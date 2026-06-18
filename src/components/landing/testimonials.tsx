import { Star, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

interface Testimonial {
  id: string;
  name: string;
  body: string;
  rating: number;
  meta?: string | null;
  verified: boolean;
}

interface TestimonialsProps {
  eyebrow: string;
  title: string;
  items: Testimonial[];
}

export function Testimonials({ eyebrow, title, items }: TestimonialsProps) {
  return (
    <section id="reviews" className="bg-cream-deep py-20 sm:py-28">
      <div className="container-tight">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{title}</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={(i % 2) * 0.08}>
              <figure className="card h-full p-7">
                <div className="flex items-center gap-1 text-amber">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="size-4 fill-amber text-amber" />
                  ))}
                </div>
                <blockquote className="mt-4 leading-relaxed text-ink-soft">
                  {t.body}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-ink font-semibold text-cream">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 font-semibold text-ink">
                      {t.name}
                      {t.verified ? (
                        <BadgeCheck className="size-4 text-success" />
                      ) : null}
                    </p>
                    {t.meta ? (
                      <p className="text-xs text-muted">{t.meta}</p>
                    ) : null}
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
