export interface SubscriptionPlanSchema {
  id: string;
  code: string;
  name: string;
  plan_type: "entry_fee" | "subscription";
  price: number;
  duration_months: number;
}

/** Открытая задолженность по членскому (только статус open на бэкенде) */
export interface OpenMembershipArrear {
  id: string;
  year: number;
  amount: number;
  description: string;
  source: string;
  escalation_level: string | null;
}

export type SubscriptionNextAction =
  | "pay_entry_fee_and_subscription"
  | "pay_subscription"
  | "renew"
  | "complete_payment"
  | "pay_arrears"
  | string
  | null;

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
  next_action: SubscriptionNextAction;
  entry_fee_required: boolean;
  /** Освобождение от вступительного (профиль); если true — не показывать блок про вступительный */
  entry_fee_exempt?: boolean;
  entry_fee_plan: SubscriptionPlanSchema | null;
  available_plans: SubscriptionPlanSchema[];
  /** Только открытые долги (к оплате) */
  open_arrears?: OpenMembershipArrear[];
  /** Сумма открытых долгов */
  arrears_total?: number;
  /** Блокировка при долгах включена на сайте и есть открытые долги */
  arrears_block_active?: boolean;
  is_membership_excluded?: boolean;
  membership_excluded_at?: string | null;
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

export interface SubscriptionPayArrearsRequest {
  arrear_id: string;
  idempotency_key: string;
}
