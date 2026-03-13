import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type {
  SubscriptionStatusResponse,
  SubscriptionPlanSchema,
  SubscriptionPayRequest,
  SubscriptionPayResponse,
} from "../types";

export const subscriptionApi = {
  getStatus: (): Promise<SubscriptionStatusResponse> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.STATUS),

  getPlans: async (): Promise<SubscriptionPlanSchema[]> => {
    const response = await apiClient.get<{ data: SubscriptionPlanSchema[] }>(
      API_ENDPOINTS.SUBSCRIPTIONS.PLANS,
    );
    return response.data;
  },

  pay: (request: SubscriptionPayRequest): Promise<SubscriptionPayResponse> =>
    apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS.PAY, request),
};
