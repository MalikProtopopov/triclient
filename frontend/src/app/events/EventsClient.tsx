"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useEvents } from "@/entities/event";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Badge, SkeletonCard, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import { formatDate } from "@/shared/lib/format";
import { useGSAP } from "@/shared/lib/useGSAP";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EventsClient() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const contentRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useEvents({ period: activeTab });
  const events = data?.data ?? [];
  const [featuredEvent, ...restEvents] = events;

  useEffect(() => {
    if (!contentRef.current || isLoading || events.length === 0) return;
    const cards = contentRef.current.querySelectorAll("[data-event-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  }, [events, isLoading, activeTab]);

  const headerRef = useGSAP((_ctx, el) => {
    gsap.fromTo(
      el.querySelectorAll("[data-hero-text]"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
    );
  });

  const handleTab = (tab: "upcoming" | "past") => {
    if (tab === activeTab) return;
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setActiveTab(tab);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          );
        },
      });
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        <div ref={headerRef} className="border-b border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
            <p data-hero-text className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Ассоциация трихологов
            </p>
            <h1 data-hero-text className="font-heading text-4xl font-bold text-text-primary lg:text-5xl xl:text-6xl">
              Мероприятия
            </h1>
            <p data-hero-text className="mt-4 max-w-xl text-text-secondary">
              Конференции, семинары и образовательные события для врачей-трихологов
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="mb-10 flex gap-1 self-start rounded-xl border border-border bg-bg-secondary p-1 w-fit">
            {(["upcoming", "past"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTab(tab)}
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

          <div ref={contentRef}>
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
              <div className="space-y-6">
                {/* Featured event - cinematic card */}
                {featuredEvent && activeTab === "upcoming" && (
                  <Link href={ROUTES.EVENT(featuredEvent.slug)} data-event-card>
                    <div className="group relative min-h-[320px] overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl lg:min-h-[400px]">
                      {featuredEvent.cover_image_url ? (
                        <Image
                          src={featuredEvent.cover_image_url}
                          alt={featuredEvent.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          sizes="100vw"
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-[#5BB5A2]/20" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8 lg:min-h-[400px] lg:p-12">
                        <div className="max-w-2xl">
                          <span className="mb-4 inline-block rounded-lg bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                            Ближайшее
                          </span>
                          <h2 className="font-heading text-2xl font-bold text-white lg:text-4xl">
                            {featuredEvent.title}
                          </h2>
                          <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-white/70">
                            <span className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(featuredEvent.event_date)}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {featuredEvent.location}
                            </span>
                          </div>
                          {featuredEvent.tariffs.length > 0 && (
                            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                              <span className="text-xs text-white/60">для членов от</span>
                              <span className="font-heading text-xl font-bold text-white">
                                {Math.min(...featuredEvent.tariffs.map((t) => t.member_price)).toLocaleString("ru")} ₽
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-accent group-hover:scale-110 lg:right-10 lg:top-10">
                          <ArrowUpRight className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid events */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {(activeTab === "upcoming" ? restEvents : events).map((event) => {
                    const minPrice = event.tariffs.length
                      ? Math.min(...event.tariffs.map((t) => t.price))
                      : null;

                    return (
                      <div key={event.id} data-event-card>
                        <Link href={ROUTES.EVENT(event.slug)}>
                          <div className="group h-full overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                            <div className="relative aspect-video w-full overflow-hidden">
                              {event.cover_image_url ? (
                                <Image
                                  src={event.cover_image_url}
                                  alt={event.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-accent/15 to-[#5BB5A2]/10" />
                              )}
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                            <div className="p-5">
                              <p className="mb-2 text-xs text-text-muted">
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
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 transition-all duration-300 group-hover:bg-accent">
                                  <ArrowUpRight className="h-3.5 w-3.5 text-accent transition-colors group-hover:text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
