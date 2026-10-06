import { business } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { trackEvent } from "../lib/analytics";
import { EstimateForm } from "./EstimateForm";
import { HeadingReveal, Reveal } from "./Motion";

export function FinalCTA({ defaultService = "" }: { defaultService?: string }) {
  const { t } = useLanguage();
  return <section className="final-cta" aria-labelledby="final-cta-heading">
    <div className="container-wide final-cta-layout">
      <div className="final-cta-content"><span className="eyebrow light">{t("ctaEyebrow")}</span><div id="final-cta-heading"><HeadingReveal lines={[t("ctaTitle")]} /></div><Reveal><p className="body-large">{t("ctaSub")}</p><div className="call-line">{t("ctaCall")}<a href={`tel:${business.phoneHref}`} onClick={() => trackEvent("contact_call_click", { location: "final_cta" })}>{business.phoneDisplay}</a></div></Reveal></div>
      <Reveal delay={.15}><EstimateForm compact defaultService={defaultService} /></Reveal>
    </div>
  </section>;
}