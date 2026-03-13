"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

import type { ContentBlock } from "@/shared/types";

function useDeviceType(): "desktop" | "mobile" {
  if (typeof window === "undefined") return "desktop";
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function TextBlock({ block }: { block: ContentBlock }) {
  if (!block.content_text) return null;
  return (
    <div
      className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary"
      dangerouslySetInnerHTML={{ __html: block.content_text }}
    />
  );
}

function ImageBlock({ block }: { block: ContentBlock }) {
  if (!block.content_image_url) return null;
  return (
    <figure>
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={block.content_image_url}
          alt={block.content_image_alt ?? ""}
          width={800}
          height={450}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {block.content_image_alt && (
        <figcaption className="mt-2 text-center text-xs text-text-muted">
          {block.content_image_alt}
        </figcaption>
      )}
    </figure>
  );
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // VK Video — formats: vk.com/video-123_456 or vk.com/video_ext.php?oid=-123&id=456
  const vkMatch = url.match(/vk\.com\/video(-?\d+)_(\d+)/);
  if (vkMatch) return `https://vk.com/video_ext.php?oid=${vkMatch[1]}&id=${vkMatch[2]}`;
  if (url.includes("vk.com/video_ext.php")) return url;

  // Rutube
  const rutubeMatch = url.match(/rutube\.ru\/video\/([a-zA-Z0-9]+)/);
  if (rutubeMatch) return `https://rutube.ru/play/embed/${rutubeMatch[1]}`;

  return null;
}

function VideoBlock({ block }: { block: ContentBlock }) {
  if (!block.content_video_url) return null;

  const url = block.content_video_url;

  const embedUrl = getEmbedUrl(url);
  if (embedUrl) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <video
        src={block.content_video_url}
        controls
        className="w-full"
        preload="metadata"
      />
    </div>
  );
}

function GalleryBlock({ block }: { block: ContentBlock }) {
  const images = (block.block_metadata?.images as string[] | undefined) ?? [];
  if (images.length === 0 && block.content_image_url) {
    images.push(block.content_image_url);
  }
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {images.map((src, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={`Gallery image ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}

function LinkBlock({ block }: { block: ContentBlock }) {
  if (!block.content_link_url) return null;
  return (
    <a
      href={block.content_link_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/40 hover:bg-bg"
    >
      {block.content_link_text || block.content_link_url}
      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

const BLOCK_COMPONENTS: Record<ContentBlock["block_type"], React.FC<{ block: ContentBlock }>> = {
  text: TextBlock,
  image: ImageBlock,
  video: VideoBlock,
  gallery: GalleryBlock,
  link: LinkBlock,
};

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
  className?: string;
}

export function ContentBlockRenderer({ blocks, className }: ContentBlockRendererProps) {
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
