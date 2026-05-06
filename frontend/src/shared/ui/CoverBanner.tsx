"use client";

import { useState } from "react";
import { ShimmerImage } from "./ShimmerImage";
import { cn } from "@/shared/lib";

interface CoverBannerProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function CoverBanner({
  src,
  alt,
  className,
  sizes = "(max-width: 896px) 100vw, 896px",
  priority,
}: CoverBannerProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  if (!src) return null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-metal-light",
        className,
      )}
      style={{ aspectRatio: aspectRatio ?? 16 / 9 }}
    >
      <ShimmerImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
        onLoad={(e) => {
          const img = e.currentTarget as HTMLImageElement;
          if (img.naturalWidth && img.naturalHeight) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
    </div>
  );
}
