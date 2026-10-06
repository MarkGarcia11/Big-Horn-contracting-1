import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/Content";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function Journal() {
  const { language, t } = useLanguage();
  const topics = language === "es" ? ["Cómo elegir un color de estuco para Albuquerque", "Ideas para un patio de concreto en el desierto", "Qué preguntar antes de remodelar su cocina"] : ["Choosing stucco colors for Albuquerque light", "Concrete patio ideas for desert living", "Questions to ask before a kitchen remodel"];
  return <><SEO title={t("blogTitle")} description={t("blogSub")} noindex /><PageHero eyebrow={t("blogEyebrow")} title={t("blogTitle")} description={t("blogSub")} /><section className="section-space"><div className="container-narrow"><p className="eyebrow">{t("blogSub")}</p><div className="mt-9">{topics.map((topic, index) => <div className="feature-line" key={topic}><span>0{index + 1}</span><div><h2 className="font-display text-3xl tracking-[-.05em]">{topic}</h2><p>{language === "es" ? "Próximamente" : "Coming soon"}</p></div></div>)}</div><Link to="/contact" className="text-link mt-10">{t("contact")}<ArrowRight size={15} /></Link></div></section></>;
}