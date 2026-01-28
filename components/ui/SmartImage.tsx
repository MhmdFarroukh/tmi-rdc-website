import React, { useMemo } from "react";

export type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: "high" | "low" | "auto";
};

/**
 * Convert image path to WebP format (or use original if WebP doesn't exist)
 * Automatically handles .webp conversion for optimized loading
 */
function getWebPPath(src: string | undefined): string | undefined {
  if (!src) return src;
  
  // If it's already webp, return as-is
  if (src.toLowerCase().endsWith('.webp')) return src;
  
  // If it's a standard image format, replace extension with .webp
  const ext = /\.(jpg|jpeg|png|gif)$/i;
  if (ext.test(src)) {
    return src.replace(ext, '.webp');
  }
  
  return src;
}

/**
 * Get fallback JPEG path for browsers that don't support WebP
 */
function getFallbackPath(src: string | undefined): string | undefined {
  if (!src) return src;
  
  // If it's already .jpg, return as-is
  if (src.toLowerCase().endsWith('.jpg')) return src;
  
  // If it's .webp, replace with .jpg
  if (src.toLowerCase().endsWith('.webp')) {
    return src.replace(/\.webp$/i, '.jpg');
  }
  
  // If it's .jpeg, .png, or .gif, replace with .jpg
  const ext = /\.(jpeg|png|gif)$/i;
  if (ext.test(src)) {
    return src.replace(ext, '.jpg');
  }
  
  return src;
}

export function SmartImage({
  loading = "lazy",
  decoding = "async",
  fetchpriority,
  src,
  ...rest
}: SmartImageProps) {
  // Memoize to prevent unnecessary recalculations
  const webpSrc = useMemo(() => getWebPPath(src), [src]);
  const fallbackSrc = useMemo(() => getFallbackPath(src), [src]);

  return (
    <picture>
      {/* WebP format (primary, smaller) */}
      {webpSrc && webpSrc !== src && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      {/* Fallback JPEG format */}
      {fallbackSrc && fallbackSrc !== webpSrc && (
        <source srcSet={fallbackSrc} type="image/jpeg" />
      )}
      {/* Standard img tag with fallback */}
      <img
        loading={loading}
        decoding={decoding}
        src={fallbackSrc || src}
        {...(fetchpriority ? ({ fetchpriority } as any) : {})}
        {...rest}
      />
    </picture>
  );
}

export default SmartImage;
