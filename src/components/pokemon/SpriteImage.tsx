"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

interface SpriteImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
  initial?: string;
}

/**
 * Site sprite <img> with a consistent fallback: when the sprite proxy
 * fails (dev timeouts, missing artwork), render the branded dashed-circle
 * placeholder instead of the browser's broken-image glyph.
 */
export function SpriteImage({ src, alt, className, width, height, loading, initial }: SpriteImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={className ? `sprite-fallback ${className}` : "sprite-fallback"}
        style={width ? { width, height } : undefined}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
      >
        {initial ?? "?"}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}
