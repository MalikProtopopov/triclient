/** Ключи из GET /api/v1/settings/public — в ответе могут отсутствовать любые поля. */
export type PublicSettings = {
  contact_email?: string;
  contact_phone?: string;
  telegram_bot_link?: string | null;
  site_name?: string;
  site_description?: string | null;
};
