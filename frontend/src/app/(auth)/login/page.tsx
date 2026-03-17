"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, Input } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { useAuth, getPostLoginRedirect } from "@/providers/AuthProvider";
import { authApi } from "@/entities/auth";
import type { ApiError } from "@/entities/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "1") {
      toast.success("Email подтверждён. Войдите в аккаунт.");
      router.replace(ROUTES.LOGIN, { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const onboarding = await login(data.access_token);
      const redirect = searchParams.get("redirect");
      toast.success("Добро пожаловать!");
      router.push(getPostLoginRedirect(onboarding, redirect));
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const code = axiosErr.response?.data?.error?.code;
      if (code === "ACCOUNT_DEACTIVATED") {
        toast.error("Аккаунт деактивирован");
      } else {
        toast.error("Неверный email или пароль");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-text-primary">Вход</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.ru"
              required
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Пароль"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-text-muted hover:text-text-primary"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-accent hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Войти
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Нет аккаунта?{" "}
            <Link href={ROUTES.REGISTER} className="font-medium text-accent hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
