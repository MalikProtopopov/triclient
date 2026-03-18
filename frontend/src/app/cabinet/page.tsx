"use client";

import Link from "next/link";
import { MapPin, AlertTriangle, RefreshCw, Clock, CreditCard } from "lucide-react";

import { useSubscriptionStatus } from "@/entities/subscription";
import { useProfileEvents } from "@/entities/profile";
import { useEvents } from "@/entities/event";
import { Card, Button, Badge } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate, formatShortDate } from "@/shared/lib/format";

export default function CabinetPage() {
  const { data: subscription } = useSubscriptionStatus();
  const { data: registrations = [] } = useProfileEvents();
  const { data: eventsData } = useEvents({ period: "upcoming", limit: 3 });

  const events = eventsData?.data ?? [];
  const currentSub = subscription?.current_subscription;
  const isActive = currentSub?.status === "active";
  const endDate = currentSub?.ends_at
    ? formatShortDate(currentSub.ends_at)
    : null;

  const nextAction = subscription?.next_action;
  const showEntryFeeBanner =
    nextAction === "pay_entry_fee_and_subscription" ||
    (subscription && !subscription.has_paid_entry_fee);
  const showRenewBanner = nextAction === "renew";
  const showPendingPaymentBanner = nextAction === "complete_payment";
  const showPaySubscriptionBanner = nextAction === "pay_subscription";

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Личный кабинет
      </h1>

      {showEntryFeeBanner && (
        <Card className="relative overflow-hidden border-warning/30 bg-warning/5 pl-6">
          <div
            className="absolute left-0 top-0 h-full w-1 bg-warning"
            aria-hidden
          />
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
            <Link href={ROUTES.CABINET_PAYMENTS}>
              <Button size="sm">Оплатить</Button>
            </Link>
          </div>
        </Card>
      )}

      {showRenewBanner && (
        <Card className="relative overflow-hidden border-accent/30 bg-accent/5 pl-6">
          <div
            className="absolute left-0 top-0 h-full w-1 bg-accent"
            aria-hidden
          />
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 shrink-0 text-accent" />
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Продлите подписку
              </p>
              <p className="text-sm text-text-secondary">
                Срок вашей подписки истёк
              </p>
            </div>
            <Link href={ROUTES.CABINET_PAYMENTS}>
              <Button size="sm">Продлить</Button>
            </Link>
          </div>
        </Card>
      )}

      {showPaySubscriptionBanner && (
        <Card className="relative overflow-hidden border-accent/30 bg-accent/5 pl-6">
          <div
            className="absolute left-0 top-0 h-full w-1 bg-accent"
            aria-hidden
          />
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 shrink-0 text-accent" />
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Оформите подписку
              </p>
              <p className="text-sm text-text-secondary">
                Для доступа ко всем функциям необходимо оформить подписку
              </p>
            </div>
            <Link href={ROUTES.CABINET_PAYMENTS}>
              <Button size="sm">Оформить</Button>
            </Link>
          </div>
        </Card>
      )}

      {showPendingPaymentBanner && (
        <Card className="relative overflow-hidden border-amber-300/30 bg-amber-50/50 pl-6">
          <div
            className="absolute left-0 top-0 h-full w-1 bg-amber-400"
            aria-hidden
          />
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="flex-1">
              <p className="font-medium text-text-primary">
                Незавершённый платёж
              </p>
              <p className="text-sm text-text-secondary">
                Дождитесь завершения обработки платежа
              </p>
            </div>
          </div>
        </Card>
      )}

      {isActive && endDate && (
        <Card className="relative overflow-hidden bg-success/5 pl-6">
          <div
            className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-accent/70"
            aria-hidden
          />
          <p className="text-lg font-medium text-success">
            Подписка активна до {endDate}
          </p>
        </Card>
      )}

      {/* My Registrations */}
      {registrations.length > 0 && (
        <section>
          <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
            Мои регистрации
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-bg-secondary">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Мероприятие
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Дата
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Тариф
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr
                    key={reg.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 text-sm text-text-primary">
                      <Link
                        href={ROUTES.EVENT(reg.event_slug)}
                        className="hover:text-accent hover:underline"
                      >
                        {reg.event_title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {formatDate(reg.event_date)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">
                      {reg.tariff_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          reg.status === "confirmed"
                            ? "success"
                            : reg.status === "cancelled"
                              ? "error"
                              : "warning"
                        }
                      >
                        {reg.status === "confirmed"
                          ? "Подтверждено"
                          : reg.status === "cancelled"
                            ? "Отменено"
                            : "Ожидает"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
          Ближайшие мероприятия
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} hover className="overflow-hidden p-0">
              <div className="aspect-video w-full bg-gradient-to-br from-metal-light to-accent/20" />
              <div className="p-4">
                <p className="mb-1 text-sm text-text-muted">
                  {formatDate(event.event_date)}
                </p>
                <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary">
                  {event.title}
                </h3>
                <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{event.location}</span>
                </div>
                <Link href={ROUTES.EVENT(event.slug)}>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-4">
          <Link href={ROUTES.EVENTS}>
            <Button variant="secondary">Все мероприятия</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
