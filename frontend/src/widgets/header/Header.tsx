"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { usePublicSettings } from "@/entities/settings";
import { useAuth } from "@/providers/AuthProvider";
import { cn, trimStringOrNull } from "@/shared/lib";
import { ROUTES } from "@/shared/config";
import { Button } from "@/shared/ui";

const NAV_ITEMS = [
  { label: "Правление", href: ROUTES.PRAVLENIE },
  { label: "Врачи", href: ROUTES.DOCTORS },
  { label: "Мероприятия", href: ROUTES.EVENTS },
  { label: "Статьи", href: ROUTES.ARTICLES },
  { label: "Документы", href: ROUTES.DOCUMENTS },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { data: settings } = usePublicSettings();
  const telegramLink = trimStringOrNull(settings?.telegram_bot_link);
  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-bg-secondary/95 backdrop-blur-sm transition-shadow duration-300",
        isScrolled ? "border-border shadow-sm" : "border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link
          href={ROUTES.HOME}
          className="flex min-w-0 max-w-[calc(100%-3.25rem)] items-center gap-1.5 sm:max-w-none sm:gap-3 lg:shrink-0"
        >
          <span className="relative block h-9 w-[4.75rem] shrink-0 sm:w-28 md:w-32">
            <Image
              src="/logo.png"
              alt={settings?.site_name ?? "Профессиональное общество трихологов"}
              fill
              className="object-contain object-left"
            />
          </span>
          <span className="flex min-w-0 max-w-[6.25rem] flex-col justify-center leading-[1.1] sm:max-w-[7.5rem] md:max-w-none">
            <span className="font-heading text-[9px] font-semibold tracking-wide text-text-primary sm:text-[10px] lg:text-[11px]">
              Ассоциация
            </span>
            <span className="font-heading text-[9px] font-semibold tracking-wide text-text-muted sm:text-[10px] lg:text-[11px]">
              трихологов России
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                pathname === item.href
                  ? "bg-accent/10 font-medium text-text-primary"
                  : "text-text-secondary hover:bg-bg hover:text-text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {telegramLink && (
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Telegram
            </a>
          )}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link href={ROUTES.CABINET}>
                    <Button variant="primary" size="sm">
                      Личный кабинет
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <Link href={ROUTES.LOGIN}>
                    <Button variant="ghost" size="sm">
                      Войти
                    </Button>
                  </Link>
                  <Link href={ROUTES.REGISTER}>
                    <Button variant="primary" size="sm">
                      Стать членом
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg lg:hidden"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileOpen && (
        <div className="border-t border-border bg-bg-secondary px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-accent/10 font-medium text-text-primary"
                    : "text-text-secondary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {telegramLink && (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-4 py-3 text-sm text-text-secondary transition-colors hover:bg-bg hover:text-text-primary"
              >
                Telegram
              </a>
            )}
            {isAuthenticated ? (
              <>
                <Link href={ROUTES.CABINET}>
                  <Button fullWidth>Личный кабинет</Button>
                </Link>
                <Button variant="secondary" fullWidth onClick={logout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="secondary" fullWidth>
                    Войти
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button fullWidth>Стать членом</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
