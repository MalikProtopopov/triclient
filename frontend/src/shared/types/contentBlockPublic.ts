export type ContentBlockPublicNestedBlockType =
  | "text"
  | "image"
  | "video"
  | "file"
  | "link"
  | "gallery"
  | "banner";

export interface ContentBlockPublicNested {
  id: string;
  block_type: ContentBlockPublicNestedBlockType;
  sort_order: number;
  title: string | null;
  content: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  link_url: string | null;
  link_label: string | null;
  device_type: "all" | "both" | "desktop" | "mobile";
}
