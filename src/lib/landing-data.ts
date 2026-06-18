import { prisma } from "@/lib/prisma";
import { getSiteContent, defaultSiteContent, type SiteContentData } from "@/lib/content";
import {
  fallbackProduct,
  fallbackPainPoints,
  fallbackFeatures,
  fallbackTestimonials,
  fallbackFaqs,
} from "@/lib/fallback-content";

export interface LandingProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
}

export interface LandingData {
  content: SiteContentData;
  product: LandingProduct;
  painPoints: { id: string; icon: string; title: string; body: string }[];
  features: { id: string; icon: string; title: string; body: string }[];
  testimonials: {
    id: string;
    name: string;
    body: string;
    rating: number;
    meta: string | null;
    verified: boolean;
  }[];
  faqs: { id: string; question: string; answer: string }[];
  dbReady: boolean;
}

export async function getLandingData(): Promise<LandingData> {
  try {
    const [content, product, painPoints, features, testimonials, faqs] =
      await Promise.all([
        getSiteContent(),
        prisma.product.findFirst({
          where: { active: true },
          orderBy: { createdAt: "asc" },
        }),
        prisma.painPoint.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.feature.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
      ]);

    return {
      content,
      product: product
        ? {
            id: product.id,
            slug: product.slug,
            title: product.title,
            subtitle: product.subtitle,
            priceCents: product.priceCents,
            compareAtCents: product.compareAtCents,
            currency: product.currency,
          }
        : fallbackProduct,
      painPoints: painPoints.length
        ? painPoints
        : fallbackPainPoints.map((p, i) => ({ id: `pp-${i}`, ...p })),
      features: features.length
        ? features
        : fallbackFeatures.map((f, i) => ({ id: `f-${i}`, ...f })),
      testimonials: testimonials.length
        ? testimonials
        : fallbackTestimonials.map((t, i) => ({ id: `t-${i}`, ...t })),
      faqs: faqs.length
        ? faqs
        : fallbackFaqs.map((f, i) => ({ id: `faq-${i}`, ...f })),
      dbReady: true,
    };
  } catch {
    // Database not yet configured - render with fallback content so the page
    // still previews correctly.
    return {
      content: defaultSiteContent,
      product: fallbackProduct,
      painPoints: fallbackPainPoints.map((p, i) => ({ id: `pp-${i}`, ...p })),
      features: fallbackFeatures.map((f, i) => ({ id: `f-${i}`, ...f })),
      testimonials: fallbackTestimonials.map((t, i) => ({ id: `t-${i}`, ...t })),
      faqs: fallbackFaqs.map((f, i) => ({ id: `faq-${i}`, ...f })),
      dbReady: false,
    };
  }
}
