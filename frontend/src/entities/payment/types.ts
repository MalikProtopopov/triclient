import type { PaginatedResponse } from "@/shared/types";

export interface Payment {
  id: string;
  amount: number;
  product_type: "entry_fee" | "subscription" | "event";
  status: "pending" | "succeeded" | "failed" | "refunded";
  description: string;
  created_at: string;
  paid_at: string | null;
  receipt_url: string | null;
}

export type PaymentListResponse = PaginatedResponse<Payment>;
