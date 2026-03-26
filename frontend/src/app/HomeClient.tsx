"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Calendar, MapPin, Star, Users, BookOpen } from "lucide-react";

import { useEvents } from "@/entities/event";
import { useArticles } from "@/entities/article";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";
import { useAuth, shouldSkipClientOnboarding } from "@/providers/AuthProvider";
import { useGSAP } from "@/shared/lib/useGSAP";
import { staggerReveal, gsap } from "@/shared/lib/animations";

const BENEFITS = [
  "Публикация в каталоге верифицированных врачей",
  "Доступ к закрытому профессиональному чату",
  "Льготные цены на конференции и семинары",
  "Именной сертификат члена ассоциации",
];

const STATS = [
  { num: "500+", label: "членов" },
  { num: "14", label: "лет работы" },
  { num: "XXII", label: "конференции" },
  { num: "EHRS", label: "международный партнёр" },
];

const HOME_MISSION = [
  {
    num: "01",
    icon: Star,
    title: "Стандарты качества",
    desc: "Строгая сертификация и контроль квалификации. Только верифицированные специалисты попадают в открытый каталог.",
    metric: "500+",
    metricLabel: "врачей в каталоге",
    tag: "Сертификация",
  },
  {
    num: "02",
    icon: Users,
    title: "Профессиональное сообщество",
    desc: "Закрытый Telegram-канал, обмен клиническими случаями, профессиональная поддержка коллег.",
    metric: "14",
    metricLabel: "лет объединяем врачей",
    tag: "Сообщество",
  },
  {
    num: "03",
    icon: BookOpen,
    title: "Образование и развитие",
    desc: "Ежегодные конференции, семинары и вебинары по льготным ценам. Доступ к записям и мастер-классам.",
    metric: "30+",
    metricLabel: "городов присутствия",
    tag: "Обучение",
  },
];

function HomeMissionSection() {
  const ref = useGSAP((_ctx, el) => {
    staggerReveal("[data-hm-card]", el, { y: 36, stagger: 0.12, duration: 0.65 });
  });

  return (
    <section
      ref={ref}
      className="border-t border-border bg-bg-secondary/60 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,20rem)_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10 bg-accent/60"
                aria-hidden
              />
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-text-muted">
                01 · Миссия
              </p>
            </div>
            <h2 className="mt-5 max-w-[14ch] font-heading text-[1.65rem] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary sm:text-3xl lg:text-[2rem]">
              Зачем нужна ассоциация
            </h2>
            <Link
              href={ROUTES.DOCUMENTS}
              className="mt-6 inline-flex text-sm font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
            >
              Документы организации
            </Link>
          </div>

          <div className="min-w-0">
            {HOME_MISSION.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  data-hm-card
                  className="grid gap-6 border-t border-border py-10 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[auto_1fr] sm:gap-8 lg:grid-cols-[3.5rem_1fr_minmax(0,9.5rem)] lg:items-start lg:gap-10"
                >
                  <div className="flex flex-row items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <span
                      className="font-mono text-[13px] font-medium tabular-nums text-accent"
                      aria-hidden
                    >
                      {item.num}
                    </span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-bg text-text-secondary">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="font-heading text-lg font-semibold text-text-primary lg:text-xl">
                        {item.title}
                      </h3>
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
                        {item.tag}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary lg:text-[15px]">
                      {item.desc}
                    </p>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-border lg:pl-8">
                    <p className="font-heading text-2xl font-bold tabular-nums tracking-tight text-text-primary lg:text-[1.65rem]">
                      {item.metric}
                    </p>
                    <p className="mt-1 max-w-[12rem] text-xs leading-snug text-text-muted">
                      {item.metricLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeClient() {
  const { isAuthenticated, user } = useAuth();
  const isOnboarded =
    isAuthenticated &&
    !!user?.onboarding &&
    shouldSkipClientOnboarding(user.onboarding);
  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    period: "upcoming",
    limit: 4,
  });
  const { data: articlesData } = useArticles({ limit: 3 });

  const events = eventsData?.data ?? [];
  const articles = articlesData?.data ?? [];
  const [featuredEvent, ...restEvents] = events;

  const heroRef = useGSAP((_ctx, el) => {
    staggerReveal("[data-hero-text]", el, { y: 40, stagger: 0.12, duration: 0.7, start: "top 95%" });
    const orb = el.querySelector("[data-orb]");
    // Без scale/elastic: иначе + backdrop-filter на потомках дают мерцание при загрузке
    if (orb) gsap.fromTo(orb, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.15 });
    staggerReveal("[data-stat-card]", el, { y: 24, stagger: 0.08, duration: 0.5, start: "top 95%" });
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">

        {/* ══════════ HERO ══════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 15% 60%, rgba(232,99,139,0.09) 0%, transparent 100%),
              radial-gradient(ellipse 60% 80% at 78% 20%, rgba(91,181,162,0.08) 0%, transparent 100%),
              radial-gradient(ellipse 50% 50% at 50% 100%, rgba(232,99,139,0.04) 0%, transparent 100%),
              #ffffff
            `,
          }}
        >
          <div className="mx-auto max-w-7xl px-4 pt-20 pb-8 lg:px-8 lg:pt-28 lg:pb-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_380px]">
              {/* Text */}
              <div>
                <div data-hero-text>
                  <span className="inline-block rounded-full border border-accent/20 bg-accent/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                    Профессиональное сообщество · с 2012
                  </span>
                </div>
                <h1
                  data-hero-text
                  className="mt-6 font-heading text-5xl font-extrabold leading-[1.05] text-text-primary lg:text-7xl xl:text-[82px]"
                >
                  Профессиональное общество<br />
                  <span className="text-accent">Трихологов</span>
                </h1>
                <p
                  data-hero-text
                  className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary lg:text-lg"
                >
                  Объединяем врачей-дерматологов, трихологов и специалистов по
                  здоровью волос. Сертификация, конференции и интеграция через EHRS.
                </p>
                <div data-hero-text className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                    <button className="group inline-flex items-center gap-3 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-accent-contrast shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
                      {isOnboarded ? "Перейти в кабинет" : "Стать членом"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href={ROUTES.DOCTORS}>
                    <button className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-text-primary transition-all duration-300 hover:border-accent/40 hover:bg-accent/5">
                      Каталог врачей
                    </button>
                  </Link>
                </div>
              </div>

              {/* 3D Glass Orb */}
              <div data-orb className="hidden lg:block">
                <div className="relative" style={{ width: 360, height: 360 }}>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full blur-[60px]"
                    style={{ background: "radial-gradient(circle, rgba(232,99,139,0.25) 0%, rgba(91,181,162,0.15) 50%, transparent 70%)" }}
                  />
                  <div className="animate-orb-float absolute inset-[20px]">
                    <div
                      className="relative h-full w-full rounded-full"
                      style={{
                        background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(232,99,139,0.15) 35%, rgba(91,181,162,0.12) 60%, rgba(232,99,139,0.08) 100%)",
                        boxShadow: "0 8px 60px rgba(232,99,139,0.2), 0 2px 20px rgba(91,181,162,0.15), inset 0 -8px 30px rgba(232,99,139,0.12), inset 0 8px 30px rgba(255,255,255,0.8)",
                        border: "1px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      <div
                        className="absolute inset-[25px] rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 40% 32%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.18) 42%, transparent 68%)",
                          boxShadow:
                            "inset 0 4px 20px rgba(255,255,255,0.4), inset 0 -4px 15px rgba(232,99,139,0.08)",
                        }}
                      />
                      <div
                        className="absolute left-[18%] top-[12%] h-[30%] w-[35%] rounded-full"
                        style={{
                          background: "radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 70%)",
                          transform: "rotate(-15deg)",
                        }}
                      />
                      <div
                        className="animate-orb-pulse absolute bottom-[15%] left-[10%] h-[20%] w-[60%] rounded-full"
                        style={{ background: "radial-gradient(ellipse, rgba(91,181,162,0.2) 0%, transparent 70%)" }}
                      />
                      <div className="pointer-events-none absolute inset-[10%] z-[4]">
                        <Image
                          src="/hero-russia-map.png"
                          alt=""
                          fill
                          className="object-contain object-center opacity-[0.32] mix-blend-multiply"
                          sizes="280px"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="animate-orb-dot absolute left-0 top-1/4 h-3 w-3 rounded-full" style={{ background: "#E8638B", opacity: 0.6 }} />
                  <div className="animate-orb-dot absolute right-4 top-8 h-2 w-2 rounded-full" style={{ background: "#5BB5A2", opacity: 0.5, animationDelay: "1s" }} />
                  <div className="animate-orb-dot absolute bottom-8 left-12 h-2.5 w-2.5 rounded-full" style={{ background: "#E8638B", opacity: 0.4, animationDelay: "2s" }} />
                  <div className="animate-orb-dot absolute bottom-1/4 right-0 h-2 w-2 rounded-full" style={{ background: "#5BB5A2", opacity: 0.5, animationDelay: "1.5s" }} />
                </div>
              </div>
            </div>

            {/* Bento stat cards */}
            <div className="mt-12 grid grid-cols-2 gap-4 lg:mt-16 lg:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  data-stat-card
                  className="group rounded-2xl border border-white/60 bg-white/60 p-5 backdrop-blur-[12px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg lg:p-6"
                  style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}
                >
                  <div className="font-heading text-3xl font-extrabold text-accent lg:text-4xl">
                    {s.num}
                  </div>
                  <div className="mt-1.5 text-xs text-text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ МИССИЯ ══════════ */}
        <HomeMissionSection />

        {/* ══════════ CTA (асимметричный split) ══════════ */}
        <section className="overflow-hidden bg-bg-secondary">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2">
              {/* Левая — преимущества */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="px-4 py-16 lg:px-12 lg:py-20"
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  02 · Членство
                </p>
                <h2 className="mb-8 font-heading text-3xl font-bold text-text-primary lg:text-4xl">
                  Преимущества членства
                </h2>
                <ul className="space-y-4">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent">
                        <Check className="h-3 w-3 text-accent-contrast" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                    <Button size="lg">
                      {isOnboarded ? "Личный кабинет" : "Зарегистрироваться"}
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Правая — мягкий акцент без «тяжёлого» чёрного */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative flex min-h-[min(52vh,420px)] items-center justify-center overflow-hidden px-8 py-16 lg:min-h-0 lg:py-20"
                style={{
                  background: `
                    radial-gradient(ellipse 90% 70% at 80% 15%, rgba(232,99,139,0.12) 0%, transparent 55%),
                    radial-gradient(ellipse 70% 60% at 10% 85%, rgba(91,181,162,0.1) 0%, transparent 50%),
                    linear-gradient(165deg, #fdf9fa 0%, #f5eef1 42%, #eef5f2 100%)
                  `,
                }}
              >
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.07]">
                  <span className="relative block h-[min(52vw,220px)] w-[min(52vw,220px)] sm:h-[200px] sm:w-[200px] lg:h-[240px] lg:w-[240px]">
                    <Image src="/logo.png" alt="" fill className="object-contain" />
                  </span>
                </div>
                <div className="relative max-w-[18rem] text-center sm:max-w-none">
                  <div className="font-heading text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-text-primary sm:text-4xl lg:text-[2.75rem]">
                    Вступайте
                    <br />
                    в сообщество
                    <br />
                    <span className="text-accent">трихологов</span>
                  </div>
                  <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-text-secondary">
                    Заявки рассматриваются в течение 2–3 рабочих дней
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ МЕРОПРИЯТИЯ (featured + list) ══════════ */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  03 · Мероприятия
                </p>
                <h2 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
                  Ближайшие события
                </h2>
              </div>
              <Link href={ROUTES.EVENTS} className="hidden text-sm text-text-muted transition-colors hover:text-text-primary lg:block">
                Все мероприятия →
              </Link>
            </div>

            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-2xl bg-border-light/40" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <p className="text-text-muted">Мероприятий пока не запланировано</p>
            ) : (
              <div className="space-y-4">
                {/* Главное мероприятие */}
                {featuredEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Link href={ROUTES.EVENT(featuredEvent.slug)}>
                      <div className="group relative overflow-hidden rounded-2xl bg-[#1A1D23] p-8 transition-all duration-300 hover:shadow-xl lg:p-10">
                        <div
                          className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20"
                          style={{ background: "linear-gradient(to left, var(--accent), transparent)" }}
                        />
                        <div className="relative grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                          {/* Дата как большое число */}
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
                              className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-accent-contrast"
                              style={{ background: "var(--accent)" }}
                            >
                              Ближайшее
                            </span>
                            <h3 className="font-heading text-xl font-bold text-white lg:text-2xl">
                              {featuredEvent.title}
                            </h3>
                            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/50">
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
                          <div className="flex-shrink-0">
                            {featuredEvent.tariffs.length > 0 && (
                              <div className="text-right">
                                <div className="text-xs text-white/40">от</div>
                                <div className="font-heading text-2xl font-bold text-white">
                                  {Math.min(...featuredEvent.tariffs.map((t) => t.member_price)).toLocaleString("ru")} ₽
                                </div>
                                <div className="text-xs text-white/40">для членов</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Остальные — compact list */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {restEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Link href={ROUTES.EVENT(event.slug)}>
                        <div className="group overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-300 hover:border-accent/40 hover:shadow-md">
                          {/* Обложка */}
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
                          <p className="mb-2 text-xs text-text-muted">
                            {formatDate(event.event_date)}
                          </p>
                          <h3 className="mb-2 text-sm font-semibold leading-snug text-text-primary line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          {event.tariffs.length > 0 && (
                            <div
                              className="mt-3 text-xs font-medium text-accent"
                            >
                              от {Math.min(...event.tariffs.map((t) => t.member_price)).toLocaleString("ru")} ₽
                            </div>
                          )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 lg:hidden">
              <Link href={ROUTES.EVENTS}>
                <Button variant="outline" fullWidth>Все мероприятия</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════ СТАТЬИ ══════════ */}
        <section className="border-t border-border bg-bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  04 · Публикации
                </p>
                <h2 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
                  Статьи и новости
                </h2>
              </div>
              <Link href={ROUTES.ARTICLES} className="hidden text-sm text-text-muted transition-colors hover:text-text-primary lg:block">
                Все статьи →
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={ROUTES.ARTICLE(article.slug)}>
                    <div className="group h-full overflow-hidden rounded-2xl border border-border bg-bg transition-all duration-300 hover:border-accent/40 hover:shadow-md">
                      {/* Обложка */}
                      <div className="relative h-44 w-full overflow-hidden">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-border-light to-accent/20" />
                        )}
                        {/* Accent полоса снизу обложки */}
                        <div
                          className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                          style={{ background: "var(--accent)" }}
                        />
                      </div>
                      <div className="p-5">
                        <p className="mb-2 text-xs text-text-muted">
                          {formatDate(article.published_at)}
                        </p>
                        <h3 className="mb-2 font-heading text-base font-semibold leading-snug text-text-primary line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-text-secondary line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="mt-4 text-xs font-medium text-text-muted transition-colors group-hover:text-text-primary">
                          Читать →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 lg:hidden">
              <Link href={ROUTES.ARTICLES}>
                <Button variant="outline" fullWidth>Все статьи</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
