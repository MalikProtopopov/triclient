"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { XCircle, CheckCircle, Loader2 } from "lucide-react";

import { toast } from "sonner";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { useOnboardingStatus } from "@/entities/auth";
import { getOnboardingStepRoute } from "@/providers/AuthProvider";

function formatSubmittedDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OnboardingPendingPage() {
  const router = useRouter();
  const { data: status, isLoading } = useOnboardingStatus({ refetchInterval: 30_000 });

  useEffect(() => {
    const isWaiting =
      status?.next_step === "await_moderation" || status?.next_step === "wait_moderation";
    if (isWaiting && sessionStorage.getItem("onboarding_submitted") === "1") {
      toast.success("Заявка успешно отправлена");
      sessionStorage.removeItem("onboarding_submitted");
    }
  }, [status?.next_step]);

  if (status) {
    if (status.moderation_status === "approved" || status.moderation_status === "active") {
      const target = status.next_step === "pay_entry_fee" ? ROUTES.CABINET_PAYMENTS : ROUTES.CABINET;
      toast.success("Заявка одобрена! Добро пожаловать.");
      router.replace(target);
      return null;
    }
    const isWaiting =
      status.next_step === "await_moderation" || status.next_step === "wait_moderation";
    if (!isWaiting && status.moderation_status !== "rejected") {
      router.replace(getOnboardingStepRoute(status.next_step));
      return null;
    }
  }

  if (isLoading) {
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

  if (status?.moderation_status === "rejected") {
    return (
      <>
        <Header />
        <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
            Заявка отклонена
          </h1>

          {status.rejection_comment && (
            <p className="mb-6 text-sm leading-relaxed text-text-secondary">
              {status.rejection_comment}
            </p>
          )}

          <p className="mb-8 text-sm text-text-muted">
            Дата подачи: {formatSubmittedDate(status.submitted_at)}
          </p>

          <Link href={ROUTES.ONBOARDING_PROFILE}>
            <Button>Исправить и отправить повторно</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
        </div>

        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Заявка успешно отправлена
        </h1>

        <p className="mb-6 text-sm leading-relaxed text-text-secondary">
          Ваша заявка отправлена на модерацию. Мы проверим ваши документы и уведомим вас
          по email в течение 2–3 рабочих дней.
        </p>

        <p className="mb-8 text-sm text-text-muted">
          Дата подачи: {formatSubmittedDate(status?.submitted_at ?? null)}
        </p>

        <Link href={ROUTES.HOME}>
          <Button variant="secondary">На главную</Button>
        </Link>
      </main>
      <Footer />
    </>
  );
}
