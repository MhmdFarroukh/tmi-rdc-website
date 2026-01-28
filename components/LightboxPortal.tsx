import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  src: string | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export default function LightboxPortal({ open, src, onClose, onPrev, onNext }: Props) {
  // Convert thumbnail path to full-size only when lightbox opens
  const fullSizeSrc = useMemo(() => {
    if (!src) return null;
    // If src contains size indicator (_480px, _768px, etc), remove it for full-size
    return src.replace(/_\d+px\.(webp|jpg|jpeg|png)$/i, '.$1');
  }, [src]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || !fullSizeSrc) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
        >
          ◀
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
        >
          ▶
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
      </div>

      <img
        src={fullSizeSrc}
        className="max-h-[90vh] max-w-[95vw] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        alt=""
        loading="eager"
        decoding="async"
      />
    </div>,
    document.body
  );
}
