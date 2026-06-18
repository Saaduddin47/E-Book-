import { Reveal } from "@/components/ui/reveal";

export function QuoteSection({ text }: { text: string }) {
  return (
    <section className="bg-cream-deep py-20 sm:py-24">
      <div className="container-narrow text-center">
        <Reveal>
          <span className="font-display text-6xl leading-none text-ember/40">
            &ldquo;
          </span>
          <p className="-mt-4 font-display text-2xl font-medium leading-relaxed text-ink sm:text-3xl">
            {text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
