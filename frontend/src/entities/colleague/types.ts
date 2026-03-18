import type { PaginatedResponse } from "@/shared/types";

export interface Colleague {
  id: string;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  city: string | null;
  specialization: string | null;
  photo_url: string | null;
  slug: string;
}

export type ColleagueListResponse = PaginatedResponse<Colleague>;

export interface ColleagueFilters {
  limit?: number;
  offset?: number;
  search?: string;
}
