import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CurtainRevealProps {
  children: React.ReactNode;
  className?: string;
  curtainColor?: string;
}

export const CurtainReveal: React.FC<CurtainRevealProps> = ({ 
  children, 
  className = "",
  curtainColor = "bg-white" // Default curtain color
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        initial={{ height: "100%" }}
        animate={isInView ? { height: "0%" } : { height: "100%" }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className={`absolute inset-0 z-10 w-full ${curtainColor}`}
      />
    </div>
  );
};

export const TextReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-5%" });

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <motion.div
                initial={{ y: "100%" }}
                animate={isInView ? { y: "0%" } : { y: "100%" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay }}
            >
                {children}
            </motion.div>
        </div>
    )
}