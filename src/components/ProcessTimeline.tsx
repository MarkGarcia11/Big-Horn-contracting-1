import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { copy, steps } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { HeadingReveal, Reveal } from "./Motion";

function TimelineItem({ step, index }: { step: typeof steps[number]; index: number }) {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const active = useInView(ref, { amount: .5, margin: "0px 0px -15% 0px" });
  return <div ref={ref} className={`timeline-step ${active ? "active" : ""}`}>
    <span className="timeline-dot" aria-hidden="true">{index + 1}</span>
    <Reveal delay={.05}><h3>{copy(step.title, language)}</h3><p>{copy(step.detail, language)}</p></Reveal>
  </div>;
}

export function ProcessTimeline({ expanded = false }: { expanded?: boolean }) {
  const { t } = useLanguage();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 75%", "end 70%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return <section className="process-section section-space" aria-labelledby="process-heading">
    <div className="container-wide process-layout">
      <div className="process-sticky">
        <span className="eyebrow">{t("processEyebrow")}</span>
        <div id="process-heading"><HeadingReveal lines={[t("processTitle")]} /></div>
        <p className="body-large">{expanded ? t("processPageSub") : t("processSub")}</p>
        {!expanded && <Link to="/process" className="text-link mt-8">{t("processLink")}<ArrowRight size={15} /></Link>}
      </div>
      <div className="timeline" ref={timelineRef}>
        <div className="timeline-rail" aria-hidden="true"><motion.div className="timeline-fill" style={{ scaleY: fill }} /></div>
        {steps.map((step, index) => <TimelineItem step={step} index={index} key={index} />)}
      </div>
    </div>
  </section>;
}