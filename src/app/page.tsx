import { auth } from "@/auth";
import { getLandingData } from "@/lib/landing-data";
import { hasEntitlement } from "@/lib/entitlement";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { PainSection } from "@/components/landing/pain-section";
import { QuoteSection } from "@/components/landing/quote";
import { Solution } from "@/components/landing/solution";
import { WhatsInside } from "@/components/landing/whats-inside";
import { BeforeAfter } from "@/components/landing/before-after";
import { Testimonials } from "@/components/landing/testimonials";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const revalidate = 60;

export default async function HomePage() {
  const data = await getLandingData();
  const { content, product } = data;

  const session = await auth();
  const isLoggedIn = Boolean(session?.user);
  let owns = false;
  if (session?.user?.id && data.dbReady && product.id !== "preview") {
    owns = await hasEntitlement(session.user.id, product.id);
  }

  return (
    <>
      {content.announcement.enabled ? (
        <AnnouncementBar text={content.announcement.text} />
      ) : null}

      <Nav brand={content.brand.name} isLoggedIn={isLoggedIn} owns={owns} />

      <main className="flex-1">
        <Hero
          badge={content.hero.badge}
          titleLines={content.hero.titleLines}
          subtitle={content.hero.subtitle}
          bullets={content.hero.bullets}
          ctaText={content.hero.ctaText}
          trustText={content.hero.trustText}
          brand={content.brand.name}
          bookTitle={product.title}
          bookSubtitle={product.subtitle}
          priceCents={product.priceCents}
          compareAtCents={product.compareAtCents}
          currency={product.currency}
        />

        <PainSection
          eyebrow={content.painSection.eyebrow}
          title={content.painSection.title}
          intro={content.painSection.intro}
          items={data.painPoints}
        />

        <QuoteSection text={content.quote.text} />

        <Solution
          eyebrow={content.solution.eyebrow}
          title={content.solution.title}
          subheading={content.solution.subheading}
          paragraphs={content.solution.paragraphs}
          ctaText={content.solution.ctaText}
          ctaNote={content.solution.ctaNote}
        />

        <WhatsInside
          eyebrow={content.whatsInside.eyebrow}
          title={content.whatsInside.title}
          intro={content.whatsInside.intro}
          ctaText={content.whatsInside.ctaText}
          ctaNote={content.whatsInside.ctaNote}
          items={data.features}
        />

        <BeforeAfter
          eyebrow={content.beforeAfter.eyebrow}
          title={content.beforeAfter.title}
          intro={content.beforeAfter.intro}
          beforeTitle={content.beforeAfter.beforeTitle}
          afterTitle={content.beforeAfter.afterTitle}
          before={content.beforeAfter.before}
          after={content.beforeAfter.after}
          ctaText={content.beforeAfter.ctaText}
        />

        <Testimonials
          eyebrow={content.testimonialsSection.eyebrow}
          title={content.testimonialsSection.title}
          items={data.testimonials}
        />

        <Faq
          eyebrow={content.faqSection.eyebrow}
          title={content.faqSection.title}
          items={data.faqs}
        />

        <FinalCta
          title={content.finalCta.title}
          subtitle={content.finalCta.subtitle}
          saveText={content.finalCta.saveText}
          ctaText={content.finalCta.ctaText}
          urgencyText={content.finalCta.urgencyText}
          priceCents={product.priceCents}
          compareAtCents={product.compareAtCents}
          currency={product.currency}
        />
      </main>

      <Footer brand={content.brand.name} tagline={content.footer.tagline} />
    </>
  );
}
