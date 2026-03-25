"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Star,
  Users,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
import { useState, useRef } from "react";

import { useEvents } from "@/entities/event";
import { useArticles } from "@/entities/article";
import { useAuth, shouldSkipClientOnboarding } from "@/providers/AuthProvider";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";
import { useGSAP } from "@/shared/lib/useGSAP";
import { staggerReveal, parallaxY, gsap } from "@/shared/lib/animations";

const PINK = "#E8638B";
const TEAL = "#5BB5A2";
const SURFACE = "#F8F9FB";
const DARK = "#1A1D23";

const NAV_LINKS = [
  { label: "Правление", href: ROUTES.PRAVLENIE },
  { label: "Врачи", href: ROUTES.DOCTORS },
  { label: "Мероприятия", href: ROUTES.EVENTS },
  { label: "Статьи", href: ROUTES.ARTICLES },
  { label: "Документы", href: ROUTES.DOCUMENTS },
];

const BENEFITS = [
  "Публикация в каталоге верифицированных врачей",
  "Доступ к закрытому профессиональному чату",
  "Льготные цены на конференции и семинары",
  "Именной сертификат члена ассоциации",
  "Участие в выборах президента ассоциации",
];

const STATS = [
  { num: "500+", label: "Членов ассоциации" },
  { num: "14", label: "Лет работы" },
  { num: "42", label: "Города России" },
  { num: "EHRS", label: "Международный партнёр" },
];

const glass =
  "backdrop-blur-[16px] bg-white/70 border border-white/40";

const sectionReveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
};

const MISSION_CARDS = [
  {
    num: "01",
    icon: Star,
    title: "Стандарты качества",
    desc: "Строгая сертификация и постоянный контроль квалификации. Только верифицированные специалисты попадают в каталог.",
    metric: "500+",
    metricLabel: "врачей в каталоге",
    accent: PINK,
    accentBg: "#FCE4EC",
  },
  {
    num: "02",
    icon: Users,
    title: "Профессиональное сообщество",
    desc: "Закрытый Telegram-канал, разбор клинических случаев, поддержка коллег. Живое сообщество практиков.",
    metric: "14",
    metricLabel: "лет объединяем врачей",
    accent: TEAL,
    accentBg: "#E0F2F1",
  },
  {
    num: "03",
    icon: BookOpen,
    title: "Образование и конференции",
    desc: "Ежегодные конференции, семинары и вебинары по льготным ценам. Доступ к записям и мастер-классам.",
    metric: "30+",
    metricLabel: "городов присутствия",
    accent: PINK,
    accentBg: "#FCE4EC",
  },
];

function MissionSection() {
  const ref = useGSAP((_ctx, el) => {
    staggerReveal("[data-mission-card]", el, { y: 50, stagger: 0.15, duration: 0.8 });
    parallaxY("[data-mission-num]", el, 20);
  });

  return (
    <section ref={ref} style={{ background: SURFACE, padding: "96px 0" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <span
            className="mb-4 inline-block rounded-[6px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ background: "#E0F2F1", color: TEAL }}
          >
            Миссия
          </span>
          <h2 className="font-heading text-4xl font-extrabold text-[#1A1D23] lg:text-5xl">
            Зачем нужна ассоциация
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {MISSION_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.num}
                data-mission-card
                className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl lg:p-10"
                style={{ boxShadow: "0 4px 12px -2px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="absolute left-0 top-0 h-1 w-full transition-all duration-500 group-hover:h-1.5"
                  style={{ background: `linear-gradient(90deg, ${card.accent}, ${card.accent}80)` }}
                />
                <div
                  data-mission-num
                  className="pointer-events-none absolute -right-2 -top-4 font-heading text-[100px] font-extrabold leading-none select-none transition-colors duration-500 group-hover:opacity-15"
                  style={{ color: `${card.accent}10` }}
                >
                  {card.num}
                </div>
                <div className="relative">
                  <div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    style={{ background: card.accentBg }}
                  >
                    <Icon className="h-7 w-7" style={{ color: card.accent }} />
                  </div>
                  <h3 className="font-heading mb-3 text-xl font-bold text-[#1A1D23] lg:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[#6B6F80] lg:text-base">
                    {card.desc}
                  </p>
                  <div className="mt-auto border-t border-[#E2E4EA] pt-5">
                    <div className="font-heading text-3xl font-extrabold" style={{ color: card.accent }}>
                      {card.metric}
                    </div>
                    <div className="mt-0.5 text-xs text-[#9095A5]">{card.metricLabel}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── COMPONENT ─────────────────────── */

export const ClinicalAuraHome = () => {
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

  const [mobileOpen, setMobileOpen] = useState(false);

  const heroRef = useGSAP((_ctx, el) => {
    staggerReveal("[data-ca-hero-text]", el, { y: 40, stagger: 0.12, duration: 0.7, start: "top 95%" });
    const orb = el.querySelector("[data-ca-orb]");
    if (orb) gsap.fromTo(orb, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.15 });
    staggerReveal("[data-ca-stat]", el, { y: 24, stagger: 0.08, duration: 0.5, start: "top 95%" });
  });

  return (
    <div className="theme-clinical-aura font-body min-h-screen bg-white text-[#2D2D3A]">
      {/* ════════ HEADER ════════ */}
      <header
        className={`sticky top-0 z-50 h-20 ${glass} border-b border-white/30`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href={ROUTES.HOME} className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: PINK }}
            >
              АТ
            </span>
            <span className="font-heading text-lg font-bold hidden sm:inline">
              Ассоциация трихологов
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#5A5A6E] transition-colors hover:text-[#2D2D3A]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isOnboarded ? (
              <Link
                href={ROUTES.CABINET}
                className="rounded-[10px] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{
                  background: PINK,
                  boxShadow: `0 2px 8px rgba(232,99,139,0.25)`,
                }}
              >
                Кабинет
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="hidden rounded-[10px] border border-[#E2E4EA] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[#C5C8D4] sm:inline-block"
                >
                  Войти
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className="rounded-[10px] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  style={{
                    background: PINK,
                    boxShadow: `0 2px 8px rgba(232,99,139,0.25)`,
                  }}
                >
                  Регистрация
                </Link>
              </>
            )}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className={`${glass} absolute left-0 right-0 top-20 border-t border-white/30 p-4 lg:hidden`}>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-3 text-sm font-medium text-[#5A5A6E]"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main>
        {/* ════════ HERO ════════ */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{
            padding: "100px 0 64px",
            background: `
              radial-gradient(ellipse 80% 50% at 15% 60%, rgba(232,99,139,0.10) 0%, transparent 100%),
              radial-gradient(ellipse 60% 80% at 78% 20%, rgba(91,181,162,0.09) 0%, transparent 100%),
              radial-gradient(ellipse 50% 50% at 50% 100%, rgba(232,99,139,0.04) 0%, transparent 100%),
              #ffffff
            `,
          }}
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_380px]">
              {/* Text */}
              <div>
                <div data-ca-hero-text>
                  <span
                    className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ background: "#FCE4EC", color: PINK }}
                  >
                    Профессиональное сообщество · с 2012
                  </span>
                </div>
                <h1
                  data-ca-hero-text
                  className="font-heading mt-6 text-5xl font-extrabold leading-[1.05] text-[#1A1D23] lg:text-7xl xl:text-[82px]"
                >
                  Ассоциация<br />
                  трихологов{" "}
                  <span style={{ color: PINK }}>России</span>
                </h1>
                <p
                  data-ca-hero-text
                  className="mt-6 max-w-lg text-base leading-relaxed text-[#6B6F80] lg:text-lg"
                >
                  Объединяем врачей-дерматологов, трихологов и специалистов по
                  здоровью волос. Сертификация, конференции и интеграция через EHRS.
                </p>
                <div data-ca-hero-text className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                    <button
                      className="group inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                      style={{ background: PINK, boxShadow: `0 4px 20px rgba(232,99,139,0.3)` }}
                    >
                      {isOnboarded ? "Перейти в кабинет" : "Стать членом"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </Link>
                  <Link href={ROUTES.DOCTORS}>
                    <button className="inline-flex items-center gap-2 rounded-full border border-[#E2E4EA] px-6 py-3.5 text-sm font-medium text-[#1A1D23] transition-all duration-300 hover:border-[#E8638B40] hover:bg-[#E8638B08]">
                      Каталог врачей
                    </button>
                  </Link>
                </div>
              </div>

              {/* 3D Glass Orb */}
              <div data-ca-orb className="hidden lg:block">
                <div className="relative" style={{ width: 360, height: 360 }}>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full blur-[60px]"
                    style={{ background: `radial-gradient(circle, ${PINK}40 0%, ${TEAL}25 50%, transparent 70%)` }}
                  />
                  <div className="animate-orb-float absolute inset-[20px]">
                    <div
                      className="relative h-full w-full rounded-full"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, ${PINK}25 35%, ${TEAL}20 60%, ${PINK}14 100%)`,
                        boxShadow: `0 8px 60px ${PINK}33, 0 2px 20px ${TEAL}25, inset 0 -8px 30px ${PINK}20, inset 0 8px 30px rgba(255,255,255,0.8)`,
                        border: "1px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      <div
                        className="absolute inset-[25px] rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle at 40% 32%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.18) 42%, transparent 68%)",
                          boxShadow: `inset 0 4px 20px rgba(255,255,255,0.4), inset 0 -4px 15px ${PINK}14`,
                        }}
                      />
                      <div
                        className="absolute left-[18%] top-[12%] h-[30%] w-[35%] rounded-full"
                        style={{
                          background: "radial-gradient(ellipse, rgba(255,255,255,0.75) 0%, transparent 70%)",
                          transform: "rotate(-15deg)",
                        }}
                      />
                      <div
                        className="animate-orb-pulse absolute bottom-[15%] left-[10%] h-[20%] w-[60%] rounded-full"
                        style={{ background: `radial-gradient(ellipse, ${TEAL}33 0%, transparent 70%)` }}
                      />
                    </div>
                  </div>
                  <div className="animate-orb-dot absolute left-0 top-1/4 h-3 w-3 rounded-full" style={{ background: PINK, opacity: 0.6 }} />
                  <div className="animate-orb-dot absolute right-4 top-8 h-2 w-2 rounded-full" style={{ background: TEAL, opacity: 0.5, animationDelay: "1s" }} />
                  <div className="animate-orb-dot absolute bottom-8 left-12 h-2.5 w-2.5 rounded-full" style={{ background: PINK, opacity: 0.4, animationDelay: "2s" }} />
                  <div className="animate-orb-dot absolute bottom-1/4 right-0 h-2 w-2 rounded-full" style={{ background: TEAL, opacity: 0.5, animationDelay: "1.5s" }} />
                </div>
              </div>
            </div>

            {/* Bento stat cards */}
            <div className="mt-12 grid grid-cols-2 gap-4 lg:mt-16 lg:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  data-ca-stat
                  className="group rounded-2xl border border-white/60 bg-white/60 p-5 backdrop-blur-[12px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg lg:p-6"
                  style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}
                >
                  <div className="font-heading text-3xl font-extrabold lg:text-4xl" style={{ color: PINK }}>
                    {s.num}
                  </div>
                  <div className="mt-1.5 text-xs text-[#9095A5]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ MISSION ════════ */}
        <MissionSection />

        {/* ════════ CTA / MEMBERSHIP ════════ */}
        <section style={{ padding: "64px 0" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <motion.div {...sectionReveal}>
                <span
                  className="mb-4 inline-block rounded-[6px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ background: "#E0F2F1", color: TEAL }}
                >
                  Членство
                </span>
                <h2 className="font-heading mb-8 text-3xl font-extrabold text-[#1A1D23] lg:text-4xl">
                  Преимущества членства
                </h2>
                <ul className="space-y-4">
                  {BENEFITS.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm leading-relaxed text-[#4A4D5A]"
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ background: TEAL }}
                      >
                        <Check className="h-3 w-3 text-white" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                  <button
                    className="mt-8 rounded-[10px] px-8 py-3.5 text-sm font-bold text-white transition-transform duration-300 hover:-translate-y-0.5"
                    style={{
                      background: PINK,
                      boxShadow: `0 2px 8px rgba(232,99,139,0.25)`,
                    }}
                  >
                    {isOnboarded ? "Личный кабинет" : "Зарегистрироваться"}
                  </button>
                </Link>
              </motion.div>

              <motion.div
                {...sectionReveal}
                transition={{ ...sectionReveal.transition, delay: 0.15 }}
                className={`relative overflow-hidden rounded-2xl p-10 lg:p-12 ${glass}`}
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-25 blur-[60px]"
                  style={{ background: PINK }}
                />
                <div
                  className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full opacity-20 blur-[50px]"
                  style={{ background: TEAL }}
                />
                <div className="relative text-center">
                  <p className="font-heading text-4xl font-extrabold leading-tight text-[#1A1D23] lg:text-5xl">
                    Вступайте
                    <br />в сообщество
                    <br />
                    <span style={{ color: PINK }}>трихологов</span>
                  </p>
                  <p className="mt-4 text-sm text-[#9095A5]">
                    Заявки рассматриваются в течение 2–3 рабочих дней
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════ EVENTS ════════ */}
        <section style={{ background: SURFACE, padding: "96px 0" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div {...sectionReveal} className="mb-12 flex items-end justify-between">
              <div>
                <span
                  className="mb-4 inline-block rounded-[6px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ background: "#FCE4EC", color: PINK }}
                >
                  Мероприятия
                </span>
                <h2 className="font-heading text-4xl font-extrabold text-[#1A1D23] lg:text-5xl">
                  Ближайшие события
                </h2>
              </div>
              <Link
                href={ROUTES.EVENTS}
                className="hidden text-sm font-medium transition-colors hover:opacity-70 lg:block"
                style={{ color: PINK }}
              >
                Все мероприятия →
              </Link>
            </motion.div>

            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-2xl"
                    style={{ background: "#E2E4EA" }}
                  />
                ))}
              </div>
            ) : events.length === 0 ? (
              <p className="text-[#9095A5]">Мероприятий пока не запланировано</p>
            ) : (
              <div className="space-y-6">
                {featuredEvent && (
                  <motion.div {...sectionReveal}>
                    <Link href={ROUTES.EVENT(featuredEvent.slug)}>
                      <div
                        className="group relative overflow-hidden rounded-2xl p-8 text-white transition-all duration-300 hover:shadow-xl lg:p-10"
                        style={{ background: DARK }}
                      >
                        {featuredEvent.cover_image_url && (
                          <Image
                            src={featuredEvent.cover_image_url}
                            alt={featuredEvent.title}
                            fill
                            className="object-cover opacity-20 transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        <div className="relative grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                          <div className="hidden lg:block">
                            <div className="font-heading text-7xl font-extrabold leading-none text-white/20">
                              {new Date(featuredEvent.event_date).getDate()}
                            </div>
                            <div className="mt-1 text-xs uppercase tracking-wider text-white/40">
                              {new Date(featuredEvent.event_date).toLocaleDateString("ru", { month: "long" })}
                            </div>
                          </div>
                          <div>
                            <span
                              className="mb-3 inline-block rounded-[6px] px-3 py-1 text-xs font-bold uppercase"
                              style={{ background: PINK, color: "#fff" }}
                            >
                              Ближайшее
                            </span>
                            <h3 className="font-heading text-xl font-bold lg:text-2xl">
                              {featuredEvent.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(featuredEvent.event_date)}
                              </span>
                              {featuredEvent.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {featuredEvent.location}
                                </span>
                              )}
                            </div>
                          </div>
                          {featuredEvent.tariffs?.length > 0 && (
                            <div className="text-right">
                              <div className="text-xs text-white/40">от</div>
                              <div className="font-heading text-2xl font-bold">
                                {Math.min(...featuredEvent.tariffs.map((t: any) => t.member_price)).toLocaleString("ru")}{" "}₽
                              </div>
                              <div className="text-xs text-white/40">для членов</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {restEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.45 }}
                    >
                      <Link href={ROUTES.EVENT(event.slug)}>
                        <div
                          className="group h-full overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)" }}
                        >
                          <div className="relative aspect-video w-full overflow-hidden">
                            {event.cover_image_url ? (
                              <Image
                                src={event.cover_image_url}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <div
                                className="h-full w-full"
                                style={{ background: `linear-gradient(135deg, ${PINK}30, ${TEAL}30)` }}
                              />
                            )}
                          </div>
                          <div className="p-5">
                            <p className="mb-2 text-xs text-[#9095A5]">
                              {formatDate(event.event_date)}
                            </p>
                            <h3 className="mb-2 text-sm font-bold leading-snug text-[#1A1D23] line-clamp-2">
                              {event.title}
                            </h3>
                            {event.location && (
                              <div className="flex items-center gap-1.5 text-xs text-[#9095A5]">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                            {event.tariffs?.length > 0 && (
                              <div className="mt-3 text-xs font-semibold" style={{ color: PINK }}>
                                от{" "}
                                {Math.min(...event.tariffs.map((t: any) => t.member_price)).toLocaleString("ru")}{" "}₽
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
          </div>
        </section>

        {/* ════════ ARTICLES ════════ */}
        <section style={{ padding: "96px 0" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div {...sectionReveal} className="mb-12 flex items-end justify-between">
              <div>
                <span
                  className="mb-4 inline-block rounded-[6px] px-3 py-1.5 text-xs font-bold uppercase tracking-wider"
                  style={{ background: "#E0F2F1", color: TEAL }}
                >
                  Публикации
                </span>
                <h2 className="font-heading text-4xl font-extrabold text-[#1A1D23] lg:text-5xl">
                  Статьи и новости
                </h2>
              </div>
              <Link
                href={ROUTES.ARTICLES}
                className="hidden text-sm font-medium transition-colors hover:opacity-70 lg:block"
                style={{ color: PINK }}
              >
                Все статьи →
              </Link>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                >
                  <Link href={ROUTES.ARTICLE(article.slug)}>
                    <div
                      className="group h-full overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{ boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)" }}
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{ background: `linear-gradient(135deg, ${TEAL}30, ${PINK}20)` }}
                          />
                        )}
                        <div
                          className="absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
                          style={{ background: PINK }}
                        />
                      </div>
                      <div className="p-5">
                        <p className="mb-2 text-xs text-[#9095A5]">
                          {formatDate(article.published_at)}
                        </p>
                        <h3 className="font-heading mb-2 text-base font-bold leading-snug text-[#1A1D23] line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#6B6F80] line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div
                          className="mt-4 text-xs font-semibold transition-colors group-hover:opacity-80"
                          style={{ color: PINK }}
                        >
                          Читать →
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ background: DARK }} className="text-white/70">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: PINK }}
                >
                  АТ
                </span>
                <span className="font-heading text-lg font-bold text-white">
                  Ассоциация трихологов
                </span>
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                Профессиональное объединение врачей-трихологов и дерматологов
                России. Работаем с 2012 года.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Навигация
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Участникам
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link href={ROUTES.REGISTER} className="text-sm text-white/50 transition-colors hover:text-white">
                    Регистрация
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.LOGIN} className="text-sm text-white/50 transition-colors hover:text-white">
                    Войти в кабинет
                  </Link>
                </li>
                <li>
                  <Link href={ROUTES.DOCUMENTS} className="text-sm text-white/50 transition-colors hover:text-white">
                    Документы
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                Контакты
              </h4>
              <ul className="space-y-2.5 text-sm text-white/50">
                <li>info@trichology-association.ru</li>
                <li>+7 (495) 123-45-67</li>
                <li>Москва, Россия</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/30">
            © {new Date().getFullYear()} Ассоциация трихологов России. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
