"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { useEventRegistrations } from "@/entities/profile";
import type { EventRegistrationItem } from "@/entities/profile";
import { useEvents } from "@/entities/event";
import { Card, Button, Badge, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate, formatPrice } from "@/shared/lib/format";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Подтверждено",
  pending: "Ожидает",
  cancelled: "Отменено",
};

const STATUS_VARIANTS: Record<string, "success" | "warning" | "error"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "error",
};

function canPayRegistrationRow(
  payment: EventRegistrationItem["payment"],
): boolean {
  if (!payment || payment.status !== "pending" || !payment.payment_url) {
    return false;
  }
  if (payment.expires_at) {
    return new Date(payment.expires_at) > new Date();
  }
  return true;
}

function registrationAmount(row: EventRegistrationItem): number {
  if (row.payment?.amount != null) return row.payment.amount;
  return row.tariff.applied_price;
}

export default function CabinetEventsPage() {
  const { data: regResponse, isLoading: regLoading } = useEventRegistrations({
    params: { limit: 50, offset: 0 },
  });
  const { data: eventsData } = useEvents({ period: "upcoming", limit: 3 });
  const events = eventsData?.data ?? [];

  const registrationRows = regResponse?.data ?? [];

  return (
    <div className="space-y-10">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Мероприятия
      </h1>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-primary">
            Предстоящие мероприятия
          </h2>
          <Link
            href={ROUTES.EVENTS}
            className="text-sm font-medium text-accent hover:underline"
          >
            Все мероприятия
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden p-0">
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
                <h3 className="mb-2 font-medium text-text-primary">
                  {event.title}
                </h3>
                <div className="mb-3 flex items-center gap-2 text-sm text-text-secondary">
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
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium text-text-primary">
          Мои регистрации
        </h2>
        {regLoading ? (
          <p className="text-sm text-text-muted">Загрузка…</p>
        ) : registrationRows.length === 0 ? (
          <EmptyState
            title="Нет регистраций"
            description="Вы ещё не записались ни на одно мероприятие"
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-bg-secondary">
            <table className="w-full min-w-[720px]">
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
                    Сумма
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-text-secondary">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-text-secondary">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrationRows.map((row) => {
                  const reg = row.registration;
                  const ev = row.event;
                  const tariff = row.tariff;
                  const payment = row.payment;
                  const status = reg.status;
                  const amount = registrationAmount(row);
                  const showMemberBadge = tariff.is_member_price;
                  const pay = canPayRegistrationRow(payment);

                  return (
                    <tr
                      key={reg.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 text-sm text-text-primary">
                        <Link
                          href={ROUTES.EVENT(ev.slug)}
                          className="hover:text-accent hover:underline"
                        >
                          {ev.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {formatDate(ev.event_date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-secondary">
                        {tariff.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-primary">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {formatPrice(amount)}
                          </span>
                          {showMemberBadge && (
                            <Badge variant="success" className="text-xs">
                              Членская цена
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={STATUS_VARIANTS[status] ?? "warning"}
                        >
                          {STATUS_LABELS[status] ?? status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {pay && payment?.payment_url ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = payment.payment_url;
                              if (url) window.location.href = url;
                            }}
                          >
                            Оплатить
                          </Button>
                        ) : (
                          <span className="text-sm text-text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
