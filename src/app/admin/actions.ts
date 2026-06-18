"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { getSiteContent } from "@/lib/content";
import { grantEntitlement, revokeEntitlement } from "@/lib/entitlement";
import { uploadObject } from "@/lib/supabase";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/content");
  revalidatePath("/admin/product");
}

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

const productSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  priceCents: z.coerce.number().int().min(0),
  compareAtCents: z.coerce.number().int().min(0).optional(),
  currency: z.string().min(3).max(3),
  active: z.coerce.boolean(),
});

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.parse({
    id: formData.get("id"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle") || null,
    description: formData.get("description") || null,
    priceCents: formData.get("priceCents"),
    compareAtCents: formData.get("compareAtCents") || undefined,
    currency: String(formData.get("currency") ?? "AED").toUpperCase(),
    active: formData.get("active") === "on",
  });

  await prisma.product.update({
    where: { id: parsed.id },
    data: {
      title: parsed.title,
      subtitle: parsed.subtitle,
      description: parsed.description,
      priceCents: parsed.priceCents,
      compareAtCents: parsed.compareAtCents ?? null,
      currency: parsed.currency,
      active: parsed.active,
    },
  });

  revalidateAll();
}

export async function uploadProductFile(formData: FormData) {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const kind = String(formData.get("kind") ?? ""); // "pdf" | "cover"
  const file = formData.get("file") as File | null;

  if (!productId || !file || file.size === 0) {
    throw new Error("Missing file");
  }
  if (kind !== "pdf" && kind !== "cover") {
    throw new Error("Invalid file kind");
  }

  const ext = kind === "pdf" ? "pdf" : (file.name.split(".").pop() ?? "jpg");
  const path = `${productId}/${kind}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await uploadObject(
    path,
    buffer,
    file.type || (kind === "pdf" ? "application/pdf" : "image/jpeg"),
  );

  await prisma.product.update({
    where: { id: productId },
    data: kind === "pdf" ? { pdfPath: path } : { coverPath: path },
  });

  revalidateAll();
}

// ---------------------------------------------------------------------------
// Site content (singleton)
// ---------------------------------------------------------------------------

export async function updateSiteContentJson(formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("data") ?? "");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON");
  }
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: { data: data as object },
    create: { id: "singleton", data: data as object },
  });
  revalidateAll();
}

/**
 * Update a small set of common hero/announcement fields via a simple form,
 * merging over the existing stored content.
 */
export async function updateHeroFields(formData: FormData) {
  await requireAdmin();
  const current = await getSiteContent();
  const next = {
    ...current,
    brand: { name: String(formData.get("brandName") ?? current.brand.name) },
    announcement: {
      enabled: formData.get("announcementEnabled") === "on",
      text: String(formData.get("announcementText") ?? current.announcement.text),
    },
    hero: {
      ...current.hero,
      badge: String(formData.get("heroBadge") ?? current.hero.badge),
      titleLines: String(formData.get("heroTitle") ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      subtitle: String(formData.get("heroSubtitle") ?? current.hero.subtitle),
      bullets: String(formData.get("heroBullets") ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      ctaText: String(formData.get("heroCta") ?? current.hero.ctaText),
      trustText: String(formData.get("heroTrust") ?? current.hero.trustText),
    },
  };
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: { data: next as object },
    create: { id: "singleton", data: next as object },
  });
  revalidateAll();
}

// ---------------------------------------------------------------------------
// List sections: PainPoint / Feature / Testimonial / Faq
// ---------------------------------------------------------------------------

type ListModel = "painPoint" | "feature" | "testimonial" | "faq";

export async function createListItem(model: ListModel, formData: FormData) {
  await requireAdmin();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (model === "painPoint") {
    await prisma.painPoint.create({
      data: {
        icon: String(formData.get("icon") ?? "📵"),
        title: String(formData.get("title") ?? ""),
        body: String(formData.get("body") ?? ""),
        sortOrder,
      },
    });
  } else if (model === "feature") {
    await prisma.feature.create({
      data: {
        icon: String(formData.get("icon") ?? "✨"),
        title: String(formData.get("title") ?? ""),
        body: String(formData.get("body") ?? ""),
        sortOrder,
      },
    });
  } else if (model === "testimonial") {
    await prisma.testimonial.create({
      data: {
        name: String(formData.get("name") ?? ""),
        body: String(formData.get("body") ?? ""),
        rating: Number(formData.get("rating") ?? 5),
        meta: String(formData.get("meta") ?? "") || null,
        verified: formData.get("verified") === "on",
        sortOrder,
      },
    });
  } else if (model === "faq") {
    await prisma.faq.create({
      data: {
        question: String(formData.get("question") ?? ""),
        answer: String(formData.get("answer") ?? ""),
        sortOrder,
      },
    });
  }
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function updateListItem(model: ListModel, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (model === "painPoint") {
    await prisma.painPoint.update({
      where: { id },
      data: {
        icon: String(formData.get("icon") ?? "📵"),
        title: String(formData.get("title") ?? ""),
        body: String(formData.get("body") ?? ""),
        sortOrder,
      },
    });
  } else if (model === "feature") {
    await prisma.feature.update({
      where: { id },
      data: {
        icon: String(formData.get("icon") ?? "✨"),
        title: String(formData.get("title") ?? ""),
        body: String(formData.get("body") ?? ""),
        sortOrder,
      },
    });
  } else if (model === "testimonial") {
    await prisma.testimonial.update({
      where: { id },
      data: {
        name: String(formData.get("name") ?? ""),
        body: String(formData.get("body") ?? ""),
        rating: Number(formData.get("rating") ?? 5),
        meta: String(formData.get("meta") ?? "") || null,
        verified: formData.get("verified") === "on",
        sortOrder,
      },
    });
  } else if (model === "faq") {
    await prisma.faq.update({
      where: { id },
      data: {
        question: String(formData.get("question") ?? ""),
        answer: String(formData.get("answer") ?? ""),
        sortOrder,
      },
    });
  }
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function deleteListItem(model: ListModel, formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id");

  if (model === "painPoint") await prisma.painPoint.delete({ where: { id } });
  else if (model === "feature") await prisma.feature.delete({ where: { id } });
  else if (model === "testimonial")
    await prisma.testimonial.delete({ where: { id } });
  else if (model === "faq") await prisma.faq.delete({ where: { id } });

  revalidatePath("/admin/content");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function toggleUserRole(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  if (!userId) throw new Error("Missing user");
  if (userId === admin.id) throw new Error("You cannot change your own role");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
  });
  revalidatePath("/admin/users");
}

export async function grantUserAccess(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  if (!userId || !product) throw new Error("Missing user or product");
  await grantEntitlement(userId, product.id);
  revalidatePath("/admin/users");
}

export async function revokeUserAccess(formData: FormData) {
  await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  if (!userId || !product) throw new Error("Missing user or product");
  await revokeEntitlement(userId, product.id);
  revalidatePath("/admin/users");
}
