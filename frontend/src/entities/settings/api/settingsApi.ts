import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { PublicSettings } from "../types";

export const settingsApi = {
  getPublic: async (): Promise<PublicSettings> => {
    const response = await apiClient.get<{ data: PublicSettings }>(
      API_ENDPOINTS.SETTINGS_PUBLIC,
    );
    const body = response.data as { data?: PublicSettings };
    return (body?.data ?? body) as PublicSettings;
  },
};
