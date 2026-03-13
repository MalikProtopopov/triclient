import type { PaginatedResponse, SeoMeta, ContentBlock } from "@/shared/types";

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
  content_blocks: ContentBlock[];
}

export type DoctorListResponseSchema = PaginatedResponse<DoctorResponseSchema>;

export interface DoctorFilters {
  city_id?: string;
  city_slug?: string;
  specialization?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CityResponseSchema {
  id: string;
  name: string;
  slug: string;
  doctors_count?: number;
}
