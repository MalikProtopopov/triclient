import { useQuery } from "@tanstack/react-query";

import { paymentApi } from "../api/paymentApi";

export const paymentKeys = {
  all: ["payments"] as const,
  list: (params?: { limit?: number; offset?: number }) =>
    [...paymentKeys.all, "list", params] as const,
};

export const usePayments = (params?: { limit?: number; offset?: number }) =>
  useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentApi.getList(params),
  });
