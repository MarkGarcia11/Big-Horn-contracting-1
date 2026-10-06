import { useRef, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MoveHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { copy, type Localized, type Project, type Service } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { Reveal } from "./Motion";

export function ProjectImage({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const localJpg = src.startsWith("/images/") && src.endsWith(".jpg");
  const sizes = eager ? "100vw" : "(max-width: 700px) 90vw, (max-width: 1200px) 50vw, 33vw";
  const remoteSet = src.includes("images.pexels.com") && src.includes("w=1200")
    ? [480, 800, 1200].map((width) => `${src.replace("w=1200", `w=${width}`)} ${width}w`).join(", ") : undefined;
  return <picture className="project-picture">
    {localJpg && <source type="image/webp" srcSet={[640, 1200, 1600].map((width) => `${src.slice(0, -4)}-${width}.webp ${width}w`).join(", ")} sizes={sizes} />}
    <img src={src} srcSet={remoteSet} sizes={remoteSet ? sizes : undefined} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" />
  </picture>;
}

export function ServiceTile({ service, index }: { service: Service; index: number }) {
  const { language, t } = useLanguage();
  const inner = useRef<HTMLDivElement>(null);
  function tilt(event: MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || !inner.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    inner.current.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  }
  return <Reveal delay={index * .08}><Link to={`/services/${service.slug}`} className="service-tile" onMouseMove={tilt} onMouseLeave={() => { if (inner.current) inner.current.style.transform = ""; }}>
    <div className="service-tile-inner" ref={inner}>
      <div className="service-image-wrap"><ProjectImage src={service.image} alt={copy(service.alt, language)} /><span className="service-overlay"><span className="text-xs font-bold uppercase tracking-widest">{t("learnMore")}</span><ArrowUpRight size={23} /></span></div>
      <div className="service-tile-meta"><h3>{copy(service.title, language)}</h3><ArrowUpRight size={21} /></div>
      <p>{copy(service.short, language)}</p>
    </div>
  </Link></Reveal>;
}

export function BeforeAfter({ before, after, alt, className = "" }: { before: string; after: string; alt: string; className?: string }) {
  const { t } = useLanguage();
  const [value, setValue] = useState(51);
  return <div className={`compare ${className}`}>
    <ProjectImage src={after} alt={alt} />
    <div className="compare-before" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}><ProjectImage src={before} alt="" className="!w-full" /></div>
    <div className="compare-handle" style={{ left: `${value}%` }} aria-hidden="true"><span><MoveHorizontal size={23} /></span></div>
    <span className="compare-label before-label">{t("before")}</span><span className="compare-label after-label">{t("after")}</span>
    <input className="compare-range" type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} aria-label={t("dragCompare")} />
  </div>;
}

export function ProjectCard({ project, onOpen, compare = false, className = "" }: { project: Project; onOpen: () => void; compare?: boolean; className?: string }) {
  const { language, t } = useLanguage();
  return <article className={`${className} ${project.tall ? "project-tall" : ""}`}>
    {compare && project.before ? (
      <div className="project-media h-[420px] w-full"><BeforeAfter before={project.before} after={project.image} alt={copy(project.alt, language)} /></div>
    ) : (
      <button type="button" className="project-media block h-[420px] w-full text-left" onClick={onOpen} aria-label={`${t("viewProject")}: ${copy(project.title, language)}`}><ProjectImage src={project.image} alt={copy(project.alt, language)} /></button>
    )}
    <div className="project-caption"><div><h3>{copy(project.title, language)}</h3><span>{copy(project.area, language)} / {t(project.category)}</span></div>{compare && <button className="text-link mt-2" type="button" onClick={onOpen}>{t("viewProject")} <ArrowUpRight size={13} /></button>}</div>
  </article>;
}

export function AreaMap() {
  const { language } = useLanguage();
  return <svg className="map-art" viewBox="0 0 650 470" fill="none" role="img" aria-label={language === "es" ? "Mapa ilustrativo de Albuquerque y comunidades cercanas" : "Illustrative map of Albuquerque and nearby communities"}>
    <defs><linearGradient id="mapGround" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#F5E8D6" /><stop offset="1" stopColor="#EEE0CA" /></linearGradient><linearGradient id="mapRiver" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#67B5A7" /><stop offset="1" stopColor="#2A9D8F" /></linearGradient></defs>
    <rect width="650" height="470" rx="3" fill="url(#mapGround)" />
    <circle cx="537" cy="79" r="46" fill="#E8BC81" opacity=".6" />
    <path d="M0 232C74 200 88 226 150 188C214 149 258 197 312 157C374 111 430 151 493 113C553 77 607 120 650 92" stroke="#D9C7B0" strokeWidth="1.2" />
    <path d="M0 255C74 223 88 249 150 211C214 172 258 220 312 180C374 134 430 174 493 136C553 100 607 143 650 115M0 280C74 248 88 274 150 236C214 197 258 245 312 205C374 159 430 199 493 161C553 125 607 168 650 140" stroke="#D5BFA5" strokeWidth="1" />
    <path d="M25 398C120 347 165 380 223 324C272 277 319 307 381 250C429 205 501 220 584 170C610 154 634 155 650 148" stroke="#D6C2AC" strokeWidth="1.3" />
    <path d="M0 420C95 369 165 402 223 346C272 299 319 329 381 272C429 227 501 242 584 192C610 176 634 177 650 170" stroke="#D6C2AC" strokeWidth="1.1" />
    <path d="M253 -10C238 56 268 91 255 149C240 216 289 231 269 302C255 354 287 399 274 480" stroke="url(#mapRiver)" strokeWidth="8" strokeLinecap="round" opacity=".75" />
    <path d="M254 -10C239 56 269 91 256 149C241 216 290 231 270 302C256 354 288 399 275 480" stroke="#E8F5EC" strokeWidth="1.3" opacity=".7" />
    <path d="M405 212L440 156L462 175L498 113L526 155L552 139L615 222" stroke="#CDB59A" strokeWidth="2" opacity=".8" />
    <path d="M55 190L162 87M324 397L564 292M129 425L345 70" stroke="#DED0BE" strokeWidth="1" strokeDasharray="5 7" />
    <g fill="#C4553B"><circle cx="302" cy="254" r="8" /><circle cx="302" cy="254" r="16" stroke="#C4553B" strokeWidth="1" fill="none" opacity=".4" /></g>
    <g fill="#A7725C"><circle cx="248" cy="162" r="4" /><circle cx="257" cy="103" r="4" /><circle cx="217" cy="225" r="4" /><circle cx="299" cy="358" r="4" /><circle cx="308" cy="399" r="4" /><circle cx="385" cy="224" r="4" /><circle cx="435" cy="163" r="4" /><circle cx="473" cy="303" r="4" /><circle cx="525" cy="337" r="4" /></g>
    <text x="324" y="257" className="map-label main">ALBUQUERQUE</text><text x="172" y="155" className="map-label">RIO RANCHO</text><text x="175" y="96" className="map-label">BERNALILLO</text><text x="120" y="231" className="map-label">CORRALES</text><text x="316" y="365" className="map-label">LOS LUNAS</text><text x="314" y="412" className="map-label">BELEN</text><text x="395" y="215" className="map-label">PLACITAS</text><text x="485" y="298" className="map-label">EDGEWOOD</text><text x="535" y="348" className="map-label">MORIARTY</text>
    <text x="33" y="445" className="map-label" fill="#9B8979">NEW MEXICO / NOT TO SCALE</text>
  </svg>;
}

export function PageHero({ eyebrow, title, description, image, alt, ctaTo = "/contact" }: { eyebrow: string; title: string; description: string; image?: string; alt?: string; ctaTo?: string }) {
  const { t } = useLanguage();
  return image ? <section className="photo-page-hero"><ProjectImage src={image} alt={alt || ""} eager /><div className="container-wide"><span className="eyebrow light">{eyebrow}</span><h1 className="display-title">{title}</h1><p>{description}</p><Link to={ctaTo} className="button-primary"><span>{t("freeEstimate")}</span><ArrowRight size={16} /></Link></div></section>
    : <section className="page-hero"><div className="container-wide"><span className="eyebrow">{eyebrow}</span><h1 className="display-title">{title}</h1><p>{description}</p></div></section>;
}

export function MiniCTA() {
  const { t } = useLanguage();
  return <div className="container-wide mini-cta"><div><h2>{t("serviceEstimate")}</h2><p>{t("serviceEstimateSub")}</p></div><Link to="/contact" className="button-primary"><span>{t("freeEstimate")}</span><ArrowRight size={17} /></Link></div>;
}

export function BackLink({ to = "/services", children }: { to?: string; children: string }) {
  return <Link to={to} className="text-link"><ArrowLeft size={14} />{children}</Link>;
}

export function Checklist({ items }: { items: Localized[] }) {
  const { language } = useLanguage();
  return <ul className="check-list">{items.map((item, index) => <li key={index}><Check size={19} aria-hidden="true" />{copy(item, language)}</li>)}</ul>;
}