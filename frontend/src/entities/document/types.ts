import type { PaginatedResponse, ContentBlock } from "@/shared/types";

export type { ContentBlock };

export interface OrganizationDocument {
  id: string;
  title: string;
  slug: string;
  content: string;
  file_url: string | null;
  content_blocks: ContentBlock[];
  is_active: boolean;
  sort_order: number;
}

export type DocumentListResponse = PaginatedResponse<OrganizationDocument>;
