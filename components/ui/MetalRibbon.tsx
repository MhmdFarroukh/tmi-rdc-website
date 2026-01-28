import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const MetalRibbon: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-8 bottom-0 w-[2px] z-0 hidden lg:block pointer-events-none"
    >
      {/* Track */}
      <div className="absolute top-0 left-0 w-full h-full bg-forge-border/30" />
      
      {/* Animated Metal Weld */}
      <motion.div 
        style={{ height }}
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-safety-orange via-orange-400 to-transparent shadow-[0_0_10px_rgba(249,115,22,0.5)]"
      />
      
      {/* Nodes at specific percentages (simulated) */}
      {[0.1, 0.3, 0.5, 0.7, 0.9].map((pos, i) => (
        <div key={i} className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-forge-border border border-slate-600 rotate-45" style={{ top: `${pos * 100}%` }} />
      ))}
    </div>
  );
};

export const SectionConnector: React.FC<{ reversed?: boolean }> = ({ reversed }) => {
  return (
    <div className={`w-full h-px bg-forge-border relative overflow-hidden my-12 ${reversed ? 'origin-right' : 'origin-left'}`}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-50" />
    </div>
  );
};