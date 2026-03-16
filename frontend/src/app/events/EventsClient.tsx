"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

import { useEvents } from "@/entities/event";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Badge, SkeletonCard, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import { formatDate } from "@/shared/lib/format";

export default function EventsClient() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const { data, isLoading } = useEvents({ period: activeTab });
  const events = data?.data ?? [];
  const [featuredEvent, ...restEvents] = events;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        {/* Шапка страницы */}
        <div className="border-b border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Ассоциация трихологов
            </p>
            <h1 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
              Мероприятия
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
          {/* Табы */}
          <div className="mb-10 flex gap-1 self-start rounded-xl border border-border bg-bg-secondary p-1 w-fit">
            {(["upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200",
                  activeTab === tab
                    ? "bg-accent text-accent-contrast shadow-sm"
                    : "text-text-secondary hover:text-text-primary",
                )}
              >
                {tab === "upcoming" ? "Предстоящие" : "Прошедшие"}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              title={activeTab === "upcoming" ? "Нет предстоящих мероприятий" : "Нет прошедших мероприятий"}
              description="Следите за обновлениями — скоро появятся новые события"
            />
          ) : (
            <div className="space-y-4">
              {/* Главное мероприятие */}
              {featuredEvent && activeTab === "upcoming" && (
                <Link href={ROUTES.EVENT(featuredEvent.slug)}>
                  <div className="group relative overflow-hidden rounded-2xl bg-[#4a4a4a] p-8 transition-all duration-300 hover:shadow-xl lg:p-10">
                    <div
                      className="pointer-events-none absolute right-0 top-0 h-full w-2/5 opacity-20"
                      style={{ background: "linear-gradient(to left, #edbecc, transparent)" }}
                    />
                    <div className="relative grid gap-6 lg:grid-cols-[120px_1fr_auto] lg:items-center">
                      {/* Дата */}
                      <div className="hidden lg:block">
                        <div className="font-heading text-7xl font-bold leading-none text-white/20">
                          {new Date(featuredEvent.event_date).getDate()}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-wider text-white/40">
                          {new Date(featuredEvent.event_date).toLocaleDateString("ru", { month: "long" })}
                        </div>
                      </div>

                      <div>
                        <span
                          className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-[#4a4a4a]"
                          style={{ background: "#edbecc" }}
                        >
                          Ближайшее
                        </span>
                        <h2 className="font-heading text-xl font-bold text-white lg:text-2xl">
                          {featuredEvent.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/50">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(featuredEvent.event_date)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {featuredEvent.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {featuredEvent.tariffs.length > 0 && (
                          <div className="text-right">
                            <div className="text-xs text-white/40">для членов от</div>
                            <div className="font-heading text-2xl font-bold text-white">
                              {Math.min(...featuredEvent.tariffs.map((t) => t.member_price)).toLocaleString("ru")} ₽
                            </div>
                          </div>
                        )}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-[#edbecc] group-hover:text-[#4a4a4a] text-white">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Остальные */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(activeTab === "upcoming" ? restEvents : events).map((event) => {
                  const minPrice = event.tariffs.length
                    ? Math.min(...event.tariffs.map((t) => t.price))
                    : null;

                  return (
                    <Link key={event.id} href={ROUTES.EVENT(event.slug)}>
                      <div className="group h-full overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-300 hover:border-accent/40 hover:shadow-md">
                        {/* Cover */}
                        <div className="relative aspect-video w-full overflow-hidden">
                          {event.cover_image_url ? (
                            <Image
                              src={event.cover_image_url}
                              alt={event.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-border-light to-accent/20" />
                          )}
                        </div>
                        <div className="p-5">
                          <p className="mb-1.5 text-xs text-text-muted">
                            {formatDate(event.event_date)}
                          </p>
                          <h3 className="mb-2 font-heading text-base font-semibold leading-snug text-text-primary line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="mb-3 flex items-center gap-1.5 text-xs text-text-muted">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            {event.status === "upcoming" && minPrice !== null ? (
                              <span className="text-xs font-medium text-text-primary">
                                от {minPrice.toLocaleString("ru")} ₽
                              </span>
                            ) : (
                              <Badge variant="muted">Завершено</Badge>
                            )}
                            <span className="text-xs text-text-muted transition-colors group-hover:text-text-primary">
                              Подробнее →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
