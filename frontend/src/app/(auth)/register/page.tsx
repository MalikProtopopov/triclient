"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, Input } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { authApi } from "@/entities/auth";
import type { ApiError } from "@/entities/auth";

function PasswordStrengthBars({ password }: { password: string }) {
  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(password);

  return (
    <div className="flex gap-1">
      <div
        className={`h-1 flex-1 rounded-full transition-colors ${
          hasMinLength ? "bg-green-500" : "bg-red-400"
        }`}
      />
      <div
        className={`h-1 flex-1 rounded-full transition-colors ${
          hasDigit ? "bg-green-500" : hasMinLength ? "bg-yellow-500" : "bg-red-400"
        }`}
      />
      <div
        className={`h-1 flex-1 rounded-full transition-colors ${
          hasLetter ? "bg-green-500" : hasMinLength && hasDigit ? "bg-yellow-500" : "bg-red-400"
        }`}
      />
    </div>
  );
}

function PasswordHints({ password }: { password: string }) {
  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(password);

  return (
    <div className="space-y-1 text-xs">
      <p className={hasMinLength ? "text-green-600 dark:text-green-400" : "text-text-muted"}>
        {hasMinLength ? "✓" : "○"} Минимум 8 символов
      </p>
      <p className={hasDigit ? "text-green-600 dark:text-green-400" : "text-text-muted"}>
        {hasDigit ? "✓" : "○"} Хотя бы 1 цифра
      </p>
      <p className={hasLetter ? "text-green-600 dark:text-green-400" : "text-text-muted"}>
        {hasLetter ? "✓" : "○"} Хотя бы 1 буква
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailError, setEmailError] = useState<string | undefined>();

  const hasMinLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasLetter = /[a-zA-Zа-яА-ЯёЁ]/.test(password);
  const passwordValid = hasMinLength && hasDigit && hasLetter;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const doRegister = async () => {
    setIsLoading(true);
    setEmailError(undefined);
    try {
      await authApi.register({ email, password });
      setIsConfirmed(true);
      startCooldown();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiError>;
      const code = axiosErr.response?.data?.error?.code;
      if (code === "EMAIL_ALREADY_EXISTS") {
        setEmailError("Пользователь с таким email уже зарегистрирован");
        toast.error("Пользователь с таким email уже зарегистрирован");
      } else {
        toast.error("Ошибка регистрации");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch) return;
    await doRegister();
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    await doRegister();
  };

  if (isConfirmed) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-8 shadow-sm text-center">
            <h1 className="mb-2 text-2xl font-semibold text-text-primary">Проверьте почту</h1>
            <p className="mb-6 text-text-secondary">
              Письмо с подтверждением отправлено на <strong className="text-text-primary">{email}</strong>
            </p>
            <Button
              variant="secondary"
              onClick={handleResend}
              disabled={resendCooldown > 0}
              fullWidth
            >
              {resendCooldown > 0 ? `Отправить повторно (${resendCooldown} с)` : "Отправить повторно"}
            </Button>
            <p className="mt-6 text-center text-sm text-text-secondary">
              Уже есть аккаунт?{" "}
              <Link href={ROUTES.LOGIN} className="font-medium text-accent hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-text-primary">Регистрация</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailError(undefined); }}
              placeholder="example@mail.ru"
              required
              autoComplete="email"
              error={emailError}
            />
            <div className="relative">
              <Input
                label="Пароль"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
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
            <div className="space-y-2">
              <PasswordStrengthBars password={password} />
              <PasswordHints password={password} />
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
              disabled={!passwordValid || !passwordsMatch}
            >
              Зарегистрироваться
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Уже есть аккаунт?{" "}
            <Link href={ROUTES.LOGIN} className="font-medium text-accent hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
