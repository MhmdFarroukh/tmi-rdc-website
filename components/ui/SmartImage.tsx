import React, { useMemo, useState, useEffect } from "react";

export type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: "high" | "low" | "auto";
  responsiveSizes?: boolean; // Enable responsive srcset/sizes
  forGrid?: boolean; // Optimized for grid/card display (480px primary)
};

/**
 * Convert image path to WebP format with responsive breakpoints
 */
function getWebPPath(src: string | undefined, size: number | null = null): string | undefined {
  if (!src) return src;
  
  // If it's already webp, return as-is
  if (src.toLowerCase().endsWith('.webp')) {
    if (size) return src.replace(/\.webp$/i, `_${size}px.webp`);
    return src;
  }
  
  // If it's already jpeg/jpg, keep as is (don't convert to webp for existing jpegs)
  if (src.toLowerCase().endsWith('.jpg') || src.toLowerCase().endsWith('.jpeg')) {
    return src;
  }
  
  // If it's a standard image format, replace extension with .webp
  const ext = /\.(png|gif)$/i;
  if (ext.test(src)) {
    const base = src.replace(ext, '');
    if (size) return `${base}_${size}px.webp`;
    return `${base}.webp`;
  }
  
  return src;
}

/**
 * Get fallback JPEG path for browsers that don't support WebP
 */
function getFallbackPath(src: string | undefined, size: number | null = null): string | undefined {
  if (!src) return src;
  
  // Handle .webp specifically - convert to jpg
  if (src.toLowerCase().endsWith('.webp')) {
    const base = src.replace(/\.webp$/i, '');
    if (size) return `${base}_${size}px.jpg`;
    return `${base}.jpg`;
  }
  
  // If already JPEG, return as-is
  if (src.toLowerCase().endsWith('.jpg') || src.toLowerCase().endsWith('.jpeg')) {
    if (size) return src.replace(/\.(jpg|jpeg)$/i, `_${size}px.jpg`);
    return src;
  }
  
  // For other formats, convert to .jpg
  const ext = /\.(png|gif)$/i;
  if (ext.test(src)) {
    const base = src.replace(ext, '');
    if (size) return `${base}_${size}px.jpg`;
    return `${base}.jpg`;
  }
  
  return src;
}

/**
 * Generate srcset string for responsive images
 */
function generateSrcSet(src: string | undefined, forGrid: boolean = false): string {
  if (!src) return '';
  
  const breakpoints = forGrid 
    ? [480, 768, 1024] // For grids: mobile, tablet, desktop
    : [768, 1024, 1440]; // For full images: tablet, desktop, large
  
  const srcset = breakpoints
    .map(size => {
      const webpPath = getWebPPath(src, size);
      return `${webpPath} ${size}w`;
    })
    .join(', ');
  
  return srcset;
}

/**
 * Generate fallback srcset string for responsive JPEG images
 */
function generateFallbackSrcSet(src: string | undefined, forGrid: boolean = false): string {
  if (!src) return '';
  
  const breakpoints = forGrid 
    ? [480, 768, 1024] // For grids: mobile, tablet, desktop
    : [768, 1024, 1440]; // For full images: tablet, desktop, large
  
  // Generate srcset even if image is already JPEG
  const srcset = breakpoints
    .map(size => {
      const jpegPath = getFallbackPath(src, size);
      return `${jpegPath} ${size}w`;
    })
    .join(', ');
  
  return srcset;
}

/**
 * Check if image is WebP format
 */
function isWebP(src: string | undefined): boolean {
  if (!src) return false;
  return src.toLowerCase().endsWith('.webp');
}

/**
 * Check if image is JPEG format
 */
function isJPEG(src: string | undefined): boolean {
  if (!src) return false;
  const lower = src.toLowerCase();
  return lower.endsWith('.jpg') || lower.endsWith('.jpeg');
}

/**
 * Generate sizes attribute for responsive images
 */
function generateSizes(forGrid: boolean = false): string {
  if (forGrid) {
    // For grids: ~100% on mobile, 50% on tablet, 33% on desktop
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
  return '(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px';
}

export function SmartImage({
  loading = "lazy",
  decoding = "async",
  fetchpriority,
  src,
  responsiveSizes = false,
  forGrid = false,
  sizes: userSizes,
  ...rest
}: SmartImageProps) {
  // Use preloading with a skeleton to avoid broken-image icon and flashes.
  const fallbackSrc = useMemo(() => getFallbackPath(src), [src]);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setFailed(false);

    const imgSrc = fallbackSrc || src;
    if (!imgSrc) return;

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      if (!cancelled) setLoaded(true);
    };
    img.onerror = () => {
      if (!cancelled) setFailed(true);
    };

    return () => {
      cancelled = true;
    };
  }, [fallbackSrc, src]);

  // Accessibility: use role img on wrapper and provide aria-label from alt prop
  const ariaLabel = (rest && (rest as any).alt) || undefined;

  // Wrapper background style for the skeleton layer
  const bgStyle: React.CSSProperties = loaded && !failed ? {
    backgroundImage: `url('${fallbackSrc || src}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    opacity: 1,
  } : {
    backgroundColor: '#0b0b0b',
    opacity: 1,
  };

  // Provide a visible skeleton overlay while loading to prevent CLS
  return (
    <div
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      className={(rest && (rest as any).className) || undefined}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Skeleton / background overlay (absolute) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transition: 'opacity 300ms ease-in-out',
          opacity: loaded ? 0 : 1,
          zIndex: 0,
          ...bgStyle,
        }}
        data-loaded={loaded}
      />

      {/* The real image stays in normal flow so container retains height */}
      <img
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: (rest && (rest as any).style && (rest as any).style.objectFit) || 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease-in-out',
          position: 'relative',
          zIndex: 1,
        }}
        loading={loading}
        decoding={decoding}
        src={fallbackSrc || src}
        {...(fetchpriority ? ({ fetchpriority } as any) : {})}
        {...rest}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        alt={(rest && (rest as any).alt) || ''}
      />
    </div>
  );
}

export default SmartImage;
