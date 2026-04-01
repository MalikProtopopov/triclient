const PASSPORT_DIGITS_LENGTH = 10;

/** Форматирует ввод паспорта: только цифры, маска «1234 567890» */
export function formatPassportInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, PASSPORT_DIGITS_LENGTH);
  if (digits.length === 0) return "";
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

/** Возвращает 10 цифр без пробелов для отправки в API */
export function formatPassportForApi(value: string): string {
  return value.replace(/\D/g, "").slice(0, PASSPORT_DIGITS_LENGTH);
}

/** Нормализует значение из API и показывает с маской */
export function formatPassportDisplay(value: string | null | undefined): string {
  if (!value?.trim()) return "";
  const digits = value.replace(/\D/g, "").slice(0, PASSPORT_DIGITS_LENGTH);
  return formatPassportInput(digits);
}
