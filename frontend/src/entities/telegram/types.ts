export interface TelegramBinding {
  is_linked: boolean;
  tg_username: string | null;
  is_in_channel: boolean;
}

export interface GenerateCodeResponse {
  auth_code: string;
  expires_at: string;
  bot_link: string;
  instruction: string;
}
