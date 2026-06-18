import { BuyButton } from "@/components/ui/buy-button";
import { Reveal } from "@/components/ui/reveal";

interface Feature {
  id: string;
  icon: string;
  title: string;
  body: string;
}

interface WhatsInsideProps {
  eyebrow: string;
  title: string;
  intro: string;
  ctaText: string;
  ctaNote: string;
  items: Feature[];
}

export function WhatsInside({
  eyebrow,
  title,
  intro,
  ctaText,
  ctaNote,
  items,
}: WhatsInsideProps) {
  return (
    <section id="whats-inside" className="bg-surface py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-ink-soft">{intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.06}>
              <div className="card h-full p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex size-12 items-center justify-center rounded-xl bg-cream-deep text-2xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12 flex flex-col items-center">
          <BuyButton>{ctaText} &rarr;</BuyButton>
          <p className="mt-3 text-sm text-muted">{ctaNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
