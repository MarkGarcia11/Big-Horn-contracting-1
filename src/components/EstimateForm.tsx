import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Paperclip, Phone } from "lucide-react";
import { business, copy, services } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { trackEvent } from "../lib/analytics";
import { Button } from "./ui/button";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  service: string;
  details: string;
  contactMethod: "call" | "text" | "email";
  partnerName: string;
  website: string;
};

const initialValues = (service = ""): FormValues => ({ name: "", phone: "", email: "", service, details: "", contactMethod: "call", partnerName: "", website: "" });

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}

export function EstimateForm({ compact = false, defaultService = "", headingLevel = "h3" }: { compact?: boolean; defaultService?: string; headingLevel?: "h2" | "h3" }) {
  const { language, t } = useLanguage();
  const [values, setValues] = useState<FormValues>(() => initialValues(defaultService));
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());
  const Heading = headingLevel;

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file && (file.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
      setError(t("formPhotoError"));
      event.target.value = "";
      setPhoto(null);
      return;
    }
    setPhoto(file);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.name.trim() || values.phone.replace(/\D/g, "").length < 10 || values.details.trim().length < 8) { setError(t("formRequired")); return; }
    if ((values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) || (values.contactMethod === "email" && !values.email)) { setError(t("formEmailError")); return; }
    if (photo && (photo.size > 2 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(photo.type))) { setError(t("formPhotoError")); return; }

    setStatus("sending");
    setError("");
    try {
      const photoData = photo ? await readImage(photo) : null;
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, photoData, elapsedMs: Date.now() - startedAt.current, sourcePath: window.location.pathname, language }),
      });
      if (!response.ok) {
        if (response.status === 429) throw new Error(t("formRateLimit"));
        if (response.status === 503) throw new Error(t("formNotConfigured"));
        throw new Error(t("formError"));
      }
      setStatus("success");
      trackEvent("estimate_submit", { service: values.service || "general", location: window.location.pathname });
    } catch (caught) {
      setStatus("idle");
      setError(caught instanceof Error ? caught.message : t("formError"));
    }
  }

  if (status === "success") {
    return <div className="form-panel form-success" role="status" aria-live="polite">
      <CheckCircle2 size={45} strokeWidth={1.5} aria-hidden="true" />
      <Heading>{t("formSuccessTitle")}</Heading>
      <p>{t("formSuccessText")}</p>
      <button type="button" className="text-link" onClick={() => { setStatus("idle"); setValues(initialValues(defaultService)); setPhoto(null); startedAt.current = Date.now(); }}>{t("formAnother")} <ArrowRight size={15} /></button>
    </div>;
  }

  return (
    <div className="form-panel">
      <Heading>{compact ? t("serviceEstimate") : t("freeEstimate")}</Heading>
      <form onSubmit={submit} noValidate>
        <div className="form-honeypot" aria-hidden="true"><label htmlFor={`website-${compact ? "short" : "full"}`}>{t("formHoneypot")}</label><input id={`website-${compact ? "short" : "full"}`} tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} /></div>
        <div className="form-grid">
          <div className="form-field"><label htmlFor={`name-${compact ? "short" : "full"}`}>{t("formName")} *</label><input id={`name-${compact ? "short" : "full"}`} autoComplete="name" value={values.name} onChange={(event) => update("name", event.target.value)} placeholder={t("formNamePlaceholder")} required maxLength={100} /></div>
          <div className="form-field"><label htmlFor={`phone-${compact ? "short" : "full"}`}>{t("formPhone")} *</label><input id={`phone-${compact ? "short" : "full"}`} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} placeholder={t("formPhonePlaceholder")} required maxLength={30} /></div>
          {!compact && <div className="form-field"><label htmlFor="email-full">{t("formEmail")}</label><input id="email-full" type="email" autoComplete="email" value={values.email} onChange={(event) => update("email", event.target.value)} placeholder={t("formEmailPlaceholder")} maxLength={150} /></div>}
          <div className={`form-field ${compact ? "full" : ""}`}><label htmlFor={`service-${compact ? "short" : "full"}`}>{t("formService")}</label><select id={`service-${compact ? "short" : "full"}`} value={values.service} onChange={(event) => update("service", event.target.value)}><option value="">{t("formServicePlaceholder")}</option>{services.map((service) => <option key={service.slug} value={service.slug}>{copy(service.title, language)}</option>)}<option value="general">{t("formGeneral")}</option></select></div>
          <div className="form-field full"><label htmlFor={`details-${compact ? "short" : "full"}`}>{t("formDetails")} *</label><textarea id={`details-${compact ? "short" : "full"}`} value={values.details} onChange={(event) => update("details", event.target.value)} placeholder={t("formDetailsPlaceholder")} required maxLength={3000} /></div>
          {!compact && <div className="form-field full"><span className="form-label" id="contact-method-label">{t("formContact")}</span><div className="contact-choice" role="radiogroup" aria-labelledby="contact-method-label">{(["call", "text", "email"] as const).map((method) => <label key={method}><input type="radio" name="contactMethod" value={method} checked={values.contactMethod === method} onChange={() => update("contactMethod", method)} /><span>{method === "call" ? t("formCall") : method === "text" ? t("formText") : t("formEmailChoice")}</span></label>)}</div></div>}
          <div className="form-field full"><label htmlFor={`partner-${compact ? "short" : "full"}`}>{t("formPartner")}</label><input id={`partner-${compact ? "short" : "full"}`} value={values.partnerName} onChange={(event) => update("partnerName", event.target.value)} placeholder={t("formPartnerPlaceholder")} maxLength={100} /></div>
          {!compact && <div className="form-field full"><span className="form-label">{t("formPhoto")}</span><label className="upload-label"><Paperclip size={17} aria-hidden="true" /><span>{photo ? photo.name : t("formPhotoHint")}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhotoChange} aria-label={t("formPhoto")} /></label></div>}
        </div>
        {error && <div className="form-error mt-5" role="alert">{error} <a href={`tel:${business.phoneHref}`} className="underline" onClick={() => trackEvent("contact_call_click", { location: "form_error" })}><Phone size={12} className="inline" /> {business.phoneDisplay}</a></div>}
        <div className="form-bottom"><Button type="submit" disabled={status === "sending"}><span>{status === "sending" ? t("formSending") : t("formSubmit")}</span><ArrowRight size={16} aria-hidden="true" /></Button><p className="form-privacy">{t("formPrivacy")}</p></div>
      </form>
    </div>
  );
}