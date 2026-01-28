// pages/Politique.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import FastImage from "../components/ui/FastImage";
import { Reveal } from "../components/ui/Reveal";

type GalleryItem = {
  title: string;
  file: string; // can be "images/...." OR just "filename.jpg"
  hintDir?: string; // optional directory hint if file is only a filename
};

const withLeadingSlash = (p: string) => (p.startsWith("/") ? p : `/${p}`);

/**
 * Accepts:
 * - "images/immersion/x.jpg"  -> "/images/immersion/x.jpg"
 * - "/images/immersion/x.jpg" -> "/images/immersion/x.jpg"
 * - "x.jpg" + hintDir -> "/images/<hintDir>/x.jpg"
 * - "x.jpg" (no hint) -> tries a sensible default folder
 */
function resolveAsset(file: string, hintDir?: string) {
  const raw = file.trim();

  // already a path
  if (raw.includes("/")) return withLeadingSlash(raw);

  // filename only
  const dir = hintDir?.trim() || "immersion";
  return withLeadingSlash(`images/${dir}/${raw}`);
}

const GALLERY: GalleryItem[] = [
  // If these are NOT in images/immersion, change hintDir or put full path.
  { title: "Chantier / structure", file: "construction.webp", hintDir: "immersion" },
  { title: "Construction métallique", file: "charpente.webp", hintDir: "immersion" },
  { title: "Charpente métallique", file: "WhatsApp Image 2026-01-23 at 1.02.21 PM.jpeg", hintDir: "immersion" },
  { title: "Citerne / réservoir", file: "WhatsApp Image 2026-01-23 at 1.01.54 PM.jpeg", hintDir: "immersion" },
  { title: "Remorque", file: "remorque.webp", hintDir: "immersion" },
  { title: "Maintenance", file: "img2.webp", hintDir: "immersion" },
  { title: "Atelier", file: "img3.webp", hintDir: "immersion" },
  { title: "Qualité", file: "qualite.webp", hintDir: "immersion" },
];

const Lightbox: React.FC<{
  open: boolean;
  onClose: () => void;
  items: GalleryItem[];
  index: number;
  setIndex: (i: number) => void;
}> = ({ open, onClose, items, index, setIndex }) => {
  const prev = useCallback(() => setIndex((index - 1 + items.length) % items.length), [index, items.length, setIndex]);
  const next = useCallback(() => setIndex((index + 1) % items.length), [index, items.length, setIndex]);

  // ESC + arrows + body scroll lock
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            type="button"
          >
            <X size={28} />
          </button>

          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous"
            type="button"
          >
            <ChevronLeft size={34} />
          </button>

          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-[10000]"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next"
            type="button"
          >
            <ChevronRight size={34} />
          </button>

          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              className="relative max-w-[92vw] max-h-[85vh] w-full"
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
                <div className="w-full h-[85vh]">
                  <FastImage
                    src={resolveAsset(items[index].file, items[index].hintDir)}
                    alt={items[index].title}
                    className="w-full h-full object-contain bg-black"
                    sizes="(max-width: 768px) 90vw, 1200px"
                    decoding="async"
                  />
                </div>
              </div>

              <div className="mt-4 text-center text-white/70 text-sm">
                <span className="font-semibold text-white">{items[index].title}</span>
                <span className="mx-2 text-white/30">•</span>
                <span>
                  {index + 1}/{items.length}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const PolitiquePage: React.FC = () => {
  const [idx, setIdx] = useState<number | null>(null);
  const items = useMemo(() => GALLERY, []);

  return (
    <div className="pt-28 md:pt-32 min-h-screen pb-24 bg-forge-dark">
      <div className="container mx-auto px-6">
        {/* HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <Reveal effect="mask">
              <h1 className="text-[10vw] lg:text-[5.2rem] font-display font-bold text-white uppercase leading-[0.9] tracking-tighter">
                Agence <br className="hidden md:block" /> &amp; Terrain
              </h1>
            </Reveal>

            <p className="text-white/60 max-w-2xl mt-6">
              Techno Métal Industrie (TMI-RDC) accompagne vos projets de construction métallique de bout en bout :
              étude, fabrication, montage et suivi de chantier — avec des standards industriels.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:info@tmi-rdc.com"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-safety-orange text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition"
              >
                Demander un devis
              </a>
              <a
                href="tel:+243828391457"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/15 text-white text-xs font-bold uppercase tracking-widest hover:border-white/30 hover:text-white transition"
              >
                Appeler
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[4/3]">
                <FastImage
                  src={withLeadingSlash("images/immersion/hero.avif")}
                  alt="Atelier et terrain — TMI-RDC"
                  className="absolute inset-0 w-full h-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white/80 text-xs font-mono uppercase tracking-widest">Lubumbashi • RDC</div>
                  <div className="text-white font-display font-bold uppercase tracking-tight mt-2">
                    Atelier, fabrication, chantier
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-white/70 text-xs font-mono uppercase tracking-widest">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-white">Charpente</div>
                <div className="mt-2 text-white/50">Acier • Assemblage</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-white">Chaudronnerie</div>
                <div className="mt-2 text-white/50">Cuves • Pièces</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-white">Tuyauterie</div>
                <div className="mt-2 text-white/50">Réseaux • Support</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-white">Suivi</div>
                <div className="mt-2 text-white/50">Planning • Qualité</div>
              </div>
            </div>
          </div>
        </div>

        {/* METHOD */}
        <section className="mt-20 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="text-white font-display font-bold uppercase tracking-tight text-3xl md:text-4xl">
              Notre méthode
            </h2>
            <p className="text-white/60 mt-4 max-w-xl">
              Une exécution maîtrisée : de la conception à la pose, avec traçabilité, contrôle et respect des délais.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Étude & conception",
                desc: "Analyse des contraintes, planification, préparation technique et validation des choix.",
              },
              {
                title: "Fabrication atelier",
                desc: "Découpe, assemblage, soudure et contrôle avant expédition sur site.",
              },
              {
                title: "Montage & chantier",
                desc: "Installation, levage, ajustements et coordination terrain avec vos équipes.",
              },
              {
                title: "Qualité & sécurité",
                desc: "Contrôles, conformité, bonnes pratiques HSE et livraison dans les standards.",
              },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-white font-semibold">{b.title}</div>
                <div className="text-white/60 mt-3">{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="mt-20 md:mt-24">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-white/70 font-mono text-xs uppercase tracking-widest">
                Galerie (atelier & chantier)
              </div>
              <h2 className="text-white font-display font-bold uppercase tracking-tight text-3xl md:text-4xl mt-2">
                Aperçu terrain
              </h2>
            </div>
            <div className="text-white/40 text-sm hidden md:block">Cliquez pour ouvrir • ESC pour fermer</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((it, i) => (
              <button
                key={`${it.file}-${i}`}
                onClick={() => setIdx(i)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black group text-left"
                type="button"
              >
                <FastImage
                  src={resolveAsset(it.file, it.hintDir)}
                  alt={it.title}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 22vw"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white font-display font-bold uppercase tracking-tight">{it.title}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <Lightbox
        open={idx !== null}
        onClose={() => setIdx(null)}
        items={items}
        index={idx ?? 0}
        setIndex={(v) => setIdx(v)}
      />
    </div>
  );
};

// IMPORTANT: your App.tsx imports { Politique }
export const Politique = PolitiquePage;
export { PolitiquePage };
