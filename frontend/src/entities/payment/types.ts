import type { PaginatedResponse } from "@/shared/types";

export interface Payment {
  id: string;
  amount: number;
  product_type: "entry_fee" | "subscription" | "event";
  payment_provider: "yookassa" | "paykeeper" | null;
  status: "pending" | "completed" | "failed" | "refunded" | "partially_refunded";
  description: string;
  created_at: string;
  receipt_url: string | null;
}

export type PaymentListResponse = PaginatedResponse<Payment>;

export interface PaymentStatus {
  id: string;
  status: Payment["status"];
  payment_url: string | null;
}
