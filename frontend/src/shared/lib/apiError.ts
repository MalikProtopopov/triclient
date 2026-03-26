import type { AxiosError } from "axios";

import type { ApiError } from "@/entities/auth";

/** Текст из `{ error: { message } }` тела ответа API */
export function getApiErrorMessage(error: unknown): string | null {
  const ax = error as AxiosError<ApiError>;
  const msg = ax.response?.data?.error?.message;
  return typeof msg === "string" && msg.trim() ? msg.trim() : null;
}
