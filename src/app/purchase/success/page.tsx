import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { grantEntitlement } from "@/lib/entitlement";
import {
  getPaymentIntent,
  isZiinaConfigured,
  isCompletedStatus,
} from "@/lib/ziina";

export const metadata = { title: "Purchase complete" };
export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; pi?: string }>;
}) {
  const user = await requireUser("/account");
  const params = await searchParams;

  let completed = false;

  if (params.order) {
    const order = await prisma.order.findFirst({
      where: { id: params.order, userId: user.id },
    });

    if (order) {
      if (order.status === "COMPLETED") {
        completed = true;
      } else if (
        isZiinaConfigured() &&
        (order.ziinaPaymentIntentId || params.pi)
      ) {
        // Reconcile directly with Ziina in case the webhook is delayed.
        try {
          const pi = await getPaymentIntent(
            order.ziinaPaymentIntentId ?? params.pi!,
          );
          if (isCompletedStatus(pi.status)) {
            await prisma.order.update({
              where: { id: order.id },
              data: { status: "COMPLETED" },
            });
            await grantEntitlement(order.userId, order.productId, order.id);
            completed = true;
          }
        } catch {
          // fall through to pending state
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="card w-full max-w-md p-8 text-center">
        {completed ? (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="size-9" />
            </div>
            <h1 className="display mt-5 text-3xl">You&apos;re all set!</h1>
            <p className="mt-3 text-ink-soft">
              Your payment was successful and your guide is unlocked. You can
              start reading right away.
            </p>
            <Link href="/read" className="btn-primary mt-7 inline-flex w-full">
              Read the Guide &rarr;
            </Link>
            <Link
              href="/account"
              className="mt-3 inline-block text-sm text-muted hover:text-ink"
            >
              Go to my account
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber/10 text-amber">
              <Clock className="size-9" />
            </div>
            <h1 className="display mt-5 text-3xl">Confirming your payment...</h1>
            <p className="mt-3 text-ink-soft">
              Your payment is being processed. This usually takes only a few
              seconds. Refresh this page or check your account shortly.
            </p>
            <Link href="/account" className="btn-dark mt-7 inline-flex w-full">
              Go to my account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
