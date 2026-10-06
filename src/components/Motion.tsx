import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({ children, className = "", delay = 0, direction = "up" }: { children: ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" }) {
  const reduce = useReducedMotion();
  const offset = direction === "left" ? { x: -35, y: 0 } : direction === "right" ? { x: 35, y: 0 } : { x: 0, y: 32 };
  return <motion.div className={className} initial={{ opacity: 0, ...(reduce ? {} : offset), filter: reduce ? "none" : "blur(5px)" }} whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: reduce ? .25 : .8, delay, ease }}>{children}</motion.div>;
}

export function HeadingReveal({ lines, className = "section-title" }: { lines: string[]; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <h2 className={className}>
      {lines.map((line, index) => (
        <span key={index} style={{ display: "block", overflow: "hidden", paddingBottom: ".08em", marginBottom: "-.08em" }}>
          <motion.span style={{ display: "block" }} initial={{ y: reduce ? 0 : "110%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: .7 }} transition={{ duration: reduce ? .3 : .85, delay: index * .11, ease }}>{line}</motion.span>
        </span>
      ))}
    </h2>
  );
}

export function AccentUnderline({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return <span className="relative inline-block">{children}<svg aria-hidden="true" viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute -bottom-1 left-0 h-[10px] w-full overflow-visible text-terracotta/75"><motion.path d="M2 8C55 1 134 3 198 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? .1 : .9, delay: .3, ease }} /></svg></span>;
}

export function CountUp({ to, className = "" }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setValue(to); return; }
    const controls = animate(0, to, { duration: 1.2, ease, onUpdate: (latest) => setValue(Math.round(latest)) });
    return () => controls.stop();
  }, [inView, to, reduce]);
  return <span ref={ref} className={className}>{value}</span>;
}

export function MagneticLink({ to, children, className = "button-primary" }: { to: string; children: ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 230, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 230, damping: 20 });
  const reduce = useReducedMotion();
  return (
    <motion.span style={{ display: "inline-flex", x: smoothX, y: smoothY }} onMouseMove={(event) => {
      if (reduce || !window.matchMedia("(hover: hover)").matches) return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * .11);
      y.set((event.clientY - rect.top - rect.height / 2) * .11);
    }} onMouseLeave={() => { x.set(0); y.set(0); }}>
      <Link to={to} className={className}><span>{children}</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
    </motion.span>
  );
}