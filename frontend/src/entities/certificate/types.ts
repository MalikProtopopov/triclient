export interface Certificate {
  id: string;
  certificate_type: "member" | "event";
  year: number;
  event: { id: string; title: string } | null;
  certificate_number: string;
  is_active: boolean;
  generated_at: string;
  download_url: string;
}
