import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  /** Path relative to public root (e.g. "/images/immersion/hero.avif") */
  src: string;
  priority?: boolean; // hero / LCP
};

function withBase(path: string) {
  const base = (import.meta as any).env?.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // Encode spaces and special chars safely
  return encodeURI(`${cleanBase}${cleanPath}`) || cleanPath;
}

export default function FastImage({ src, alt = "", loading, decoding, priority, ...rest }: Props) {
  const finalSrc = withBase(src);

  return (
    <img
      src={finalSrc}
      alt={alt}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding={decoding ?? "async"}
      fetchPriority={priority ? "high" : (rest as any).fetchPriority}
      {...rest}
    />
  );
}
