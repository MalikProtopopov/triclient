import type { PaginatedResponse, SeoMeta, ContentBlock } from "@/shared/types";

export interface ArticleTheme {
  id: string;
  title: string;
  slug: string;
}

export interface ArticleResponseSchema {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  published_at: string;
  themes: ArticleTheme[];
  seo_title: string;
  seo_description: string;
  seo: SeoMeta | null;
  content_blocks: ContentBlock[];
}

export type ArticleListResponseSchema = PaginatedResponse<ArticleResponseSchema>;

export interface ArticleFilters {
  theme_slug?: string;
  limit?: number;
  offset?: number;
}
