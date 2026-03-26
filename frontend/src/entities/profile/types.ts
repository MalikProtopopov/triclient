export interface PersonalProfile {
  first_name: string;
  last_name: string;
  middle_name: string | null;
  phone: string | null;
  passport_data: string | null;
  registration_address: string | null;
  city: { id: string; name: string } | null;
  clinic_name: string | null;
  position: string | null;
  specialization: string | null;
  academic_degree: string | null;
  diploma_photo_url: string | null;
  colleague_contacts: string | null;
  documents: ProfileDocument[];
}

/** PATCH request: backend accepts city as string (name) or city_id (UUID) */
export type UpdatePersonalRequest = Omit<Partial<PersonalProfile>, "city"> & {
  city?: string | null;
  city_id?: string;
};

export type ProfileDocumentType =
  | "medical_diploma"
  | "retraining_cert"
  | "oncology_cert"
  | "additional_cert";

export interface ProfileDocument {
  id: string;
  document_type: ProfileDocumentType;
  original_filename: string;
  uploaded_at: string;
  /** Optional; backend may omit if download URL is not available */
  file_url?: string;
  /** Legacy: backend may still return name instead of original_filename */
  name?: string;
}

export interface PublicProfile {
  bio: string | null;
  public_email: string | null;
  public_phone: string | null;
  city_id: string | null;
  /** API may return city object at top level */
  city?: { id: string; name: string } | null;
  clinic_name: string | null;
  specialization: string | null;
  academic_degree: string | null;
  photo_url: string | null;
  first_name: string;
  last_name: string;
  pending_draft: PublicProfileDraft | null;
  /** Client-only: set after upload when backend returns pending_moderation */
  photo_pending_moderation?: boolean;
}

export interface PublicProfileDraft {
  status: "pending" | "rejected" | "approved";
  changes: {
    bio?: string | null;
    public_email?: string | null;
    public_phone?: string | null;
    city_id?: string | null;
    clinic_name?: string | null;
    specialization?: string | null;
    academic_degree?: string | null;
    photo_url?: string;
  };
  /** Backend may return flat fields at draft level instead of in changes */
  bio?: string | null;
  public_email?: string | null;
  public_phone?: string | null;
  city_id?: string | null;
  clinic_name?: string | null;
  specialization?: string | null;
  academic_degree?: string | null;
  photo_url?: string;
  submitted_at: string;
  rejection_reason: string | null;
  reviewed_at: string | null;
}

export interface UploadPhotoResponse {
  photo_url: string;
  message?: string;
  pending_moderation: boolean;
}

/** Ответ POST /profile/public/submit (multipart) */
export interface PublicSubmitResponse {
  message: string;
  pending_moderation: boolean;
  /** Превью URL только если в этом запросе был файл photo */
  photo_url: string;
}

export interface ProfileEvent {
  registration_id: string;
  event_id: string;
  event_slug: string;
  title: string;
  event_date: string;
  status: "pending" | "confirmed" | "cancelled";
  applied_price: number;
  is_member_price: boolean;
  tariff_name: string | null;
}

export type EventRegistrationStatus = "pending" | "confirmed" | "cancelled";

export interface EventRegistrationNested {
  id: string;
  status: EventRegistrationStatus;
  created_at: string;
  guest_full_name: string | null;
  guest_email: string | null;
  guest_workplace: string | null;
  guest_specialization: string | null;
  fiscal_email: string | null;
}

export interface EventRegistrationEventNested {
  id: string;
  slug: string;
  title: string;
  event_date: string;
  event_end_date: string | null;
  location: string;
  status: string;
  cover_image_url: string | null;
}

export interface EventRegistrationTariffNested {
  id: string;
  name: string;
  price: number;
  member_price: number;
  applied_price: number;
  is_member_price: boolean;
}

export interface EventRegistrationPaymentNested {
  id?: string;
  status: string;
  amount?: number;
  payment_url?: string | null;
  expires_at?: string | null;
}

export interface EventRegistrationItem {
  registration: EventRegistrationNested;
  event: EventRegistrationEventNested;
  tariff: EventRegistrationTariffNested;
  payment: EventRegistrationPaymentNested | null;
}

export interface EventRegistrationsListResponse {
  data: EventRegistrationItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface EventRegistrationsQueryParams {
  limit?: number;
  offset?: number;
  status?: EventRegistrationStatus;
  event_id?: string;
}
