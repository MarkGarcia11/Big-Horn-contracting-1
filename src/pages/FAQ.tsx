import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/Content";
import { FAQList } from "../components/FAQList";
import { HeadingReveal } from "../components/Motion";
import { faqs } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO, faqSchema } from "../lib/seo";

export default function FAQ() {
  const { language, t } = useLanguage();
  return <>
    <SEO title={t("faqPageTitle")} description={t("faqPageSub")} schema={faqSchema(faqs, language)} />
    <PageHero eyebrow={t("faqPageEyebrow")} title={t("faqPageTitle")} description={t("faqPageSub")} />
    <section className="section-space" aria-labelledby="faq-list-heading"><div className="container-narrow"><span className="eyebrow">{t("faq")}</span><div id="faq-list-heading" className="mt-5 mb-10"><HeadingReveal lines={[t("serviceFaq")]} /></div><FAQList items={faqs} /><div className="mt-14"><h3 className="font-display text-3xl tracking-[-.05em]">{t("faqMore")}</h3><Link to="/contact" className="text-link mt-5">{t("contact")}<ArrowRight size={15} /></Link></div></div></section>
  </>;
}