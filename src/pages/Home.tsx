import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, CheckCircle2, Heart, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { RamMark } from "../components/Brand";
import { AreaMap, ProjectCard, ServiceTile } from "../components/Content";
import { FinalCTA } from "../components/FinalCTA";
import { AccentUnderline, HeadingReveal, MagneticLink, Reveal } from "../components/Motion";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { ShareButton } from "../components/SiteShell";
import { business, copy, projects, sampleReviews, services } from "../data/site";
import { trackEvent } from "../lib/analytics";
import { useLanguage } from "../lib/i18n";
import { SEO, serviceSchema } from "../lib/seo";

const HeroMasonryScene = lazy(() => import("../components/HeroMasonryScene"));
const GalleryLightbox = lazy(() => import("../components/GalleryLightbox"));
const ease = [0.22, 1, 0.36, 1] as const;

function Hero() {
  const { t } = useLanguage();
  const reduced = useReducedMotion();
  const [showThree, setShowThree] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
    if (reduced || window.innerWidth < 1200 || nav.connection?.saveData || (nav.deviceMemory && nav.deviceMemory < 4)) return;
    const timer = window.setTimeout(() => setShowThree(true), 2100);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return <section className="home-hero" ref={ref} aria-labelledby="home-hero-heading">
    <motion.picture style={{ y: reduced ? 0 : imageY }}><source type="image/avif" srcSet="/images/hero-courtyard-640.avif 640w, /images/hero-courtyard-1200.avif 1200w, /images/hero-courtyard-1600.avif 1600w" sizes="100vw" /><source type="image/webp" srcSet="/images/hero-courtyard-640.webp 640w, /images/hero-courtyard-1200.webp 1200w, /images/hero-courtyard-1600.webp 1600w" sizes="100vw" /><img src="/images/hero-courtyard.jpg" alt="Sunlit Southwest stucco home and concrete courtyard at golden hour, illustrative hero image" fetchPriority="high" decoding="async" /></motion.picture>
    {showThree && <div className="hero-three" aria-hidden="true"><Suspense fallback={null}><HeroMasonryScene /></Suspense></div>}
    <div className="container-wide hero-content"><div className="hero-content-inner">
      <motion.div className="hero-brand-line" initial={{ opacity: 0, y: reduced ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18, duration: .8, ease }}><RamMark /><div><span>Big Horn</span><small>CONTRACTING / ALBUQUERQUE, NM</small></div></motion.div>
      <h1 className="hero-heading" id="home-hero-heading">
        {[t("heroLineOne"), t("heroLineTwo")].map((line, index) => <span className="word-line" key={index}><motion.span className="gradient-word inline-block" initial={{ y: reduced ? 0 : "115%", x: reduced ? 0 : index === 0 ? -17 : 17, opacity: 0 }} animate={{ y: 0, x: 0, opacity: 1 }} transition={{ duration: reduced ? .3 : 1.05, delay: .32 + index * .17, ease }}>{line}</motion.span></span>)}
      </h1>
      <motion.p className="hero-sub" initial={{ opacity: 0, y: reduced ? 0 : 17 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .78, duration: .75, ease }}>{t("heroSub")}</motion.p>
      <motion.div className="hero-actions" initial={{ opacity: 0, y: reduced ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .93, duration: .7, ease }}>
        <MagneticLink to="/contact">{t("freeEstimate")}</MagneticLink>
        <a href={`tel:${business.phoneHref}`} className="button-outline" onClick={() => trackEvent("contact_call_click", { location: "hero" })}><Phone size={16} aria-hidden="true" />{t("call")}</a>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}><ShareButton className="hero-share"><span>{t("share")}</span><ArrowUpRight size={14} aria-hidden="true" /></ShareButton></motion.div>
    </div></div>
    <div className="hero-bottom"><div className="container-wide hero-bottom-inner"><span>{t("heroLocation")}</span><span>{t("heroScroll")}<ArrowDown size={13} /></span></div></div>
  </section>;
}

function TrustStrip() {
  const { t } = useLanguage();
  const values = [[ShieldCheck, t("trustLicense")], [Heart, t("trustLocal")], [CheckCircle2, t("trustFree")], [MapPin, t("trustArea")]] as const;
  return <div className="trust-strip"><div className="container-wide trust-inner">{values.map(([Icon, label], index) => <div key={label} className="contents"><div className="trust-item"><Icon size={20} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span></div>{index < values.length - 1 && <span className="trust-divider" aria-hidden="true" />}</div>)}</div><p className="container-wide pb-3 text-[10px] text-[#87786b]">{t("trustFootnote")}</p></div>;
}

function PartnerShareRow() {
  const { t } = useLanguage();
  return <div className="border-b border-clay bg-[#fffaf3]"><div className="container-wide flex flex-wrap items-center justify-between gap-3 py-4"><p className="font-display text-lg italic tracking-[-.03em] text-[#655a50]">{t("shareNote")}</p><ShareButton className="text-link"><span>{t("share")}</span><ArrowUpRight size={14} /></ShareButton></div></div>;
}

function WhatWeBuild() {
  const { t } = useLanguage();
  return <section className="section-space" aria-labelledby="work-heading"><div className="container-wide">
    <div className="section-intro"><div><span className="eyebrow">{t("workEyebrow")}</span><div id="work-heading"><HeadingReveal lines={[t("workTitle")]} /></div></div><Reveal className="section-aside body-large"><p>{t("workSub")}</p></Reveal></div>
    <div className="service-grid">{services.filter((service) => !service.secondary).map((service, index) => <ServiceTile key={service.slug} service={service} index={index} />)}</div>
    <div className="cleanup-row"><span>{t("cleanupLine")}</span><Link to="/services/cleanup-hauling" className="text-link">{t("learnMore")}<ArrowRight size={14} /></Link></div>
  </div></section>;
}

function WhyBigHorn() {
  const { t } = useLanguage();
  const reasons = [[t("whyOne"), t("whyOneText")], [t("whyTwo"), t("whyTwoText")], [t("whyThree"), t("whyThreeText")], [t("whyFour"), t("whyFourText")]];
  return <section className="why-section section-space" aria-labelledby="why-heading"><div className="container-wide relative">
    <span className="eyebrow">{t("whyEyebrow")}</span><div id="why-heading" className="mt-5 max-w-[920px]"><HeadingReveal lines={[t("whyTitle")]} /></div><Reveal><p className="body-large mt-5 max-w-[600px] text-muted">{t("whySub")}</p></Reveal>
    <div className="why-grid">{reasons.map(([title, text], index) => <Reveal key={title} delay={index * .09}><div className="glass-panel"><span className="number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div></Reveal>)}</div>
    <Reveal direction="left"><p className="family-note">{t("whyTogether")}</p></Reveal>
  </div></section>;
}

function HornDivider() {
  const reduced = useReducedMotion();
  const first = "M0 0H1440V30C1170 94 900 9 710 63C480 117 250 28 0 95Z";
  const second = "M0 0H1440V58C1160 110 940 15 710 63C470 105 225 12 0 74Z";
  return <div className="h-[65px] overflow-hidden bg-cream md:h-[94px]" aria-hidden="true"><svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="h-full w-full"><defs><linearGradient id="horn-divider" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#f1e4d2" /><stop offset=".56" stopColor="#f4e7d5" /><stop offset="1" stopColor="#fbf6ee" /></linearGradient></defs><motion.path initial={{ d: first }} whileInView={{ d: reduced ? first : second }} viewport={{ once: true }} transition={{ duration: 1.1, ease }} fill="url(#horn-divider)" /></svg></div>;
}

function FeaturedProjects() {
  const { t } = useLanguage();
  const featured = projects.slice(0, 4);
  const carousel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const scroll = (direction: number) => carousel.current?.scrollBy({ left: direction * (carousel.current.clientWidth * .7), behavior: "smooth" });
  return <section className="section-space" aria-labelledby="project-heading"><div className="container-wide">
    <div className="section-intro"><div><span className="eyebrow">{t("projectEyebrow")}</span><div id="project-heading"><HeadingReveal lines={[t("projectTitle")]} /></div><Reveal><p className="body-large mt-5 max-w-[610px] text-muted">{t("projectSub")}</p></Reveal></div><div className="carousel-controls"><button className="round-arrow" type="button" onClick={() => scroll(-1)} aria-label={t("previous")}><ArrowLeftIcon /></button><button className="round-arrow" type="button" onClick={() => scroll(1)} aria-label={t("next")}><ArrowRight size={20} /></button></div></div>
    <div className="project-carousel" ref={carousel}>{featured.map((project, index) => <ProjectCard key={project.id} project={project} compare={!!project.before} onOpen={() => setActive(index)} />)}</div>
    <div className="mt-8 flex flex-wrap items-center justify-between gap-5"><p className="text-xs text-[#827469]">{t("illustrative")}</p><Link to="/projects" className="text-link">{t("seeProjects")}<ArrowRight size={15} /></Link></div>
    {active !== null && <Suspense fallback={null}><GalleryLightbox items={featured} activeIndex={active} onClose={() => setActive(null)} onChange={setActive} /></Suspense>}
  </div></section>;
}

function ArrowLeftIcon() { return <ArrowRight size={20} style={{ transform: "rotate(180deg)" }} />; }

function OwnerPreview() {
  const { language, t } = useLanguage();
  return <section className="owner-section section-space" aria-labelledby="owner-heading"><div className="container-wide owner-layout">
    <Reveal direction="left" className="owner-photo-wrap"><img src="/images/owner-placeholder.jpg" srcSet="/images/owner-placeholder-640.webp 640w, /images/owner-placeholder-1200.webp 1200w" sizes="(max-width: 700px) 100vw, 50vw" alt={language === "es" ? "Retrato ilustrativo provisional de un contratista local en un patio de estuco" : "Illustrative placeholder portrait of a local contractor in a stucco courtyard"} loading="lazy" decoding="async" /><span className="absolute bottom-4 left-4 bg-cream/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">{t("ownerPlaceholder")}</span></Reveal>
    <div className="owner-content"><span className="eyebrow">{t("ownerEyebrow")}</span><h2 className="section-title" id="owner-heading">{language === "es" ? <>Un nombre local. Una promesa <AccentUnderline>personal.</AccentUnderline></> : <>A local name. A <AccentUnderline>personal</AccentUnderline> promise.</>}</h2><Reveal><span className="hand-note">{t("ownerNote")}</span><p className="body-large">{t("ownerBody")}</p><p className="body-large">{t("ownerBodyTwo")}</p><Link to="/about" className="text-link">{t("ownerLink")}<ArrowRight size={15} /></Link></Reveal></div>
  </div></section>;
}

function ReviewPreview() {
  const { language, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % sampleReviews.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduce]);
  const review = sampleReviews[index];
  return <section className="reviews-section section-space" aria-labelledby="reviews-heading" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}><div className="container-wide relative z-10 text-center">
    <span className="eyebrow">{t("reviewEyebrow")}</span><div id="reviews-heading" className="mt-5"><HeadingReveal lines={[t("reviewTitle")]} /></div><p className="mx-auto mt-5 max-w-[650px] text-muted">{t("reviewSub")}</p>
    <div className="review-stars mt-10" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={1} />)}</div>
    <AnimatePresence mode="wait"><motion.blockquote key={index} className="review-quote" initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -12 }} transition={{ duration: .5, ease }}>{copy(review.quote, language)}</motion.blockquote></AnimatePresence>
    <p className="review-person">{copy(review.person, language)} / {review.area}</p><p className="mt-3 text-[11px] text-[#776a5e]">{t("reviewPlaceholder")}</p>
    <div className="review-controls"><button className="round-arrow !h-10 !w-10" type="button" onClick={() => setIndex((index - 1 + sampleReviews.length) % sampleReviews.length)} aria-label={t("previous")}><ArrowLeftIcon /></button><div className="review-dots">{sampleReviews.map((_, dot) => <button key={dot} type="button" className={`review-dot ${dot === index ? "active" : ""}`} aria-label={`${t("reviews")} ${dot + 1}`} onClick={() => setIndex(dot)} />)}</div><button className="round-arrow !h-10 !w-10" type="button" onClick={() => setIndex((index + 1) % sampleReviews.length)} aria-label={t("next")}><ArrowRight size={18} /></button></div>
    <Link to="/reviews" className="text-link mt-8">{t("readMore")}<ArrowRight size={15} /></Link>
  </div></section>;
}

function AreaPreview() {
  const { t } = useLanguage();
  return <section className="area-teaser section-space" aria-labelledby="area-heading"><div className="container-wide area-layout"><div><span className="eyebrow">{t("areaEyebrow")}</span><div id="area-heading"><HeadingReveal lines={[t("areaTitle")]} /></div><Reveal><p className="body-large">{t("areaSub")}</p><Link to="/service-areas" className="text-link">{t("areaLink")}<ArrowRight size={15} /></Link></Reveal></div><Reveal direction="right"><AreaMap /></Reveal></div></section>;
}

export default function Home() {
  const { language, t } = useLanguage();
  const schema = useMemo(() => services.filter((service) => !service.secondary).map((service) => serviceSchema(service, language)), [language]);
  return <>
    <SEO title={language === "es" ? "Big Horn Contracting | Hecho fuerte. Hecho para durar." : "Big Horn Contracting | Built Strong. Built to Last."} description={t("heroSub")} schema={schema} />
    <Hero />
    <TrustStrip />
    <PartnerShareRow />
    <WhatWeBuild />
    <WhyBigHorn />
    <HornDivider />
    <FeaturedProjects />
    <ProcessTimeline />
    <OwnerPreview />
    <ReviewPreview />
    <AreaPreview />
    <FinalCTA />
  </>;
}