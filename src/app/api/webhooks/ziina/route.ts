import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { grantEntitlement, revokeEntitlement } from "@/lib/entitlement";
import {
  verifyWebhookSignature,
  isCompletedStatus,
  isFailedStatus,
  ZIINA_WEBHOOK_IPS,
} from "@/lib/ziina";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ZiinaWebhookBody {
  event: string;
  data: {
    id: string;
    status: string;
    [key: string]: unknown;
  };
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const isProd = process.env.NODE_ENV === "production";

  // 1. IP allowlist (enforced in production).
  const ip = getClientIp(req.headers);
  if (isProd && !ZIINA_WEBHOOK_IPS.includes(ip)) {
    console.warn(`Rejected webhook from unauthorized IP: ${ip}`);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. HMAC signature verification (enforced when a secret is configured).
  const signature = req.headers.get("x-hmac-signature");
  if (process.env.ZIINA_WEBHOOK_SECRET) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn("Rejected webhook with invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else if (isProd) {
    console.error("ZIINA_WEBHOOK_SECRET not set; rejecting webhook in production");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  let body: ZiinaWebhookBody;
  try {
    body = JSON.parse(rawBody) as ZiinaWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event, data } = body;
  if (!event || !data?.id) {
    return NextResponse.json({ received: true });
  }

  try {
    if (event === "payment_intent.status.updated") {
      await handlePaymentIntentUpdate(data.id, data.status);
    } else if (event === "refund.status.updated") {
      await handleRefundUpdate(data.id, data.status);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Return 500 so Ziina retries delivery.
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentIntentUpdate(paymentIntentId: string, status: string) {
  const order = await prisma.order.findUnique({
    where: { ziinaPaymentIntentId: paymentIntentId },
  });
  if (!order) {
    console.warn(`No order for payment intent ${paymentIntentId}`);
    return;
  }

  if (isCompletedStatus(status)) {
    if (order.status !== "COMPLETED") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "COMPLETED" },
      });
    }
    // Idempotent grant.
    await grantEntitlement(order.userId, order.productId, order.id);
  } else if (isFailedStatus(status)) {
    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: status.startsWith("cancel") ? "CANCELLED" : "FAILED" },
      });
    }
  }
}

async function handleRefundUpdate(paymentIntentId: string, status: string) {
  if (status !== "completed") return;
  const order = await prisma.order.findUnique({
    where: { ziinaPaymentIntentId: paymentIntentId },
  });
  if (!order) return;
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "CANCELLED" },
  });
  await revokeEntitlement(order.userId, order.productId);
}
