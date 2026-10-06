import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { AreaMap, PageHero } from "../components/Content";
import { EstimateForm } from "../components/EstimateForm";
import { business, services } from "../data/site";
import { trackEvent } from "../lib/analytics";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function Contact() {
  const { language, t } = useLanguage();
  const [params] = useSearchParams();
  const selectedService = services.some((service) => service.slug === params.get("service")) ? params.get("service")! : "";
  return <>
    <SEO title={t("contactTitle")} description={t("contactSub")} />
    <PageHero eyebrow={t("contactEyebrow")} title={t("contactTitle")} description={t("contactSub")} />
    <section className="section-space" aria-label={t("freeEstimate")}><div className="container-wide contact-layout">
      <EstimateForm key={selectedService} defaultService={selectedService} headingLevel="h2" />
      <aside className="contact-side"><span className="eyebrow">{t("contactDetails")}</span><h2 className="mt-5">{t("contactDetails")}</h2><p className="body-large mt-5 text-muted">{t("contactTogether")}</p>
        <div className="contact-method"><Phone size={22} /><div><span>{t("call")}</span><a href={`tel:${business.phoneHref}`} onClick={() => trackEvent("contact_call_click", { location: "contact_page" })}>{business.phoneDisplay}</a></div></div>
        <div className="contact-method"><MessageCircle size={22} /><div><span>{t("textUs")}</span><a href={`sms:${business.phoneHref}`} onClick={() => trackEvent("contact_text_click", { location: "contact_page" })}>{business.phoneDisplay}</a><div className="mt-2"><a className="text-xs !font-semibold text-terracotta underline" href={`https://wa.me/${business.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent(language === "es" ? "Hola Big Horn, quiero hablar sobre un proyecto." : "Hello Big Horn, I'd like to talk about a project.")}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></div>
        <div className="contact-method"><Mail size={22} /><div><span>{t("formEmailChoice")}</span><a href={`mailto:${business.email}`}>{business.email}</a></div></div>
        <div className="contact-method"><Clock3 size={22} /><div><span>{t("contactHours")}</span><strong>{t("hoursValue")}</strong></div></div>
        <div className="contact-method"><MapPin size={22} /><div><span>{t("contactArea")}</span><strong>{t("addressPending")}</strong></div></div>
        <div className="contact-map"><AreaMap /></div>
      </aside>
    </div></section>
  </>;
}