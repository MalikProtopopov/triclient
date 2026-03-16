import { ENV } from "@/shared/config/env";

/**
 * Resolves a media URL that may be relative (e.g. "events/covers/xxx.png")
 * by prepending the API base URL when needed.
 */
export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = ENV.API_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * Derives event status from event_date when backend does not return status.
 */
export function deriveEventStatus(eventDate: string): "upcoming" | "past" {
  return new Date(eventDate) >= new Date() ? "upcoming" : "past";
}
