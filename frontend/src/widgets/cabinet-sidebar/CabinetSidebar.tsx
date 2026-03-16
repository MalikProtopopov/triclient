"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  Globe,
  CreditCard,
  Calendar,
  Award,
  MessageCircle,
  Settings,
  Vote,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { usePersonalProfile } from "@/entities/profile";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";

interface NavItem {
  sectionKey: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

const ALL_NAV_ITEMS: NavItem[] = [
  { sectionKey: "cabinet", label: "Главная", href: ROUTES.CABINET, icon: Home },
  { sectionKey: "personal", label: "Личная информация", href: ROUTES.CABINET_PERSONAL, icon: User },
  { sectionKey: "public", label: "Публичный профиль", href: ROUTES.CABINET_PUBLIC, icon: Globe },
  { sectionKey: "payments", label: "Оплаты и подписка", href: ROUTES.CABINET_PAYMENTS, icon: CreditCard },
  { sectionKey: "events", label: "Мероприятия", href: ROUTES.CABINET_EVENTS, icon: Calendar },
  { sectionKey: "certificate", label: "Сертификат", href: ROUTES.CABINET_CERTIFICATE, icon: Award },
  { sectionKey: "telegram", label: "Telegram", href: ROUTES.CABINET_TELEGRAM, icon: MessageCircle },
  { sectionKey: "settings", label: "Настройки", href: ROUTES.CABINET_SETTINGS, icon: Settings },
  { sectionKey: "voting", label: "Голосование", href: ROUTES.CABINET_VOTING, icon: Vote },
];

export const CabinetSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const sidebarSections = user?.sidebarSections;
  const hasPersonalSection = sidebarSections?.includes("personal") ?? false;

  const { data: profile } = usePersonalProfile({ enabled: hasPersonalSection });

  const visibleNav = useMemo(() => {
    if (!sidebarSections?.length) return ALL_NAV_ITEMS;
    const allowed = new Set(sidebarSections);
    return ALL_NAV_ITEMS.filter((item) => allowed.has(item.sectionKey));
  }, [sidebarSections]);

  const handleLogout = (): void => {
    logout();
    router.push(ROUTES.HOME);
  };

  const displayName = hasPersonalSection && profile
    ? `${profile.first_name} ${profile.last_name?.[0]}.`
    : user?.email ?? "";

  const initials = hasPersonalSection && profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`
    : (user?.email?.[0] ?? "").toUpperCase();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-bg-secondary">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-contrast">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {displayName}
            </p>
            {hasPersonalSection && profile?.phone && (
              <p className="truncate text-xs text-text-muted">{profile.phone}</p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-0.5">
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                pathname === item.href
                  ? "bg-accent/10 font-medium text-text-primary"
                  : "text-text-secondary hover:bg-bg hover:text-text-primary",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="border-t border-border p-3 space-y-0.5">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg hover:text-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться на сайт
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-error/5 hover:text-error"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </button>
      </div>
    </aside>
  );
};
