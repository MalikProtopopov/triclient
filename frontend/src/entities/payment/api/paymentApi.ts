import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type { PaymentListResponse, PaymentStatus } from "../types";

export const paymentApi = {
  getList: (): Promise<PaymentListResponse> =>
    apiClient.get(API_ENDPOINTS.PAYMENTS.LIST),

  getReceipt: (id: string): Promise<{ receipt_url: string }> =>
    apiClient.get(API_ENDPOINTS.PAYMENTS.RECEIPT(id)),

  getStatus: (id: string): Promise<PaymentStatus> =>
    apiClient.get(API_ENDPOINTS.PAYMENTS.STATUS(id)),
};
