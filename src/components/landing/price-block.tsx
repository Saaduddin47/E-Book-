import { formatPrice } from "@/lib/utils";

interface PriceBlockProps {
  priceCents: number;
  compareAtCents?: number | null;
  currency: string;
  saveText?: string;
  align?: "center" | "start";
}

export function PriceBlock({
  priceCents,
  compareAtCents,
  currency,
  saveText,
  align = "center",
}: PriceBlockProps) {
  const saved =
    compareAtCents && compareAtCents > priceCents
      ? compareAtCents - priceCents
      : 0;

  return (
    <div
      className={`flex flex-col ${align === "center" ? "items-center text-center" : "items-start"}`}
    >
      {compareAtCents ? (
        <p className="text-sm font-medium text-muted">
          Regular price:{" "}
          <span className="line-through">
            {formatPrice(compareAtCents, currency)}
          </span>
        </p>
      ) : null}
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-5xl font-semibold text-ink sm:text-6xl">
          {formatPrice(priceCents, currency)}
        </span>
      </div>
      {saved > 0 ? (
        <p className="mt-1 text-sm font-semibold text-success">
          You save {formatPrice(saved, currency)}
          {saveText ? ` - ${saveText}` : ""}
        </p>
      ) : null}
    </div>
  );
}
