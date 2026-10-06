import { ArrowRight, ClipboardCheck, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniCTA, PageHero, ProjectImage } from "../components/Content";
import { CountUp, HeadingReveal, Reveal } from "../components/Motion";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function Process() {
  const { language, t } = useLanguage();
  return <>
    <SEO title={t("processPageTitle")} description={t("processPageSub")} />
    <PageHero eyebrow={t("processPageEyebrow")} title={t("processPageTitle")} description={t("processPageSub")} image="/images/concrete-patio.jpg" alt={language === "es" ? "Patio de concreto bajo la luz del sol, imagen ilustrativa" : "Completed concrete patio in warm sunlight, illustrative image"} />
    <ProcessTimeline expanded />
    <section className="dark-section section-space" aria-labelledby="expect-heading"><div className="container-wide inner-layout items-center"><div><span className="eyebrow light">{t("guaranteeEyebrow")}</span><div id="expect-heading" className="mt-5"><HeadingReveal lines={[t("guaranteeTitle")]} /></div><p className="body-large mt-6">{t("guaranteeText")}</p><Link to="/faq" className="text-link mt-8">{t("faq")}<ArrowRight size={15} /></Link></div><div className="border-t border-white/20 pt-10 md:pl-12"><ClipboardCheck size={35} className="text-amber" strokeWidth={1.3} /><p className="mt-7 font-display text-[29px] leading-tight tracking-[-.04em] text-white">{language === "es" ? "Un acuerdo claro antes de empezar. Una revisión juntos al terminar." : "A clear agreement before we begin. A walkthrough together when we're done."}</p><div className="mt-12 flex items-end gap-5 border-t border-white/20 pt-8"><CountUp to={1} className="font-display text-[100px] leading-none tracking-[-.08em] text-[#f4b971]" /><div className="pb-2 text-sm font-bold uppercase tracking-[.1em] text-white/80">{language === "es" ? "día hábil para responder" : "business day to respond"}</div></div></div></div></section>
    <section className="section-space"><div className="container-wide inner-layout items-center"><Reveal><ProjectImage src="/images/stucco-home.jpg" alt={language === "es" ? "Casa con estuco terminado, imagen ilustrativa" : "Finished stucco home, illustrative image"} className="detail-photo" /></Reveal><div><HeartHandshake size={38} className="text-terracotta" strokeWidth={1.3} /><h2 className="sub-title mt-7">{t("contactTogether")}</h2><p className="body-large mt-5 text-muted">{t("whyTogether")}</p><Link to="/contact" className="text-link mt-8">{t("freeEstimate")}<ArrowRight size={15} /></Link></div></div></section>
    <MiniCTA />
  </>;
}