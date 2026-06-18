import crypto from "crypto";

const ZIINA_API_BASE = "https://api-v2.ziina.com/api";

// Ziina delivers webhooks only from these IPs.
export const ZIINA_WEBHOOK_IPS = [
  "3.29.184.186",
  "3.29.190.95",
  "20.233.47.127",
  "13.202.161.181",
];

export type ZiinaPaymentIntentStatus =
  | "requires_payment_instrument"
  | "requires_user_action"
  | "pending"
  | "completed"
  | "failed"
  | "canceled"
  | "cancelled";

export interface CreatePaymentIntentInput {
  amount: number; // lowest currency unit (e.g. fils)
  currencyCode?: string; // default AED
  message?: string;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  test?: boolean;
}

export interface ZiinaPaymentIntent {
  id: string;
  status: ZiinaPaymentIntentStatus;
  amount: number;
  currency_code: string;
  redirect_url?: string;
  latest_error?: { message?: string } | null;
  [key: string]: unknown;
}

function getToken(): string {
  const token = process.env.ZIINA_API_TOKEN;
  if (!token) {
    throw new Error("ZIINA_API_TOKEN is not set.");
  }
  return token;
}

export function isZiinaConfigured(): boolean {
  return Boolean(process.env.ZIINA_API_TOKEN);
}

export async function createPaymentIntent(
  input: CreatePaymentIntentInput,
): Promise<ZiinaPaymentIntent> {
  const body = {
    amount: input.amount,
    currency_code: input.currencyCode ?? "AED",
    message: input.message,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    failure_url: input.failureUrl,
    test: input.test ?? process.env.ZIINA_TEST_MODE === "true",
  };

  const res = await fetch(`${ZIINA_API_BASE}/payment_intent`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ziina createPaymentIntent failed (${res.status}): ${text}`);
  }

  return (await res.json()) as ZiinaPaymentIntent;
}

export async function getPaymentIntent(
  id: string,
): Promise<ZiinaPaymentIntent> {
  const res = await fetch(`${ZIINA_API_BASE}/payment_intent/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ziina getPaymentIntent failed (${res.status}): ${text}`);
  }
  return (await res.json()) as ZiinaPaymentIntent;
}

/**
 * Verify the HMAC SHA-256 signature delivered in the X-Hmac-Signature header.
 * The signature is computed over the raw request body using the shared secret.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = process.env.ZIINA_WEBHOOK_SECRET;
  if (!secret) return false;
  if (!signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function isCompletedStatus(status: string): boolean {
  return status === "completed";
}

export function isFailedStatus(status: string): boolean {
  return status === "failed" || status === "canceled" || status === "cancelled";
}
