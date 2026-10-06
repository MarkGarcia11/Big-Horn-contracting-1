import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniCTA, PageHero, ProjectImage } from "../components/Content";
import { AccentUnderline, HeadingReveal, Reveal } from "../components/Motion";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function About() {
  const { language, t } = useLanguage();
  const values = [[t("whyOne"), t("whyOneText")], [t("whyTwo"), t("whyTwoText")], [t("whyThree"), t("whyThreeText")], [t("whyFour"), t("whyFourText")]];
  return <>
    <SEO title={t("aboutTitle")} description={t("aboutSub")} />
    <PageHero eyebrow={t("aboutEyebrow")} title={t("aboutTitle")} description={t("aboutSub")} />
    <section className="section-space" aria-labelledby="about-story-heading"><div className="container-wide owner-layout"><Reveal direction="left" className="owner-photo-wrap"><img src="/images/owner-placeholder.jpg" srcSet="/images/owner-placeholder-640.webp 640w, /images/owner-placeholder-1200.webp 1200w" sizes="(max-width: 700px) 100vw, 50vw" alt={language === "es" ? "Retrato ilustrativo provisional del dueño en un patio de estuco" : "Illustrative placeholder portrait of the owner in a stucco courtyard"} loading="lazy" /><span className="absolute bottom-4 left-4 bg-cream/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-charcoal">{t("ownerPlaceholder")}</span></Reveal><div className="owner-content"><span className="eyebrow">{t("ownerNote")}</span><h2 id="about-story-heading" className="section-title mt-5">{language === "es" ? <>Hecho con <AccentUnderline>respeto.</AccentUnderline> Arraigado aquí.</> : <>Built on <AccentUnderline>respect.</AccentUnderline> Grounded here.</>}</h2><Reveal><p className="body-large">{t("aboutStoryOne")}</p><p className="body-large">{t("aboutStoryTwo")}</p><span className="hand-note mt-9">Gerardo</span></Reveal></div></div></section>
    <section className="section-space soft-section" aria-labelledby="about-values-heading"><div className="container-wide inner-layout"><div><span className="eyebrow">{t("whyEyebrow")}</span><div id="about-values-heading" className="mt-5"><HeadingReveal lines={[t("aboutValuesTitle")]} /></div><p className="body-large mt-5 text-muted">{t("whySub")}</p></div><div>{values.map(([title,text], index) => <Reveal key={title} delay={index * .08}><div className="feature-line"><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></div></Reveal>)}</div></div></section>
    <section className="section-space" aria-labelledby="community-heading"><div className="container-wide inner-layout items-center"><div><span className="eyebrow">{t("heroLocation")}</span><div id="community-heading" className="mt-5"><HeadingReveal lines={[t("aboutCommunityTitle")]} /></div><p className="body-large mt-5 text-muted">{t("aboutCommunityText")}</p><Link to="/service-areas" className="text-link mt-8">{t("areaLink")}<ArrowRight size={15} /></Link></div><Reveal direction="right"><ProjectImage src="/images/hero-courtyard.jpg" alt={language === "es" ? "Casa del suroeste bajo la luz del atardecer, imagen ilustrativa" : "Southwest home in golden-hour light, illustrative image"} className="detail-photo" /></Reveal></div></section>
    <section className="bg-sandstone py-14"><div className="container-wide flex flex-col gap-5 md:flex-row md:items-start md:gap-12"><ShieldCheck size={34} className="shrink-0 text-terracotta" strokeWidth={1.4} /><div><h2 className="font-display text-3xl tracking-[-.05em]">{t("aboutLicenseTitle")}</h2><p className="mt-3 max-w-[850px] text-[15px] text-muted">{t("aboutLicenseText")}</p></div></div></section>
    <MiniCTA />
  </>;
}