"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, Input } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { authApi } from "@/entities/auth";
import type { ApiError } from "@/entities/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch || password.length < 8 || !token) return;
    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, new_password: password });
      toast.success("Пароль успешно изменён");
      router.push(ROUTES.LOGIN);
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const code = axiosErr.response?.data?.error?.code;
      if (code === "INVALID_OR_EXPIRED_TOKEN") {
        toast.error("Ссылка недействительна или устарела");
      } else {
        toast.error("Ошибка при сохранении пароля");
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
          <h1 className="mb-6 text-2xl font-semibold text-text-primary">Новый пароль</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Новый пароль"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete="new-password"
                className="pr-10"
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
            <Input
              label="Подтвердите пароль"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
              error={confirmPassword && !passwordsMatch ? "Пароли не совпадают" : undefined}
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!passwordsMatch || password.length < 8}
            >
              Сохранить пароль
            </Button>
          </form>

          <p className="mt-6 text-center">
            <Link href={ROUTES.LOGIN} className="text-sm text-accent hover:underline">
              ← Назад к входу
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </main>
        <Footer />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
