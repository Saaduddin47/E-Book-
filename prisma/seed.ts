import { PrismaClient } from "@prisma/client";
import { defaultSiteContent } from "../src/lib/content";
import {
  fallbackPainPoints as painPoints,
  fallbackFeatures as features,
  fallbackTestimonials as testimonials,
  fallbackFaqs as faqs,
} from "../src/lib/fallback-content";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Product
  const product = await prisma.product.upsert({
    where: { slug: "main-ebook" },
    update: {},
    create: {
      slug: "main-ebook",
      title: "Why Pushing Harder Is Making It Worse — And What to Do Instead",
      subtitle: "The in-the-moment guide for chronic constipation sufferers",
      description:
        "A complete, no-fluff digital guide built around the moment that matters most. Instant PDF download, read on any device.",
      priceCents: 1700, // $17.00
      compareAtCents: 12700, // $127.00
      currency: "USD",
      active: true,
    },
  });
  console.log(`Product ready: ${product.slug}`);

  // Site content singleton
  await prisma.siteContent.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", data: defaultSiteContent as object },
  });
  console.log("Site content ready");

  // List sections (only seed if empty so we don't clobber admin edits)
  if ((await prisma.painPoint.count()) === 0) {
    await prisma.painPoint.createMany({
      data: painPoints.map((p, i) => ({ ...p, sortOrder: i })),
    });
  }
  if ((await prisma.feature.count()) === 0) {
    await prisma.feature.createMany({
      data: features.map((f, i) => ({ ...f, sortOrder: i })),
    });
  }
  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: testimonials.map((t, i) => ({ ...t, sortOrder: i })),
    });
  }
  if ((await prisma.faq.count()) === 0) {
    await prisma.faq.createMany({
      data: faqs.map((f, i) => ({ ...f, sortOrder: i })),
    });
  }
  console.log("List sections ready");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: "ADMIN" },
      create: { email: adminEmail, role: "ADMIN", name: "Admin" },
    });
    console.log(`Admin user ready: ${adminEmail}`);
  } else {
    console.warn("ADMIN_EMAIL not set - skipping admin user seed");
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
