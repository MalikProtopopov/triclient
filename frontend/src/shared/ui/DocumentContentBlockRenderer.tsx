"use client";

import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";

import type { ContentBlockPublicNested } from "@/entities/document";

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
  if (!block.media_url) return null;
  return (
    <figure>
      <div className="relative overflow-hidden rounded-xl aspect-video">
        <Image
          src={block.media_url}
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
  if (!block.media_url) return null;

  const embedUrl = getEmbedUrl(block.media_url);
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

  return (
    <div className="overflow-hidden rounded-xl">
      <video
        src={block.media_url}
        controls
        poster={block.thumbnail_url ?? undefined}
        className="w-full"
        preload="metadata"
      />
    </div>
  );
}

function FileBlock({ block }: { block: ContentBlockPublicNested }) {
  if (!block.media_url) return null;
  const label = block.link_label || block.title || "Скачать файл";
  return (
    <a
      href={block.media_url}
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

function GalleryBlock({ block }: { block: ContentBlockPublicNested }) {
  if (!block.media_url) return null;
  return (
    <figure>
      <div className="relative overflow-hidden rounded-xl aspect-video">
        <Image
          src={block.thumbnail_url || block.media_url}
          alt={block.title ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
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
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-secondary">
      {block.media_url && (
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={block.media_url}
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
    .filter((b) => b.device_type === "all" || b.device_type === deviceType)
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
