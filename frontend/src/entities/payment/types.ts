import type { PaginatedResponse } from "@/shared/types";

export type PaymentProductType =
  | "entry_fee"
  | "subscription"
  | "event"
  | "membership_arrears";

export interface Payment {
  id: string;
  amount: number;
  product_type: PaymentProductType;
  /** Год долга — если бэкенд отдаёт (для membership_arrears) */
  year?: number | null;
  status:
    | "pending"
    | "succeeded"
    | "failed"
    | "refunded"
    | "expired"
    | "partially_refunded";
  status_label?: string;
  description: string;
  created_at: string;
  paid_at: string | null;
  payment_url?: string | null;
  expires_at?: string | null;
}

export type PaymentListResponse = PaginatedResponse<Payment>;

export interface ReceiptResponse {
  id: string;
  receipt_type: string;
  receipt_url: string;
  fiscal_number?: string;
  fiscal_document?: string;
  fiscal_sign?: string;
  amount: number;
  status: string;
}

export interface PaymentStatusResponse {
  payment_id: string;
  status: "pending" | "succeeded" | "failed" | "expired";
  product_type: PaymentProductType;
  amount: number;
  created_at: string;
  paid_at: string | null;
  event_id: string | null;
  event_title: string | null;
}
