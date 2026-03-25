"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Check, ArrowRight } from "lucide-react";

import { useEvents } from "@/entities/event";
import { useArticles } from "@/entities/article";
import { useAuth, shouldSkipClientOnboarding } from "@/providers/AuthProvider";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";

const ROSE = "#A31555";
const GOLD = "#C9A96E";
const DARK = "#0F0B13";
const SURFACE_DARK = "#1A1520";
const LIGHT = "#FFFAF5";
const TEXT_ON_DARK = "#F5F0F2";
const TEXT_SEC_DARK = "#9E8FA6";
const BORDER_DARK = "#2A2433";

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
  { num: "500+", label: "членов" },
  { num: "14 лет", label: "работы" },
  { num: "30+", label: "городов" },
  { num: "EHRS", label: "партнёр" },
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

export const EditorialLuxeHome = () => {
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

  return (
    <div className="theme-editorial-luxe font-body min-h-screen" style={{ color: TEXT_ON_DARK }}>
      {/* ════════ HEADER ════════ */}
      <header
        className="sticky top-0 z-50 flex h-[72px] items-center justify-between px-6 lg:px-10"
        style={{ background: `${DARK}ee`, backdropFilter: "blur(12px)" }}
      >
        <Link href={ROUTES.HOME} className="flex items-center gap-3">
          <span className="font-heading text-2xl font-normal italic" style={{ color: GOLD }}>
            АТ
          </span>
          <span className="hidden text-sm font-medium sm:inline" style={{ color: TEXT_ON_DARK }}>
            Ассоциация трихологов
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm transition-colors duration-300 hover:opacity-100"
              style={{ color: TEXT_SEC_DARK }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
          <button
            className="rounded-[8px] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg"
            style={{ background: ROSE, boxShadow: `0 2px 12px ${ROSE}40` }}
          >
            {isOnboarded ? "Кабинет" : "Вступить"}
          </button>
        </Link>
      </header>

      <main>
        {/* ════════ HERO (DARK) ════════ */}
        <section
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
          style={{ background: DARK }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${ROSE}1A, transparent)`,
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <p
              className="mb-8 text-xs font-medium uppercase tracking-[0.3em]"
              style={{ color: GOLD }}
            >
              Профессиональное объединение
            </p>
            <h1
              className="font-heading mx-auto max-w-4xl text-5xl leading-[1.1] lg:text-7xl xl:text-[84px]"
              style={{ color: TEXT_ON_DARK }}
            >
              Ассоциация
              <br />
              трихологов{" "}
              <span className="italic" style={{ color: GOLD }}>
                России
              </span>
            </h1>
            <p
              className="mx-auto mt-8 max-w-xl text-base leading-relaxed lg:text-lg"
              style={{ color: TEXT_SEC_DARK }}
            >
              Объединяем врачей-дерматологов, трихологов и специалистов по
              здоровью волос. Сертификация, образование и международное
              сотрудничество.
            </p>
            <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
              <button
                className="group mt-10 inline-flex items-center gap-3 rounded-[8px] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:shadow-xl"
                style={{ background: ROSE }}
              >
                {isOnboarded ? "Перейти в кабинет" : "Стать членом ассоциации"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-16 left-0 right-0"
          >
            <div className="mx-auto flex max-w-3xl items-center justify-center gap-12">
              {STATS.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  {i > 0 && (
                    <div className="h-8 w-px" style={{ background: BORDER_DARK }} />
                  )}
                  <div className="text-center">
                    <div className="font-heading text-2xl" style={{ color: GOLD }}>
                      {s.num}
                    </div>
                    <div className="mt-0.5 text-xs" style={{ color: TEXT_SEC_DARK }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ════════ MISSION (LIGHT) ════════ */}
        <section style={{ background: LIGHT, padding: "96px 0" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div {...reveal} className="mb-16 max-w-2xl">
              <p
                className="mb-4 text-xs font-medium uppercase tracking-[0.25em]"
                style={{ color: ROSE }}
              >
                Миссия
              </p>
              <h2 className="font-heading text-4xl leading-tight text-[#1A1520] lg:text-5xl">
                Зачем нужна ассоциация
              </h2>
            </motion.div>

            <div className="space-y-0 divide-y" style={{ borderColor: `${ROSE}20` }}>
              {[
                {
                  num: "I",
                  title: "Стандарты качества",
                  desc: "Строгая сертификация и постоянный контроль квалификации обеспечивают высочайший уровень медицинской помощи. Только верифицированные специалисты попадают в открытый каталог.",
                },
                {
                  num: "II",
                  title: "Профессиональное сообщество",
                  desc: "Закрытый Telegram-канал, обмен клиническими случаями и поддержка коллег. Ассоциация — это живое сообщество, а не формальная структура.",
                },
                {
                  num: "III",
                  title: "Образование и развитие",
                  desc: "Ежегодные конференции, семинары и вебинары по льготным ценам. Доступ к записям, мастер-классам и архивам прошедших мероприятий.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="grid gap-6 py-12 lg:grid-cols-[100px_1fr]"
                >
                  <div
                    className="font-heading text-5xl lg:text-6xl"
                    style={{ color: GOLD }}
                  >
                    {item.num}
                  </div>
                  <div>
                    <h3 className="font-heading mb-3 text-2xl text-[#1A1520] lg:text-3xl">
                      {item.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-[#6B5B73] lg:text-base">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ CTA / MEMBERSHIP (DARK) ════════ */}
        <section style={{ background: SURFACE_DARK, padding: "96px 0" }}>
          <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
            <motion.div {...reveal}>
              <p
                className="font-heading mx-auto mb-10 max-w-2xl text-3xl italic leading-snug lg:text-4xl"
                style={{ color: TEXT_ON_DARK }}
              >
                &ldquo;Трихология — это искусство и наука, объединённые заботой о
                пациенте&rdquo;
              </p>
              <div
                className="mx-auto mb-10 h-px w-24"
                style={{ background: GOLD }}
              />
              <ul className="mx-auto max-w-lg space-y-4 text-left">
                {BENEFITS.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: TEXT_SEC_DARK }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                      style={{ background: ROSE }}
                    >
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                <button
                  className="mt-10 rounded-[8px] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg"
                  style={{ background: ROSE }}
                >
                  {isOnboarded ? "Личный кабинет" : "Зарегистрироваться"}
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ════════ EVENTS (LIGHT) ════════ */}
        <section style={{ background: LIGHT, padding: "96px 0" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div {...reveal} className="mb-14 flex items-end justify-between">
              <div>
                <p
                  className="mb-4 text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: ROSE }}
                >
                  Мероприятия
                </p>
                <h2 className="font-heading text-4xl text-[#1A1520] lg:text-5xl">
                  Ближайшие события
                </h2>
              </div>
              <Link
                href={ROUTES.EVENTS}
                className="hidden text-sm transition-colors hover:opacity-70 lg:block"
                style={{ color: ROSE }}
              >
                Все мероприятия →
              </Link>
            </motion.div>

            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl"
                    style={{ background: "#E5DDE0" }}
                  />
                ))}
              </div>
            ) : events.length === 0 ? (
              <p style={{ color: "#6B5B73" }}>
                Мероприятий пока не запланировано
              </p>
            ) : (
              <div className="space-y-6">
                {featuredEvent && (
                  <motion.div {...reveal}>
                    <Link href={ROUTES.EVENT(featuredEvent.slug)}>
                      <div className="group relative overflow-hidden rounded-xl border border-[#E5DDE0] bg-white p-8 transition-all duration-300 hover:shadow-lg lg:p-10">
                        <div
                          className="pointer-events-none absolute right-0 top-0 h-full w-1/4 opacity-10"
                          style={{
                            background: `linear-gradient(to left, ${GOLD}, transparent)`,
                          }}
                        />
                        <div className="relative grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
                          <div className="hidden lg:block">
                            <div
                              className="font-heading text-7xl leading-none"
                              style={{ color: `${GOLD}40` }}
                            >
                              {new Date(featuredEvent.event_date).getDate()}
                            </div>
                            <div
                              className="mt-1 text-xs uppercase tracking-wider"
                              style={{ color: "#6B5B73" }}
                            >
                              {new Date(
                                featuredEvent.event_date,
                              ).toLocaleDateString("ru", { month: "long" })}
                            </div>
                          </div>
                          <div>
                            <span
                              className="mb-3 inline-block rounded-md px-3 py-1 text-xs font-semibold"
                              style={{ background: "#F8D7E3", color: ROSE }}
                            >
                              Ближайшее
                            </span>
                            <h3 className="font-heading text-xl text-[#1A1520] lg:text-2xl">
                              {featuredEvent.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#6B5B73]">
                              <span className="flex items-center gap-1.5">
                                <Calendar
                                  className="h-3.5 w-3.5"
                                  style={{ color: ROSE }}
                                />
                                {formatDate(featuredEvent.event_date)}
                              </span>
                              {featuredEvent.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin
                                    className="h-3.5 w-3.5"
                                    style={{ color: ROSE }}
                                  />
                                  {featuredEvent.location}
                                </span>
                              )}
                            </div>
                          </div>
                          {featuredEvent.tariffs?.length > 0 && (
                            <div className="text-right">
                              <div className="text-xs text-[#6B5B73]">от</div>
                              <div
                                className="font-heading text-2xl"
                                style={{ color: GOLD }}
                              >
                                {Math.min(
                                  ...featuredEvent.tariffs.map(
                                    (t: any) => t.member_price,
                                  ),
                                ).toLocaleString("ru")}{" "}
                                ₽
                              </div>
                              <div className="text-xs text-[#6B5B73]">
                                для членов
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  {restEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                      <Link href={ROUTES.EVENT(event.slug)}>
                        <div className="group h-full overflow-hidden rounded-xl border border-[#E5DDE0] bg-white transition-all duration-300 hover:shadow-md">
                          <div className="relative aspect-video w-full overflow-hidden">
                            {event.cover_image_url ? (
                              <Image
                                src={event.cover_image_url}
                                alt={event.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, 50vw"
                              />
                            ) : (
                              <div
                                className="h-full w-full"
                                style={{
                                  background: `linear-gradient(135deg, ${ROSE}20, ${GOLD}20)`,
                                }}
                              />
                            )}
                          </div>
                          <div className="p-5">
                            <p className="mb-2 text-xs text-[#6B5B73]">
                              {formatDate(event.event_date)}
                            </p>
                            <h3 className="font-heading text-base text-[#1A1520] line-clamp-2">
                              {event.title}
                            </h3>
                            {event.location && (
                              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6B5B73]">
                                <MapPin
                                  className="h-3 w-3 flex-shrink-0"
                                  style={{ color: ROSE }}
                                />
                                <span className="truncate">
                                  {event.location}
                                </span>
                              </div>
                            )}
                            {event.tariffs?.length > 0 && (
                              <div
                                className="mt-3 text-xs font-semibold"
                                style={{ color: GOLD }}
                              >
                                от{" "}
                                {Math.min(
                                  ...event.tariffs.map(
                                    (t: any) => t.member_price,
                                  ),
                                ).toLocaleString("ru")}{" "}
                                ₽
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

        {/* ════════ ARTICLES (DARK) ════════ */}
        <section style={{ background: DARK, padding: "96px 0" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <motion.div {...reveal} className="mb-14 flex items-end justify-between">
              <div>
                <p
                  className="mb-4 text-xs font-medium uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Публикации
                </p>
                <h2
                  className="font-heading text-4xl lg:text-5xl"
                  style={{ color: TEXT_ON_DARK }}
                >
                  Статьи и новости
                </h2>
              </div>
              <Link
                href={ROUTES.ARTICLES}
                className="hidden text-sm transition-colors hover:opacity-70 lg:block"
                style={{ color: GOLD }}
              >
                Все статьи →
              </Link>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link href={ROUTES.ARTICLE(article.slug)}>
                    <div
                      className="group h-full overflow-hidden rounded-xl border transition-all duration-300"
                      style={{
                        background: SURFACE_DARK,
                        borderColor: BORDER_DARK,
                      }}
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{
                              background: `linear-gradient(135deg, ${ROSE}30, ${GOLD}20)`,
                            }}
                          />
                        )}
                      </div>
                      <div className="p-5">
                        <span
                          className="mb-3 inline-block rounded-md border px-2 py-0.5 text-[10px] uppercase tracking-wider"
                          style={{
                            borderColor: BORDER_DARK,
                            color: TEXT_SEC_DARK,
                          }}
                        >
                          Статья
                        </span>
                        <h3
                          className="font-heading mb-2 text-base leading-snug line-clamp-2"
                          style={{ color: TEXT_ON_DARK }}
                        >
                          {article.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed line-clamp-2"
                          style={{ color: TEXT_SEC_DARK }}
                        >
                          {article.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span
                            className="text-xs"
                            style={{ color: TEXT_SEC_DARK }}
                          >
                            {formatDate(article.published_at)}
                          </span>
                          <span
                            className="text-xs font-medium transition-colors group-hover:opacity-80"
                            style={{ color: GOLD }}
                          >
                            Читать →
                          </span>
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
      <footer style={{ background: DARK }}>
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="mb-10 h-px" style={{ background: GOLD }} />
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <span
                className="font-heading text-2xl italic"
                style={{ color: GOLD }}
              >
                АТ
              </span>
              <p
                className="mt-4 max-w-xs text-sm leading-relaxed"
                style={{ color: TEXT_SEC_DARK }}
              >
                Профессиональное объединение врачей-трихологов и дерматологов
                России. Работаем с 2012 года.
              </p>
            </div>
            <div>
              <h4
                className="mb-4 text-xs font-semibold uppercase tracking-wider"
                style={{ color: TEXT_ON_DARK }}
              >
                Навигация
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:opacity-80"
                      style={{ color: TEXT_SEC_DARK }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 text-xs font-semibold uppercase tracking-wider"
                style={{ color: TEXT_ON_DARK }}
              >
                Контакты
              </h4>
              <ul className="space-y-2.5 text-sm" style={{ color: TEXT_SEC_DARK }}>
                <li>info@trichology-association.ru</li>
                <li>+7 (495) 123-45-67</li>
                <li>Москва, Россия</li>
              </ul>
            </div>
          </div>
          <div
            className="mt-12 border-t pt-8 text-center text-xs"
            style={{ borderColor: BORDER_DARK, color: TEXT_SEC_DARK }}
          >
            © {new Date().getFullYear()} Ассоциация трихологов России. Все права
            защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
