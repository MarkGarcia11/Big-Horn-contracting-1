import { lazy, Suspense, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { BackLink, Checklist, PageHero, ProjectCard, ProjectImage, ServiceTile } from "../components/Content";
import { FAQList } from "../components/FAQList";
import { FinalCTA } from "../components/FinalCTA";
import { HeadingReveal, Reveal } from "../components/Motion";
import { copy, projects, services, steps } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO, faqSchema, serviceSchema } from "../lib/seo";
import NotFound from "./NotFound";

const GalleryLightbox = lazy(() => import("../components/GalleryLightbox"));

export default function ServiceDetail() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [active, setActive] = useState<number | null>(null);
  const service = services.find((item) => item.slug === slug);
  const related = useMemo(() => service?.related.map((id) => services.find((item) => item.slug === id)!).filter(Boolean) || [], [service]);
  if (!service) return <NotFound />;
  const gallery = projects.filter((project) => project.category === service.slug).slice(0, 3);
  const materialImage = service.slug === "remodeling" ? "/images/remodel-kitchen.jpg" : service.slug === "block" ? "https://images.pexels.com/photos/19688828/pexels-photo-19688828.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200" : service.slug === "stucco" ? "/images/hero-courtyard.jpg" : "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200";
  const pageSchema = [serviceSchema(service, language), faqSchema(service.faqs, language)];

  return <>
    <SEO title={`${copy(service.title, language)} ${language === "es" ? "en" : "in"} Albuquerque, NM`} description={copy(service.intro, language)} image={service.image} schema={pageSchema} />
    <PageHero eyebrow={service.secondary ? t("secondaryLabel") : t("serviceHeroLabel")} title={copy(service.title, language)} description={copy(service.intro, language)} image={service.image} alt={copy(service.alt, language)} ctaTo={`/contact?service=${service.slug}`} />
    <section className="section-space" aria-labelledby="included-heading"><div className="container-wide inner-layout"><div><BackLink>{t("backServices")}</BackLink><span className="eyebrow mt-10">{t("servicesPageEyebrow")}</span><div id="included-heading" className="mt-5"><HeadingReveal lines={[t("serviceIncluded")]} /></div><Checklist items={service.included} /></div><Reveal direction="right" className="overflow-hidden"><ProjectImage src={materialImage} alt={language === "es" ? "Materiales y trabajo artesanal, imagen ilustrativa" : "Materials and careful craftwork, illustrative photo"} className="detail-photo material-closeup" /></Reveal></div></section>
    <section className="section-space soft-section" aria-labelledby="service-process-heading"><div className="container-wide inner-layout"><div><span className="eyebrow">{t("processEyebrow")}</span><div id="service-process-heading" className="mt-5"><HeadingReveal lines={[t("serviceProcess")]} /></div><p className="body-large mt-5 text-muted">{t("serviceProcessText")}</p><Link to="/process" className="text-link mt-7">{t("processLink")}<ArrowRight size={15} /></Link></div><div>{[steps[0], steps[2], steps[3]].map((step, index) => <Reveal key={index} delay={index * .08}><div className="feature-line"><span>0{index + 1}</span><div><h3>{copy(step.title, language)}</h3><p>{copy(step.detail, language)}</p></div></div></Reveal>)}</div></div></section>
    {gallery.length > 0 && <section className="section-space" aria-labelledby="service-gallery-heading"><div className="container-wide"><span className="eyebrow">{t("projectEyebrow")}</span><div id="service-gallery-heading" className="mt-5 mb-7"><HeadingReveal lines={[t("projectTitle")]} /></div><p className="mb-8 text-sm text-muted">{t("illustrative")}</p><div className="grid gap-6 md:grid-cols-2">{gallery.map((project, index) => <ProjectCard key={project.id} project={project} compare={!!project.before} onOpen={() => setActive(index)} />)}</div>{active !== null && <Suspense fallback={null}><GalleryLightbox items={gallery} activeIndex={active} onClose={() => setActive(null)} onChange={setActive} /></Suspense>}</div></section>}
    <section className="section-space soft-section" aria-labelledby="service-faq-heading"><div className="container-narrow"><span className="eyebrow">{t("faq")}</span><div id="service-faq-heading" className="mt-5 mb-9"><HeadingReveal lines={[t("serviceFaq")]} /></div><FAQList items={service.faqs} /></div></section>
    <section className="section-space" aria-labelledby="related-heading"><div className="container-wide"><span className="eyebrow">{t("services")}</span><div id="related-heading" className="mt-5 mb-9"><HeadingReveal lines={[t("related")]} /></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map((item, index) => <ServiceTile key={item.slug} service={item} index={index} />)}</div></div></section>
    <FinalCTA key={service.slug} defaultService={service.slug} />
  </>;
}