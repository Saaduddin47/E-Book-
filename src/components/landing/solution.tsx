import { BuyButton } from "@/components/ui/buy-button";
import { Reveal } from "@/components/ui/reveal";

interface SolutionProps {
  eyebrow: string;
  title: string;
  subheading: string;
  paragraphs: string[];
  ctaText: string;
  ctaNote: string;
}

export function Solution({
  eyebrow,
  title,
  subheading,
  paragraphs,
  ctaText,
  ctaNote,
}: SolutionProps) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-narrow text-center">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl lg:text-[2.6rem]">
            {title}
          </h2>
          <p className="mt-4 text-lg font-medium text-ink-soft">{subheading}</p>
        </Reveal>

        <div className="mx-auto mt-8 max-w-2xl space-y-5 text-left">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="text-lg leading-relaxed text-ink-soft">{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10 flex flex-col items-center">
          <BuyButton>{ctaText} &rarr;</BuyButton>
          <p className="mt-3 text-sm text-muted">{ctaNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
