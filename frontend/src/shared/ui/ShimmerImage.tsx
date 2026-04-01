"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/shared/lib";

/**
 * Next/Image с шиммер-плейсхолдером.
 * Пока изображение грузится — показывает серебристый shimmer,
 * после загрузки плавно проявляет картинку.
 *
 * Для fill-изображений шиммер рисуется абсолютно внутри родителя.
 * Для width/height — оборачивает в relative-контейнер.
 */
export function ShimmerImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const isFill = props.fill;

  const shimmer = !loaded && (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden rounded-[inherit] bg-border-light/40"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );

  const image = (
    <Image
      {...props}
      className={cn(
        "transition-opacity duration-500",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
      onLoad={(e) => {
        setLoaded(true);
        if (typeof onLoad === "function") {
          (onLoad as (e: React.SyntheticEvent<HTMLImageElement>) => void)(e);
        }
      }}
    />
  );

  if (isFill) {
    return (
      <>
        {shimmer}
        {image}
      </>
    );
  }

  return (
    <span className="relative inline-block">
      {shimmer}
      {image}
    </span>
  );
}
