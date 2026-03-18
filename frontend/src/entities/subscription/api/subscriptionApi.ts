import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type {
  SubscriptionStatusResponse,
  SubscriptionPayRequest,
  SubscriptionPayResponse,
} from "../types";

export const subscriptionApi = {
  getStatus: (): Promise<SubscriptionStatusResponse> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.STATUS),

  pay: (request: SubscriptionPayRequest): Promise<SubscriptionPayResponse> =>
    apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS.PAY, request),
};
