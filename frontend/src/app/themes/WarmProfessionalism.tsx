/*
 * VARIANT 3 — «Тёплый профессионализм» (Warm Professionalism)
 *
 * Soft, trustworthy, human. Hero with overlapping decorative circles + big
 * typographic pull-quote. Mission as staggered horizontal list with large icons.
 * CTA: two-column — left benefit list, right warm accent block.
 * Libre Baskerville (serif) + Nunito (rounded body).
 */

"use client";

import { useState } from "react";
import {
  Shield,
  Users,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
  Heart,
} from "lucide-react";

type Tab = "landing" | "doctor" | "admin";

export const WarmProfessionalism = () => {
  const [tab, setTab] = useState<Tab>("landing");

  return (
    <div className="theme-warm" style={{ fontFamily: "var(--font-nunito), system-ui, sans-serif" }}>
      <div className="mb-6 flex gap-2 border-b border-[#e0e0e0] pb-4">
        {(
          [
            { key: "landing", label: "Главная" },
            { key: "doctor", label: "Карточка врача" },
            { key: "admin", label: "Модерация" },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-2xl px-4 py-2 text-sm transition-all duration-300 ${
              tab === t.key
                ? "bg-[#edbecc]/20 text-[#4a4a4a] font-semibold shadow-sm"
                : "text-[#808080] hover:text-[#4a4a4a] hover:bg-[#edbecc]/5"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "landing" && <WarmLanding />}
      {tab === "doctor" && <WarmDoctorCard />}
      {tab === "admin" && <WarmAdminCard />}
    </div>
  );
};

const WarmLanding = () => (
  <div className="space-y-10">
    {/* Hero — мягкий радиальный фон, текст и большой pull-quote */}
    <section
      className="relative overflow-hidden rounded-[24px] px-10 py-12"
      style={{
        background: "radial-gradient(ellipse at 70% 50%, rgba(237,190,204,0.18) 0%, #ffffff 60%)",
        boxShadow: "0 4px 32px rgba(237,190,204,0.12)",
        border: "1px solid rgba(237,190,204,0.2)",
      }}
    >
      {/* Декоративные кружки — пересекаются с контентом */}
      <div
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30"
        style={{ background: "linear-gradient(135deg, #c5c5c5, #e0e0e0)" }}
      />
      <div
        className="absolute -right-4 top-8 h-36 w-36 rounded-full opacity-20"
        style={{ background: "#edbecc" }}
      />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#edbecc]" />
            <span className="text-sm font-semibold text-[#6b6b6b]">Здоровье волос · профессионально</span>
          </div>
          <h1
            className="mb-5 text-4xl font-bold leading-tight text-[#4a4a4a] lg:text-5xl"
            style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
          >
            Ассоциация
            <br />
            трихологов
            <br />
            <span style={{ color: "#c5a0b0" }}>России</span>
          </h1>
          <p className="mb-7 max-w-md text-base leading-relaxed text-[#6b6b6b]">
            Профессиональное объединение врачей-специалистов. Помогаем нашим членам расти
            и оказывать помощь высочайшего уровня.
          </p>
          <button
            className="rounded-2xl bg-[#edbecc] px-8 py-3.5 text-sm font-bold text-[#4a4a4a] transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
            style={{ boxShadow: "0 6px 20px rgba(237,190,204,0.35)" }}
          >
            Стать членом ассоциации
          </button>
        </div>

        {/* Pull-quote справа — красиво и нестандартно */}
        <div className="hidden text-right lg:block">
          <div
            className="mb-1 text-7xl font-bold leading-none text-[#edbecc]/30 select-none"
            style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
          >
            &ldquo;
          </div>
          <p
            className="max-w-[220px] text-right text-lg font-bold leading-snug text-[#4a4a4a]"
            style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
          >
            Качество.<br />Сообщество.<br />Развитие.
          </p>
          <p className="mt-2 text-xs text-[#c5c5c5]">— девиз ассоциации</p>
        </div>
      </div>

      {/* Статы — горизонтальная строка внизу */}
      <div className="relative mt-8 grid grid-cols-3 gap-4 border-t border-[#edbecc]/20 pt-6">
        {[
          { num: "500+", label: "членов" },
          { num: "15 лет", label: "работы" },
          { num: "42", label: "города" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-3xl font-bold text-[#4a4a4a]"
              style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
            >
              {s.num}
            </div>
            <div className="text-xs text-[#c5c5c5]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Миссия — горизонтальный staggered список */}
    <section>
      <div className="mb-6">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5c5c5]">
          Наши ценности
        </p>
        <h2
          className="text-3xl font-bold text-[#4a4a4a]"
          style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
        >
          Почему ассоциация
        </h2>
      </div>

      <div className="space-y-4">
        {[
          {
            icon: Shield,
            title: "Качество и сертификация",
            desc: "Строгая верификация подтверждает высокий уровень квалификации. Пациенты находят проверенных специалистов через каталог.",
            align: "left",
          },
          {
            icon: Users,
            title: "Профессиональное сообщество",
            desc: "Закрытый чат, обмен опытом, обсуждение клинических случаев. Вместе сильнее.",
            align: "right",
          },
          {
            icon: GraduationCap,
            title: "Образование и конференции",
            desc: "Ежегодные конференции, вебинары и мастер-классы по льготным ценам. Доступ к записям и материалам.",
            align: "left",
          },
        ].map((item, i) => (
          <div
            key={item.title}
            className={`group flex gap-5 rounded-2xl bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 ${
              i === 1 ? "ml-6" : ""
            }`}
            style={{
              boxShadow: "0 2px 20px rgba(237,190,204,0.1)",
              border: "1px solid rgba(237,190,204,0.15)",
            }}
          >
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, rgba(237,190,204,0.25), rgba(237,190,204,0.1))" }}
            >
              <item.icon className="h-6 w-6 text-[#4a4a4a]" />
            </div>
            <div>
              <h3
                className="mb-1 font-bold text-[#4a4a4a]"
                style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6b6b6b]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA — тёплый, радиальный градиент */}
    <section
      className="rounded-[24px] p-10"
      style={{
        background: "linear-gradient(135deg, rgba(237,190,204,0.08), rgba(237,190,204,0.18))",
        border: "1px solid rgba(237,190,204,0.2)",
      }}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2
            className="mb-5 text-2xl font-bold text-[#4a4a4a]"
            style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
          >
            Присоединяйтесь к нам
          </h2>
          <ul className="space-y-2.5">
            {[
              "Публикация в каталоге верифицированных врачей",
              "Доступ к закрытому профессиональному чату",
              "Льготные цены на конференции и семинары",
              "Именной сертификат члена ассоциации",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[#4a4a4a]">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#edbecc]">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-shrink-0 flex-col items-center gap-3">
          <button
            className="rounded-2xl bg-[#edbecc] px-10 py-4 text-sm font-bold text-[#4a4a4a] transition-all duration-300 hover:shadow-xl active:scale-[0.98]"
            style={{ boxShadow: "0 6px 20px rgba(237,190,204,0.35)" }}
          >
            Зарегистрироваться
          </button>
          <p className="text-xs text-[#c5c5c5]">Рассматриваем за 2–3 дня</p>
        </div>
      </div>
    </section>
  </div>
);

const WarmDoctorCard = () => (
  <div className="mx-auto max-w-2xl">
    <div
      className="overflow-hidden rounded-2xl bg-white"
      style={{
        boxShadow: "0 6px 32px rgba(237,190,204,0.2)",
        border: "1px solid rgba(237,190,204,0.2)",
      }}
    >
      {/* Тёплый градиентный хедер */}
      <div
        className="px-6 py-6"
        style={{
          background: "linear-gradient(135deg, rgba(237,190,204,0.08), rgba(237,190,204,0.2))",
        }}
      >
        <div className="flex gap-5">
          <div className="relative">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-bold text-[#4a4a4a]"
              style={{ background: "linear-gradient(135deg, #c5c5c5, #e0e0e0)" }}
            >
              ЕИ
            </div>
            <div
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#edbecc]"
            >
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div>
            <h2
              className="text-xl font-bold text-[#4a4a4a]"
              style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
            >
              Елена Сергеевна Иванова
            </h2>
            <p className="mt-0.5 text-sm text-[#6b6b6b]">Врач-трихолог · к.м.н.</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#808080]">
              <MapPin className="h-3.5 w-3.5 text-[#edbecc]" /> Москва
            </div>
            <span
              className="mt-2 inline-block rounded-full bg-[#edbecc] px-3 py-0.5 text-xs font-semibold text-[#4a4a4a]"
            >
              Член ассоциации
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {/* Место работы */}
        <div
          className="rounded-xl bg-[#fafafa] px-4 py-3"
          style={{ border: "1px solid #e0e0e0" }}
        >
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#c5c5c5]">
            Место работы
          </p>
          <p className="text-sm text-[#4a4a4a]">Клиника красоты «Эстетик» · Врач-трихолог</p>
        </div>

        {/* О враче */}
        <p className="text-sm leading-relaxed text-[#6b6b6b]">
          Более 15 лет опыта в области трихологии. Специализируется на лечении алопеции,
          себорейного дерматита и восстановлении волос после химиотерапии.
          Автор 20+ научных публикаций.
        </p>

        {/* Контакты */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Phone, text: "+7 (495) 123-45-67" },
            { icon: Mail, text: "ivanova@clinic.ru" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#fafafa] px-4 py-2.5 text-sm text-[#4a4a4a] transition-colors hover:bg-[#edbecc]/10"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <Icon className="h-4 w-4 text-[#edbecc]" /> {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const WarmAdminCard = () => (
  <div className="mx-auto max-w-2xl">
    <div
      className="overflow-hidden rounded-2xl bg-white"
      style={{
        boxShadow: "0 4px 24px rgba(237,190,204,0.15)",
        border: "1px solid rgba(237,190,204,0.2)",
      }}
    >
      {/* Статус */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          <span className="text-sm font-semibold text-amber-600">Ожидает проверки</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-[#c5c5c5]">
          <Clock className="h-3.5 w-3.5" /> 2 марта 2026
        </span>
      </div>

      {/* Информация о враче */}
      <div
        className="mx-5 rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg, rgba(237,190,204,0.06), rgba(237,190,204,0.14))",
        }}
      >
        <div className="flex gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-base font-bold text-[#4a4a4a]"
            style={{ background: "linear-gradient(135deg, #c5c5c5, #e0e0e0)" }}
          >
            АП
          </div>
          <div>
            <h3
              className="text-base font-bold text-[#4a4a4a]"
              style={{ fontFamily: "var(--font-libre), Georgia, serif" }}
            >
              Андрей Владимирович Петров
            </h3>
            <p className="text-sm text-[#6b6b6b]">
              <MapPin className="mr-0.5 inline h-3.5 w-3.5 text-[#edbecc]" />
              Санкт-Петербург · д.м.н.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Поля */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Email", value: "doctor.petrov@email.com" },
            { label: "Телефон", value: "+7 (812) 234-56-78" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-[#fafafa] p-3"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <div className="text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">
                {label}
              </div>
              <div className="text-sm text-[#4a4a4a]">{value}</div>
            </div>
          ))}
        </div>

        {/* Документы */}
        <div>
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">
            Документы
          </p>
          {["Диплом ВМО — diploma_petrov.pdf", "Сертификат переподготовки — cert_trich.pdf"].map((d) => (
            <div
              key={d}
              className="flex cursor-pointer items-center gap-2 rounded-xl py-2.5 px-3 text-sm text-[#4a4a4a] transition-colors hover:bg-[#edbecc]/5"
            >
              <FileText className="h-4 w-4 text-[#edbecc]" />
              <span className="flex-1">{d}</span>
              <ChevronRight className="h-4 w-4 text-[#c5c5c5]" />
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 pt-1">
          <button
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-[#4a4a4a] transition-all duration-300 hover:shadow-lg active:scale-[0.98]"
            style={{ background: "#edbecc", boxShadow: "0 4px 16px rgba(237,190,204,0.3)" }}
          >
            <CheckCircle className="h-4 w-4" /> Одобрить
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#e0e0e0] py-3 text-sm text-[#808080] transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-500">
            <XCircle className="h-4 w-4" /> Отклонить
          </button>
        </div>
      </div>
    </div>
  </div>
);
