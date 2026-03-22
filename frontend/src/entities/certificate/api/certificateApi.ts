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

  /** Скачивает сертификат как blob (запрос с Bearer через apiClient) */
  downloadBlob: async (id: string): Promise<Blob> => {
    const blob = await apiClient.get<Blob>(
      API_ENDPOINTS.CERTIFICATES.DOWNLOAD(id),
      { responseType: "blob" },
    );
    return blob;
  },
};
