import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrandLoader, RamMark } from "./components/Brand";
import { SiteShell } from "./components/SiteShell";
import { LanguageProvider, useLanguage } from "./lib/i18n";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const Process = lazy(() => import("./pages/Process"));
const ServiceAreas = lazy(() => import("./pages/ServiceAreas"));
const Reviews = lazy(() => import("./pages/Reviews"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Journal = lazy(() => import("./pages/Journal"));
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Website() {
  const { language } = useLanguage();
  return <>
    <a href="#main-content" className="sr-only fixed left-4 top-4 z-[400] bg-cream px-5 py-3 text-charcoal focus:not-sr-only">{language === "es" ? "Ir al contenido" : "Skip to content"}</a>
    <BrandLoader />
    <SiteShell>
      <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center"><RamMark className="h-16 w-16 animate-pulse text-terracotta" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/process" element={<Process />} />
          <Route path="/service-areas" element={<ServiceAreas />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SiteShell>
  </>;
}

export default function App() {
  return <LanguageProvider><BrowserRouter><Website /></BrowserRouter></LanguageProvider>;
}
