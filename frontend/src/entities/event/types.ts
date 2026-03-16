import type { PaginatedResponse, SeoMeta, ContentBlock } from "@/shared/types";

export interface EventResponseSchema {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  event_end_date: string;
  location: string;
  cover_image_url: string | null;
  status?: "upcoming" | "past";
  tariffs: EventTariff[];
  galleries: EventGallery[];
  recordings: EventRecording[];
  content_blocks: ContentBlock[];
  seo: SeoMeta | null;
  user_registration?: EventRegistrationResponse | null;
}

export interface EventTariff {
  id: string;
  name: string;
  description: string | null;
  conditions: string | null;
  details: string | null;
  price: number;
  member_price: number;
  benefits: string[] | null;
  seats_limit: number | null;
  seats_taken?: number;
  seats_available?: number;
  is_active?: boolean;
  sort_order?: number;
}

export interface EventGallery {
  id: string;
  title: string;
  access_level: "public" | "members_only";
  photo_count: number;
}

export interface EventRecording {
  id: string;
  title: string;
  duration: string;
  access_level: "public" | "members_only" | "participants_only";
  video_source: string | null;
  video_playback_url: string | null;
}

export type EventListResponseSchema = PaginatedResponse<EventResponseSchema>;

export interface EventFilters {
  period?: "upcoming" | "past";
  limit?: number;
  offset?: number;
}

export interface EventRegistrationRequest {
  tariff_id: string;
  idempotency_key: string;
  guest_email?: string;
  guest_full_name?: string;
  guest_workplace?: string;
  guest_specialization?: string;
  fiscal_email?: string;
}

export interface EventRegistrationResponse {
  registration_id: string | null;
  payment_url: string | null;
  applied_price: number | null;
  is_member_price: boolean | null;
  action: "verify_existing" | "verify_new_email" | null;
  masked_email: string | null;
}

export interface ConfirmGuestRegistrationRequest {
  email: string;
  code: string;
  tariff_id: string;
  idempotency_key: string;
  guest_full_name?: string;
  guest_workplace?: string;
  guest_specialization?: string;
  fiscal_email?: string;
}
