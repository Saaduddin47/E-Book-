import { BuyButton } from "@/components/ui/buy-button";
import { PriceBlock } from "@/components/landing/price-block";
import { Reveal } from "@/components/ui/reveal";

interface FinalCtaProps {
  title: string;
  subtitle: string;
  saveText: string;
  ctaText: string;
  urgencyText: string;
  priceCents: number;
  compareAtCents?: number | null;
  currency: string;
}

export function FinalCta({
  title,
  subtitle,
  ctaText,
  urgencyText,
  priceCents,
  compareAtCents,
  currency,
}: FinalCtaProps) {
  return (
    <section className="bg-ink py-20 text-cream sm:py-28">
      <div className="container-narrow text-center">
        <Reveal>
          <h2 className="display text-3xl text-cream sm:text-4xl lg:text-[2.8rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cream/75">
            {subtitle}
          </p>

          <div className="mx-auto mt-10 max-w-sm rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-8">
            <div className="[&_*]:!text-cream">
              <PriceBlock
                priceCents={priceCents}
                compareAtCents={compareAtCents}
                currency={currency}
                saveText="today only"
              />
            </div>
            <div className="mt-6">
              <BuyButton className="w-full">{ctaText} &rarr;</BuyButton>
            </div>
          </div>

          <p className="mt-6 text-sm text-cream/60">⏳ {urgencyText}</p>
        </Reveal>
      </div>
    </section>
  );
}
