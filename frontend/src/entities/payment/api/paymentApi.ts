import { API_ENDPOINTS } from "@/shared/config";
import { apiClient } from "@/shared/api";

import type {
  PaymentListResponse,
  PaymentStatusResponse,
  ReceiptResponse,
} from "../types";

export const paymentApi = {
  getList: (params?: {
    limit?: number;
    offset?: number;
  }): Promise<PaymentListResponse> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENTS, { params }),

  getReceipt: (id: string): Promise<ReceiptResponse> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.RECEIPT(id)),

  getStatus: (paymentId: string): Promise<PaymentStatusResponse> =>
    apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS.PAYMENT_STATUS(paymentId)),
};
