import type { PaginatedResponse } from "@/shared/types";

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
  device_type: "all" | "desktop" | "mobile";
}

export interface OrganizationDocument {
  id: string;
  title: string;
  slug: string;
  content: string;
  file_url: string | null;
  content_blocks: ContentBlockPublicNested[];
  is_active: boolean;
  sort_order: number;
}

export type DocumentListResponse = PaginatedResponse<OrganizationDocument>;
