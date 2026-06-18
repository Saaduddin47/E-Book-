import { Check, Star } from "lucide-react";
import { BuyButton } from "@/components/ui/buy-button";
import { PriceBlock } from "@/components/landing/price-block";
import { Reveal } from "@/components/ui/reveal";

interface HeroProps {
  badge: string;
  titleLines: string[];
  subtitle: string;
  bullets: string[];
  ctaText: string;
  trustText: string;
  brand: string;
  bookTitle: string;
  bookSubtitle?: string | null;
  priceCents: number;
  compareAtCents?: number | null;
  currency: string;
}

export function Hero({
  badge,
  titleLines,
  subtitle,
  bullets,
  ctaText,
  trustText,
  brand,
  bookTitle,
  bookSubtitle,
  priceCents,
  compareAtCents,
  currency,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-amber/10 blur-3xl" />
      </div>

      <div className="container-tight grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        {/* Left: copy */}
        <Reveal>
          <span className="inline-flex items-center rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {badge}
          </span>

          <h1 className="display mt-5 text-4xl sm:text-5xl lg:text-[3.4rem]">
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {subtitle}
          </p>

          <ul className="mt-7 space-y-3.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-success/12 text-success">
                  <Check className="size-4" strokeWidth={3} />
                </span>
                <span className="text-base text-ink-soft">{b}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Right: offer card */}
        <Reveal delay={0.1}>
          <div className="card relative mx-auto w-full max-w-md p-6 sm:p-8">
            <div className="mx-auto mb-6 flex justify-center">
              <BookCover title={bookTitle} subtitle={bookSubtitle} brand={brand} />
            </div>

            <PriceBlock
              priceCents={priceCents}
              compareAtCents={compareAtCents}
              currency={currency}
              saveText="Limited time only"
            />

            <div className="mt-6">
              <BuyButton className="w-full">{ctaText} &rarr;</BuyButton>
            </div>

            <p className="mt-4 text-center text-xs text-muted">{trustText}</p>

            <div className="mt-4 flex items-center justify-center gap-1 text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber text-amber" />
              ))}
              <span className="ml-2 text-xs font-medium text-muted">
                Loved by readers
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function BookCover({
  title,
  subtitle,
  brand,
}: {
  title: string;
  subtitle?: string | null;
  brand: string;
}) {
  return (
    <div className="relative h-64 w-48 rounded-r-md rounded-l-sm bg-gradient-to-br from-ink via-ink-soft to-ember-dark p-5 text-cream shadow-lift sm:h-72 sm:w-52">
      <div className="absolute inset-y-2 left-1.5 w-1 rounded-full bg-white/15" />
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cream/70">
        {brand}
      </p>
      <p className="mt-8 font-display text-2xl font-semibold leading-tight">
        {title}
      </p>
      {subtitle ? (
        <p className="mt-3 text-xs leading-relaxed text-cream/80">{subtitle}</p>
      ) : null}
      <p className="absolute bottom-5 left-5 text-[0.6rem] uppercase tracking-widest text-cream/60">
        Digital Edition
      </p>
    </div>
  );
}
