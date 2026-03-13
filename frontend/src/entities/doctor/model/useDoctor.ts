import { useQuery } from "@tanstack/react-query";

import { doctorApi } from "../api/doctorApi";
import type { DoctorFilters } from "../types";

export const doctorKeys = {
  all: ["doctors"] as const,
  list: (filters?: DoctorFilters) => [...doctorKeys.all, "list", filters] as const,
  detail: (id: string) => [...doctorKeys.all, "detail", id] as const,
  cities: ["cities"] as const,
};

export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: () => doctorApi.getList(filters),
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => doctorApi.getById(id),
    enabled: !!id,
  });
};

export const useCities = () => {
  return useQuery({
    queryKey: doctorKeys.cities,
    queryFn: () => doctorApi.getCities(),
  });
};
