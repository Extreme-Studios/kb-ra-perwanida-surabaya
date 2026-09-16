"use client";
import { useEffect, useRef, useState } from "react";
import type { GalleryEntry } from "@/types/content";
import { ResponsiveImage } from "@/components/ui/responsive-image";
import { IconButton } from "@/components/ui/primitives";

export function Gallery({ entries, compact = false }: { entries: readonly GalleryEntry[]; compact?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photos = entries.flatMap((entry) => entry.images.map((asset) => ({ asset, title: entry.title })));
  const active = selected === null ? null : photos[selected];
  const close = () => { dialog.current?.close(); setSelected(null); opener.current?.focus(); };
  useEffect(() => {
    if (selected === null) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  return <><div className={`gallery-grid ${compact ? "gallery-grid--compact" : ""}`}>
    {photos.map((photo, index) => <button key={photo.asset.id} className="gallery-photo" aria-label={`Buka foto: ${photo.title}`} onClick={(event) => { opener.current = event.currentTarget; setSelected(index); }}>
      <ResponsiveImage asset={photo.asset} sizes="(max-width: 639px) 90vw, 45vw" />
      <span className="gallery-caption">{photo.title}<span aria-hidden="true">↗</span></span>
    </button>)}
  </div>
    <dialog ref={dialog} className="lightbox" aria-labelledby="lightbox-title" onCancel={() => setSelected(null)}
      onClose={() => { setSelected(null); opener.current?.focus(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" && selected !== null) setSelected((selected + 1) % photos.length);
        if (event.key === "ArrowLeft" && selected !== null) setSelected((selected + photos.length - 1) % photos.length);
        if (event.key === "Tab") {
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
          const first = controls[0], last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
      {active && <div className="lightbox-inner"><div className="lightbox-top"><p id="lightbox-title">{active.title}</p><IconButton label="Tutup foto" onClick={close}>×</IconButton></div>
        <ResponsiveImage asset={active.asset} sizes="90vw" className="lightbox-image" />
        <div className="lightbox-bottom"><IconButton label="Foto sebelumnya" onClick={() => setSelected(((selected ?? 0) + photos.length - 1) % photos.length)}>←</IconButton><span aria-live="polite">{(selected ?? 0) + 1} / {photos.length}</span><IconButton label="Foto berikutnya" onClick={() => setSelected(((selected ?? 0) + 1) % photos.length)}>→</IconButton></div>
      </div>}
    </dialog>
  </>;
}

