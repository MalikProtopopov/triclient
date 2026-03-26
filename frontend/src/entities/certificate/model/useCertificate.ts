import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { certificateApi } from "../api/certificateApi";

export const certificateKeys = {
  all: ["certificates"] as const,
  list: () => [...certificateKeys.all, "list"] as const,
};

export const useCertificates = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: certificateKeys.list(),
    queryFn: () => certificateApi.getList(),
    enabled: options?.enabled ?? true,
    retry: (failureCount, failure) => {
      const status = (failure as AxiosError)?.response?.status;
      if (status === 401 || status === 403 || status === 404) return false;
      return failureCount < 2;
    },
  });
};
