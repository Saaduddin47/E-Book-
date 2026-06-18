"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyButtonProps {
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "dark";
}

export function BuyButton({
  className,
  children,
  variant = "primary",
}: BuyButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent("/checkout")}`);
        return;
      }

      const data = await res.json();

      if (data.alreadyOwned) {
        router.push("/read");
        return;
      }

      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error ?? "Could not start checkout. Please try again.");
      }

      window.location.href = data.redirectUrl as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={cn(
          variant === "primary" ? "btn-primary" : "btn-dark",
          "disabled:opacity-70 disabled:cursor-not-allowed text-base sm:text-lg",
          className,
        )}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Starting checkout...
          </>
        ) : (
          children
        )}
      </button>
      {error ? (
        <p className="text-sm text-danger text-center max-w-xs">{error}</p>
      ) : null}
    </div>
  );
}
