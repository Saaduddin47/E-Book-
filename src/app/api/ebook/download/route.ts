import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasEntitlement } from "@/lib/entitlement";
import { createSignedUrl, isStorageConfigured } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login?callbackUrl=/read", req.url));
  }

  const ip = getClientIp(req.headers);
  const rl = rateLimit(`download:${session.user.id}:${ip}`, 20, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  if (!product?.pdfPath) {
    return NextResponse.json({ error: "File not available" }, { status: 404 });
  }

  if (!(await hasEntitlement(session.user.id, product.id))) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  try {
    // Short-lived signed URL, forced as a download.
    const url = await createSignedUrl(product.pdfPath, 60, true);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Could not generate download" },
      { status: 500 },
    );
  }
}
