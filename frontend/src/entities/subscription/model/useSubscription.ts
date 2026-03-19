import { useQuery, useMutation } from "@tanstack/react-query";

import { subscriptionApi } from "../api/subscriptionApi";
import type { SubscriptionPayRequest } from "../types";

export const subscriptionKeys = {
  status: ["subscription", "status"] as const,
};

export const useSubscriptionStatus = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: subscriptionKeys.status,
    queryFn: () => subscriptionApi.getStatus(),
    enabled: options?.enabled,
  });

export const useSubscriptionPayMutation = () =>
  useMutation({
    mutationFn: (request: SubscriptionPayRequest) =>
      subscriptionApi.pay(request),
  });
