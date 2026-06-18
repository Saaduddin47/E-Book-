import { BuyButton } from "@/components/ui/buy-button";
import { Reveal } from "@/components/ui/reveal";

interface Item {
  icon: string;
  text: string;
}

interface BeforeAfterProps {
  eyebrow: string;
  title: string;
  intro: string;
  beforeTitle: string;
  afterTitle: string;
  before: Item[];
  after: Item[];
  ctaText: string;
}

export function BeforeAfter({
  eyebrow,
  title,
  intro,
  beforeTitle,
  afterTitle,
  before,
  after,
  ctaText,
}: BeforeAfterProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-ink-soft">{intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="card h-full border-danger/20 bg-danger/[0.03] p-7">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                <span className="text-danger">✕</span> {beforeTitle}
              </h3>
              <ul className="mt-5 space-y-4">
                {before.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-soft">
                    <span className="text-lg leading-none">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="card h-full border-success/25 bg-success/[0.04] p-7">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                <span className="text-success">✓</span> {afterTitle}
              </h3>
              <ul className="mt-5 space-y-4">
                {after.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink-soft">
                    <span className="text-lg leading-none">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <BuyButton>{ctaText} &rarr;</BuyButton>
        </Reveal>
      </div>
    </section>
  );
}
