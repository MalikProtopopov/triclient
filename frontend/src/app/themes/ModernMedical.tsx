/*
 * VARIANT 2 — «Современная медицина» (Modern Medical)
 *
 * Editorial / magazine aesthetic. Dark hero with left-aligned vertical stats,
 * mission as a large featured card + stacked labels on the right.
 * CTA — split pill-bar design.
 * Cormorant Garamond (display) + Mulish (UI).
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
  ArrowUpRight,
} from "lucide-react";

type Tab = "landing" | "doctor" | "admin";

export const ModernMedical = () => {
  const [tab, setTab] = useState<Tab>("landing");

  return (
    <div className="theme-modern" style={{ fontFamily: "var(--font-mulish), system-ui, sans-serif" }}>
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
            className={`rounded-lg px-4 py-2 text-sm transition-all duration-300 ${
              tab === t.key
                ? "bg-[#4a4a4a] text-[#edbecc] font-medium"
                : "text-[#808080] hover:text-[#4a4a4a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "landing" && <ModernLanding />}
      {tab === "doctor" && <ModernDoctorCard />}
      {tab === "admin" && <ModernAdminCard />}
    </div>
  );
};

const ModernLanding = () => (
  <div className="space-y-0">
    {/* Hero — тёмный, асимметричный: большой заголовок + вертикальные статы сбоку */}
    <section className="relative overflow-hidden rounded-t-3xl bg-[#4a4a4a]">
      {/* Большой фоновый декоративный текст */}
      <div
        className="pointer-events-none absolute -right-4 top-0 select-none text-[220px] font-bold leading-none text-[#edbecc] opacity-[0.04]"
        style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
      >
        AT
      </div>

      <div className="relative grid lg:grid-cols-[1fr_120px]">
        {/* Основной контент */}
        <div className="px-10 py-14 lg:px-14">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-px w-8 bg-[#edbecc]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#edbecc]/60">
              Ассоциация трихологов
            </span>
          </div>

          <h1
            className="mb-6 text-5xl font-bold leading-[0.95] text-white lg:text-7xl"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Трихологи
            <br />
            <span className="text-[#edbecc]">России</span>
          </h1>

          <p className="mb-8 max-w-md text-sm leading-relaxed text-[#a0a0a0] lg:text-base">
            Профессиональное объединение врачей. Сертификация, конференции,
            обмен опытом и доступ к закрытому сообществу специалистов.
          </p>

          <button className="group inline-flex items-center gap-3 rounded-lg bg-[#edbecc] px-7 py-3.5 text-sm font-bold text-[#4a4a4a] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(237,190,204,0.25)]">
            Вступить в ассоциацию
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>

          {/* Горизонтальная линия разделитель */}
          <div className="mt-10 h-px bg-white/10" />

          {/* Статы в строку */}
          <div className="mt-6 flex gap-8">
            {[
              { num: "500+", label: "членов" },
              { num: "15", label: "лет" },
              { num: "42", label: "города" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className="text-3xl font-bold text-[#edbecc] lg:text-4xl"
                  style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
                >
                  {s.num}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[#606060]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Вертикальная боковая полоса */}
        <div className="hidden items-stretch border-l border-white/10 lg:flex">
          <div className="flex flex-col items-center justify-center gap-8 px-5 py-10">
            {["Сертификация", "Сообщество", "Конференции"].map((label) => (
              <div
                key={label}
                className="writing-vertical text-[10px] font-semibold uppercase tracking-[0.25em] text-white/20"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Разделитель металлик */}
    <div className="h-[2px] bg-gradient-to-r from-[#c5c5c5] via-[#e0e0e0] to-[#d0d0d0]" />

    {/* Миссия — большой featured блок + список тегов */}
    <section className="rounded-b-3xl bg-white">
      <div className="grid divide-x divide-[#e0e0e0] lg:grid-cols-[2fr_1fr]">
        {/* Левая часть — большая карточка */}
        <div className="p-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5c5c5]">
            Почему ассоциация
          </p>
          <h2
            className="mb-6 text-3xl font-bold text-[#4a4a4a]"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
          >
            Профессиональное<br />признание
          </h2>
          <p className="mb-6 max-w-md text-sm leading-relaxed text-[#6b6b6b]">
            Членство в ассоциации — это знак качества для пациентов и коллег.
            Прохождение строгой верификации подтверждает ваш профессионализм
            и открывает доступ к закрытому экспертному сообществу.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: "Сертификация", desc: "Подтверждение квалификации и реестр специалистов" },
              { title: "Сообщество", desc: "Закрытый чат, клинические разборы, взаимная поддержка" },
              { title: "Мероприятия", desc: "Конференции и семинары по льготным ценам" },
              { title: "Публичность", desc: "Профиль в каталоге для пациентов" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-[#4a4a4a] p-4">
                <div className="mb-1.5 inline-block rounded bg-[#edbecc] px-2 py-0.5 text-[10px] font-bold text-[#4a4a4a]">
                  {item.title}
                </div>
                <p className="text-xs leading-relaxed text-[#a0a0a0]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Правая — CTA */}
        <div className="flex flex-col items-start justify-between p-8">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c5c5c5]">
              Членство
            </p>
            <ul className="space-y-2">
              {["Каталог", "Чат", "Льготы", "Сертификат", "Голосования"].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-[#4a4a4a]">
                  <Check className="h-3.5 w-3.5 text-[#edbecc]" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <button className="mt-6 w-full rounded-lg bg-[#4a4a4a] py-3 text-sm font-bold text-[#edbecc] transition-all duration-300 hover:bg-[#3a3a3a] hover:shadow-md">
            Зарегистрироваться
          </button>
        </div>
      </div>
    </section>
  </div>
);

const ModernDoctorCard = () => (
  <div className="mx-auto max-w-2xl">
    <div className="overflow-hidden rounded-2xl shadow-xl">
      {/* Dark header */}
      <div className="relative overflow-hidden bg-[#4a4a4a] px-6 py-5">
        {/* Декоративный фон */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/3 select-none text-right text-[96px] font-bold leading-none text-[#edbecc] opacity-[0.06]"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
        >
          М
        </div>
        <div className="relative flex gap-5">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[#edbecc]/20 text-xl font-bold text-[#edbecc]">
            ЕИ
          </div>
          <div>
            <h2
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Елена Сергеевна Иванова
            </h2>
            <p className="mt-0.5 text-sm text-[#a0a0a0]">Врач-трихолог</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded bg-[#edbecc] px-2 py-0.5 text-[10px] font-bold text-[#4a4a4a]">
                к.м.н.
              </span>
              <span className="text-xs text-[#606060]">
                <MapPin className="mr-0.5 inline h-3 w-3" /> Москва
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Металлический разделитель */}
      <div className="h-[2px] bg-gradient-to-r from-[#c5c5c5] via-[#e0e0e0] to-[#d0d0d0]" />

      {/* White body */}
      <div className="space-y-4 bg-white p-6">
        <div className="flex items-center gap-2 text-sm text-[#4a4a4a]">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#edbecc]/15">
            <MapPin className="h-3.5 w-3.5 text-[#edbecc]" />
          </div>
          Клиника красоты «Эстетик» · Врач-трихолог
        </div>

        <blockquote className="border-l-[3px] border-[#edbecc] pl-4 text-sm italic leading-relaxed text-[#6b6b6b]">
          Более 15 лет опыта в трихологии. Специализируется на лечении алопеции и
          восстановлении волос. Автор 20+ научных публикаций.
        </blockquote>

        <div className="flex gap-3 pt-1">
          {[
            { icon: Phone, text: "+7 (495) 123-45-67" },
            { icon: Mail, text: "ivanova@clinic.ru" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg bg-[#fafafa] px-3 py-2 text-xs text-[#4a4a4a] transition-colors hover:bg-[#edbecc]/10"
              style={{ border: "1px solid #e0e0e0" }}
            >
              <Icon className="h-3.5 w-3.5 text-[#edbecc]" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ModernAdminCard = () => (
  <div className="mx-auto max-w-2xl">
    <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid #e0e0e0" }}>
      {/* Шапка */}
      <div className="flex items-center justify-between bg-[#4a4a4a] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edbecc]/20 text-xs font-bold text-[#edbecc]">
            АП
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Андрей Владимирович Петров</div>
            <div className="text-xs text-[#808080]">Санкт-Петербург · Медицинский центр «Волос»</div>
          </div>
        </div>
        <span className="rounded bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
          На проверке
        </span>
      </div>

      <div className="h-[2px] bg-gradient-to-r from-[#c5c5c5] via-[#e0e0e0] to-[#d0d0d0]" />

      <div className="bg-white p-5 space-y-4">
        {/* Поля */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Email", value: "doctor.petrov@email.com" },
            { label: "Телефон", value: "+7 (812) 234-56-78" },
            { label: "Специализация", value: "Трихология, дерматология" },
            { label: "Степень", value: "д.м.н." },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">{label}</div>
              <div className="text-[#4a4a4a]">{value}</div>
            </div>
          ))}
        </div>

        {/* Документы */}
        <div className="border-t border-[#e0e0e0] pt-3">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-[#c5c5c5]">
            Документы
          </p>
          {["Диплом ВМО — diploma_petrov.pdf", "Сертификат переподготовки — cert_trich.pdf"].map((d) => (
            <div
              key={d}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#4a4a4a] transition-colors hover:bg-[#fafafa]"
            >
              <FileText className="h-4 w-4 text-[#edbecc]" />
              <span className="flex-1">{d}</span>
              <ChevronRight className="h-4 w-4 text-[#c5c5c5]" />
            </div>
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3 border-t border-[#e0e0e0] pt-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#4a4a4a] py-2.5 text-sm font-semibold text-[#edbecc] transition-all duration-300 hover:bg-[#3a3a3a]">
            <CheckCircle className="h-4 w-4" /> Одобрить
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#e0e0e0] py-2.5 text-sm text-[#808080] transition-all duration-300 hover:border-red-300 hover:text-red-500">
            <XCircle className="h-4 w-4" /> Отклонить
          </button>
        </div>
      </div>
    </div>
  </div>
);
