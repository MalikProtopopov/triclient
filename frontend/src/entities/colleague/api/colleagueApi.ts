import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { ColleagueListResponse, ColleagueFilters } from "../types";

export const colleagueApi = {
  getList: (params?: ColleagueFilters): Promise<ColleagueListResponse> =>
    apiClient.get(API_ENDPOINTS.COLLEAGUES, { params }),
};
