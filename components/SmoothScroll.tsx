import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const { pathname } = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 2,
      prevent: (node) => node.classList.contains("no-lenis"),
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenis.destroy();
    };
  }, []);

  // Handle page transitions properly
  useEffect(() => {
    setIsTransitioning(true);
    const lenis = lenisRef.current;
    if (!lenis) return;

    // Immediately reset scroll
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      lenis.scrollTo(0, { immediate: true });
      setIsTransitioning(false);
    }, 0);
  }, [pathname]);

  return (
    <div className={`w-full ${isTransitioning ? "opacity-100" : "opacity-100"} transition-opacity`}>
      {children}
    </div>
  );
};
