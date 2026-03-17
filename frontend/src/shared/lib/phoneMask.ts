const RUSSIAN_PHONE_DIGITS_LENGTH = 10;

export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, RUSSIAN_PHONE_DIGITS_LENGTH + 1);
  let nums = digits;
  if (digits.startsWith("7") || digits.startsWith("8")) {
    nums = digits.slice(1);
  } else if (digits.length > 0) {
    nums = digits;
  }
  const limited = nums.slice(0, RUSSIAN_PHONE_DIGITS_LENGTH);
  if (limited.length === 0) return "";
  if (limited.length <= 3) return `+7 (${limited}`;
  if (limited.length <= 6) return `+7 (${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `+7 (${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 8)}-${limited.slice(8)}`;
}

export function formatPhoneForApi(value: string): string {
  const digits = value.replace(/\D/g, "");
  const nums = digits.startsWith("7") ? digits.slice(1) : digits.startsWith("8") ? digits.slice(1) : digits;
  return `+7${nums.slice(0, RUSSIAN_PHONE_DIGITS_LENGTH)}`;
}
