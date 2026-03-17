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

export interface ProfileDocument {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
}

export interface PublicProfile {
  bio: string | null;
  public_email: string | null;
  public_phone: string | null;
  city_id: string | null;
  clinic_name: string | null;
  specialization: string | null;
  academic_degree: string | null;
  photo_url: string | null;
  first_name: string;
  last_name: string;
  pending_draft: PublicProfileDraft | null;
}

export interface PublicProfileDraft {
  bio: string | null;
  public_email: string | null;
  public_phone: string | null;
  city_id: string | null;
  clinic_name: string | null;
  specialization: string | null;
  academic_degree: string | null;
  submitted_at: string;
}

export interface ProfileEvent {
  id: string;
  event_id: string;
  event_title: string;
  event_slug: string;
  event_date: string;
  tariff_name: string | null;
  status: "pending" | "confirmed" | "cancelled";
  registered_at: string;
}
