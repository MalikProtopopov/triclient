import { apiClient } from "@/shared/api";
import { API_ENDPOINTS } from "@/shared/config";

import type {
  DoctorResponseSchema,
  DoctorListResponseSchema,
  DoctorFilters,
  CityResponseSchema,
} from "../types";

export const doctorApi = {
  getList: (filters?: DoctorFilters): Promise<DoctorListResponseSchema> =>
    apiClient.get(API_ENDPOINTS.DOCTORS.LIST, { params: filters }),

  getBySlug: (slug: string): Promise<DoctorResponseSchema> =>
    apiClient.get(API_ENDPOINTS.DOCTORS.BY_SLUG(slug)),

  getCities: async (params?: { withDoctors?: boolean }): Promise<CityResponseSchema[]> => {
    const response = await apiClient.get<{ data: CityResponseSchema[] }>(
      API_ENDPOINTS.CITIES,
      {
        params:
          params?.withDoctors === true ? { with_doctors: true } : undefined,
      },
    );
    return response.data;
  },

  getCityBySlug: (slug: string): Promise<CityResponseSchema> =>
    apiClient.get(API_ENDPOINTS.CITY_BY_SLUG(slug)),
};
