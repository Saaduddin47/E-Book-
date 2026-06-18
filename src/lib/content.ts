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
  brand: { name: "ddaura" },
  announcement: {
    text: "Limited Time Offer — Was $127 | Now Only $17 | Price Goes Up Soon",
    enabled: true,
  },
  hero: {
    badge: "Digital Guide — Instant Download",
    eyebrow: "Read on any device",
    titleLines: [
      "Why Pushing Harder",
      "Is Making It Worse —",
      "And What to Do Instead",
    ],
    subtitle:
      "The in-the-moment guide for chronic constipation sufferers who are tired of straining, cancelling plans, and carrying this quietly — alone.",
    bullets: [
      "Learn the one thing that makes hard stools pass with far less pain — starting today",
      "Stop the 30–45 minute bathroom sessions stealing your mornings and your reputation",
      "No supplements, no equipment — just a change your body was already designed for",
    ],
    ctaText: "Yes — I Want the Guide for $17",
    trustText: "Instant PDF download · Read on any device · 100% private",
  },
  painSection: {
    eyebrow: "Sound Familiar?",
    title:
      "Constipation Isn't Just a Physical Problem. It's Taking Over Your Life.",
    intro:
      "Most people think constipation is just uncomfortable. But if you've been living with it for months or years, you know the truth. It follows you everywhere.",
  },
  quote: {
    text: "You've already watched the YouTube videos. Pressed the magical acupressure points. Tried the warm lemon water at 6am. Some of it helped a little. None of it solved it. That's because none of it told you what to do in the specific moment that matters most.",
  },
  solution: {
    eyebrow: "Introducing the Solution",
    title: "Your Body Already Knows How to Do This. You Just Keep Interrupting It.",
    subheading: "Why Pushing Harder Is Making It Worse",
    paragraphs: [
      "Here is what nobody tells you: your body has a built-in, automatic system designed to pass stool — without straining, without pain, without 40-minute sessions. The problem isn't that the system is broken. The problem is that everything you've been taught to do is accidentally switching it off.",
      "Every time you strain and hold your breath, your muscles tighten defensively — pushing against a door that's swinging the wrong way. The harder you push, the more your body resists. And every difficult session causes real damage that makes the next session even harder.",
      "This guide teaches you the one thing that changes everything: how to cooperate with your body's natural reflex instead of fighting it. How to breathe. How to wait. How to let the process work — so you're in and out in minutes, not hours, and you walk out feeling fine instead of broken.",
      "No supplements. No equipment. No complicated routine. Just the right information applied at the right moment — and everything changes.",
    ],
    ctaText: "Get the Guide — Only $17",
    ctaNote: "Was $127 — Now $17 for a limited time",
  },
  whatsInside: {
    eyebrow: "Everything You Get",
    title: "Here Is Exactly What's Inside",
    intro:
      "One complete, no-fluff guide built entirely around the moment that matters most — right now, in the bathroom.",
    ctaText: "Get Instant Access — $17",
    ctaNote: "PDF download · Read on phone, tablet, or computer",
  },
  beforeAfter: {
    eyebrow: "The Transformation",
    title: "Before This Guide vs. After",
    intro:
      "This is not about a miracle cure. It is about finally having the right information — and watching everything shift because of it.",
    beforeTitle: "Before",
    afterTitle: "After",
    before: [
      { icon: "😰", text: "Dreading the bathroom days before it happens" },
      { icon: "⏱️", text: "30–45 minute sessions that go nowhere" },
      { icon: "📵", text: "Missing calls and hiding in the bathroom" },
      { icon: "🚫", text: "Cancelling plans with no explanation people believe" },
      { icon: "😣", text: "2–3 days of soreness and stiff walking after a hard session" },
      { icon: "🔄", text: "Every session making the next one worse" },
      { icon: "😔", text: "Shame, silence, and carrying it completely alone" },
    ],
    after: [
      { icon: "😌", text: "Knowing exactly what to wait for and what to do" },
      { icon: "⚡", text: "Sessions that complete in 5–10 focused minutes" },
      { icon: "📞", text: "Answering your calls — because you're not hiding anymore" },
      { icon: "✅", text: "Keeping plans because the bathroom no longer runs your schedule" },
      { icon: "🚶", text: "Walking normally — no soreness, no aftermath" },
      { icon: "📈", text: "Each session building a stronger natural reflex" },
      { icon: "💪", text: "Confidence — because you have a system that actually works" },
    ],
    ctaText: "I'm Ready — Get the Guide for $17",
  },
  testimonialsSection: { eyebrow: "Real Results", title: "What Readers Are Saying" },
  faqSection: { eyebrow: "Got Questions?", title: "Frequently Asked Questions" },
  finalCta: {
    title: "You Have Been Carrying This Long Enough.",
    subtitle:
      "The cancelled plans. The missed calls. The mornings planned around a bathroom visit that never goes the way you need it to. It does not have to stay this way.",
    saveText: "You Save $110 Today",
    ctaText: "Get Instant Access — $17",
    urgencyText: "This offer will not last. Price returns to $127 soon.",
  },
  footer: {
    tagline:
      "This product is a digital PDF guide. Results may vary. This guide does not constitute medical advice.",
  },
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
