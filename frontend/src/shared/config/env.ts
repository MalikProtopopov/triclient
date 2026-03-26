export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? "Профессиональное общество Трихологов",
} as const;

/** Base URL for media (e.g. for S3 keys in draft: origin + /media/ + key) */
export function getMediaBaseUrl(): string {
  try {
    return new URL(ENV.API_URL).origin;
  } catch {
    return ENV.API_URL.replace(/\/api\/v1\/?$/, "") || "http://localhost:8000";
  }
}

/** Resolve S3 key to full media URL. Key may be relative (e.g. doctors/uuid/photo/x.jpg) or full URL. */
export function resolvePendingPhotoUrl(key: string | undefined): string | undefined {
  if (!key) return undefined;
  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  const base = getMediaBaseUrl();
  const normalized = key.startsWith("/") ? key : `/${key}`;
  return `${base}${normalized.startsWith("/media") ? normalized : `/media${normalized}`}`;
}
