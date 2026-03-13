"use client";

import { Download, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  useSubscriptionStatus,
  useSubscriptionPlans,
  useSubscriptionPayMutation,
} from "@/entities/subscription";
import { usePayments, paymentApi } from "@/entities/payment";
import type { ApiError } from "@/entities/auth";
import { Card, Button, PaymentStatusBadge } from "@/shared/ui";
import { formatShortDate, formatPrice } from "@/shared/lib/format";
import { ROUTES } from "@/shared/config";

export default function PaymentsPage() {
  const { data: subscription } = useSubscriptionStatus();
  const { data: paymentsData } = usePayments();
  const { data: plans } = useSubscriptionPlans();
  const payMutation = useSubscriptionPayMutation();

  const payments = paymentsData?.data ?? [];
  const currentSub = subscription?.current_subscription;
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

  const availablePlans = plans?.filter((p) => p.is_available) ?? [];

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

  const handleReceipt = async (paymentId: string) => {
    try {
      const data = await paymentApi.getReceipt(paymentId);
      window.open(data.receipt_url, "_blank");
    } catch {
      toast.error("Не удалось получить чек");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Оплаты и подписка
      </h1>

      {/* Entry Fee Banner */}
      {subscription && !subscription.has_paid_entry_fee && (
        <Card className="border-warning/30 bg-warning/5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Оплатите вступительный взнос
              </p>
              <p className="text-sm text-text-secondary">
                Для активации членства необходимо оплатить вступительный взнос
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Subscription Status Card */}
      {currentSub?.status === "active" && (
        <Card className="border-success/30 bg-success/5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-success">
                Подписка активна
              </h2>
              {subscription?.can_renew && (
                <Button
                  size="sm"
                  onClick={() => {
                    const plan = availablePlans[0];
                    if (plan) handlePay(plan.id);
                  }}
                  disabled={payMutation.isPending}
                >
                  Продлить подписку
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

      {/* Available Plans */}
      {availablePlans.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
            Тарифы
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availablePlans.map((plan) => (
              <Card key={plan.id} className="flex flex-col justify-between">
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
                  onClick={() => handlePay(plan.id)}
                  disabled={payMutation.isPending}
                >
                  {payMutation.isPending ? "Перенаправление..." : "Оплатить"}
                </Button>
              </Card>
            ))}
          </div>
        </section>
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
                    {formatShortDate(payment.created_at)}
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
                    {payment.receipt_url ? (
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
