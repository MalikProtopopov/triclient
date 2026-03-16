import type { PaginatedResponse } from "@/shared/types";
import type { ContentBlockPublicNested } from "@/shared/types";

export type { ContentBlockPublicNested } from "@/shared/types";

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
