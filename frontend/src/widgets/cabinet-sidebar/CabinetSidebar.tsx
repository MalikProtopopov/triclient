"use client";

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

import { useAuth } from "@/providers/AuthProvider";
import { usePersonalProfile } from "@/entities/profile";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";

const DOCTOR_NAV = [
  { label: "Главная", href: ROUTES.CABINET, icon: Home },
  { label: "Личная информация", href: ROUTES.CABINET_PERSONAL, icon: User },
  { label: "Публичный профиль", href: ROUTES.CABINET_PUBLIC, icon: Globe },
  { label: "Оплаты и подписка", href: ROUTES.CABINET_PAYMENTS, icon: CreditCard },
  { label: "Мероприятия", href: ROUTES.CABINET_EVENTS, icon: Calendar },
  { label: "Сертификат", href: ROUTES.CABINET_CERTIFICATE, icon: Award },
  { label: "Telegram", href: ROUTES.CABINET_TELEGRAM, icon: MessageCircle },
  { label: "Настройки", href: ROUTES.CABINET_SETTINGS, icon: Settings },
  { label: "Голосование", href: ROUTES.CABINET_VOTING, icon: Vote },
];

export const CabinetSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { data: profile } = usePersonalProfile();

  const handleLogout = (): void => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-bg-secondary">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-contrast">
            {profile?.first_name?.[0]}
            {profile?.last_name?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-text-primary">
              {profile?.first_name} {profile?.last_name?.[0]}.
            </p>
            <p className="truncate text-xs text-text-muted">{profile?.phone}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-0.5">
          {DOCTOR_NAV.map((item) => (
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
