/** Безопасная обрезка: только для строк; иначе null (API может вернуть не string). */
export function trimStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t === "" ? null : t;
}
