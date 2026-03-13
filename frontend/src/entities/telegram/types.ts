export interface TelegramBinding {
  is_bound: boolean;
  telegram_username: string | null;
  bound_at: string | null;
}

export interface GenerateCodeResponse {
  code: string;
  bot_url: string;
  expires_at: string;
}
