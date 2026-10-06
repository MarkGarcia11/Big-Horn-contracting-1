import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniCTA, PageHero } from "../components/Content";
import { business, copy, sampleReviews } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO, reviewSchema } from "../lib/seo";

export default function Reviews() {
  const { language, t } = useLanguage();
  return <>
    <SEO title={t("reviewsPageTitle")} description={t("reviewsPageSub")} schema={reviewSchema(sampleReviews, language)} />
    <PageHero eyebrow={t("reviewsPageEyebrow")} title={t("reviewsPageTitle")} description={t("reviewsPageSub")} />
    <section className="section-space" aria-label={t("reviews")}><div className="container-narrow"><p className="mb-8 text-xs font-bold uppercase tracking-widest text-terracotta">{t("reviewPlaceholder")}</p>{sampleReviews.map((review, index) => <figure key={index} className="border-t border-clay py-12"><div className="flex gap-1 text-terracotta" aria-label={language === "es" ? `${review.rating} de 5 estrellas` : `${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, star) => <Star key={star} size={17} fill="currentColor" strokeWidth={1} />)}</div><blockquote className="mt-5 font-display text-[clamp(27px,3vw,40px)] leading-[1.3] tracking-[-.045em]">{copy(review.quote, language)}</blockquote><figcaption className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">{copy(review.person, language)} / {review.area}</figcaption></figure>)}</div></section>
    <section className="soft-section py-20"><div className="container-wide flex flex-col justify-between gap-8 md:flex-row md:items-center"><div><span className="eyebrow">{t("reviews")}</span><h2 className="sub-title mt-5">{t("leaveReview")}</h2><p className="mt-4 max-w-[520px] text-muted">{t("leaveReviewText")}</p></div><div className="flex flex-wrap gap-3"><a href={`mailto:${business.email}?subject=${encodeURIComponent("My Big Horn experience")}`} className="button-primary"><span>{t("leaveReview")}</span><ArrowRight size={16} /></a><a href={business.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className="button-outline">{t("googleReviews")}</a></div></div></section>
    <div className="container-wide py-8"><Link to="/contact" className="text-link">{t("contact")}<ArrowRight size={15} /></Link></div>
    <MiniCTA />
  </>;
}