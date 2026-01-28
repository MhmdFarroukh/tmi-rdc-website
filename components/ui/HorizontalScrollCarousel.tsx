import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SmartImage } from "./SmartImage";

const withBase = (p: string) => {
  const base = import.meta.env.BASE_URL ?? "/";
  const cleanBase = base.endsWith("/") ? base : `${base}/`;
  const cleanPath = p.startsWith("/") ? p.slice(1) : p;
  return `${cleanBase}${cleanPath}`;
};

type CardItem = {
  url: string;
  title: string;
  id: number;
  desc: string;
  revealMaskUrl?: string;
};

const cards: CardItem[] = [
  {
    // ✅ MUST be in: public/images/immersion/charpente.webp
    url: withBase("images/immersion/charpente.webp"),
    title: "Charpente Métallique",
    id: 1,
    desc: "Structures Grande Portée",
  },
  {
    // ✅ MUST be in: public/images/immersion/construction.webp
    url: withBase("images/immersion/construction.webp"),
    title: "TECHNO METAL INDUSTRIE",
    id: 2,
    desc: "Cuves & Réservoirs",
  },
  {
    url: withBase("images/immersion/remorque.webp"),
    title: "Construction remorque",
    id: 3,
    desc: "Réseaux Industriels",
  },
  {
    url: withBase("images/immersion/qualite.webp"),
    title: "QUALITÉ, SATISFACTION & FIDÉLISATION",
    id: 4,
    desc: "Infrastructures Minières",
    revealMaskUrl: withBase("images/immersion/flame2.webp"),
  },
  {
    url: withBase("images/immersion/img2.webp"),
    title: "Maintenance",
    id: 5,
    desc: "Service Sur Site",
    revealMaskUrl: withBase("images/immersion/flame.webp"),
  },
  {
    url: withBase("images/immersion/img3.webp"),
    title: "Atelier",
    id: 6,
    desc: "Fabrication & Assemblage",
  },
];

export const HorizontalScrollCarousel: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [scrollLen, setScrollLen] = useState(0);
  const [sectionHeight, setSectionHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const calc = () => {
      // track.scrollWidth includes all cards width (after images/fonts/layout)
      const totalW = track.scrollWidth;
      const viewportW = section.clientWidth;

      const travel = Math.max(0, totalW - viewportW);
      setScrollLen(travel);

      // Give enough vertical space to finish horizontal travel
      // + a small buffer so last card can be fully interacted with
      const buffer = 120; // px
      const h = Math.max(window.innerHeight, travel + window.innerHeight + buffer);
      setSectionHeight(h);
    };

    // First calc
    calc();

    // Recalc on resize
    window.addEventListener("resize", calc);

    // Recalc when layout changes (images load, fonts, etc.)
    const ro = new ResizeObserver(() => calc());
    ro.observe(track);
    ro.observe(section);

    // Also recalc once when page fully loads
    window.addEventListener("load", calc);

    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("load", calc);
      ro.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollLen]);

  return (
    <>
      {/* ✅ Flame reveal CSS */}
      <style>{`
        .sparks-reveal .glow-layer,
        .sparks-reveal .core-layer {
          opacity: 0;
          transition: opacity 220ms ease;
          pointer-events: none;

          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          -webkit-mask-size: cover;
          mask-size: cover;
          -webkit-mask-position: center;
          mask-position: center;
        }

        .sparks-reveal .glow-layer {
          background:
            radial-gradient(circle at 50% 55%,
              rgba(255,140,0,0.95),
              rgba(255,200,0,0.35) 35%,
              rgba(0,0,0,0) 70%);
          mix-blend-mode: screen;
          filter: blur(0.6px);
        }

        .sparks-reveal .core-layer {
          background:
            radial-gradient(circle at 50% 55%,
              rgba(255,255,255,0.95),
              rgba(255,210,120,0.25) 28%,
              rgba(0,0,0,0) 55%);
          mix-blend-mode: screen;
          filter: blur(0.2px);
        }

        .group:hover .sparks-reveal .glow-layer {
          opacity: 1;
          animation: sparksFlicker 700ms infinite;
        }
        .group:hover .sparks-reveal .core-layer {
          opacity: 1;
          animation: sparksFlicker 520ms infinite;
        }

        @keyframes sparksFlicker {
          0%   { opacity: 0.55; transform: translate(0,0) scale(1); }
          20%  { opacity: 1;    transform: translate(1px,-1px) scale(1.02); }
          50%  { opacity: 0.7;  transform: translate(-1px,1px) scale(0.99); }
          80%  { opacity: 0.95; transform: translate(1px,0) scale(1.03); }
          100% { opacity: 0.75; transform: translate(0,0) scale(1); }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative bg-forge-dark"
        style={{ height: sectionHeight || undefined }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center">
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-8 px-12 md:px-24 w-max will-change-transform"
          >
            {/* Intro Block */}
            <div className="flex flex-col justify-center min-w-[80vw] md:min-w-[40vw] text-white pr-24">
              <div className="w-12 h-1 bg-safety-orange mb-8" />
              <h2 className="text-[12vw] md:text-[7vw] font-display font-bold uppercase leading-none tracking-tighter">
                Réalisations
              </h2>
              <p className="mt-8 text-gray-400 max-w-md text-lg md:text-xl font-light leading-relaxed">
                Une expertise forgée sur les plus grands chantiers de la RDC.
                Découvrez nos projets majeurs.
              </p>
              <div className="mt-12 flex items-center gap-4 text-sm font-mono uppercase tracking-widest text-safety-orange">
                <span>Scroll to explore</span>
                <div className="w-12 h-px bg-safety-orange" />
              </div>
            </div>

            {/* Cards */}
            {cards.map((card) => (
              <Card key={card.id} card={card} />
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

const Card: React.FC<{ card: CardItem }> = ({ card }) => {
  const hasMask = !!card.revealMaskUrl;

  const maskStyle = useMemo(() => {
    if (!hasMask) return {};
    return {
      WebkitMaskImage: `url(${card.revealMaskUrl})`,
      maskImage: `url(${card.revealMaskUrl})`,
    } as React.CSSProperties;
  }, [card.revealMaskUrl, hasMask]);

  return (
    <div className="group relative h-[60vh] w-[80vw] md:h-[70vh] md:w-[50vw] overflow-hidden bg-neutral-900 border border-white/5">
      <SmartImage
        src={card.url}
        alt={card.title}
        responsiveSizes={true}
        forGrid={true}
        className="absolute inset-0 h-full w-full object-cover grayscale opacity-70 transition-transform duration-1000 group-hover:scale-110"
        draggable={false}
        decoding="async"
        onError={() => console.error("[Carousel] failed to load:", card.url)}
      />

      {/* Flame reveal overlay (ONLY when mask exists) */}
      {hasMask && (
        <div className="sparks-reveal absolute inset-0 pointer-events-none">
          <div className="glow-layer absolute inset-0" style={maskStyle} />
          <div className="core-layer absolute inset-0" style={maskStyle} />
        </div>
      )}

      <span className="absolute top-4 left-6 text-[80px] md:text-[140px] font-display font-bold text-white/5 select-none z-10">
        {String(card.id).padStart(2, "0")}
      </span>

      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 bg-gradient-to-t from-black via-black/60 to-transparent">
        <h3 className="text-3xl md:text-5xl font-display font-bold text-white uppercase mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {card.title}
        </h3>

        <div className="flex justify-between items-end overflow-hidden mt-4">
          <p className="text-safety-orange font-mono text-xs md:text-sm uppercase tracking-widest translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-75">
            {card.desc}
          </p>

          <div className="w-12 h-12 rounded-full border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 delay-100">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
