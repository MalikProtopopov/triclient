import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type { FaqPublicItem, FaqListResponse, FaqFilters } from "../types";

export const faqApi = {
  getList: (filters?: FaqFilters): Promise<FaqListResponse> =>
    apiClient.get(API_ENDPOINTS.FAQ.LIST, { params: filters }),

  getById: (id: string): Promise<FaqPublicItem> =>
    apiClient.get(API_ENDPOINTS.FAQ.BY_ID(id)),
};
