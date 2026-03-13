import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

import { paymentApi } from "../api/paymentApi";

export const paymentKeys = {
  all: ["payments"] as const,
  list: () => [...paymentKeys.all, "list"] as const,
  status: (id: string) => [...paymentKeys.all, "status", id] as const,
};

export const usePayments = () =>
  useQuery({
    queryKey: paymentKeys.list(),
    queryFn: () => paymentApi.getList(),
  });

const MAX_POLL_ATTEMPTS = 10;

export const usePaymentStatus = (id: string, polling = false) => {
  const attemptsRef = useRef(0);

  return useQuery({
    queryKey: paymentKeys.status(id),
    queryFn: async () => {
      const result = await paymentApi.getStatus(id);
      attemptsRef.current += 1;
      return result;
    },
    enabled: !!id,
    refetchInterval: polling
      ? (query) => {
          const status = query.state.data?.status;
          if (status === "completed" || status === "failed") return false;
          if (attemptsRef.current >= MAX_POLL_ATTEMPTS) return false;
          return 3000;
        }
      : false,
  });
};
