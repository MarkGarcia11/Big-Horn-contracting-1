import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { RamMark } from "../components/Brand";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function NotFound() {
  const { t } = useLanguage();
  return <><SEO title={t("notFoundTitle")} description={t("notFoundText")} noindex /><section className="soft-section flex min-h-[75vh] items-center justify-center px-5 pb-24 pt-44 text-center"><div><RamMark className="not-found-horn" /><span className="eyebrow">404 / BIG HORN</span><h1 className="section-title mx-auto mt-5 max-w-[750px]">{t("notFoundTitle")}</h1><p className="mx-auto mt-6 max-w-[490px] text-muted">{t("notFoundText")}</p><Link to="/" className="button-primary mt-9"><span>{t("backHome")}</span><ArrowRight size={16} /></Link></div></section></>;
}