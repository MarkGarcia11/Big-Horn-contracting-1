import { PageHero } from "../components/Content";
import { business } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

export default function Legal({ type }: { type: "privacy" | "terms" }) {
  const { language, t } = useLanguage();
  const privacy = type === "privacy";
  const title = privacy ? t("footerPrivacy") : t("footerTerms");
  return <><SEO title={title} description={language === "es" ? `Información sobre ${title.toLowerCase()} de Big Horn Contracting.` : `${title} for Big Horn Contracting.`} /><PageHero eyebrow="BIG HORN CONTRACTING" title={title} description={language === "es" ? "Información clara sobre el uso de este sitio y sus datos." : "Clear information about this website and your information."} /><section className="section-space"><div className="container-narrow legal-copy">
    {privacy ? <>
      <p>{language === "es" ? "Al enviar una solicitud, nos proporciona su nombre, teléfono, correo opcional, detalles del proyecto y, si decide adjuntarla, una foto. Usamos estos datos para responderle y preparar su presupuesto." : "When you send an estimate request, you provide your name, phone number, optional email, project details, and optionally a photo. We use this information to respond and prepare your estimate."}</p>
      <h2>{language === "es" ? "Dónde guardamos la información" : "Where information is stored"}</h2><p>{language === "es" ? "Las solicitudes se guardan en una base de datos privada de Supabase. Las fotos se guardan en un espacio privado. Si está configurada la notificación por correo, se envía un resumen al dueño. No vendemos sus datos." : "Requests are stored in a private Supabase database. Photos are stored in private storage. If email notifications are configured, a summary is sent to the owner. We do not sell your information."}</p>
      <h2>{language === "es" ? "Análisis y cookies" : "Analytics and cookies"}</h2><p>{language === "es" ? "Solo cargamos Google Analytics o Meta Pixel si acepta el análisis opcional y si el dueño configuró esas herramientas. Puede rechazarlo en el aviso de cookies. Su preferencia se guarda en el navegador." : "We only load Google Analytics or Meta Pixel if you allow optional analytics and the owner has configured those tools. You can decline in the cookie notice. Your choice is stored in your browser."}</p>
      <h2>{language === "es" ? "Sus preguntas" : "Your questions"}</h2><p>{language === "es" ? `Para consultar o solicitar la eliminación de la información que nos envió, escriba a ${business.email}. Los plazos de retención se confirmarán antes de publicar.` : `To ask about or request deletion of information you submitted, email ${business.email}. Retention periods will be confirmed before launch.`}</p>
    </> : <>
      <p>{language === "es" ? "La información de este sitio es general y puede cambiar. Las fotos de proyectos, el retrato del dueño, los testimonios y ciertos datos comerciales son provisionales y se reemplazarán antes de publicar." : "The information on this site is general and may change. Project imagery, the owner portrait, testimonials, and certain business details are placeholders to be replaced before launch."}</p>
      <h2>{language === "es" ? "Presupuestos y trabajo" : "Estimates and work"}</h2><p>{language === "es" ? "Los presupuestos son gratis. Una solicitud en línea no crea un contrato. El alcance, precio, calendario, pagos, permisos y cualquier garantía se acuerdan por escrito para cada proyecto antes de comenzar." : "Estimates are free. An online request does not create a contract. Scope, price, schedule, payment terms, permits, and any warranty are agreed in writing for each project before work begins."}</p>
      <h2>{language === "es" ? "Uso del sitio" : "Website use"}</h2><p>{language === "es" ? "No use el formulario para contenido ilegal o malicioso. La disponibilidad de servicio depende de su ubicación y del alcance del trabajo." : "Please do not use the form for unlawful or malicious content. Service availability depends on location and project scope."}</p>
      <h2>{language === "es" ? "Contacto" : "Contact"}</h2><p>{business.email} / {business.area}</p>
    </>}
  </div></section></>;
}