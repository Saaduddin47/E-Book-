/**
 * Default list-section content. Used by the seed script and as a graceful
 * fallback so the landing page still renders before the database is configured.
 */

export const fallbackProduct = {
  id: "preview",
  slug: "main-ebook",
  title: "The Complete Guide",
  subtitle: "A practical, step-by-step digital guide",
  priceCents: 5900,
  compareAtCents: 45900,
  currency: "AED",
};

export const fallbackPainPoints = [
  {
    icon: "🌀",
    title: "Too Much Conflicting Advice",
    body: "Every source says something different. You end up overwhelmed, unsure who to trust, and stuck before you even start.",
  },
  {
    icon: "⏳",
    title: "Wasted Time and Effort",
    body: "Hours spent on tactics that go nowhere. You're busy, but you're not actually moving forward.",
  },
  {
    icon: "😣",
    title: "Starting and Stopping",
    body: "You get motivated, push hard for a few days, then lose steam. Without a real system, momentum never lasts.",
  },
  {
    icon: "😔",
    title: "Quiet Self-Doubt",
    body: "Deep down you wonder if it'll ever click for you. It will - you just haven't had the right plan yet.",
  },
];

export const fallbackFeatures = [
  { icon: "🧭", title: "The Core Method", body: "The single framework everything else is built on - explained simply so it finally clicks." },
  { icon: "📋", title: "Step-by-Step Roadmap", body: "Exactly what to do, in what order, so you never have to guess what comes next." },
  { icon: "⚡", title: "Quick-Start Guide", body: "Get your first real result fast, so you stay motivated from day one." },
  { icon: "🛠️", title: "Practical Toolkit", body: "The exact tools, templates, and checklists to make the method effortless to follow." },
  { icon: "🚧", title: "Common Pitfalls", body: "The mistakes that quietly hold most people back - and precisely how to avoid them." },
  { icon: "🔁", title: "Build the Habit", body: "A simple routine that turns the method into something you do automatically." },
  { icon: "✅", title: "Readiness Checklist", body: "A quick yes/no checklist so you know you're set up to succeed before you begin." },
  { icon: "📅", title: "14-Day Plan", body: "A printable two-week plan that builds the right habits one day at a time." },
  { icon: "🌿", title: "Daily Routine Guide", body: "The exact daily rhythm that makes consistent progress feel natural." },
  { icon: "⭐", title: "Recommended Resources", body: "A short, curated list of tools and resources that support everything in the guide." },
];

export const fallbackTestimonials = [
  { name: "Alex M.", rating: 5, verified: true, body: "I'd tried everything before this. The difference here is that it's an actual system, not random tips. I saw results in the first week and finally feel in control.", meta: "Verified Buyer - 3 weeks ago" },
  { name: "Priya S.", rating: 5, verified: true, body: "Clear, honest, and genuinely practical. No fluff, no filler. The step-by-step plan made it impossible to get lost. Worth far more than the price.", meta: "Verified Buyer - 1 month ago" },
  { name: "Daniel K.", rating: 5, verified: true, body: "I was sceptical about a PDF guide, but the core method alone was worth it. Everything clicked and I've already recommended it to two friends.", meta: "Verified Buyer - 2 weeks ago" },
  { name: "Maria L.", rating: 5, verified: true, body: "What got me was how well it understood exactly where I was stuck. Then the advice actually worked. That combination is rare.", meta: "Verified Buyer - 5 days ago" },
];

export const fallbackFaqs = [
  { question: "Is this just the same advice I can find for free?", answer: "No. Free advice is scattered and contradictory. This guide gives you one complete, ordered system - so you know exactly what to do and when, without piecing it together yourself." },
  { question: "Will this work for me if I'm a complete beginner?", answer: "Yes. It's written for beginners and assumes no prior experience. Everything is explained step by step in plain language." },
  { question: "How will I receive the guide after purchasing?", answer: "Instantly. As soon as your payment is confirmed you'll get access to download the PDF. You can be reading within a couple of minutes." },
  { question: "What format is the guide in?", answer: "It's a PDF that opens on any phone, tablet, or computer - no special app required." },
  { question: "Why is it discounted right now?", answer: "The current price is a limited launch offer to get the guide into as many hands as possible. The price returns to full price when the offer ends." },
  { question: "What if it doesn't help me?", answer: "The guide is designed to be applied, not just read. If you follow the steps, you'll see a difference. Reach out any time with questions." },
];
