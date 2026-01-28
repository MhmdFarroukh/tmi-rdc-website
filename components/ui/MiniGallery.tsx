import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const MiniGallery: React.FC<{
  title?: string;
  images: { src: string; alt?: string }[];
}> = ({ title = "Galerie", images }) => {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold uppercase tracking-widest text-xs">{title}</h4>
        <div className="h-px flex-1 bg-white/10 ml-4" />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img) => (
          <button
            key={img.src}
            onClick={() => setOpen(img.src)}
            className="relative min-w-[220px] h-[140px] overflow-hidden border border-white/10 bg-black group"
          >
            <img
              src={img.src}
              alt={img.alt ?? "Image"}
              className="w-full h-full object-cover grayscale opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              draggable={false}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[220] bg-black/90 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <button className="absolute top-6 right-6 text-white/80 hover:text-white" onClick={() => setOpen(null)}>
              <X size={28} />
            </button>
            <motion.img
              src={open}
              className="max-h-[85vh] max-w-[92vw] object-contain rounded-xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
