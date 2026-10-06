import { useEffect, useRef, type TouchEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { copy, type Project } from "../data/site";
import { useLanguage } from "../lib/i18n";
import { ProjectImage } from "./Content";

export default function GalleryLightbox({ items, activeIndex, onClose, onChange }: { items: Project[]; activeIndex: number; onClose: () => void; onChange: (index: number) => void }) {
  const { language, t } = useLanguage();
  const touchStart = useRef<number | null>(null);
  const active = items[activeIndex];
  const next = () => onChange((activeIndex + 1) % items.length);
  const previous = () => onChange((activeIndex - 1 + items.length) % items.length);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") { event.preventDefault(); next(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, items.length]);
  function endTouch(event: TouchEvent<HTMLDivElement>) {
    if (touchStart.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(delta) > 45) delta < 0 ? next() : previous();
    touchStart.current = null;
  }
  return <Dialog.Root open onOpenChange={(value) => { if (!value) onClose(); }}><Dialog.Portal>
    <Dialog.Overlay className="lightbox-overlay" />
    <Dialog.Content className="lightbox-content" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={endTouch}>
      <Dialog.Title className="sr-only">{active ? copy(active.title, language) : t("viewProject")}</Dialog.Title>
      <Dialog.Close asChild><button type="button" className="lightbox-close" aria-label={t("close")}><X size={21} /></button></Dialog.Close>
      {active && <><div className="lightbox-image-wrap"><ProjectImage src={active.image} alt={copy(active.alt, language)} eager /></div><div className="lightbox-caption"><span>{copy(active.title, language)} / {copy(active.area, language)}</span><span className="text-white/65">{t("imagePlaceholder")}</span></div></>}
      <button type="button" className="lightbox-arrow prev" onClick={previous} aria-label={t("previous")}><ChevronLeft size={24} /></button>
      <button type="button" className="lightbox-arrow next" onClick={next} aria-label={t("next")}><ChevronRight size={24} /></button>
    </Dialog.Content>
  </Dialog.Portal></Dialog.Root>;
}