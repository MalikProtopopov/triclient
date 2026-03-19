import type { PaginatedResponse } from "@/shared/types";

export interface Colleague {
  id: string;
  first_name: string;
  last_name: string;
  /** API returns middle_name; legacy patronymic supported */
  middle_name?: string | null;
  patronymic?: string | null;
  city: string | null;
  specialization: string | null;
  photo_url: string | null;
  public_phone: string | null;
  public_email: string | null;
  colleague_contacts: string | null;
  /** For link to doctor profile; may be omitted */
  slug?: string;
}

export type ColleagueListResponse = PaginatedResponse<Colleague>;

export interface ColleagueFilters {
  limit?: number;
  offset?: number;
  search?: string;
}
