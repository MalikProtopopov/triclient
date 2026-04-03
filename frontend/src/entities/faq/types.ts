import type { PaginatedResponse } from "@/shared/types";

export interface FaqPublicItem {
  id: string;
  question_title: string;
  question_text: string;
  answer_text: string | null;
  author_name: string | null;
  original_date: string | null;
}

export type FaqListResponse = PaginatedResponse<FaqPublicItem>;

export interface FaqFilters {
  limit?: number;
  offset?: number;
  search?: string;
  answered_only?: boolean;
}
