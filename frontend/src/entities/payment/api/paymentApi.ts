import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { PaymentListResponse } from "../types";

export const paymentApi = {
  getList: (params?: {
    limit?: number;
    offset?: number;
  }): Promise<PaymentListResponse> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS, { params }),

  getReceipt: (id: string): Promise<Blob> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.RECEIPT(id), {
      responseType: "blob",
    }),
};
