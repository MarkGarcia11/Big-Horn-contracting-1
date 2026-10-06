import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Camera, ChevronDown, Copy, Mail, Menu, MessageCircle, Phone, Share2, X } from "lucide-react";
import { Brand } from "./Brand";
import { Button } from "./ui/button";
import { areas, business, copy, services } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { initializeAnalytics, trackEvent } from "../lib/analytics";

export function ShareButton({ className = "", children, onBeforeShare }: { className?: string; children?: ReactNode; onBeforeShare?: () => void }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const popover = useRef<HTMLDivElement>(null);
  const url = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    const onClick = (event: MouseEvent) => { if (popover.current && !popover.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  async function share() {
    onBeforeShare?.();
    trackEvent("share_click", { page: window.location.pathname });
    if (navigator.share) {
      try { await navigator.share({ title: "Big Horn Contracting", text: t("shareNote"), url }); return; }
      catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
    }
    setOpen(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt(t("share"), url);
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={share} aria-label={t("share")} aria-expanded={open}>
        {children || <><Share2 size={15} aria-hidden="true" /><span>{t("share")}</span></>}
      </button>
      <AnimatePresence>
        {open && <motion.div ref={popover} className="share-popover" role="dialog" aria-label={t("share")} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <button type="button" onClick={() => setOpen(false)} aria-label={t("close")} style={{ position: "absolute", right: 12, top: 11, width: 30, minHeight: 30 }}><X size={17} /></button>
          <p>{t("shareNote")}</p>
          <button type="button" onClick={copyLink}><Copy size={16} />{copied ? t("shareCopied") : t("share")}</button>
          <a href={`mailto:?subject=${encodeURIComponent("Big Horn Contracting")}&body=${encodeURIComponent(`${t("shareNote")} ${url}`)}`} onClick={() => setOpen(false)}><Mail size={16} />{t("shareEmail")}</a>
          <a href={`sms:?body=${encodeURIComponent(`${t("shareNote")} ${url}`)}`} onClick={() => setOpen(false)}><MessageCircle size={16} />{t("shareText")}</a>
        </motion.div>}
      </AnimatePresence>
    </>
  );
}

function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const overHero = location.pathname === "/" || services.some((service) => location.pathname === `/services/${service.slug}`);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { setMenuOpen(false); setDropdownOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;
    mobileMenuRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); }
      if (event.key !== "Tab" || !mobileMenuRef.current) return;
      const items = Array.from(mobileMenuRef.current.querySelectorAll<HTMLElement>("a,button:not([disabled])"));
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const nav = [
    ["/projects", t("projects")], ["/process", t("process")], ["/about", t("about")],
    ["/reviews", t("reviews")], ["/contact", t("contact")],
  ];

  return (
    <>
      <header className={`site-header ${overHero ? "over-hero" : ""} ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <div className="site-header-inner">
          <Brand onClick={() => setMenuOpen(false)} />
          <nav className="desktop-nav" aria-label={language === "es" ? "Navegación principal" : "Main navigation"}>
            <div className={`nav-dropdown ${dropdownOpen ? "open" : ""}`}>
              <button type="button" className="nav-dropdown-trigger nav-underline" aria-expanded={dropdownOpen} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {t("services")} <ChevronDown size={13} aria-hidden="true" />
              </button>
              <div className="nav-dropdown-menu">
                <Link to="/services" onClick={() => setDropdownOpen(false)}>{t("viewAll")} {t("services").toLowerCase()}</Link>
                {services.map((service) => <Link key={service.slug} to={`/services/${service.slug}`} onClick={() => setDropdownOpen(false)}>{copy(service.title, language)}</Link>)}
              </div>
            </div>
            {nav.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-underline ${isActive ? "active" : ""}`}>{label}</NavLink>)}
          </nav>
          <div className="nav-actions">
            <ShareButton className="nav-desktop-only inline-flex min-h-11 items-center gap-1.5 text-[10px] font-extrabold tracking-wide" ><Share2 size={16} /><span className="hidden min-[1250px]:inline">{t("share")}</span></ShareButton>
            <a className="nav-icon-button" href={`tel:${business.phoneHref}`} aria-label={`${t("call")}: ${business.phoneDisplay}`} onClick={() => trackEvent("contact_call_click", { location: "header" })}><Phone size={16} /></a>
            <Button asChild size="sm" className="nav-estimate"><Link to="/contact"><span>{t("freeEstimate")}</span><ArrowRight size={14} /></Link></Button>
            <button className="lang-button" type="button" onClick={() => setLanguage(language === "en" ? "es" : "en")} aria-label={language === "en" ? "Cambiar a Español" : "Switch to English"}>{language === "en" ? "ES" : "EN"}</button>
            <button ref={menuButtonRef} className="hamburger" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t("close") : t("menu")} aria-expanded={menuOpen} aria-controls="mobile-menu">{menuOpen ? <X size={25} /> : <Menu size={25} />}</button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.nav ref={mobileMenuRef} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label={language === "es" ? "Menú móvil" : "Mobile menu"} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: .35 }}>
            <Link to="/services" onClick={() => setMenuOpen(false)}>{t("services")}<ArrowRight size={24} /></Link>
            {services.map((service) => <Link className="mobile-sub-link" key={service.slug} to={`/services/${service.slug}`} onClick={() => setMenuOpen(false)}>{copy(service.title, language)}</Link>)}
            {nav.map(([to, label]) => <Link key={to} to={to} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={24} /></Link>)}
            <Link to="/service-areas" onClick={() => setMenuOpen(false)}>{t("areas")}<ArrowRight size={24} /></Link>
            <Link to="/faq" onClick={() => setMenuOpen(false)}>{t("faq")}<ArrowRight size={24} /></Link>
            <div className="mobile-menu-actions">
              <a className="button-primary" href={`tel:${business.phoneHref}`} onClick={() => { trackEvent("contact_call_click", { location: "mobile_menu" }); setMenuOpen(false); }}><Phone size={16} />{t("call")}</a>
              <ShareButton className="button-outline" onBeforeShare={() => setMenuOpen(false)} />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  const { language, t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="container-wide footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>{t("footerLine")}</p>
          <div className="footer-social" aria-label={t("footerSocial")}>
            <span title="Facebook profile to be added" aria-label="Facebook profile to be added" className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/25 text-sm font-bold">f</span>
            <span title="Instagram profile to be added" aria-label="Instagram profile to be added" className="grid h-[38px] w-[38px] place-items-center rounded-full border border-white/25"><Camera size={15} /></span>
            <a href={business.googleBusinessUrl} target="_blank" rel="noopener noreferrer" aria-label={t("googleReviews")}><span className="text-sm font-bold">G</span></a>
          </div>
        </div>
        <div><h4>{t("footerServices")}</h4><ul>{services.map((service) => <li key={service.slug}><Link to={`/services/${service.slug}`}>{copy(service.title, language)}</Link></li>)}</ul></div>
        <div><h4>{t("footerCompany")}</h4><ul>{[["/about",t("about")],["/projects",t("projects")],["/process",t("process")],["/reviews",t("reviews")],["/faq",t("faq")],["/journal",t("blog")]].map(([to,label]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></div>
        <div><h4>{t("footerAreas")}</h4><ul>{areas.slice(0,6).map((area) => <li key={area}><Link to="/service-areas">{area}</Link></li>)}<li><Link to="/service-areas">{t("viewAll")} <ArrowRight size={12} className="inline" /></Link></li></ul></div>
        <div><h4>{t("footerContact")}</h4><ul>
          <li><a href={`tel:${business.phoneHref}`} onClick={() => trackEvent("contact_call_click", { location: "footer" })}>{business.phoneDisplay}</a></li>
          <li><a href={`mailto:${business.email}`}>{business.email}</a></li>
          <li className="footer-detail">{t("hoursValue")}</li>
          <li className="footer-detail">{business.area}<br />{t("footerAreaNote")}</li>
          <li className="footer-detail">{t("footerLicense")}</li>
        </ul><Link className="footer-prompt" to="/contact">{t("footerPrompt")} <ArrowRight size={15} /></Link></div>
      </div>
      <div className="container-wide footer-bottom">
        <span>© {new Date().getFullYear()} Big Horn Contracting. {t("footerCopyright")}</span>
        <div className="footer-bottom-links"><Link to="/privacy">{t("footerPrivacy")}</Link><Link to="/terms">{t("footerTerms")}</Link><span>{t("footerVerify")}</span></div>
      </div>
    </footer>
  );
}

function CookieNotice() {
  const { t } = useLanguage();
  const [choice, setChoice] = useState<string | null>(() => { try { return localStorage.getItem("bighorn-cookie-choice"); } catch { return null; } });
  useEffect(() => { if (choice === "yes") initializeAnalytics(); }, [choice]);
  function choose(value: string) { try { localStorage.setItem("bighorn-cookie-choice", value); } catch { /* Storage can be unavailable. */ } setChoice(value); }
  if (choice) return null;
  return <div className="cookie-notice" role="region" aria-label={t("cookiePrivacy")}><p>{t("cookieText")} <Link to="/privacy" className="underline">{t("cookiePrivacy")}</Link></p><div className="cookie-notice-actions"><Button type="button" variant="dark" size="sm" onClick={() => choose("yes")}>{t("cookieAccept")}</Button><button type="button" onClick={() => choose("no")}>{t("cookieDecline")}</button></div></div>;
}

function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const move = (event: PointerEvent) => {
      if (!ring.current) return;
      ring.current.style.left = `${event.clientX}px`;
      ring.current.style.top = `${event.clientY}px`;
      ring.current.style.opacity = "1";
      ring.current.classList.toggle("is-hovering", !!(event.target as Element)?.closest("a,button,input,textarea,select,[role=button]"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduce]);
  return <div ref={ring} className="cursor-ring hidden lg:block" style={{ opacity: 0 }} aria-hidden="true" />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [pathname]);
  return null;
}

export function SiteShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  return (
    <>
      <ScrollToTop />
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <div className="mobile-bottom-bar">
        <a href={`tel:${business.phoneHref}`} className="button-outline" onClick={() => trackEvent("contact_call_click", { location: "mobile_bar" })}><Phone size={16} />{t("callShort")}</a>
        <Link to="/contact" className="button-primary"><span>{t("freeEstimateShort")}</span><ArrowRight size={16} /></Link>
      </div>
      <CookieNotice />
      <CustomCursor />
    </>
  );
}