import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { paymentKeys } from "@/entities/payment";

import { subscriptionApi } from "../api/subscriptionApi";
import type { SubscriptionPayRequest, SubscriptionPayArrearsRequest } from "../types";

export const subscriptionKeys = {
  status: ["subscription", "status"] as const,
};

export const useSubscriptionStatus = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: subscriptionKeys.status,
    queryFn: () => subscriptionApi.getStatus(),
    enabled: options?.enabled,
  });

export const useSubscriptionPayMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SubscriptionPayRequest) => subscriptionApi.pay(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.status });
      void queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
};

export const useSubscriptionPayArrearsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SubscriptionPayArrearsRequest) =>
      subscriptionApi.payArrears(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.status });
      void queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
};
