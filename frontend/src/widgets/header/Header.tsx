"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/shared/lib";
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href={ROUTES.HOME} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
            <span className="text-sm font-bold text-accent-contrast">АТ</span>
          </div>
          <span className="hidden text-sm font-semibold text-text-primary sm:block">
            Профессиональное общество трихологов
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
