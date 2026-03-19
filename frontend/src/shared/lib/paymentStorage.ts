const KEY_IDEMPOTENCY = "payment_idempotency_key";
const KEY_PAYMENT_ID = "pending_payment_id";
const KEY_EXPIRES = "pending_payment_expires";
const KEY_PLAN_ID = "payment_plan_id";
const KEY_SAVED_AT = "payment_saved_at";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 ч

function isClient(): boolean {
  return typeof window !== "undefined";
}

export function savePendingPayment(data: {
  idempotencyKey: string;
  paymentId: string;
  expiresAt: string;
  planId: string;
}): void {
  if (!isClient()) return;
  localStorage.setItem(KEY_IDEMPOTENCY, data.idempotencyKey);
  localStorage.setItem(KEY_PAYMENT_ID, data.paymentId);
  localStorage.setItem(KEY_EXPIRES, data.expiresAt);
  localStorage.setItem(KEY_PLAN_ID, data.planId);
  localStorage.setItem(KEY_SAVED_AT, String(Date.now()));
}

export function getSavedIdempotencyKey(): string | null {
  if (!isClient()) return null;
  const savedAt = localStorage.getItem(KEY_SAVED_AT);
  const key = localStorage.getItem(KEY_IDEMPOTENCY);
  if (!key || !savedAt) return null;
  const elapsed = Date.now() - Number(savedAt);
  if (elapsed >= TTL_MS) return null;
  return key;
}

export function getSavedPlanId(): string | null {
  if (!isClient()) return null;
  return localStorage.getItem(KEY_PLAN_ID);
}

export function clearPendingPayment(): void {
  if (!isClient()) return;
  localStorage.removeItem(KEY_IDEMPOTENCY);
  localStorage.removeItem(KEY_PAYMENT_ID);
  localStorage.removeItem(KEY_EXPIRES);
  localStorage.removeItem(KEY_PLAN_ID);
  localStorage.removeItem(KEY_SAVED_AT);
}
