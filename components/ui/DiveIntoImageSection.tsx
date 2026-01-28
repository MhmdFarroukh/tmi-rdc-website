import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const DiveImmersion = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  const IMAGES = useMemo(
    () => [
      "/images_optimized/immersion/img1.480.webp",
      "/images_optimized/immersion/img2.480.webp",
      "/images_optimized/immersion/img3.480.webp",
    ],
    []
  );

  // preload (and logs errors)
  useEffect(() => {
    let done = 0;
    IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        done += 1;
        if (done === IMAGES.length) setReady(true);
      };
      img.onerror = () => {
        done += 1;
        if (done === IMAGES.length) setReady(true);
        console.error("[DiveImmersion] failed to load:", src);
      };
      img.src = src;
    });
  }, [IMAGES]);

  // ✅ IMPORTANT: correct offset for sticky “long scroll” sections
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
const p = useSpring(scrollYProgress, {
  stiffness: 70,  // ⬇️ slower
  damping: 28,    // ⬆️ smooth
  mass: 1.9,      // ⬆️ heavier = slower
});


  // ✅ slower crossfades (more overlap, less snappy)
const o1 = useTransform(p, [0.00, 0.45, 0.65], [1, 1, 0]);
const o2 = useTransform(p, [0.25, 0.60, 0.85], [0, 1, 0]);
const o3 = useTransform(p, [0.55, 0.78, 1.00], [0, 1, 1]); // holds longer





  // motion
const scale = useTransform(p, [0, 1], [1.03, 1.12]); // was bigger
const y = useTransform(p, [0, 1], [0, -70]);         // was -120



  return (
    <section
      ref={ref}
      className="relative w-full bg-white"
      style={{ height: "300vh" }}
    >
      {/* sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* ✅ Overscan so transforms never show edges */}
        <motion.div
          className="absolute inset-[-12%]"
          style={{
            scale,
            y,
            filter: "grayscale(1) contrast(1.15) brightness(0.9)",
            backgroundImage: `url(${IMAGES[0]})`, // ✅ fallback (prevents black flash)
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <motion.img
            src={IMAGES[0]}
            alt="TMI immersion 1"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: o1 }}
            draggable={false}
          />
          <motion.img
            src={IMAGES[1]}
            alt="TMI immersion 2"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: o2 }}
            draggable={false}
          />
          <motion.img
            src={IMAGES[2]}
            alt="TMI immersion 3"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: o3 }}
            draggable={false}
          />
        </motion.div>

        {/* cinematic overlays */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(70%_55%_at_50%_45%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_55%,rgba(0,0,0,0.95)_100%)]" />

        {/* ✅ fade to white at bottom (so next section blends perfectly) */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 z-30 bg-gradient-to-b from-black/0 via-white/25 to-white" />

        {!ready && (
          <div className="absolute bottom-6 left-6 z-40 text-white/70 text-xs font-mono">
            Loading immersion images…
          </div>
        )}

        {/* text */}
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex items-center gap-3 text-white/80 font-mono text-xs uppercase tracking-[0.35em]">
              <span className="inline-block w-2 h-2 rounded-full bg-white/80" />
              <span>( EXPLORER )</span>
            </div>

            <h2 className="mt-6 text-[12vw] md:text-6xl font-display font-bold uppercase leading-[0.9] tracking-tighter text-white">
              IMMERSION
              <br />
              CHANTIER
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiveImmersion;
