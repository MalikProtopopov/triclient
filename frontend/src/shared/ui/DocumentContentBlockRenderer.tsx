"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, ExternalLink, Maximize2 } from "lucide-react";

import { cn } from "@/shared/lib";
import type { ContentBlockPublicNested } from "@/shared/types";
import { GalleryLightbox, type LightboxPhoto } from "./GalleryLightbox";

function useDeviceType(): "desktop" | "mobile" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  const vkMatch = url.match(/vk\.com\/video(-?\d+)_(\d+)/);
  if (vkMatch) return `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}`;
  if (url.includes("vk.com/video_ext.php")) return url;

  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (rutubeMatch) return `https://rutube.ru/play/embed/${rutubeMatch[1]}`;

  return null;
}

function TextBlock({ block }: { block: ContentBlockPublicNested }) {
  if (!block.content) return null;
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}

function ImageBlock({ block }: { block: ContentBlockPublicNested }) {
  const src = block.media_url;
  if (!src) return null;
  return (
    <figure>
      <div className="relative overflow-hidden rounded-xl aspect-video">
        <Image
          src={src}
          alt={block.title ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {block.title && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
}

function VideoBlock({ block }: { block: ContentBlockPublicNested }) {
  const mediaUrl = block.media_url;
  if (!mediaUrl) return null;

  const embedUrl = getEmbedUrl(mediaUrl);
  if (embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={block.title ?? "Video"}
        />
      </div>
    );
  }

  const posterUrl = block.thumbnail_url;
  return (
    <div className="overflow-hidden rounded-xl">
      <video
        src={mediaUrl}
        controls
        poster={posterUrl ?? undefined}
        className="w-full"
        preload="metadata"
      />
    </div>
  );
}

function FileBlock({ block }: { block: ContentBlockPublicNested }) {
  const href = block.media_url;
  if (!href) return null;
  const label = block.link_label || block.title || "Скачать файл";
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:bg-bg"
    >
      <Download className="h-4 w-4" />
      {label}
    </a>
  );
}

function LinkBlock({ block }: { block: ContentBlockPublicNested }) {
  if (!block.link_url) return null;
  return (
    <a
      href={block.link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:bg-bg"
    >
      {block.link_label || block.link_url}
      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

/** Парсинг `block_metadata.images`: объекты `{ url, alt }` или legacy-массив URL-строк */
function parseGalleryImages(block: ContentBlockPublicNested): { url: string; alt: string }[] {
  const raw = block.block_metadata?.images as unknown;
  if (!Array.isArray(raw) || raw.length === 0) return [];
  const out: { url: string; alt: string }[] = [];
  for (const item of raw) {
    if (typeof item === "string") {
      const u = item.trim();
      if (u) out.push({ url: u, alt: "" });
      continue;
    }
    if (item && typeof item === "object" && "url" in item) {
      const u = (item as { url: unknown }).url;
      if (typeof u !== "string" || !u.trim()) continue;
      const altRaw = (item as { alt?: unknown }).alt;
      const alt = typeof altRaw === "string" ? altRaw : "";
      out.push({ url: u.trim(), alt });
    }
  }
  return out;
}

const SWIPE_THRESHOLD = 50;

function GallerySlider({ items }: { items: { url: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = items.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);
  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null || total <= 1) return;
    const end = e.changedTouches[0]?.clientX ?? start;
    const dx = end - start;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  const lightboxPhotos: LightboxPhoto[] = items.map((item, i) => ({
    id: `${item.url}-${i}`,
    file_url: item.url,
    caption: item.alt.trim() || null,
  }));

  const current = items[index];
  const currentAlt = current.alt.trim() || `Фото ${index + 1}`;

  return (
    <figure>
      <div className="relative">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Открыть фото в полном размере"
          className="group relative flex h-[60vw] max-h-[640px] min-h-[260px] w-full items-center justify-center overflow-hidden rounded-xl bg-bg-secondary"
        >
          <Image
            key={current.url}
            src={current.url}
            alt={currentAlt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
            priority={index === 0}
          />
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/55 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/90 p-2 text-text-primary shadow-md ring-1 ring-border transition-colors hover:bg-bg sm:left-3"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/90 p-2 text-text-primary shadow-md ring-1 ring-border transition-colors hover:bg-bg sm:right-3"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-text-muted">
            {index + 1} / {total}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Перейти к фото ${i + 1}`}
                className={cn(
                  "h-1.5 w-6 rounded-full transition-colors",
                  i === index ? "bg-accent" : "bg-border hover:bg-border/70",
                )}
              />
            ))}
          </div>
        </div>
      )}

      {currentAlt && currentAlt !== `Фото ${index + 1}` && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">
          {currentAlt}
        </figcaption>
      )}

      <GalleryLightbox
        isOpen={lightboxOpen}
        photos={lightboxPhotos}
        startIndex={index}
        onClose={() => setLightboxOpen(false)}
      />
    </figure>
  );
}

function GalleryBlock({ block }: { block: ContentBlockPublicNested }) {
  const items = parseGalleryImages(block);
  if (items.length > 0) {
    return <GallerySlider items={items} />;
  }

  const mediaUrl = block.media_url;
  const thumbUrl = block.thumbnail_url;
  const src = thumbUrl || mediaUrl;
  if (!src) return null;
  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-bg-secondary">
        <Image
          src={src}
          alt={block.title ?? ""}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {block.title && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">
          {block.title}
        </figcaption>
      )}
    </figure>
  );
}

function BannerBlock({ block }: { block: ContentBlockPublicNested }) {
  const mediaSrc = block.media_url;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary">
      {mediaSrc && (
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={mediaSrc}
            alt={block.title ?? ""}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
      {block.content && (
        <div
          className="prose prose-sm max-w-none p-6 prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      )}
      {block.link_url && (
        <div className="px-6 pb-6">
          <a
            href={block.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            {block.link_label || "Подробнее"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}

const BLOCK_COMPONENTS: Record<
  ContentBlockPublicNested["block_type"],
  React.FC<{ block: ContentBlockPublicNested }>
> = {
  text: TextBlock,
  image: ImageBlock,
  video: VideoBlock,
  file: FileBlock,
  link: LinkBlock,
  gallery: GalleryBlock,
  banner: BannerBlock,
};

interface DocumentContentBlockRendererProps {
  blocks: ContentBlockPublicNested[];
  className?: string;
}

export function DocumentContentBlockRenderer({
  blocks,
  className,
}: DocumentContentBlockRendererProps) {
  const deviceType = useDeviceType();

  if (!blocks || blocks.length === 0) return null;

  const visible = blocks
    .filter(
      (b) =>
        b.device_type === "all" ||
        b.device_type === "both" ||
        b.device_type === deviceType,
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  if (visible.length === 0) return null;

  return (
    <div className={className ?? "space-y-6"}>
      {visible.map((block) => {
        const Component = BLOCK_COMPONENTS[block.block_type];
        if (!Component) return null;
        return <Component key={block.id} block={block} />;
      })}
    </div>
  );
}
