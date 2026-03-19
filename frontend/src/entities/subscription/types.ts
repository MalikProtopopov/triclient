export interface SubscriptionPlanSchema {
  id: string;
  code: string;
  name: string;
  plan_type: "entry_fee" | "subscription";
  price: number;
  duration_months: number;
}

export interface SubscriptionStatusResponse {
  has_subscription: boolean;
  current_subscription: {
    id: string;
    plan: { code: string; name: string };
    status: "pending_payment" | "active" | "expired";
    starts_at: string;
    ends_at: string;
    days_remaining: number;
  } | null;
  has_paid_entry_fee: boolean;
  can_renew: boolean;
  next_action:
    | "pay_entry_fee_and_subscription"
    | "pay_subscription"
    | "renew"
    | "complete_payment"
    | null;
  entry_fee_required: boolean;
  entry_fee_plan: SubscriptionPlanSchema | null;
  available_plans: SubscriptionPlanSchema[];
}

export interface SubscriptionPayRequest {
  plan_id: string;
  idempotency_key: string;
}

export interface SubscriptionPayResponse {
  payment_id: string;
  payment_url: string;
  amount: number;
  expires_at: string | null;
}
