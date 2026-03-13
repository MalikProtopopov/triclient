/*
 * VARIANT 1 — «Клиническая элегантность» (Clinical Elegance)
 *
 * Refined minimalism inspired by premium medical environments.
 * Typography-first approach: Playfair Display serifs create editorial hierarchy.
 * Rose (#EDBECC) as accent underlines, CTA fills, and delicate separators.
 * Non-standard layout: numbered horizontal mission list (not grid),
 * split CTA with left list + right full-bleed typography.
 */

"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

type Tab = "landing" | "doctor" | "admin";

export const ClinicalElegance = () => {
  const [tab, setTab] = useState<Tab>("landing");

  return (
    <div className="theme-clinical" style={{ fontFamily: "var(--font-raleway), system-ui, sans-serif" }}>
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
            className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
              tab === t.key
                ? "bg-[#edbecc] text-[#4a4a4a] font-medium"
                : "text-[#808080] hover:text-[#4a4a4a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "landing" && <ClinicalLanding />}
      {tab === "doctor" && <ClinicalDoctorCard />}
      {tab === "admin" && <ClinicalAdminCard />}
    </div>
  );
};

const ClinicalLanding = () => (
  <div className="space-y-0">
    {/* Hero — минималистичный, текст доминирует */}
    <section className="relative bg-white pb-16 pt-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:items-end">
        <div>
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c5c5c5]">
            Профессиональное медицинское объединение · с 2009
          </p>
          <h1
            className="mb-6 text-5xl font-bold leading-[1.0] text-[#4a4a4a] lg:text-7xl"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Ассоциация
            <br />
            <span className="relative inline-block">
              трихологов
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#edbecc]" />
            </span>
            <br />
            России
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-[#6b6b6b]">
            Строгая сертификация, профессиональное сообщество, ежегодные конференции.
            Более 500 верифицированных специалистов по всей России.
          </p>
          <button className="group inline-flex items-center gap-3 rounded-full bg-[#edbecc] px-8 py-3.5 text-sm font-semibold text-[#4a4a4a] transition-all duration-300 hover:gap-4 hover:shadow-lg hover:shadow-[#edbecc]/30">
            Стать членом ассоциации
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Правая колонка — статистика вертикально */}
        <div className="hidden border-l border-[#e0e0e0] pl-8 lg:block">
          {[
            { num: "500+", label: "членов" },
            { num: "15", label: "лет" },
            { num: "42", label: "города" },
          ].map((s, i) => (
            <div key={s.label} className={i > 0 ? "mt-6 border-t border-[#f0f0f0] pt-6" : ""}>
              <div
                className="text-4xl font-bold text-[#edbecc]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {s.num}
              </div>
              <div className="mt-0.5 text-xs tracking-wider text-[#c5c5c5]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Горизонтальная линия-разделитель */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#edbecc]/60 via-[#e0e0e0] to-transparent" />
    </section>

    {/* Миссия — нумерованный список, не сетка */}
    <section className="py-14">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c5c5c5]">
        01 · Миссия
      </p>
      <h2
        className="mb-10 text-3xl font-bold text-[#4a4a4a]"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        Зачем нужна ассоциация
      </h2>

      <div className="divide-y divide-[#f0f0f0]">
        {[
          {
            n: "01",
            title: "Стандарты качества",
            desc: "Строгая сертификация и постоянный контроль квалификации. В каталоге — только верифицированные специалисты.",
          },
          {
            n: "02",
            title: "Профессиональное сообщество",
            desc: "Закрытый чат, клинические разборы, поддержка коллег. Ассоциация — живое сообщество, не формальная структура.",
          },
          {
            n: "03",
            title: "Образование и конференции",
            desc: "Ежегодные конференции, вебинары и семинары по льготным ценам. Доступ к фотоархивам и записям докладов.",
          },
        ].map((item) => (
          <div
            key={item.n}
            className="group grid gap-4 py-8 lg:grid-cols-[72px_1fr_160px] lg:items-center"
          >
            <span
              className="font-bold text-5xl leading-none text-[#e0e0e0] transition-colors duration-500 group-hover:text-[#edbecc]/40"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {item.n}
            </span>
            <div>
              <h3
                className="mb-1 text-lg font-semibold text-[#4a4a4a]"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#6b6b6b]">{item.desc}</p>
            </div>
            <div className="lg:text-right">
              <span className="inline-block rounded-full border border-[#edbecc]/40 bg-[#edbecc]/10 px-4 py-1.5 text-xs text-[#4a4a4a]">
                Узнать больше
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA — split, левый список + правый полноценный блок */}
    <section className="overflow-hidden rounded-3xl" style={{ border: "1px solid #e0e0e0" }}>
      <div className="grid lg:grid-cols-2">
        <div className="bg-white p-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#c5c5c5]">
            02 · Членство
          </p>
          <h2
            className="mb-6 text-2xl font-bold text-[#4a4a4a]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Преимущества членства
          </h2>
          <ul className="space-y-3">
            {[
              "Публикация в каталоге верифицированных врачей",
              "Доступ к закрытому профессиональному чату",
              "Льготные цены на конференции и семинары",
              "Именной сертификат члена ассоциации",
              "Участие в выборах президента",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-[#4a4a4a]">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#edbecc]">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <button className="mt-8 rounded-full bg-[#edbecc] px-8 py-3 text-sm font-semibold text-[#4a4a4a] transition-all duration-300 hover:shadow-md">
            Зарегистрироваться
          </button>
        </div>

        {/* Правая — большая цитата/декоративный текст */}
        <div className="relative flex items-center justify-center overflow-hidden bg-[#4a4a4a] px-8 py-12">
          <div
            className="absolute left-0 top-0 select-none text-[180px] font-bold leading-none text-white opacity-[0.03]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            АТ
          </div>
          <div className="relative text-center">
            <p
              className="text-4xl font-bold leading-snug text-white lg:text-5xl"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Вступайте
              <br />в сообщество
              <br />
              <span style={{ color: "#edbecc" }}>трихологов</span>
            </p>
            <p className="mt-4 text-xs text-white/40">
              Рассматриваем заявки в течение 2–3 рабочих дней
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

const ClinicalDoctorCard = () => (
  <div className="mx-auto max-w-2xl">
    {/* Асимметричная карточка — аватар слева, текст справа, снизу инфоблоки */}
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid #e0e0e0" }}>
      {/* Верхняя полоса с градиентом */}
      <div className="h-1.5 bg-gradient-to-r from-[#edbecc] via-[#edbecc]/50 to-transparent" />

      <div className="p-8">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-semibold text-[#4a4a4a]"
              style={{ background: "linear-gradient(135deg, #edbecc30, #edbecc10)" }}
            >
              ЕИ
            </div>
          </div>
          <div className="flex-1">
            <h2
              className="text-2xl font-bold text-[#4a4a4a]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Елена Сергеевна Иванова
            </h2>
            <p className="mt-1 text-sm text-[#6b6b6b]">Врач-трихолог</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="rounded-full bg-[#edbecc]/20 px-3 py-0.5 text-xs font-medium text-[#4a4a4a]">
                к.м.н.
              </span>
              <div className="flex items-center gap-1 text-xs text-[#808080]">
                <MapPin className="h-3 w-3" /> Москва
              </div>
            </div>
          </div>
        </div>

        {/* Инфоблоки — горизонтально, не стэком */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl bg-[#fafafa] p-3" style={{ border: "1px solid #f0f0f0" }}>
            <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">Клиника</div>
            <div className="text-xs text-[#4a4a4a] leading-snug">«Эстетик»</div>
          </div>
          <div className="rounded-xl bg-[#fafafa] p-3" style={{ border: "1px solid #f0f0f0" }}>
            <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">Опыт</div>
            <div className="text-xs text-[#4a4a4a]">15+ лет</div>
          </div>
          <div className="rounded-xl bg-[#fafafa] p-3" style={{ border: "1px solid #f0f0f0" }}>
            <div className="mb-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">Публикации</div>
            <div className="text-xs text-[#4a4a4a]">20+</div>
          </div>
        </div>

        {/* О враче */}
        <p className="mt-5 border-l-2 border-[#edbecc] pl-4 text-sm leading-relaxed text-[#6b6b6b]">
          Специализируется на лечении алопеции, себорейного дерматита и восстановлении
          волос после химиотерапии. Автор 20+ научных публикаций.
        </p>

        {/* Контакты — одна строка */}
        <div className="mt-5 flex gap-4 border-t border-[#f0f0f0] pt-5">
          <div className="flex items-center gap-1.5 text-sm text-[#4a4a4a] transition-colors hover:text-[#edbecc] cursor-pointer">
            <Phone className="h-3.5 w-3.5 text-[#c5c5c5]" /> +7 (495) 123-45-67
          </div>
          <div className="flex items-center gap-1.5 text-sm text-[#4a4a4a] transition-colors hover:text-[#edbecc] cursor-pointer">
            <Mail className="h-3.5 w-3.5 text-[#c5c5c5]" /> ivanova@clinic.ru
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClinicalAdminCard = () => (
  <div className="mx-auto max-w-2xl">
    <div className="overflow-hidden rounded-2xl bg-white" style={{ border: "1px solid #e0e0e0" }}>
      {/* Заголовок модерации */}
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-sm font-medium text-[#4a4a4a]">Новая заявка на вступление</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-[#c5c5c5]">
          <Clock className="h-3.5 w-3.5" /> 2 марта 2026
        </span>
      </div>

      <div className="p-6">
        {/* Врач */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold text-[#4a4a4a]" style={{ background: "#edbecc20" }}>
            АП
          </div>
          <div>
            <h3
              className="text-lg font-bold text-[#4a4a4a]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Андрей Владимирович Петров
            </h3>
            <p className="text-sm text-[#6b6b6b]">
              <MapPin className="mr-0.5 inline h-3 w-3" /> Санкт-Петербург · Медицинский центр «Волос» · д.м.н.
            </p>
          </div>
        </div>

        {/* Контакты */}
        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-[#fafafa] px-3 py-2" style={{ border: "1px solid #f0f0f0" }}>
            <div className="text-[9px] uppercase tracking-wider text-[#c5c5c5]">Email</div>
            <div className="text-[#4a4a4a]">doctor.petrov@email.com</div>
          </div>
          <div className="rounded-lg bg-[#fafafa] px-3 py-2" style={{ border: "1px solid #f0f0f0" }}>
            <div className="text-[9px] uppercase tracking-wider text-[#c5c5c5]">Телефон</div>
            <div className="text-[#4a4a4a]">+7 (812) 234-56-78</div>
          </div>
        </div>

        {/* Документы */}
        <div className="mb-5">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">
            Документы
          </p>
          {[
            "Диплом ВМО — diploma_petrov.pdf",
            "Сертификат переподготовки — cert_trich.pdf",
            "Сертификат онколога — cert_onco.pdf",
          ].map((doc) => (
            <div
              key={doc}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#4a4a4a] transition-colors hover:bg-[#edbecc]/5"
              style={{ border: "1px solid #f0f0f0", marginTop: "4px" }}
            >
              <FileText className="h-3.5 w-3.5 text-[#c5c5c5]" />
              <span className="flex-1">{doc}</span>
              <ChevronRight className="h-3.5 w-3.5 text-[#c5c5c5]" />
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 border-t border-[#f0f0f0] pt-5">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#edbecc] py-3 text-sm font-semibold text-[#4a4a4a] transition-all duration-300 hover:shadow-md">
            <CheckCircle className="h-4 w-4" /> Одобрить
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#e0e0e0] py-3 text-sm text-[#808080] transition-all duration-300 hover:border-red-300 hover:text-red-500">
            <XCircle className="h-4 w-4" /> Отклонить
          </button>
        </div>
      </div>
    </div>
  </div>
);
