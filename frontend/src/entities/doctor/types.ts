import type {
  PaginatedResponse,
  SeoMeta,
  ContentBlockPublicNested,
} from "@/shared/types";

export type BoardRole = "president" | "pravlenie";

export interface DoctorResponseSchema {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  specialization: string;
  academic_degree: string;
  city: string;
  clinic_name: string;
  position: string;
  bio: string;
  photo_url: string | null;
  public_phone: string;
  public_email: string;
  slug: string;
  is_active: boolean;
  seo: SeoMeta | null;
  content_blocks: ContentBlockPublicNested[];
  board_role: BoardRole | null;
}

export type DoctorListResponseSchema = PaginatedResponse<DoctorResponseSchema>;

export interface DoctorFilters {
  city_id?: string;
  city_slug?: string;
  specialization?: string;
  search?: string;
  board_role?: BoardRole[];
  limit?: number;
  offset?: number;
}

export interface CityResponseSchema {
  id: string;
  name: string;
  slug: string;
  doctors_count?: number;
}
