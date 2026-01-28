// pages/Home.tsx (TMI) — fixed + local hero
import React, { useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { Play } from "lucide-react";

import { TextReveal } from "../components/ui/CurtainReveal";
import { HorizontalScrollCarousel } from "../components/ui/HorizontalScrollCarousel";
import { HoverImageLinks } from "../components/ui/HoverImageLinks";
import { ProductionStats } from "../components/ui/ProductionStats";
import { ExpertiseSection } from "../components/ui/ExpertiseSection";
import DiveImmersion from "../components/ui/DiveIntoImageSection";

// ✅ LOCAL HERO (public/images/immersion/hero.avif)
const HERO_SRC = "/images/immersion/hero.avif";

// --------------------
// VIDEO DATA
// --------------------
const VIDEO_NEWS = [
  {
    title:
      "PROJET DE CONSTRUCTION USINES & DEPOTS. Boulevard Lumumba (16ème rue - Limete), Kinshasa - RD CONGO",
    subtitle: "Boulevard Lumumba (16ème rue - Limete), Kinshasa - RD CONGO",
    video: "https://www.youtube.com/embed/E8lpVGR6k1M?wmode=opaque",
    img: "https://i.ytimg.com/vi/E8lpVGR6k1M/hqdefault.jpg",
  },
  {
    title: "AVANCEMENT PROJET CONSTRUCTION",
    subtitle: "USINES & DEPOTS - Suivi de chantier",
    video: "https://www.youtube.com/embed/4lO0RkZV2jk?wmode=opaque",
    img: "https://i.ytimg.com/vi/4lO0RkZV2jk/hqdefault.jpg",
  },
  {
    title: "TMI PROJET DE CONSTRUCTION USINES & DEPOTS",
    subtitle: "Boulevard Lumumba (16ème rue - Limete), Kinshasa - RD CONGO",
    video: "https://www.youtube.com/embed/eflUFbEJ7Tg?wmode=opaque",
    img: "https://i.ytimg.com/vi/eflUFbEJ7Tg/hqdefault.jpg",
  },
  {
    title: "AVANCEMENT PROJET CONSTRUCTION",
    subtitle: "USINES & DEPOTS - Suivi de chantier",
    video: "https://www.youtube.com/embed/QQYS9ExmK7o?wmode=opaque",
    img: "https://i.ytimg.com/vi/QQYS9ExmK7o/hqdefault.jpg",
  },
] as const;

type VideoNewsItem = (typeof VIDEO_NEWS)[number];

function VideoCard({
  item,
  onOpen,
}: {
  item: VideoNewsItem;
  onOpen: (url: string) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(item.video)}
      whileHover={{ y: -10 }}
      className="group relative cursor-pointer text-left"
    >
      <div className="relative aspect-video overflow-hidden bg-black mb-6 shadow-2xl w-full">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
          loading="lazy"
          decoding="async"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-safety-orange group-hover:border-safety-orange transition-all duration-300">
            <Play
              fill="currentColor"
              className="text-white ml-1 w-6 h-6 md:w-8 md:h-8"
            />
          </div>
        </div>

        <div className="absolute top-4 left-4">
          <div className="bg-white p-1 rounded-sm">
            <span className="text-[10px] font-bold text-black tracking-tighter">
              TMI-RDC
            </span>
          </div>
        </div>
      </div>

      <div className="border-l-2 border-black/15 pl-6 group-hover:border-safety-orange transition-colors duration-300">
        <h3 className="text-xl md:text-2xl font-display font-bold uppercase leading-tight mb-2 group-hover:text-safety-orange transition-colors text-black">
          {item.title}
        </h3>
        <p className="text-black/60 text-sm font-mono uppercase tracking-wide">
          {item.subtitle}
        </p>
      </div>
    </motion.button>
  );
}

export const Home: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.5],
    reduce ? [1, 1] : [1, 1.12]
  );

  const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    setHoverSide(clientX < left + width / 2 ? "left" : "right");
  };

  return (
    <div className="w-full bg-forge-dark">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-forge-dark">
        <motion.div
          style={{ scale: heroScale }}
          className="absolute inset-0 opacity-50"
        >
          {/* ✅ LOCAL HERO */}
          <img
            src={HERO_SRC}
            alt="TMI Hero"
            className="w-full h-full object-cover grayscale"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/55" />

        <div className="container mx-auto px-4 z-10 flex flex-col justify-between h-full py-12 md:py-24">
          <div className="flex justify-between items-start text-white/60 font-mono text-xs uppercase tracking-widest">
            <span>Est. 2005</span>
            <span>Lubumbashi, RDC</span>
          </div>

          <div className="text-center text-white mix-blend-difference">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                className="text-[18vw] font-display font-bold uppercase leading-[0.8] tracking-tighter"
              >
                TMI-RDC
              </motion.h1>
            </div>

            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.2,
                  ease: [0.76, 0, 0.24, 1],
                  delay: 0.1,
                }}
                className="text-xl md:text-3xl font-light uppercase tracking-widest mt-4 md:mt-8 opacity-80"
              >
                Techno Métal Industrie
              </motion.p>
            </div>
          </div>

          <div className="flex justify-center text-white">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="w-[1px] h-24 bg-white/50 origin-top"
            />
          </div>
        </div>
      </section>

      <HorizontalScrollCarousel />
      <ExpertiseSection />

      <div className="bg-forge-dark">
        <HoverImageLinks />
      </div>

      <ProductionStats />

      {/* 6. IMMERSIVE TEXTURE BREAK */}
      <section
        className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-[#e0e0e0] cursor-none hidden md:block"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverSide(null)}
      >
        <div
          className="absolute inset-0 z-0 bg-cover bg-center grayscale contrast-125"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20 z-10" />

        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className={`fixed top-0 left-0 pointer-events-none z-50 flex items-center gap-2 mix-blend-difference ${
            hoverSide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full" />
          <span className="text-white font-bold text-xs uppercase tracking-widest whitespace-nowrap">
            ( Explorer )
          </span>
        </motion.div>

        <div className="relative z-20 w-full h-full flex">
          <div className="w-1/2 h-full flex items-center justify-center group">
            <h2
              className={[
                "text-8xl font-display font-bold uppercase transition-all duration-500 select-none",
                "text-transparent [-webkit-text-stroke:2.5px_rgba(0,0,0,0.95)] [-webkit-text-fill-color:rgba(0,0,0,0)]",
                hoverSide === "left"
                  ? "opacity-100 scale-110 [-webkit-text-fill-color:rgba(0,0,0,1)] [-webkit-text-stroke:0px_rgba(0,0,0,0)]"
                  : "opacity-60",
              ].join(" ")}
            >
              Projets
            </h2>
          </div>

          <div className="w-1/2 h-full flex items-center justify-center group">
            <h2
              className={[
                "text-8xl font-display font-bold uppercase transition-all duration-500 select-none",
                "text-transparent [-webkit-text-stroke:2.5px_rgba(0,0,0,0.95)] [-webkit-text-fill-color:rgba(0,0,0,0)]",
                hoverSide === "right"
                  ? "opacity-100 scale-110 [-webkit-text-fill-color:rgba(0,0,0,1)] [-webkit-text-stroke:0px_rgba(0,0,0,0)]"
                  : "opacity-60",
              ].join(" ")}
            >
              Solutions
            </h2>
          </div>
        </div>
      </section>

      <DiveImmersion />

      {/* 7. ACTUALITÉS */}
      <section className="py-32 md:py-48 bg-white text-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24">
            <TextReveal>
              <h2 className="text-[10vw] leading-[0.9] font-display font-bold uppercase tracking-tighter text-black pt-[0.06em]">
                Actualités
              </h2>
            </TextReveal>

            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/#/news"
              className="hidden md:inline-flex items-center justify-center px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-safety-orange transition-colors"
            >
              Voir toutes les vidéos
            </motion.a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {VIDEO_NEWS.map((item) => (
              <VideoCard
                item={item}
                onOpen={setActiveVideo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-5xl aspect-video bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              className="w-full h-full"
              src={`${activeVideo}${activeVideo.includes("?") ? "&" : "?"}autoplay=1`}
              title="TMI video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};
