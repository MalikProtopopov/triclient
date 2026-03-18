"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Calendar, MapPin } from "lucide-react";

import { useEvents } from "@/entities/event";
import { useArticles } from "@/entities/article";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";
import { useAuth } from "@/providers/AuthProvider";

const BENEFITS = [
  "Публикация в каталоге верифицированных врачей",
  "Доступ к закрытому профессиональному чату",
  "Льготные цены на конференции и семинары",
  "Именной сертификат члена ассоциации",
  "Участие в выборах президента ассоциации",
];

const STATS = [
  { num: "500+", label: "членов" },
  { num: "14", label: "лет работы" },
  { num: "XXII", label: "конференции" },
  { num: "EHRS", label: "международный партнёр" },
];

export default function HomeClient() {
  const { isAuthenticated, user } = useAuth();
  const isOnboarded = isAuthenticated && (user?.onboarding?.next_step === "completed" || user?.onboarding?.next_step === "done");
  const { data: eventsData, isLoading: eventsLoading } = useEvents({
    period: "upcoming",
    limit: 4,
  });
  const { data: articlesData } = useArticles({ limit: 3 });

  const events = eventsData?.data ?? [];
  const articles = articlesData?.data ?? [];
  const [featuredEvent, ...restEvents] = events;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">

        {/* ══════════ HERO ══════════ */}
        <section className="relative overflow-hidden bg-[#4a4a4a]">
          {/* Фоновый акцентный элемент */}
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full opacity-[0.07]"
            style={{ background: "#edbecc" }}
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
            style={{ background: "linear-gradient(90deg, #edbecc 0%, transparent 60%)" }}
          />

          <div className="mx-auto max-w-7xl px-4 pt-16 pb-0 lg:px-8 lg:pt-24">
            <div className="grid items-end gap-8 lg:grid-cols-[1fr_340px]">
              {/* Левая часть — текст */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="pb-16 lg:pb-24"
              >
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#edbecc]/70">
                  Профессиональное сообщество · с 2012 года
                </p>
                <h1
                  className="mb-6 font-heading text-5xl font-bold leading-[1.0] text-white lg:text-7xl xl:text-[88px]"
                >
                  Ассоциация<br />
                  <span className="relative inline-block">
                    трихологов
                    <span
                      className="absolute -bottom-1 left-0 h-[3px] w-full"
                      style={{ background: "#edbecc" }}
                    />
                  </span>
                  <br />
                  <span className="text-[#edbecc]">России</span>
                </h1>
                <p className="mb-8 max-w-lg text-base leading-relaxed text-white/60 lg:text-lg">
                  Объединяем врачей-дерматологов, трихологов и специалистов по волосам.
                  Ежегодные конференции, сертификация и интеграция в мировую трихологию через EHRS.
                </p>
                <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                  <button className="group inline-flex items-center gap-3 rounded-full bg-[#edbecc] px-8 py-3.5 text-sm font-semibold text-[#4a4a4a] transition-all duration-300 hover:shadow-[0_0_30px_rgba(237,190,204,0.3)] hover:scale-[1.02]">
                    {isOnboarded ? "Перейти в кабинет" : "Стать членом ассоциации"}
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>

                {/* Статистика */}
                <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8">
                  {STATS.map((s) => (
                    <div key={s.label}>
                      <div
                        className="font-heading text-3xl font-bold text-[#edbecc] lg:text-4xl"
                      >
                        {s.num}
                      </div>
                      <div className="mt-0.5 text-xs text-white/40">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Правая часть — фото президента */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="hidden self-end lg:block"
              >
                <Link href="/pravlenie" className="group block">
                  <div className="relative mx-auto w-[280px]">
                    {/* Арочный контейнер с фото */}
                    <div className="relative overflow-hidden rounded-t-[140px] h-[380px]">
                      <Image
                        src="/media/gadzhigoroeva-aida-guseyhanovna-prezident-associacii-professionalnoe-obshchestvo-trihologov.jpg"
                        alt="Гаджигороева Аида Гусейхановна — президент"
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="280px"
                        priority
                      />
                      {/* Тёмный градиент снизу */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#4a4a4a] to-transparent" />
                    </div>

                    {/* Подпись снизу */}
                    <div className="relative -mt-14 px-4 pb-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#edbecc]/60">
                        Президент ассоциации
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-white leading-snug">
                        Гаджигороева Аида<br />Гусейхановна
                      </p>
                    </div>

                    {/* Декоративная рамка — появляется при ховере */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-t-[140px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ boxShadow: "inset 0 0 0 2px rgba(237,190,204,0.4)" }}
                    />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════ МИССИЯ (список, не grid) ══════════ */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-14 flex items-end justify-between">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                  01 · Миссия
                </p>
                <h2 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
                  Зачем нужна ассоциация
                </h2>
              </div>
              <Link
                href={ROUTES.DOCUMENTS}
                className="hidden text-sm text-text-muted transition-colors hover:text-text-primary lg:block"
              >
                Документы организации →
              </Link>
            </div>

            <div className="space-y-0 divide-y divide-border">
              {[
                {
                  num: "01",
                  title: "Стандарты качества",
                  desc: "Строгая сертификация и контроль квалификации обеспечивают высочайший уровень медицинской помощи. Только верифицированные специалисты попадают в открытый каталог.",
                  tag: "Сертификация",
                },
                {
                  num: "02",
                  title: "Профессиональное сообщество",
                  desc: "Закрытый Telegram-канал, обмен клиническими случаями, профессиональная поддержка коллег. Ассоциация — это живое сообщество, а не формальная структура.",
                  tag: "Сообщество",
                },
                {
                  num: "03",
                  title: "Образование и развитие",
                  desc: "Ежегодные конференции, семинары и вебинары по льготным ценам. Доступ к записям докладов, мастер-классам и фотоархивам прошедших мероприятий.",
                  tag: "Обучение",
                },
              ].map((item) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.45 }}
                  className="group grid gap-6 py-10 lg:grid-cols-[96px_1fr_220px] lg:items-center"
                >
                  <div
                    className="font-heading text-6xl font-bold leading-none text-border-light transition-colors duration-500 group-hover:text-accent/30 lg:text-7xl"
                  >
                    {item.num}
                  </div>
                  <div>
                    <h3 className="mb-2 font-heading text-xl font-semibold text-text-primary lg:text-2xl">
                      {item.title}
                    </h3>
                    <p className="max-w-xl text-sm leading-relaxed text-text-secondary lg:text-base">
                      {item.desc}
                    </p>
                  </div>
                  <div className="lg:text-right">
                    <span className="inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-text-primary">
                      {item.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

              {/* Правая — большая типографика */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="relative flex items-center justify-center overflow-hidden bg-[#4a4a4a] px-8 py-16 lg:py-20"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-heading text-[180px] font-bold leading-none text-white/[0.04] select-none lg:text-[220px]"
                  >
                    АТ
                  </span>
                </div>
                <div className="relative text-center">
                  <div
                    className="font-heading text-5xl font-bold leading-tight text-white lg:text-6xl"
                  >
                    Вступайте <br />в сообщество
                    <br />
                    <span style={{ color: "#edbecc" }}>трихологов</span>
                  </div>
                  <p className="mt-4 text-sm text-white/50">
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
                      <div className="group relative overflow-hidden rounded-2xl bg-[#4a4a4a] p-8 transition-all duration-300 hover:shadow-xl lg:p-10">
                        <div
                          className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-20"
                          style={{ background: "linear-gradient(to left, #edbecc, transparent)" }}
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
                              className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold text-[#4a4a4a]"
                              style={{ background: "#edbecc" }}
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
                              className="mt-3 text-xs font-medium"
                              style={{ color: "#edbecc" }}
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
                          style={{ background: "#edbecc" }}
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
