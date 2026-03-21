export interface Certificate {
  id: string;
  certificate_type: "member" | "event";
  year: number | null;
  event: { id: string; title: string } | null;
  certificate_number: string;
  is_active: boolean;
  generated_at: string;
  download_url: string;
  verify_url: string;
}

export interface CertificateVerifyResponse {
  certificate_number: string;
  doctor_full_name: string;
  doctor_slug: string;
  certificate_type: "member" | "event";
  year: number | null;
  issued_at: string;
  is_valid: boolean;
  invalid_reason: string | null;
  organization_name: string;
  president_full_name: string;
  president_title: string;
}
