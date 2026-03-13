import { useQuery, useMutation } from "@tanstack/react-query";

import { subscriptionApi } from "../api/subscriptionApi";
import type { SubscriptionPayRequest } from "../types";

export const subscriptionKeys = {
  status: ["subscription", "status"] as const,
  plans: ["subscription", "plans"] as const,
};

export const useSubscriptionStatus = () =>
  useQuery({
    queryKey: subscriptionKeys.status,
    queryFn: () => subscriptionApi.getStatus(),
  });

export const useSubscriptionPlans = () =>
  useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: () => subscriptionApi.getPlans(),
  });

export const useSubscriptionPayMutation = () =>
  useMutation({
    mutationFn: (request: SubscriptionPayRequest) => subscriptionApi.pay(request),
  });
