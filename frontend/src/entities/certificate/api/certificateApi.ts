import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { Certificate } from "../types";

export const certificateApi = {
  getList: (): Promise<Certificate[]> =>
    apiClient.get(API_ENDPOINTS.CERTIFICATES.LIST),

  download: async (id: string): Promise<string> => {
    const data = await apiClient.get<{ redirect_url: string }>(
      API_ENDPOINTS.CERTIFICATES.DOWNLOAD(id),
    );
    return data.redirect_url;
  },
};
