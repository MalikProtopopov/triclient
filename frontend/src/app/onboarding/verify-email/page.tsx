"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { maskEmail } from "@/shared/lib/maskEmail";
import { useAuth } from "@/providers/AuthProvider";
import { useOnboardingStatus, authApi } from "@/entities/auth";
import { getOnboardingStepRoute } from "@/providers/AuthProvider";

const COOLDOWN_200_SEC = 60;
const COOLDOWN_429_SEC = 600;

export default function OnboardingVerifyEmailPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: status, isLoading } = useOnboardingStatus();

  const [isResending, setIsResending] = useState(false);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [cooldownReason, setCooldownReason] = useState<"success" | "rate_limit" | null>(null);

  const startCooldown = useCallback((seconds: number, reason: "success" | "rate_limit") => {
    setCooldownSec(seconds);
    setCooldownReason(reason);
  }, []);

  useEffect(() => {
    if (cooldownSec <= 0) {
      setCooldownReason(null);
      return;
    }
    const timer = setInterval(() => setCooldownSec((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldownSec]);

  const handleResend = async () => {
    const email = user?.email;
    if (!email) {
      toast.error("Email не найден. Попробуйте войти заново.");
      return;
    }

    setIsResending(true);
    try {
      await authApi.resendVerificationEmail(email);
      toast.success(
        `Письмо отправлено на ${maskEmail(email)}. Проверьте почту и папку «Спам».`,
      );
      startCooldown(COOLDOWN_200_SEC, "success");
    } catch (err) {
      const status = (err as AxiosError).response?.status;
      if (status === 429) {
        toast.error("Слишком много запросов. Попробуйте через 10 минут.");
        startCooldown(COOLDOWN_429_SEC, "rate_limit");
      } else if (status === 422) {
        toast.error("Введите корректный email.");
      } else {
        toast.error("Не удалось отправить письмо. Попробуйте позже.");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (status && status.next_step !== "verify_email") {
    router.replace(getOnboardingStepRoute(status.next_step));
    return null;
  }

  if (isLoading || !user?.email) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </main>
        <Footer />
      </div>
    );
  }

  const maskedEmail = maskEmail(user.email);
  const isCooldown = cooldownSec > 0;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
          <Mail className="h-8 w-8 text-accent" />
        </div>

        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Подтвердите email
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-text-secondary">
          Письмо с подтверждением было отправлено на {maskedEmail}. Не пришло?
        </p>

        <div className="mb-8 flex flex-col gap-4">
          <Button
            onClick={handleResend}
            disabled={isResending || isCooldown}
            variant="outline"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Отправка...
              </>
            ) : isCooldown ? (
              cooldownReason === "rate_limit"
                ? "Слишком много запросов. Попробуйте через 10 минут"
                : `Письмо отправлено. Повторить через ${cooldownSec} сек`
            ) : (
              "Отправить письмо повторно"
            )}
          </Button>

          <Link href={ROUTES.LOGIN}>
            <Button variant="ghost" className="text-sm">
              Вернуться к входу
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
