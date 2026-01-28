import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  /** Hotspot position in % (0..100) where the sparks are */
  hotspotX?: number; // default 70
  hotspotY?: number; // default 55
  className?: string;
  /** Optional: only enable the effect once the element is in view */
  activateOnView?: boolean; // default true
};

export const HotspotColorReveal: React.FC<Props> = ({
  src,
  alt = "",
  hotspotX = 70,
  hotspotY = 55,
  className = "",
  activateOnView = true,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(!activateOnView);

  useEffect(() => {
    if (!activateOnView) return;

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [activateOnView]);

  const vars = useMemo(
    () =>
      ({
        // CSS vars used by the mask
        ["--hx" as any]: `${hotspotX}%`,
        ["--hy" as any]: `${hotspotY}%`,
      }) as React.CSSProperties,
    [hotspotX, hotspotY]
  );

  return (
    <div
      ref={ref}
      style={vars}
      className={[
        "hotspot-wrap group relative overflow-hidden",
        inView ? "is-active" : "not-active",
        className,
      ].join(" ")}
    >
      {/* Base (grayscale) */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover grayscale contrast-125 opacity-90 transition-transform duration-700 group-hover:scale-[1.02]"
        draggable={false}
      />

      {/* Colored layer (revealed only near hotspot) */}
      <img
        src={src}
        alt=""
        className="hotspot-color absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        draggable={false}
      />

      {/* Sparks tint + glow (no need to edit image) */}
      <div className="hotspot-glow absolute inset-0" />

      {/* Your existing overlay content should sit above */}
      <div className="relative z-10 h-full w-full">{/* children slot if needed */}</div>
    </div>
  );
};
