"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqProps {
  eyebrow: string;
  title: string;
  items: FaqItem[];
}

export function Faq({ eyebrow, title, items }: FaqProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container-narrow">
        <div className="text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="display mt-3 text-3xl sm:text-4xl">{title}</h2>
        </div>

        <div className="mt-12 space-y-3">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <div key={item.id} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-semibold text-ink">
                    {item.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream-deep text-ink"
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <p className="px-6 pb-5 leading-relaxed text-ink-soft">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
