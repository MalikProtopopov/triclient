export interface ContentBlock {
  id: string;
  block_type: "text" | "image" | "video" | "gallery" | "link";
  sort_order: number;
  locale: string;
  device_type: "all" | "desktop" | "mobile";
  content_text: string | null;
  content_image_url: string | null;
  content_image_alt: string | null;
  content_video_url: string | null;
  content_link_url: string | null;
  content_link_text: string | null;
  block_metadata: Record<string, unknown> | null;
}
