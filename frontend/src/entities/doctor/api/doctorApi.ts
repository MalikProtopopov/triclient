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

  getById: (id: string): Promise<DoctorResponseSchema> =>
    apiClient.get(API_ENDPOINTS.DOCTORS.BY_ID(id)),

  getCities: (): Promise<CityResponseSchema[]> =>
    apiClient.get(API_ENDPOINTS.CITIES, { params: { with_doctors: true } }),
};
