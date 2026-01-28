import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  open: boolean;
  src: string | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

export const LightboxPortal: React.FC<Props> = ({ open, src, onClose, onPrev, onNext }) => {
  // lock scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, onPrev, onNext]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && src && (
        <motion.div
          className="fixed inset-0 z-[2147483647] bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 flex items-center justify-center p-6">
            {/* close */}
            <button
              className="absolute top-6 right-6 text-white/80 hover:text-white z-[2147483647]"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {/* prev */}
            {onPrev && (
              <button
                className="absolute left-4 md:left-8 text-white/70 hover:text-white z-[2147483647]"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={34} />
              </button>
            )}

            {/* image */}
            <motion.img
              src={src}
              alt=""
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />

            {/* next */}
            {onNext && (
              <button
                className="absolute right-4 md:right-8 text-white/70 hover:text-white z-[2147483647]"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                aria-label="Next"
              >
                <ChevronRight size={34} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
