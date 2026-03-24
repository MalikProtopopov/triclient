import { API_ENDPOINTS } from "@/shared/config";
import { serverFetch } from "@/shared/lib/serverFetch";

import type { PublicSettings } from "../types";

/** Серверный fetch публичных настроек (metadata, SSR). */
export async function fetchPublicSettingsServer(): Promise<PublicSettings | null> {
  const raw = await serverFetch<{ data?: PublicSettings }>(API_ENDPOINTS.SETTINGS_PUBLIC);
  if (!raw) return null;
  const data = raw.data;
  if (data && typeof data === "object") return data;
  return null;
}
