import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LightboxPortal } from "../components/ui/LightboxPortal";
import { SmartImage } from "../components/ui/SmartImage";

const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = p.startsWith("/") ? p.slice(1) : p;
  return `${cleanBase}${cleanPath}`;
};

const fileKeyFromSrc = (src: string) => {
  try {
    const clean = src.split("?")[0];
    const last = clean.split("/").pop() ?? src;
    return decodeURIComponent(last);
  } catch {
    return src;
  }
};

type Tag = "construction" | "remorques" | "maintenance" | "atelier";

type MediaItem = {
  src: string;
  alt?: string;
  tags: Tag[];
  mask?: string; // white reveals, black hides
  strength?: number; // 0.3 subtle -> 1 strong
};

const FILTERS: { id: "all" | Tag; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "construction", label: "Construction" },
  { id: "remorques", label: "Remorques" },
  { id: "maintenance", label: "Maintenance & Soudure" },
  { id: "atelier", label: "Atelier" },
];

export const RealisationsPage: React.FC = () => {
  const heroVideo = withBase("images/immersion/WhatsApp Video 2026-01-23 at 1.00.59 PM.mp4");

  const flameMask1 = withBase("images/immersion/flame.png");
  const flameMask2 = withBase("images/immersion/flame2.png");

  const ALL: MediaItem[] = useMemo(
    () => [
      { src: withBase("images/immersion/charpente.png"), tags: ["construction"] },
      { src: withBase("images/immersion/construction.png"), tags: ["construction"] },
      { src: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.21 PM.jpeg"), tags: ["construction"] },
      { src: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.43 PM.jpeg"), tags: ["construction"] },

      { src: withBase("images/immersion/remorque.png"), tags: ["remorques"] },
      { src: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.33 PM.jpeg"), tags: ["remorques"] },

      {
        src: withBase("images/immersion/qualite.png"),
        alt: "Qualité, Satisfaction & Fidélisation",
        tags: ["maintenance"],
        mask: flameMask2,
        strength: 0.85,
      },
      {
        src: withBase("images/immersion/img2.png"),
        alt: "Maintenance",
        tags: ["maintenance"],
        mask: flameMask1,
        strength: 1,
      },
      { src: withBase("images/immersion/img3.png"), tags: ["maintenance"] },

      { src: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.12 PM.jpeg"), tags: ["atelier"] },
      { src: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.01.20 PM.jpeg"), tags: ["atelier"] },
      { src: withBase("images/immersion/WhatsApp Image 2026-01-23 at 1.02.00 PM.jpeg"), tags: ["atelier"] },
    ],
    [flameMask1, flameMask2]
  );

  const [filter, setFilter] = useState<"all" | Tag>("all");
  const filtered = useMemo(() => {
    if (filter === "all") return ALL;
    return ALL.filter((m) => m.tags.includes(filter));
  }, [ALL, filter]);

  const [index, setIndex] = useState<number | null>(null);
  const openSrc = index !== null ? filtered[index]?.src : null;
  const isOpen = index !== null && !!openSrc;

  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % filtered.length));

  return (
    <div className="pt-28 min-h-screen bg-forge-dark">
      <style>{`
        .sparks-reveal .glow-layer, .sparks-reveal .core-layer {
          opacity: 0;
          transition: opacity 240ms ease;
          pointer-events: none;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: cover;
          mask-size: cover;
          -webkit-mask-position: center;
          mask-position: center;
        }
        .sparks-reveal .glow-layer {
          background: radial-gradient(circle at 50% 55%,
            rgba(255,140,0,0.95),
            rgba(255,200,0,0.35) 35%,
            rgba(0,0,0,0) 72%);
          mix-blend-mode: screen;
          filter: blur(0.7px);
        }
        .sparks-reveal .core-layer {
          background: radial-gradient(circle at 50% 55%,
            rgba(255,255,255,0.95),
            rgba(255,210,120,0.25) 26%,
            rgba(0,0,0,0) 56%);
          mix-blend-mode: screen;
          filter: blur(0.25px);
        }
        .group:hover .sparks-reveal .glow-layer {
          opacity: var(--reveal,0.65);
          animation: sparksFlicker 680ms infinite;
        }
        .group:hover .sparks-reveal .core-layer {
          opacity: calc(var(--reveal,0.65)*0.95);
          animation: sparksFlicker 520ms infinite;
        }
        @keyframes sparksFlicker {
          0%{opacity:calc(var(--reveal,0.65)*0.55);transform:translate(0,0) scale(1)}
          20%{opacity:var(--reveal,0.65);transform:translate(1px,-1px) scale(1.02)}
          50%{opacity:calc(var(--reveal,0.65)*0.7);transform:translate(-1px,1px) scale(0.99)}
          80%{opacity:calc(var(--reveal,0.65)*0.95);transform:translate(1px,0) scale(1.03)}
          100%{opacity:calc(var(--reveal,0.65)*0.75);transform:translate(0,0) scale(1)}
        }
        .masonry { column-count: 1; column-gap: 16px; }
        @media (min-width: 640px) { .masonry { column-count: 2; } }
        @media (min-width: 1280px) { .masonry { column-count: 3; } }
        .masonry-item { break-inside: avoid; margin: 0 0 16px; }
      `}</style>

      {/* HERO VIDEO */}
      <section className="relative h-[68vh] md:h-[78vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="relative z-10 container mx-auto px-6 h-full flex items-end pb-14">
          <div className="max-w-3xl">
            <div className="w-12 h-1 bg-safety-orange mb-6" />
            <h1 className="text-white font-display font-bold uppercase tracking-tighter leading-[0.95] text-[11vw] md:text-[5vw]">
              Réalisations
            </h1>
            <p className="mt-5 text-white/70 text-lg md:text-xl leading-relaxed">
              Construction métallique, remorques, maintenance & soudure. Galerie photo par catégories.
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS + GRID */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-wrap gap-3 mb-10">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={[
                  "px-5 py-2 rounded-full text-xs uppercase tracking-widest font-mono transition-colors",
                  active ? "bg-safety-orange text-black" : "bg-white/10 text-white hover:bg-white/20",
                ].join(" ")}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="masonry">
          {filtered.map((it, i) => (
            <div className="masonry-item" key={`${it.src}-${i}`}>
              <GalleryCard item={it} onClick={() => setIndex(i)} />
            </div>
          ))}
        </div>
      </section>

      <LightboxPortal
        open={isOpen}
        src={openSrc}
        onClose={() => setIndex(null)}
        onPrev={filtered.length > 1 ? prev : undefined}
        onNext={filtered.length > 1 ? next : undefined}
      />
    </div>
  );
};

const GalleryCard: React.FC<{ item: MediaItem; onClick: () => void }> = ({ item, onClick }) => {
  const hasMask = !!item.mask;

  const maskStyle = useMemo(() => {
    if (!hasMask) return undefined;
    return {
      WebkitMaskImage: `url(${item.mask})`,
      maskImage: `url(${item.mask})`,
    } as React.CSSProperties;
  }, [item.mask, hasMask]);

  const vars = useMemo(() => {
    const s = item.strength ?? 0.65;
    return { ["--reveal" as any]: String(s) } as React.CSSProperties;
  }, [item.strength]);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={vars}
      whileHover={{ y: -6 }}
      className="group relative w-full overflow-hidden bg-black border border-white/10"
    >
      <SmartImage
        src={item.src}
        alt={item.alt ?? "Image"}
        className="w-full h-auto object-cover grayscale opacity-85 transition-transform duration-700 group-hover:scale-105"
      />

      {hasMask && (
        <div className="sparks-reveal absolute inset-0">
          <div className="glow-layer absolute inset-0" style={maskStyle} />
          <div className="core-layer absolute inset-0" style={maskStyle} />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
    </motion.button>
  );
};

export default RealisationsPage;