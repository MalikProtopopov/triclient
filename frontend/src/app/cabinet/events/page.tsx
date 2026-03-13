"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

import { useProfileEvents } from "@/entities/profile";
import { useEvents } from "@/entities/event";
import { Card, Button, Badge, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";

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

export default function CabinetEventsPage() {
  const { data: registrations = [] } = useProfileEvents();
  const { data: eventsData } = useEvents({ period: "upcoming", limit: 3 });
  const events = eventsData?.data ?? [];

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
              <div className="aspect-video w-full bg-gradient-to-br from-metal-light to-accent/20" />
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
        {registrations.length === 0 ? (
          <EmptyState
            title="Нет регистраций"
            description="Вы ещё не записались ни на одно мероприятие"
          />
        ) : (
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
                        variant={STATUS_VARIANTS[reg.status] ?? "warning"}
                      >
                        {STATUS_LABELS[reg.status] ?? reg.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
