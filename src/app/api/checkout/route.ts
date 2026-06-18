import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasEntitlement, grantEntitlement } from "@/lib/entitlement";
import { createPaymentIntent, isZiinaConfigured } from "@/lib/ziina";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const ip = getClientIp(req.headers);
  const rl = rateLimit(`checkout:${session.user.id}:${ip}`, 8, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment." },
      { status: 429 },
    );
  }

  const product = await prisma.product.findFirst({
    where: { active: true },
    orderBy: { createdAt: "asc" },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not available" }, { status: 404 });
  }

  // Already owns it.
  if (await hasEntitlement(session.user.id, product.id)) {
    return NextResponse.json({ alreadyOwned: true });
  }

  // Create a pending order.
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      productId: product.id,
      amountCents: product.priceCents,
      currency: product.currency,
      status: "PENDING",
    },
  });

  // Dev fallback: if Ziina isn't configured outside production, simulate a
  // successful payment so the full flow can be tested end to end.
  if (!isZiinaConfigured()) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Payments are not configured." },
        { status: 503 },
      );
    }
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED" },
    });
    await grantEntitlement(session.user.id, product.id, order.id);
    return NextResponse.json({
      redirectUrl: absoluteUrl(`/purchase/success?order=${order.id}&dev=1`),
    });
  }

  try {
    const intent = await createPaymentIntent({
      amount: product.priceCents,
      currencyCode: product.currency,
      message: product.title,
      successUrl: absoluteUrl(
        `/purchase/success?order=${order.id}&pi={PAYMENT_INTENT_ID}`,
      ),
      cancelUrl: absoluteUrl(`/purchase/cancel?order=${order.id}`),
      failureUrl: absoluteUrl(`/purchase/cancel?order=${order.id}&failed=1`),
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { ziinaPaymentIntentId: intent.id },
    });

    const redirectUrl = intent.redirect_url;
    if (!redirectUrl) {
      throw new Error("Ziina did not return a redirect URL");
    }

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 },
    );
  }
}
