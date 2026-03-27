import type { AxiosError } from "axios";

import type { ApiError } from "@/entities/auth";

/** Текст из `{ error: { message } }` тела ответа API */
export function getApiErrorMessage(error: unknown): string | null {
  const ax = error as AxiosError<ApiError>;
  const msg = ax.response?.data?.error?.message;
  return typeof msg === "string" && msg.trim() ? msg.trim() : null;
}

const DEFAULT_LOGIN_ERROR_RU =
  "Неверный email или пароль. Проверьте данные и попробуйте снова.";

function hasCyrillic(text: string): boolean {
  return /[а-яёА-ЯЁ]/.test(text);
}

/**
 * Сообщение для формы `/login`: не показываем сырой английский текст из API,
 * если в `message` нет кириллицы (типичный случай — INVALID_CREDENTIALS).
 */
export function getLoginPageErrorMessage(error: unknown): string {
  const ax = error as AxiosError<ApiError>;
  const code = ax.response?.data?.error?.code;
  const msg = ax.response?.data?.error?.message;
  const trimmed = typeof msg === "string" ? msg.trim() : "";

  if (code === "ACCOUNT_DEACTIVATED") {
    return "Аккаунт деактивирован. Обратитесь в поддержку.";
  }

  if (trimmed && hasCyrillic(trimmed)) {
    return trimmed;
  }

  return DEFAULT_LOGIN_ERROR_RU;
}
