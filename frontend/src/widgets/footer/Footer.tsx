"use client";

import Link from "next/link";

import { useDocuments } from "@/entities/document";
import { usePublicSettings } from "@/entities/settings";
import { ROUTES } from "@/shared/config";
import { trimStringOrNull } from "@/shared/lib";

import { PaymentMethodsStrip } from "./PaymentMethodsStrip";

const FOOTER_DOCUMENTS_LIMIT = 4;

const FALLBACK = {
  contact_email: "info@trichologia.ru",
  contact_phone: "+7 (495) 545-43-75",
  site_name: "Профессиональное общество Трихологов",
};

export const Footer = () => {
  const { data: settings } = usePublicSettings();
  const { data: documentsData, isSuccess: documentsLoaded } = useDocuments();
  const footerDocuments = documentsLoaded
    ? (documentsData?.data ?? [])
        .filter((d) => d.is_active)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .slice(0, FOOTER_DOCUMENTS_LIMIT)
    : [];
  const email = settings?.contact_email ?? FALLBACK.contact_email;
  const phone = settings?.contact_phone ?? FALLBACK.contact_phone;
  const siteName = settings?.site_name ?? FALLBACK.site_name;
  const telegramLink = trimStringOrNull(settings?.telegram_bot_link);

  return (
    <>
    <footer className="border-t border-border bg-[#4a4a4a]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-start">
          {/* Лого + описание */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent">
                <span className="text-sm font-bold text-accent-contrast">АТ</span>
              </div>
              <div className="min-w-0 leading-[1.15]">
                <span className="block font-heading text-[10px] font-semibold tracking-wide text-white sm:text-[11px]">
                  Профессиональное общество
                </span>
                <span className="block font-heading text-[10px] font-semibold tracking-wide text-white/70 sm:text-[11px]">
                  Трихологов
                </span>
              </div>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-white/40">
              Профессиональное объединение врачей-трихологов России.
              ОГРН 1127799002924 · ИНН 7718747218
            </p>
            <div className="mt-6">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/60"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}
              >
                с 2012 года
              </span>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Навигация
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Правление", href: ROUTES.PRAVLENIE },
                { label: "Врачи", href: ROUTES.DOCTORS },
                { label: "Мероприятия", href: ROUTES.EVENTS },
                { label: "Статьи", href: ROUTES.ARTICLES },
                { label: "Документы", href: ROUTES.DOCUMENTS },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Членство */}
          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Членство
            </h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Вступить", href: ROUTES.REGISTER },
                { label: "Войти", href: ROUTES.LOGIN },
                { label: "Личный кабинет", href: ROUTES.CABINET },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/50 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
              Контакты
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-white/50">
              <a href={`mailto:${email}`} className="transition-colors hover:text-white">
                {email}
              </a>
              <a href={`tel:${phone.replace(/\D/g, "")}`} className="transition-colors hover:text-white">
                {phone}
              </a>
              {telegramLink && (
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Telegram
                </a>
              )}
              <span className="text-xs leading-relaxed">
                Москва, Спартаковская пл., д.&nbsp;14, стр.&nbsp;4, офис 4107
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} {siteName}. Все права защищены.
          </p>
          {footerDocuments.length > 0 && (
            <nav
              className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/25"
              aria-label="Документы организации"
            >
              {footerDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={ROUTES.DOCUMENT(doc.slug)}
                  className="transition-colors hover:text-white/50"
                >
                  {doc.title}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
    <PaymentMethodsStrip />
    </>
  );
};
