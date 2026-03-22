"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock,
  CreditCard,
} from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useSubscriptionStatus } from "@/entities/subscription";
import { useProfileEvents } from "@/entities/profile";
import { useEvents } from "@/entities/event";
import { Card, Button, Badge } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate, formatShortDate, formatPrice } from "@/shared/lib/format";

export default function CabinetPage() {
  const { user } = useAuth();
  const isDoctor = user?.role === "doctor";

  const { data: subscription } = useSubscriptionStatus({
    enabled: isDoctor,
  });
  const { data: registrations = [] } = useProfileEvents();
  const { data: eventsData } = useEvents({ period: "upcoming", limit: 3 });

  const events = eventsData?.data ?? [];

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Личный кабинет
      </h1>

      {isDoctor && subscription && (
        <SubscriptionWidget subscription={subscription} />
      )}

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
                    key={reg.registration_id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 text-sm text-text-primary">
                      <Link
                        href={ROUTES.EVENT(reg.event_slug)}
                        className="hover:text-accent hover:underline"
                      >
                        {reg.title}
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

      <section>
        <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
          Ближайшие мероприятия
        </h2>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} hover className="overflow-hidden p-0">
              <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-metal-light to-accent/20">
                {event.cover_image_url ? (
                  <Image
                    src={event.cover_image_url}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : null}
              </div>
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

/* ── Subscription Widget ── */

type SubStatus = NonNullable<ReturnType<typeof useSubscriptionStatus>["data"]>;

function SubscriptionWidget({ subscription }: { subscription: SubStatus }) {
  const currentSub = subscription.current_subscription;
  const nextAction = subscription.next_action;
  const isActive = currentSub?.status === "active";

  if (nextAction === "complete_payment") {
    return (
      <Card className="relative overflow-hidden border-amber-300/30 bg-amber-50/50 pl-6">
        <div
          className="absolute left-0 top-0 h-full w-1 bg-amber-400"
          aria-hidden
        />
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="font-medium text-text-primary">
              У вас есть незавершённый платёж
            </p>
            <p className="text-sm text-text-secondary">
              Перейдите к оплате или дождитесь завершения обработки
            </p>
          </div>
          <Link href={ROUTES.CABINET_PAYMENTS}>
            <Button size="sm">Перейти к оплате</Button>
          </Link>
        </div>
      </Card>
    );
  }

  if (isActive && currentSub) {
    const endDate = formatShortDate(currentSub.ends_at);
    const daysRemaining = currentSub.days_remaining ?? 0;

    return (
      <Card className="relative overflow-hidden border-success/30 bg-success/5 pl-6">
        <div
          className="absolute left-0 top-0 h-full w-1 bg-success"
          aria-hidden
        />
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 shrink-0 text-success" />
          <div className="flex-1">
            <p className="font-medium text-success">
              Подписка активна до {endDate}
            </p>
            <p className="text-sm text-text-secondary">
              {currentSub.plan.name} — осталось {daysRemaining} дн.
            </p>
          </div>
          {subscription.can_renew && (
            <Link href={ROUTES.CABINET_PAYMENTS}>
              <Button size="sm">Продлить</Button>
            </Link>
          )}
        </div>
      </Card>
    );
  }

  const { label, description, buttonText, accentColor, Icon } =
    getActionConfig(subscription);

  return (
    <Card
      className={`relative overflow-hidden border-${accentColor}/30 bg-${accentColor}/5 pl-6`}
    >
      <div
        className={`absolute left-0 top-0 h-full w-1 bg-${accentColor}`}
        aria-hidden
      />
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 shrink-0 text-${accentColor}`} />
        <div className="flex-1">
          <p className="font-medium text-text-primary">{label}</p>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <Link href={ROUTES.CABINET_PAYMENTS}>
          <Button size="sm">{buttonText}</Button>
        </Link>
      </div>
    </Card>
  );
}

function getActionConfig(subscription: SubStatus) {
  const nextAction = subscription.next_action;

  if (nextAction === "pay_entry_fee_and_subscription") {
    const total =
      (subscription.entry_fee_plan?.price ?? 0) +
      (subscription.available_plans[0]?.price ?? 0);
    return {
      label: "Оплатите вступительный и членский взнос",
      description: `Для активации членства — ${formatPrice(total)}`,
      buttonText: "Оплатить",
      accentColor: "warning",
      Icon: AlertTriangle,
    };
  }

  if (nextAction === "renew") {
    return {
      label: "Продлите подписку",
      description: "Срок вашей подписки истёк",
      buttonText: "Продлить",
      accentColor: "accent",
      Icon: CreditCard,
    };
  }

  return {
    label: "Оформите подписку",
    description: "Для доступа ко всем функциям необходимо оформить подписку",
    buttonText: "Оформить",
    accentColor: "accent",
    Icon: CreditCard,
  };
}
