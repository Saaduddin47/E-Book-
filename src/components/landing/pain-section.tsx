import { Reveal } from "@/components/ui/reveal";

interface PainPoint {
  id: string;
  icon: string;
  title: string;
  body: string;
}

interface PainSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  items: PainPoint[];
}

export function PainSection({ eyebrow, title, intro, items }: PainSectionProps) {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-ink-soft">{intro}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <div className="card h-full p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
