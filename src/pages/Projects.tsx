import { lazy, Suspense, useState } from "react";
import { MiniCTA, PageHero, ProjectCard } from "../components/Content";
import { projects, type Project } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { SEO } from "../lib/seo";

const GalleryLightbox = lazy(() => import("../components/GalleryLightbox"));

export default function Projects() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | Project["category"]>("all");
  const [active, setActive] = useState<number | null>(null);
  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const filters = ["all", "concrete", "block", "stucco", "remodeling"] as const;
  return <>
    <SEO title={t("galleryTitle")} description={t("gallerySub")} />
    <PageHero eyebrow={t("galleryEyebrow")} title={t("galleryTitle")} description={t("gallerySub")} />
    <section className="section-space" aria-label={t("projects")}><div className="container-wide">
      <div className="filter-row" role="group" aria-label={t("services")}>{filters.map((item) => <button type="button" key={item} className={`filter-chip ${filter === item ? "active" : ""}`} onClick={() => { setFilter(item); setActive(null); }} aria-pressed={filter === item}>{t(item)}</button>)}</div>
      <p className="mb-8 text-sm text-muted">{t("illustrative")}</p>
      {visible.length ? <div className="masonry-grid">{visible.map((project, index) => <ProjectCard key={project.id} project={project} compare={!!project.before} onOpen={() => setActive(index)} />)}</div> : <p>{t("galleryEmpty")}</p>}
      {active !== null && <Suspense fallback={null}><GalleryLightbox items={visible} activeIndex={active} onClose={() => setActive(null)} onChange={setActive} /></Suspense>}
    </div></section>
    <MiniCTA />
  </>;
}