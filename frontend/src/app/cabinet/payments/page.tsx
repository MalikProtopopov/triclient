"use client";

import { useState } from "react";
import { Download, AlertTriangle, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  useSubscriptionStatus,
  useSubscriptionPayMutation,
} from "@/entities/subscription";
import type { SubscriptionPlanSchema } from "@/entities/subscription";
import { usePayments, paymentApi } from "@/entities/payment";
import type { ApiError } from "@/entities/auth";
import { Card, Button, PaymentStatusBadge } from "@/shared/ui";
import { formatShortDate, formatPrice } from "@/shared/lib/format";

export default function PaymentsPage() {
  const { data: subscription } = useSubscriptionStatus();
  const { data: paymentsData } = usePayments();
  const payMutation = useSubscriptionPayMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const payments = paymentsData?.data ?? [];
  const currentSub = subscription?.current_subscription;
  const nextAction = subscription?.next_action;
  const entryFeePlan = subscription?.entry_fee_plan;
  const availablePlans = subscription?.available_plans ?? [];

  const startDate = currentSub?.starts_at
    ? formatShortDate(currentSub.starts_at)
    : null;
  const endDate = currentSub?.ends_at
    ? formatShortDate(currentSub.ends_at)
    : null;
  const daysRemaining = currentSub?.days_remaining ?? 0;
  const totalDays =
    currentSub?.starts_at && currentSub?.ends_at
      ? Math.ceil(
          (new Date(currentSub.ends_at).getTime() -
            new Date(currentSub.starts_at).getTime()) /
            86_400_000,
        )
      : 365;
  const progressPercent = Math.round((daysRemaining / totalDays) * 100);

  const handlePay = (planId: string) => {
    payMutation.mutate(
      { plan_id: planId, idempotency_key: crypto.randomUUID() },
      {
        onSuccess: (data) => {
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

  const handleEntryFeeAndSubscription = () => {
    if (!entryFeePlan) return;
    handlePay(entryFeePlan.id);
  };

  const handleReceipt = async (paymentId: string) => {
    try {
      const blob = await paymentApi.getReceipt(paymentId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 404) {
        toast.info("Чек формируется, попробуйте позже (1–30 мин)");
      } else {
        toast.error("Не удалось получить чек");
      }
    }
  };

  const renderEntryFeeTotal = () => {
    if (!entryFeePlan) return null;
    const subPlan = selectedPlanId
      ? availablePlans.find((p) => p.id === selectedPlanId)
      : availablePlans[0];
    const total = entryFeePlan.price + (subPlan?.price ?? 0);
    return (
      <Card className="border-warning/30 bg-warning/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="flex-1 space-y-3">
            <div>
              <p className="font-medium text-text-primary">
                Оплатите вступительный взнос и подписку
              </p>
              <p className="text-sm text-text-secondary">
                Для активации членства необходимо оплатить вступительный взнос и
                подписку одним платежом.
              </p>
            </div>
            <div className="space-y-1 text-sm text-text-secondary">
              <p>
                Вступительный взнос: {formatPrice(entryFeePlan.price)}
              </p>
              {subPlan && (
                <p>
                  Подписка ({subPlan.name}): {formatPrice(subPlan.price)}
                </p>
              )}
              <p className="text-base font-semibold text-text-primary">
                Итого: {formatPrice(total)}
              </p>
            </div>
            <Button
              onClick={handleEntryFeeAndSubscription}
              disabled={payMutation.isPending}
            >
              {payMutation.isPending ? "Перенаправление..." : "Оплатить"}
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  const renderPlansSection = (
    title: string,
    plans: SubscriptionPlanSchema[],
    buttonLabel: string,
  ) =>
    plans.length > 0 && (
      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
          {title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`flex flex-col justify-between ${
                selectedPlanId === plan.id
                  ? "border-accent ring-1 ring-accent"
                  : ""
              }`}
              onClick={() => setSelectedPlanId(plan.id)}
            >
              <div>
                <h3 className="mb-1 font-heading text-lg font-semibold text-text-primary">
                  {plan.name}
                </h3>
                <p className="mb-3 text-sm text-text-secondary">
                  {plan.description}
                </p>
                <p className="mb-1 text-2xl font-bold text-accent">
                  {formatPrice(plan.price)}
                </p>
                <p className="text-xs text-text-muted">
                  {plan.duration_months} мес.
                </p>
              </div>
              <Button
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePay(plan.id);
                }}
                disabled={payMutation.isPending}
              >
                {payMutation.isPending ? "Перенаправление..." : buttonLabel}
              </Button>
            </Card>
          ))}
        </div>
      </section>
    );

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Оплаты и подписка
      </h1>

      {/* Complete payment warning */}
      {nextAction === "complete_payment" && (
        <Card className="border-amber-300/30 bg-amber-50/50">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Есть незавершённый платёж
              </p>
              <p className="text-sm text-text-secondary">
                Дождитесь завершения обработки предыдущего платежа или попробуйте
                снова.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Entry fee + subscription combined */}
      {nextAction === "pay_entry_fee_and_subscription" &&
        renderEntryFeeTotal()}

      {/* Pay subscription only */}
      {nextAction === "pay_subscription" &&
        renderPlansSection(
          "Выберите тариф подписки",
          availablePlans.filter((p) => p.plan_type === "subscription"),
          "Оплатить",
        )}

      {/* Renew */}
      {nextAction === "renew" && (
        <>
          <Card className="border-accent/30 bg-accent/5">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 shrink-0 text-accent" />
              <p className="text-text-primary">
                Срок вашей подписки истёк. Продлите для доступа к сервисам.
              </p>
            </div>
          </Card>
          {renderPlansSection(
            "Продлить подписку",
            availablePlans.filter((p) => p.plan_type === "subscription"),
            "Продлить",
          )}
        </>
      )}

      {/* Active subscription */}
      {currentSub?.status === "active" && (
        <Card className="border-success/30 bg-success/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-success">
                Подписка активна
              </h2>
              {subscription?.can_renew &&
                nextAction === null &&
                availablePlans.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => handlePay(availablePlans[0].id)}
                    disabled={payMutation.isPending}
                  >
                    Продлить досрочно
                  </Button>
                )}
            </div>
            <p className="text-text-primary">{currentSub.plan.name}</p>
            <p className="text-sm text-text-secondary">
              {startDate} — {endDate}
            </p>
            <p className="text-sm font-medium text-text-primary">
              {daysRemaining} дней осталось
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-bg">
              <div
                className="h-full rounded-full bg-success transition-all duration-300"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Transactions Table */}
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
                  Чек
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
                    {payment.description}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {formatPrice(payment.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {payment.status === "succeeded" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-secondary"
                        onClick={() => handleReceipt(payment.id)}
                      >
                        <Download className="mr-1.5 h-4 w-4" />
                        Скачать чек
                      </Button>
                    ) : (
                      <span className="text-sm text-text-muted">—</span>
                    )}
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
    </div>
  );
}
