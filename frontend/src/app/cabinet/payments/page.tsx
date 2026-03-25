"use client";

import { useState } from "react";
import {
  Download,
  AlertTriangle,
  Clock,
  Info,
  CheckCircle,
  ShieldAlert,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useAuth } from "@/providers/AuthProvider";
import {
  useSubscriptionStatus,
  useSubscriptionPayMutation,
  useSubscriptionPayArrearsMutation,
} from "@/entities/subscription";
import type {
  SubscriptionPlanSchema,
  SubscriptionStatusResponse,
} from "@/entities/subscription";
import { usePayments, paymentApi } from "@/entities/payment";
import type { Payment } from "@/entities/payment";
import type { ApiError } from "@/entities/auth";
import { Card, Button, PaymentStatusBadge, EmptyState } from "@/shared/ui";
import { formatShortDate, formatPrice } from "@/shared/lib/format";
import {
  savePendingPayment,
  getSavedIdempotencyKey,
} from "@/shared/lib/paymentStorage";

/**
 * Если true — кнопка оплаты членского недоступна, пока есть открытые долги
 * (бэкенд может не требовать очереди — переключите при необходимости).
 */
const BLOCK_MEMBERSHIP_PAY_UNTIL_ARREARS_CLEARED = false;

function showsEntryFeeInUi(sub: SubscriptionStatusResponse): boolean {
  if (sub.entry_fee_exempt) return false;
  return (sub.entry_fee_required ?? false) && !!sub.entry_fee_plan;
}

function getSubscriptionMessage(status: {
  entry_fee_required: boolean;
  entry_fee_exempt?: boolean;
  has_paid_entry_fee: boolean;
}): string {
  if (status.entry_fee_exempt) {
    return "Продлите подписку для доступа ко всем функциям.";
  }
  if (status.entry_fee_required) {
    if (!status.has_paid_entry_fee) {
      return "Первая оплата. Необходимо оплатить вступительный взнос и членский взнос.";
    }
    return "Подписка истекла более 60 дней назад. Для возобновления потребуется вступительный взнос и членский взнос.";
  }
  return "Продлите подписку для доступа ко всем функциям.";
}

function formatPaymentPurpose(payment: Payment): string {
  const d = payment.description?.trim();
  if (d) return d;
  if (payment.product_type === "membership_arrears") {
    if (payment.year != null) {
      return `Задолженность за ${payment.year}`;
    }
    return "Задолженность по членскому взносу";
  }
  return "—";
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const { data: subscription, isLoading: subLoading } = useSubscriptionStatus({
    enabled: isDoctor,
  });
  const { data: paymentsData } = usePayments();
  const payMutation = useSubscriptionPayMutation();
  const payArrearsMutation = useSubscriptionPayArrearsMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [payingArrearId, setPayingArrearId] = useState<string | null>(null);

  const payments = paymentsData?.data ?? [];
  const currentSub = subscription?.current_subscription;
  const nextAction = subscription?.next_action;
  const entryFeePlan = subscription?.entry_fee_plan;
  const availablePlans = subscription?.available_plans ?? [];
  const openArrears = subscription?.open_arrears ?? [];
  const arrearsTotal = subscription?.arrears_total;
  const membershipBlockedByArrears =
    BLOCK_MEMBERSHIP_PAY_UNTIL_ARREARS_CLEARED && openArrears.length > 0;
  const showEntryFee =
    subscription && showsEntryFeeInUi(subscription);

  const selectedPlan = selectedPlanId
    ? availablePlans.find((p) => p.id === selectedPlanId)
    : availablePlans[0] ?? null;

  const showPlanSelector =
    nextAction != null && nextAction !== "complete_payment";

  const handlePay = (planId: string) => {
    const idempotencyKey =
      getSavedIdempotencyKey() ?? crypto.randomUUID();
    payMutation.mutate(
      { plan_id: planId, idempotency_key: idempotencyKey },
      {
        onSuccess: (data) => {
          savePendingPayment({
            idempotencyKey,
            paymentId: data.payment_id,
            expiresAt:
              data.expires_at ??
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            planId,
          });
          window.location.href = data.payment_url;
        },
        onError: (error) => {
          const axiosErr = error as AxiosError<ApiError>;
          const code = axiosErr.response?.data?.error?.code;
          if (code === "MEDICAL_DIPLOMA_REQUIRED") {
            toast.error(
              "Для оплаты необходимо загрузить фото медицинского диплома",
            );
          } else {
            toast.error("Не удалось инициировать оплату");
          }
        },
      },
    );
  };

  const handlePayArrear = (arrearId: string) => {
    const idempotencyKey = crypto.randomUUID();
    setPayingArrearId(arrearId);
    payArrearsMutation.mutate(
      { arrear_id: arrearId, idempotency_key: idempotencyKey },
      {
        onSuccess: (data) => {
          savePendingPayment({
            idempotencyKey,
            paymentId: data.payment_id,
            expiresAt:
              data.expires_at ??
              new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            planId: arrearId,
          });
          window.location.href = data.payment_url;
        },
        onError: () => {
          toast.error("Не удалось инициировать оплату задолженности");
        },
        onSettled: () => setPayingArrearId(null),
      },
    );
  };

  const handleGoToPay = async () => {
    try {
      const res = await paymentApi.getList({ limit: 5 });
      const list = res.data ?? [];
      const pending = list.find(
        (p) =>
          p.status === "pending" &&
          p.payment_url &&
          p.expires_at &&
          new Date(p.expires_at) > new Date(),
      );
      if (pending?.payment_url) {
        window.location.href = pending.payment_url;
      } else {
        toast.info("Срок оплаты истёк. Создайте новый платёж");
      }
    } catch {
      toast.error("Не удалось загрузить данные");
    }
  };

  const handleReceipt = async (paymentId: string, isRetry = false) => {
    try {
      const receipt = await paymentApi.getReceipt(paymentId);
      if (receipt.receipt_url) {
        window.open(receipt.receipt_url, "_blank");
      } else {
        toast.error("Не удалось получить чек");
      }
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) {
        toast.info("Чек формируется, попробуйте через 30 сек");
        if (!isRetry) {
          setTimeout(() => handleReceipt(paymentId, true), 30000);
        }
      } else {
        toast.error("Не удалось получить чек");
      }
    }
  };

  if (!isDoctor) {
    return (
      <div className="space-y-8">
        <h1 className="font-heading text-3xl font-semibold text-text-primary">
          Оплаты и подписка
        </h1>
        <EmptyState
          title="Раздел доступен только для врачей"
          description="Оплата подписки на ассоциацию доступна только для пользователей с ролью врача."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Оплаты и подписка
      </h1>

      {/* ── Section 1: Alerts & subscription status ── */}
      {!subLoading && subscription && (
        <>
          {(subscription.is_membership_excluded ||
            subscription.membership_excluded_at) && (
            <Card className="border-border bg-bg-secondary">
              <div className="flex items-start gap-3">
                <Ban className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
                <div>
                  <p className="font-medium text-text-primary">
                    Исключение из членства
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {subscription.membership_excluded_at
                      ? `Дата исключения: ${formatShortDate(subscription.membership_excluded_at)}. `
                      : ""}
                    Возобновление участия — через оплату по разделам ниже (см.
                    статус подписки и задолженности). При вопросах обратитесь в
                    ассоциацию.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {subscription.arrears_block_active && (
            <Card className="border-warning/40 bg-warning/10">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                <div>
                  <p className="font-medium text-text-primary">
                    Есть непогашенная задолженность
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    При включённой блокировке на сайте отображение в каталоге
                    врачей и привилегии могут быть ограничены до погашения долга.
                    Оплатите задолженности ниже.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <SubscriptionStatusCard
            subscription={subscription}
            currentSub={currentSub ?? null}
            onGoToPay={handleGoToPay}
          />

          {openArrears.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-text-primary">
                Задолженности по членскому взносу
              </h2>
              <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-border bg-bg-secondary/50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                          Год
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                          Описание
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                          Сумма
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-text-secondary">
                          Действие
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {openArrears.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-border last:border-b-0"
                        >
                          <td className="px-6 py-4 text-sm text-text-primary">
                            {row.year}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary">
                            <div>{row.description}</div>
                            {row.escalation_level != null && (
                              <div className="mt-1 text-xs text-text-muted">
                                Уровень: {row.escalation_level}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-text-primary">
                            {formatPrice(row.amount)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              onClick={() => handlePayArrear(row.id)}
                              disabled={
                                payArrearsMutation.isPending &&
                                payingArrearId === row.id
                              }
                            >
                              {payArrearsMutation.isPending &&
                              payingArrearId === row.id
                                ? "Ожидание..."
                                : "Оплатить"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {arrearsTotal != null && (
                  <div className="border-t border-border px-6 py-3 text-sm font-medium text-text-primary">
                    Итого к оплате (открытые долги): {formatPrice(arrearsTotal)}
                  </div>
                )}
              </Card>
            </section>
          )}
        </>
      )}

      {/* ── Section 2: Plan Selection & Payment ── */}
      {showPlanSelector && availablePlans.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            {nextAction === "renew" ? "Продлить подписку" : "Выберите тариф"}
          </h2>

          {membershipBlockedByArrears && (
            <Card className="border-border bg-bg-secondary">
              <p className="text-sm text-text-secondary">
                Сначала погасите задолженности по членскому взносу — затем
                станет доступна оплата текущего членского (настройка интерфейса;
                бэкенд может разрешать иначе).
              </p>
            </Card>
          )}

          {showEntryFee && entryFeePlan && (
            <Card className="border-warning/30 bg-warning/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                <div>
                  <p className="font-medium text-text-primary">
                    {!subscription?.has_paid_entry_fee
                      ? "Требуется вступительный взнос"
                      : "Повторный вступительный взнос"}
                  </p>
                  <p className="text-sm text-text-secondary">
                    Вступительный взнос ({formatPrice(entryFeePlan.price)})
                    будет добавлен к оплате автоматически.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availablePlans
              .filter((p) => p.plan_type === "subscription")
              .map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={
                    selectedPlan?.id === plan.id ||
                    (!selectedPlanId && availablePlans[0]?.id === plan.id)
                  }
                  onSelect={() => setSelectedPlanId(plan.id)}
                />
              ))}
          </div>

          {selectedPlan && (
            <Card className="border-accent/20 bg-accent/5">
              <div className="space-y-2">
                {showEntryFee && entryFeePlan && (
                  <>
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>Вступительный взнос</span>
                      <span>{formatPrice(entryFeePlan.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-text-secondary">
                      <span>{selectedPlan.name}</span>
                      <span>{formatPrice(selectedPlan.price)}</span>
                    </div>
                    <div className="border-t border-border pt-2" />
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-text-primary">
                    Итого
                  </span>
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(
                      (showEntryFee ? (entryFeePlan?.price ?? 0) : 0) +
                        selectedPlan.price,
                    )}
                  </span>
                </div>
                <Button
                  className="mt-3 w-full"
                  onClick={() => handlePay(selectedPlan.id)}
                  disabled={
                    payMutation.isPending || membershipBlockedByArrears
                  }
                >
                  {payMutation.isPending
                    ? "Перенаправление на оплату..."
                    : `Оплатить ${formatPrice(
                        (showEntryFee ? (entryFeePlan?.price ?? 0) : 0) +
                          selectedPlan.price,
                      )}`}
                </Button>
              </div>
            </Card>
          )}
        </section>
      )}

      {/* ── Section 3: Payment History ── */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          История платежей
        </h2>
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-bg-secondary/50">
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Дата
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Назначение
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Сумма
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-text-secondary">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border last:border-b-0 hover:bg-bg-secondary/30"
                  >
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {formatShortDate(payment.paid_at ?? payment.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {formatPaymentPurpose(payment)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge
                        status={payment.status}
                        statusLabel={payment.status_label}
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <PaymentRowActions
                        payment={payment}
                        onReceipt={handleReceipt}
                      />
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-sm text-text-muted"
                    >
                      Платежей пока нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}

/* ── Sub-components ── */

function PaymentRowActions({
  payment,
  onReceipt,
}: {
  payment: Payment;
  onReceipt: (id: string) => void;
}) {
  const isPendingExpired =
    payment.expires_at && new Date(payment.expires_at) < new Date();
  const canPay =
    payment.status === "pending" &&
    payment.payment_url &&
    !isPendingExpired;

  if (payment.status === "succeeded") {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-text-secondary"
        onClick={() => onReceipt(payment.id)}
      >
        <Download className="mr-1.5 h-4 w-4" />
        Скачать чек
      </Button>
    );
  }
  if (canPay) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (payment.payment_url) window.location.href = payment.payment_url;
        }}
      >
        Оплатить
      </Button>
    );
  }
  if (payment.status === "pending" && (!payment.payment_url || isPendingExpired)) {
    return (
      <span className="text-sm text-text-muted">
        Срок истёк. Создайте новый платёж
      </span>
    );
  }
  if (payment.status === "expired") {
    return (
      <span className="text-sm text-text-muted">Время оплаты вышло</span>
    );
  }
  return <span className="text-sm text-text-muted">—</span>;
}

function SubscriptionStatusCard({
  subscription,
  currentSub,
  onGoToPay,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscriptionStatus>["data"]>;
  currentSub: NonNullable<
    ReturnType<typeof useSubscriptionStatus>["data"]
  >["current_subscription"];
  onGoToPay: () => void | Promise<void>;
}) {
  if (subscription.next_action === "complete_payment") {
    return (
      <Card className="border-amber-300/30 bg-amber-50/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-text-primary">
                У вас есть незавершённый платёж
              </p>
              <p className="text-sm text-text-secondary">
                Перейдите к оплате или дождитесь завершения обработки.
              </p>
            </div>
          </div>
          <Button size="sm" onClick={onGoToPay}>
            Перейти к оплате
          </Button>
        </div>
      </Card>
    );
  }

  if (currentSub?.status === "active") {
    const startDate = currentSub.starts_at
      ? formatShortDate(currentSub.starts_at)
      : null;
    const endDate = currentSub.ends_at
      ? formatShortDate(currentSub.ends_at)
      : null;
    const daysRemaining = currentSub.days_remaining ?? 0;
    const totalDays =
      currentSub.starts_at && currentSub.ends_at
        ? Math.ceil(
            (new Date(currentSub.ends_at).getTime() -
              new Date(currentSub.starts_at).getTime()) /
              86_400_000,
          )
        : 365;
    const progressPercent = Math.round((daysRemaining / totalDays) * 100);

    return (
      <Card className="border-success/30 bg-success/5">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 shrink-0 text-success" />
            <h2 className="font-heading text-xl font-semibold text-success">
              Подписка активна
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-text-muted">Тариф</p>
              <p className="font-medium text-text-primary">
                {currentSub.plan.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Период</p>
              <p className="font-medium text-text-primary">
                {startDate} — {endDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Осталось</p>
              <p className="font-medium text-text-primary">
                {daysRemaining} дн.
              </p>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-success transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          {subscription.can_renew && (
            <p className="text-sm text-text-secondary">
              Осталось менее 30 дней — вы можете продлить подписку досрочно.
            </p>
          )}
        </div>
      </Card>
    );
  }

  const message = getSubscriptionMessage({
    entry_fee_required: subscription.entry_fee_required,
    entry_fee_exempt: subscription.entry_fee_exempt,
    has_paid_entry_fee: subscription.has_paid_entry_fee,
  });

  return (
    <Card className="border-border">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-text-muted" />
        <div>
          <p className="font-medium text-text-primary">
            Подписка не активна
          </p>
          <p className="mt-1 text-sm text-text-secondary">{message}</p>
        </div>
      </div>
    </Card>
  );
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
}: {
  plan: SubscriptionPlanSchema;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-accent ring-2 ring-accent/30"
          : "hover:border-accent/40"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-text-primary">
            {plan.name}
          </h3>
          <p className="text-sm text-text-muted">{plan.duration_months} мес.</p>
        </div>
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
            isSelected ? "border-accent bg-accent" : "border-border"
          }`}
        >
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white" />
          )}
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-accent">
        {formatPrice(plan.price)}
      </p>
      {plan.duration_months > 0 && (
        <p className="mt-1 text-xs text-text-muted">
          {formatPrice(Math.round(plan.price / plan.duration_months))} / мес.
        </p>
      )}
    </Card>
  );
}
