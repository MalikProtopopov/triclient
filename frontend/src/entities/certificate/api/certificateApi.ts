import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { Certificate } from "../types";

export const certificateApi = {
  getList: async (): Promise<Certificate[]> => {
    const response = await apiClient.get<{ data: Certificate[] } | Certificate[]>(
      API_ENDPOINTS.CERTIFICATES.LIST,
    );
    if (Array.isArray(response)) return response;
    return response.data;
  },

  download: async (id: string): Promise<string> => {
    const data = await apiClient.get<{ redirect_url: string }>(
      API_ENDPOINTS.CERTIFICATES.DOWNLOAD(id),
    );
    return data.redirect_url;
  },
};
