import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MiniCTA, PageHero, ServiceTile } from "../components/Content";
import { HeadingReveal, Reveal } from "../components/Motion";
import { copy, services } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function Services() {
  const { language, t } = useLanguage();
  const cleanup = services.find((service) => service.secondary)!;
  return <>
    <SEO title={t("servicesPageTitle")} description={t("servicesPageSub")} />
    <PageHero eyebrow={t("servicesPageEyebrow")} title={t("servicesPageTitle")} description={t("servicesPageSub")} image="/images/hero-courtyard.jpg" alt={language === "es" ? "Casa de estuco y patio de concreto al atardecer, imagen ilustrativa" : "Southwest stucco home and concrete courtyard at golden hour, illustrative image"} />
    <section className="section-space" aria-labelledby="services-overview-heading"><div className="container-wide">
      <span className="eyebrow">{t("workEyebrow")}</span><div id="services-overview-heading" className="mt-5 mb-11"><HeadingReveal lines={[t("workTitle")]} /></div>
      <div className="service-grid">{services.filter((service) => !service.secondary).map((service, index) => <ServiceTile key={service.slug} service={service} index={index} />)}</div>
      <Reveal><Link to={`/services/${cleanup.slug}`} className="mt-16 flex items-center gap-5 border-t border-clay pt-7 group"><img src={cleanup.image} alt="" loading="lazy" className="h-20 w-24 object-cover" /><div className="flex-1"><span className="eyebrow !text-[9px]">{t("secondaryLabel")}</span><h3 className="mt-1 font-display text-[25px] tracking-[-.04em]">{copy(cleanup.title, language)}</h3><p className="text-sm text-muted">{copy(cleanup.short, language)}</p></div><ArrowRight size={22} className="text-terracotta transition-transform group-hover:translate-x-1" /></Link></Reveal>
    </div></section>
    <section className="section-space soft-section"><div className="container-wide inner-layout items-center"><Reveal><img src="https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200" alt={language === "es" ? "Trabajadores alisando concreto recién vertido, foto de archivo ilustrativa" : "Hands at work smoothing freshly poured concrete, illustrative stock photo"} loading="lazy" className="h-[430px] w-full object-cover" /></Reveal><div><span className="eyebrow">{t("processEyebrow")}</span><div className="mt-5"><HeadingReveal lines={[t("processTitle")]} /></div><p className="body-large mt-5 text-muted">{t("processSub")}</p><Link to="/process" className="text-link mt-8">{t("processLink")}<ArrowRight size={15} /></Link></div></div></section>
    <MiniCTA />
  </>;
}