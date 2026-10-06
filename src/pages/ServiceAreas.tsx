import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { AreaMap, MiniCTA, PageHero } from "../components/Content";
import { HeadingReveal, Reveal } from "../components/Motion";
import { areas } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function ServiceAreas() {
  const { language, t } = useLanguage();
  return <>
    <SEO title={`${t("areas")} | Albuquerque, Rio Rancho & nearby NM`} description={t("areasPageSub")} />
    <PageHero eyebrow={t("areasPageEyebrow")} title={t("areasPageTitle")} description={t("areasPageSub")} />
    <section className="section-space" aria-labelledby="area-map-heading"><div className="container-wide area-layout"><div><span className="eyebrow">{t("areaEyebrow")}</span><div id="area-map-heading" className="mt-5"><HeadingReveal lines={[t("areaTitle")]} /></div><p className="body-large mt-6 text-muted">{t("areaSub")}</p><Link to="/contact" className="text-link mt-8">{t("freeEstimate")}<ArrowRight size={15} /></Link></div><Reveal direction="right"><AreaMap /></Reveal></div></section>
    <section className="section-space soft-section" aria-labelledby="areas-list-heading"><div className="container-wide"><span className="eyebrow">{t("areasPageEyebrow")}</span><div id="areas-list-heading" className="mt-5"><HeadingReveal lines={[t("areasPageTitleTwo")]} /></div><p className="body-large mt-5 max-w-[750px] text-muted">{t("areasPageText")}</p><p className="mt-2 text-xs text-[#816c5d]">{t("areasPending")}</p><div className="areas-grid mt-14">{areas.map((area) => <div className="area-row" key={area}><MapPin size={17} className="mb-4 text-terracotta" aria-hidden="true" /><h3>{area}, NM</h3><p>{language === "es" ? `Big Horn Contracting puede ayudarle con concreto, bloque, estuco y remodelación en ${area}. Consulte disponibilidad en su zona.` : `Ask Big Horn Contracting about concrete, block, stucco, and remodeling in ${area}. Contact us to confirm availability.`}</p></div>)}</div></div></section>
    <MiniCTA />
  </>;
}