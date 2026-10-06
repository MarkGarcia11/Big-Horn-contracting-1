import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { areas, business, copy, type Lang, type Service } from "../data/site";
import { useLanguage } from "./i18n";

type Schema = Record<string, unknown>;

export const faqSchema = (items: { question: { en: string; es: string }; answer: { en: string; es: string } }[], language: Lang): Schema => ({
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({ "@type": "Question", name: copy(item.question, language), acceptedAnswer: { "@type": "Answer", text: copy(item.answer, language) } })),
});

export const serviceSchema = (service: Service, language: Lang): Schema => ({
  "@type": "Service",
  name: copy(service.title, language),
  description: copy(service.intro, language),
  serviceType: copy(service.title, language),
  provider: { "@id": "#business" },
  areaServed: areas.map((area) => ({ "@type": "Place", name: `${area}, New Mexico` })),
});

// Sample testimonials are intentionally excluded from structured data until real reviews are approved.
export const reviewSchema = (reviews: { quote: { en: string; es: string }; person: { en: string; es: string }; rating: number; placeholder?: boolean }[], language: Lang): Schema[] =>
  reviews.filter((review) => !review.placeholder).map((review) => ({
    "@type": "Review", itemReviewed: { "@id": "#business" },
    author: { "@type": "Person", name: copy(review.person, language) },
    reviewBody: copy(review.quote, language), reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
  }));

function setMeta(selector: string, attribute: "name" | "property", key: string, value: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

export function SEO({ title, description, schema, image = "/images/hero-courtyard.jpg", noindex = false }: { title: string; description: string; schema?: Schema | Schema[]; image?: string; noindex?: boolean }) {
  const { language } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, "");
    const canonical = `${siteUrl}${location.pathname}`;
    const fullTitle = title.includes("Big Horn") ? title : `${title} | Big Horn Contracting`;
    document.title = fullTitle;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex,nofollow" : "index,follow");
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", new URL(image, siteUrl).href);
    setMeta('meta[property="og:locale"]', "property", "og:locale", language === "es" ? "es_US" : "en_US");
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;

    const localBusiness: Schema = {
      "@type": ["LocalBusiness", "GeneralContractor"], "@id": "#business", name: business.name,
      url: siteUrl, telephone: business.phoneHref, image: new URL(image, siteUrl).href,
      description: language === "es" ? "Concreto, bloque, estuco y remodelación en Albuquerque, Nuevo México." : "Concrete, block, stucco, and interior remodeling in Albuquerque, New Mexico.",
      address: { "@type": "PostalAddress", addressLocality: "Albuquerque", addressRegion: "NM", addressCountry: "US" },
      areaServed: areas.map((area) => ({ "@type": "Place", name: `${area}, New Mexico` })),
      availableLanguage: ["English", "Spanish"],
    };
    const graph = [localBusiness, ...(Array.isArray(schema) ? schema : schema ? [schema] : [])];
    document.querySelector('script[data-bighorn-schema]')?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.bighornSchema = "true";
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, [title, description, image, schema, language, location.pathname, noindex]);

  return null;
}