import React, { useMemo, useState, useEffect } from "react";

export type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: "high" | "low" | "auto";
  responsiveSizes?: boolean;
  forGrid?: boolean;
};

function getWebPPath(src: string | undefined, size: number | null = null): string | undefined {
  if (!src) return src;

  if (src.toLowerCase().endsWith(".webp")) {
    if (size) return src.replace(/\.webp$/i, `_${size}px.webp`);
    return src;
  }

  const ext = /\.(png|gif)$/i;
  if (ext.test(src)) {
    const base = src.replace(ext, "");
    if (size) return `${base}_${size}px.webp`;
    return `${base}.webp`;
  }

  return src;
}

function getFallbackPath(src: string | undefined, size: number | null = null): string | undefined {
  if (!src) return src;

  if (src.toLowerCase().endsWith(".webp")) {
    const base = src.replace(/\.webp$/i, "");
    if (size) return `${base}_${size}px.jpg`;
    return `${base}.jpg`;
  }

  if (src.toLowerCase().endsWith(".jpg") || src.toLowerCase().endsWith(".jpeg")) {
    if (size) return src.replace(/\.(jpg|jpeg)$/i, `_${size}px.jpg`);
    return src;
  }

  const ext = /\.(png|gif)$/i;
  if (ext.test(src)) {
    const base = src.replace(ext, "");
    if (size) return `${base}_${size}px.jpg`;
    return `${base}.jpg`;
  }

  return src;
}

function generateSrcSet(src: string | undefined, forGrid: boolean) {
  if (!src) return "";
  const breakpoints = forGrid ? [480, 768, 1024] : [768, 1024, 1440];
  return breakpoints.map((s) => `${getWebPPath(src, s)} ${s}w`).join(", ");
}

function generateFallbackSrcSet(src: string | undefined, forGrid: boolean) {
  if (!src) return "";
  const breakpoints = forGrid ? [480, 768, 1024] : [768, 1024, 1440];
  return breakpoints.map((s) => `${getFallbackPath(src, s)} ${s}w`).join(", ");
}

function generateSizes(forGrid: boolean) {
  return forGrid
    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    : "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px";
}

export function SmartImage({
  loading = "eager", // Load eagerly to hide loading delay
  decoding = "async",
  fetchpriority = "auto",
  src,
  responsiveSizes = false,
  forGrid = false,
  sizes: userSizes,
  className,
  style,
  ...rest
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    setLoaded(false);

    // Preload image to detect cached state immediately
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // Still unblur on error
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  const webpSrcSet = useMemo(() => (responsiveSizes ? generateSrcSet(src, forGrid) : ""), [src, responsiveSizes, forGrid]);
  const fallbackSrc = useMemo(() => getFallbackPath(src), [src]);
  const fallbackSrcSet = useMemo(
    () => (responsiveSizes ? generateFallbackSrcSet(src, forGrid) : ""),
    [src, responsiveSizes, forGrid]
  );

  const sizes = userSizes ?? (responsiveSizes ? generateSizes(forGrid) : undefined);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <picture>
        {src ? <source type="image/webp" srcSet={webpSrcSet || src} sizes={sizes} /> : null}

        <img
          {...rest}
          loading={loading}
          decoding={decoding}
          src={fallbackSrc || src}
          srcSet={fallbackSrcSet || undefined}
          sizes={sizes}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: (rest.style as any)?.objectFit || "cover",
            opacity: 1,
            filter: loaded ? "blur(0px)" : "blur(8px)",
            transition: "filter 300ms ease-out 100ms",
            ...(rest.style || {}),
          }}
          {...(fetchpriority ? ({ fetchpriority } as any) : {})}
          onLoad={(e) => {
            setLoaded(true);
            rest.onLoad?.(e);
          }}
          onError={(e) => {
            // Remove blur on error so image is at least visible
            setLoaded(true);
            rest.onError?.(e);
          }}
          alt={(rest as any).alt || ""}
        />
      </picture>
    </div>
  );
}

export default SmartImage;
