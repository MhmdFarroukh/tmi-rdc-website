import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;

  /**
   * Normal mode uses an aspect ratio box (like your original).
   * Sticky-linger mode makes the image stick on screen longer (best for last image).
   */
  mode?: "normal" | "sticky-linger";

  /** Only used in normal mode */
  aspectRatio?: string; // e.g. "aspect-video"

  /**
   * Only used in sticky-linger mode:
   * Extra scroll distance while the image stays visible (e.g. "60vh", "100vh").
   */
  linger?: string;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = "",
  mode = "normal",
  aspectRatio = "aspect-video",
  linger = "80vh",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // IMPORTANT:
  // - In normal mode, target is the aspect-ratio container.
  // - In sticky-linger mode, target is a tall wrapper, so progress has real distance to map over.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset:
      mode === "sticky-linger"
        ? ["start start", "end end"]
        : ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  // ✅ BEST FIX for “last image scrolls too fast”:
  // Make the last image a sticky section with extra height, so it stays on screen longer.
  if (mode === "sticky-linger") {
    return (
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ height: `calc(100vh + ${linger})` }} // <- creates real scroll room
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            style={{ y, scale }}
            className="absolute inset-0 w-full h-[120%] -top-[10%]"
          >
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    );
  }

  // Original behavior (for all non-last images)
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatio} ${className}`}
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
};
