import { prisma } from "@/lib/prisma";

export interface SiteContentData {
  brand: { name: string };
  announcement: { text: string; enabled: boolean };
  hero: {
    badge: string;
    eyebrow: string;
    titleLines: string[];
    subtitle: string;
    bullets: string[];
    ctaText: string;
    trustText: string;
  };
  painSection: { eyebrow: string; title: string; intro: string };
  quote: { text: string };
  solution: {
    eyebrow: string;
    title: string;
    subheading: string;
    paragraphs: string[];
    ctaText: string;
    ctaNote: string;
  };
  whatsInside: { eyebrow: string; title: string; intro: string; ctaText: string; ctaNote: string };
  beforeAfter: {
    eyebrow: string;
    title: string;
    intro: string;
    beforeTitle: string;
    afterTitle: string;
    before: { icon: string; text: string }[];
    after: { icon: string; text: string }[];
    ctaText: string;
  };
  testimonialsSection: { eyebrow: string; title: string };
  faqSection: { eyebrow: string; title: string };
  finalCta: {
    title: string;
    subtitle: string;
    saveText: string;
    ctaText: string;
    urgencyText: string;
  };
  footer: { tagline: string };
}

export const defaultSiteContent: SiteContentData = {
  brand: { name: "yourbrand" },
  announcement: {
    text: "Limited Time Offer - Was AED 459 | Now Only AED 59 | Price Goes Up Soon",
    enabled: true,
  },
  hero: {
    badge: "Digital Guide - Instant Download",
    eyebrow: "Read on any device",
    titleLines: ["The Complete Guide", "to [Your eBook Topic]", "- Made Simple"],
    subtitle:
      "A practical, no-fluff guide that walks you through everything you need to know - written for real people who want results without the overwhelm.",
    bullets: [
      "Learn the core method that makes everything click - starting today",
      "Skip months of trial and error with a clear, step-by-step path",
      "No prior experience needed - just follow along at your own pace",
    ],
    ctaText: "Yes - I Want the Guide",
    trustText: "Instant PDF download - Read on any device - 100% private",
  },
  painSection: {
    eyebrow: "Sound Familiar?",
    title: "You Don't Need More Information. You Need the Right Plan.",
    intro:
      "If you've been stuck for a while, you already know the problem isn't a lack of effort. It's not knowing exactly what to do next.",
  },
  quote: {
    text: "You've watched the videos. Saved the threads. Tried a bit of everything. Some of it helped a little. None of it gave you a complete, repeatable system. That's exactly what this guide is for.",
  },
  solution: {
    eyebrow: "Introducing the Solution",
    title: "Everything You Need, In One Clear Place.",
    subheading: "A single, focused guide built around what actually moves the needle.",
    paragraphs: [
      "Instead of piecing together scattered advice, this guide gives you one cohesive method - explained step by step, in plain language, with nothing left out.",
      "No filler. No jargon. Just the exact approach, the order to do it in, and the small details that make the difference between almost working and actually working.",
    ],
    ctaText: "Get the Guide",
    ctaNote: "Limited-time launch price",
  },
  whatsInside: {
    eyebrow: "Everything You Get",
    title: "Here Is Exactly What's Inside",
    intro:
      "One complete, practical guide built entirely around getting you to a result - fast.",
    ctaText: "Get Instant Access",
    ctaNote: "PDF download - Read on phone, tablet, or computer",
  },
  beforeAfter: {
    eyebrow: "The Transformation",
    title: "Before This Guide vs. After",
    intro:
      "This isn't about magic. It's about finally having the right plan - and watching things shift because of it.",
    beforeTitle: "Before",
    afterTitle: "After",
    before: [
      { icon: "😣", text: "Guessing what to do next and second-guessing every move" },
      { icon: "🌀", text: "Jumping between tips that never add up to a system" },
      { icon: "⏳", text: "Wasting time and energy on things that don't work" },
      { icon: "😔", text: "Feeling stuck, frustrated, and ready to give up" },
    ],
    after: [
      { icon: "😌", text: "Knowing exactly what to do and in what order" },
      { icon: "✅", text: "Following one clear, proven method end to end" },
      { icon: "⚡", text: "Making real progress in days, not months" },
      { icon: "💪", text: "Confidence - because you have a system that works" },
    ],
    ctaText: "I'm Ready - Get the Guide",
  },
  testimonialsSection: { eyebrow: "Real Results", title: "What Readers Are Saying" },
  faqSection: { eyebrow: "Got Questions?", title: "Frequently Asked Questions" },
  finalCta: {
    title: "You've Waited Long Enough.",
    subtitle:
      "The plan, the steps, the details - all in one place. It doesn't have to stay complicated.",
    saveText: "You save today - limited time only",
    ctaText: "Get Instant Access",
    urgencyText: "This offer won't last. The price goes up soon.",
  },
  footer: { tagline: "An independent digital guide. Instant download after purchase." },
};

/**
 * Deep-merge stored content over the defaults so new fields always resolve.
 */
function mergeContent(
  base: SiteContentData,
  override: Partial<SiteContentData> | null | undefined,
): SiteContentData {
  if (!override) return base;
  return {
    ...base,
    ...override,
    brand: { ...base.brand, ...override.brand },
    announcement: { ...base.announcement, ...override.announcement },
    hero: { ...base.hero, ...override.hero },
    painSection: { ...base.painSection, ...override.painSection },
    quote: { ...base.quote, ...override.quote },
    solution: { ...base.solution, ...override.solution },
    whatsInside: { ...base.whatsInside, ...override.whatsInside },
    beforeAfter: { ...base.beforeAfter, ...override.beforeAfter },
    testimonialsSection: { ...base.testimonialsSection, ...override.testimonialsSection },
    faqSection: { ...base.faqSection, ...override.faqSection },
    finalCta: { ...base.finalCta, ...override.finalCta },
    footer: { ...base.footer, ...override.footer },
  };
}

export async function getSiteContent(): Promise<SiteContentData> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: "singleton" } });
    return mergeContent(
      defaultSiteContent,
      (row?.data as Partial<SiteContentData>) ?? null,
    );
  } catch {
    return defaultSiteContent;
  }
}
