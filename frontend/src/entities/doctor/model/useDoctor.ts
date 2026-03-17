import { useQuery } from "@tanstack/react-query";

import { doctorApi } from "../api/doctorApi";
import type { DoctorFilters, CityResponseSchema } from "../types";

export const doctorKeys = {
  all: ["doctors"] as const,
  list: (filters?: DoctorFilters) => [...doctorKeys.all, "list", filters] as const,
  detail: (slug: string) => [...doctorKeys.all, "detail", slug] as const,
  cities: (options?: { withDoctors?: boolean }) =>
    [...doctorKeys.all, "cities", options?.withDoctors] as const,
};

export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => doctorApi.getList(filters),
  });
};

export const useDoctor = (slug: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(slug),
    queryFn: () => doctorApi.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCities = (options?: { withDoctors?: boolean }) => {
  return useQuery<CityResponseSchema[]>({
    queryKey: doctorKeys.cities(options),
    queryFn: () => doctorApi.getCities(options),
  });
};
