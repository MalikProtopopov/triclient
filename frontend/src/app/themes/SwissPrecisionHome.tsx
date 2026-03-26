"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Check, ArrowRight, Mail, Phone } from "lucide-react";

import { useEvents } from "@/entities/event";
import { useArticles } from "@/entities/article";
import { useAuth, shouldSkipClientOnboarding } from "@/providers/AuthProvider";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";

const mono = { fontFamily: "var(--sp-mono)" };

const BENEFITS = [
  "Публикация в каталоге верифицированных врачей",
  "Доступ к закрытому профессиональному чату",
  "Льготные цены на конференции и семинары",
  "Именной сертификат члена ассоциации",
];

const STATS = [
  { num: "500+", caption: "членов ассоциации" },
  { num: "14", caption: "лет работы" },
  { num: "XXII", caption: "конференции" },
  { num: "EHRS", caption: "международный партнёр" },
];

const MISSION = [
  {
    n: "01",
    title: "Стандарты качества",
    desc: "Строгая сертификация и контроль квалификации. В каталоге — только верифицированные специалисты.",
  },
  {
    n: "02",
    title: "Профессиональное сообщество",
    desc: "Закрытый чат, клинические разборы, поддержка коллег. Живое сообщество, а не формальная структура.",
  },
  {
    n: "03",
    title: "Образование и конференции",
    desc: "Ежегодные конференции, семинары и вебинары по льготным ценам. Доступ к записям и фотоархивам.",
  },
];

const NAV_LINKS = [
  { label: "О нас", href: ROUTES.DOCUMENTS },
  { label: "Врачи", href: ROUTES.DOCTORS },
  { label: "Мероприятия", href: ROUTES.EVENTS },
  { label: "Статьи", href: ROUTES.ARTICLES },
  { label: "Правление", href: ROUTES.PRAVLENIE },
];

export const SwissPrecisionHome = () => {
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
    <div className="theme-swiss-precision">
      {/* ── HEADER ── */}
      <header className="flex h-16 items-center justify-between border-b border-[#DCDFE4] bg-white px-6 lg:px-10">
        <Link href={ROUTES.HOME} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4637A] text-sm font-bold text-white">
            АТ
          </span>
          <span className="hidden flex-col text-[11px] font-semibold leading-[1.15] text-[#2C3340] sm:flex">
            <span>Профессиональное общество</span>
            <span className="font-medium text-[#5A6578]">Трихологов</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#4A5568] transition-colors hover:text-[#2C3340]"
              style={mono}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
          <button className="rounded-[6px] bg-[#2C3340] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3b4452]">
            {isOnboarded ? "Кабинет" : "Вступить"}
          </button>
        </Link>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="bg-[#FAFAFA]">
          <div className="mx-auto grid max-w-7xl gap-0 px-6 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
            <div className="lg:col-span-7 lg:pr-12">
              <p
                className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[#4A5568]"
                style={mono}
              >
                Профессиональное объединение · с 2012
              </p>
              <h1 className="font-heading text-[44px] font-bold leading-[1.05] tracking-[-0.025em] text-[#2C3340] lg:text-[64px]">
                Профессиональное общество
                <br />
                <span className="text-[#D4637A]">Трихологов</span>
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#4A5568]">
                Объединяем врачей-дерматологов, трихологов и специалистов по
                волосам. Сертификация, конференции и интеграция в мировую
                трихологию через EHRS.
              </p>
              <div className="mt-8 flex gap-3">
                <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                  <button className="inline-flex items-center gap-2 rounded-[6px] bg-[#D4637A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c0566c]">
                    {isOnboarded ? "Личный кабинет" : "Стать членом"}
                    <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
                  </button>
                </Link>
                <Link href={ROUTES.DOCTORS}>
                  <button className="rounded-[6px] border-[1.5px] border-[#DCDFE4] bg-transparent px-6 py-3 text-sm font-medium text-[#2C3340] transition-colors hover:border-[#D4637A]">
                    Каталог врачей
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-12 flex items-start lg:col-span-5 lg:mt-0 lg:border-l lg:border-[#DCDFE4] lg:pl-12">
              <div className="grid w-full grid-cols-2 gap-x-10 gap-y-8">
                {STATS.map((s) => (
                  <div key={s.caption}>
                    <div
                      className="text-3xl font-bold text-[#2C3340] lg:text-4xl"
                      style={mono}
                    >
                      {s.num}
                    </div>
                    <div className="mt-1 text-xs text-[#4A5568]">
                      {s.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="h-px bg-[#DCDFE4]" />
        </section>

        {/* ── MISSION ── */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p
            className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#4A5568]"
            style={mono}
          >
            Миссия
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-[#2C3340] lg:text-4xl">
            Зачем нужна ассоциация
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {MISSION.map((item, i) => (
              <motion.div
                key={item.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-lg border border-[#DCDFE4] border-t-[3px] border-t-[#D4637A] bg-white p-6 transition-colors hover:border-[#D4637A]"
              >
                <span className="text-sm font-bold text-[#DCDFE4]" style={mono}>
                  {item.n}
                </span>
                <h3 className="font-heading mt-3 text-lg font-semibold text-[#2C3340]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A5568]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA / MEMBERSHIP ── */}
        <section className="bg-[#F0F1F3]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28">
            <div>
              <p
                className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#4A5568]"
                style={mono}
              >
                Членство
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-[#2C3340]">
                Преимущества
              </h2>
              <ul className="mt-8 space-y-4">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-[#2C3340]">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#D4637A]">
                      <Check className="h-3 w-3 text-white" strokeWidth={2} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <Link href={isOnboarded ? ROUTES.CABINET : ROUTES.REGISTER}>
                <button className="mt-10 rounded-[6px] bg-[#D4637A] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#c0566c]">
                  {isOnboarded ? "Личный кабинет" : "Зарегистрироваться"}
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center rounded-lg border border-[#DCDFE4] bg-white p-10">
              <div className="w-full space-y-6">
                {([["Членов ассоциации","500+"],["Городов присутствия","42"],["Международный партнёр","EHRS"],["Ежегодный взнос","от 3 000 ₽"]] as const).map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between border-b border-[#DCDFE4] pb-3 last:border-0">
                    <span className="text-sm text-[#4A5568]">{label}</span>
                    <span className="text-lg font-bold text-[#2C3340]" style={mono}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p
                className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#4A5568]"
                style={mono}
              >
                Мероприятия
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-[#2C3340] lg:text-4xl">
                Ближайшие события
              </h2>
            </div>
            <Link
              href={ROUTES.EVENTS}
              className="hidden text-xs font-medium uppercase tracking-wide text-[#4A5568] transition-colors hover:text-[#D4637A] lg:block"
              style={mono}
            >
              Все мероприятия →
            </Link>
          </div>

          {eventsLoading ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-lg border border-[#DCDFE4] bg-[#F0F1F3]"
                />
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-[#4A5568]">
              Мероприятий пока не запланировано
            </p>
          ) : (
            <div className="space-y-6">
              {featuredEvent && (
                <Link href={ROUTES.EVENT(featuredEvent.slug)}>
                  <div className="group grid rounded-lg border border-[#DCDFE4] bg-white transition-colors hover:border-[#D4637A] lg:grid-cols-[200px_1fr_auto]">
                    <div className="flex flex-col items-center justify-center border-b border-[#DCDFE4] p-6 lg:border-b-0 lg:border-r">
                      <div
                        className="text-5xl font-bold text-[#2C3340]"
                        style={mono}
                      >
                        {new Date(featuredEvent.event_date).getDate()}
                      </div>
                      <div
                        className="mt-1 text-xs uppercase tracking-wider text-[#4A5568]"
                        style={mono}
                      >
                        {new Date(featuredEvent.event_date).toLocaleDateString(
                          "ru",
                          { month: "long" },
                        )}
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="inline-block rounded-[4px] border border-[#D4637A] px-2 py-0.5 text-[11px] text-[#D4637A]" style={mono}>
                        Ближайшее
                      </span>
                      <h3 className="font-heading mt-2 text-xl font-semibold text-[#2C3340]">
                        {featuredEvent.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#4A5568]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-[14px] w-[14px]" strokeWidth={1.25} />
                          {formatDate(featuredEvent.event_date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-[14px] w-[14px]" strokeWidth={1.25} />
                          {featuredEvent.location}
                        </span>
                      </div>
                    </div>
                    {featuredEvent.tariffs.length > 0 && (
                      <div className="flex items-center border-t border-[#DCDFE4] p-6 lg:border-l lg:border-t-0">
                        <div>
                          <div className="text-[10px] uppercase text-[#4A5568]" style={mono}>
                            от
                          </div>
                          <div className="text-xl font-bold text-[#2C3340]" style={mono}>
                            {Math.min(
                              ...featuredEvent.tariffs.map((t) => t.member_price),
                            ).toLocaleString("ru")}{" "}
                            ₽
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Link href={ROUTES.EVENT(event.slug)}>
                      <div className="group h-full rounded-lg border border-[#DCDFE4] bg-white transition-colors hover:border-[#D4637A]">
                        {event.cover_image_url && (
                          <div className="relative h-36 w-full overflow-hidden rounded-t-lg">
                            <Image
                              src={event.cover_image_url}
                              alt={event.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <p className="text-[11px] text-[#4A5568]" style={mono}>
                            {formatDate(event.event_date)}
                          </p>
                          <h3 className="mt-1.5 text-sm font-semibold leading-snug text-[#2C3340] line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4A5568]">
                            <MapPin className="h-[14px] w-[14px] flex-shrink-0" strokeWidth={1.25} />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── ARTICLES ── */}
        <section className="border-t border-[#DCDFE4] bg-[#FAFAFA]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p
                  className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#4A5568]"
                  style={mono}
                >
                  Публикации
                </p>
                <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-[#2C3340] lg:text-4xl">
                  Статьи и новости
                </h2>
              </div>
              <Link
                href={ROUTES.ARTICLES}
                className="hidden text-xs font-medium uppercase tracking-wide text-[#4A5568] transition-colors hover:text-[#D4637A] lg:block"
                style={mono}
              >
                Все статьи →
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link href={ROUTES.ARTICLE(article.slug)}>
                    <div className="group h-full overflow-hidden rounded-lg border border-[#DCDFE4] bg-white transition-colors hover:border-[#D4637A]">
                      <div className="relative h-44 w-full overflow-hidden">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-[#F0F1F3]" />
                        )}
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] text-[#4A5568]" style={mono}>
                          {formatDate(article.published_at)}
                        </p>
                        <h3 className="mt-1.5 text-sm font-semibold leading-snug text-[#2C3340] line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#4A5568] line-clamp-2">
                          {article.excerpt}
                        </p>
                        <span className="mt-3 inline-block text-xs font-medium text-[#4A5568] transition-colors group-hover:text-[#D4637A]" style={mono}>
                          Читать →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#DCDFE4] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto_auto]">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4637A] text-sm font-bold text-white">
                  АТ
                </span>
                <span className="flex flex-col text-sm font-semibold leading-tight text-[#2C3340]">
                  <span>Профессиональное общество</span>
                  <span className="text-xs font-medium text-[#5A6578]">Трихологов</span>
                </span>
              </div>
              <p className="mt-3 max-w-xs text-xs leading-relaxed text-[#4A5568]">
                Профессиональное объединение врачей-трихологов и дерматологов
                России. Сертификация, образование и международное сотрудничество.
              </p>
            </div>

            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#4A5568] transition-colors hover:text-[#2C3340]" style={mono}>
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-2 text-xs text-[#4A5568]">
              <div className="flex items-center gap-2"><Mail className="h-[14px] w-[14px]" strokeWidth={1.25} /> info@trichology.ru</div>
              <div className="flex items-center gap-2"><Phone className="h-[14px] w-[14px]" strokeWidth={1.25} /> +7 (495) 123-45-67</div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#DCDFE4] pt-6">
            <p className="text-[11px] text-[#4A5568]" style={mono}>
              © {new Date().getFullYear()} Профессиональное общество Трихологов
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
