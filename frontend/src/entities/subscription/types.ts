export interface SubscriptionStatusResponse {
  has_subscription: boolean;
  current_subscription: {
    id: string;
    plan: { code: string; name: string };
    status: "active" | "expiring" | "expired";
    starts_at: string;
    ends_at: string;
    days_remaining: number;
  } | null;
  has_paid_entry_fee: boolean;
  can_renew: boolean;
  next_action: "pay_entry_fee" | "renew" | null;
}

export interface SubscriptionPlanSchema {
  id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  duration_months: number;
  is_available: boolean;
}

export interface SubscriptionPayRequest {
  plan_id: string;
  idempotency_key: string;
}

export interface SubscriptionPayResponse {
  payment_id: string;
  payment_url: string;
  amount: number;
  expires_at: string;
}
