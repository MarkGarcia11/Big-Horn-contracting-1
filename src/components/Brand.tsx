import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

type MarkProps = { className?: string; animated?: boolean };

export function RamMark({ className = "brand-mark", animated = false }: MarkProps) {
  const pathMotion = animated ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } } : {};

  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" role="img" aria-label="Big Horn ram-horn mark">
      <motion.path d="M49 25C40 11 21 11 13 26C5 40 9 59 21 67C33 75 46 69 49 59C52 50 46 44 40 45C34 45 31 50 33 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" {...pathMotion} />
      <motion.path d="M51 25C60 11 79 11 87 26C95 40 91 59 79 67C67 75 54 69 51 59C48 50 54 44 60 45C66 45 69 50 67 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" {...pathMotion} />
      <motion.path d="M39 81H61M43 75L50 67L57 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" {...pathMotion} />
    </svg>
  );
}

export function Brand({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" className={`brand ${className}`} aria-label="Big Horn Contracting home" onClick={onClick}>
      <RamMark />
      <span className="brand-text">
        <span className="brand-name">Big Horn</span>
        <span className="brand-descriptor">CONTRACTING</span>
      </span>
    </Link>
  );
}

export function BrandLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduce ? 260 : 1050);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="brand-loader" aria-hidden="true" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.1 : 0.48, ease: [0.22, 1, 0.36, 1] }}>
          <div className="brand-loader-inner">
            <RamMark animated={!reduce} />
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : .35, duration: .5 }}>Big Horn</motion.p>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : .55 }}>CONTRACTING</motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}