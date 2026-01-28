import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  className?: string;
  effect?: "fade-up" | "mask" | "slide-in" | "text-reveal";
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  width = "fit-content", 
  delay = 0,
  className = "",
  effect = "fade-up"
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const variants: Record<string, { hidden: Variant; visible: Variant }> = {
    "fade-up": {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] } },
    },
    "mask": {
      hidden: { y: "100%" },
      visible: { y: "0%", transition: { duration: 0.9, delay, ease: [0.33, 1, 0.68, 1] } }
    },
    "slide-in": {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.8, delay, ease: "easeOut" } }
    },
    "text-reveal": {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: "easeOut" } }
    }
  };

  if (effect === 'mask') {
      return (
        <div ref={ref} className={`relative overflow-hidden ${width === "100%" ? "w-full" : ""} ${className}`}>
            <motion.div
                variants={variants[effect]}
                initial="hidden"
                animate={mainControls}
            >
                {children}
            </motion.div>
        </div>
      )
  }

  return (
    <div ref={ref} className={`relative ${width === "100%" ? "w-full" : ""} ${className}`}>
      <motion.div
        variants={variants[effect]}
        initial="hidden"
        animate={mainControls}
        className={width === "100%" ? "w-full" : ""}
      >
        {children}
      </motion.div>
    </div>
  );
};