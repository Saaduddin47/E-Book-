"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (res.status === 401) {
          router.push("/login?callbackUrl=/checkout");
          return;
        }

        const data = await res.json();
        if (data.alreadyOwned) {
          router.push("/read");
          return;
        }
        if (!res.ok || !data.redirectUrl) {
          throw new Error(data.error ?? "Could not start checkout.");
        }
        window.location.href = data.redirectUrl as string;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    })();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <div className="card w-full max-w-md p-8 text-center">
        {error ? (
          <>
            <h1 className="display text-2xl">Checkout error</h1>
            <p className="mt-3 text-ink-soft">{error}</p>
            <Link href="/" className="btn-primary mt-6 inline-flex">
              Back to home
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto size-8 animate-spin text-ember" />
            <h1 className="display mt-4 text-2xl">Starting secure checkout...</h1>
            <p className="mt-2 text-ink-soft">
              Please wait while we redirect you to payment.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
