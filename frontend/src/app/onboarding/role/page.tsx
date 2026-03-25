"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, Card } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { useOnboardingStatus, useChooseRoleMutation } from "@/entities/auth";
import { getOnboardingStepRoute, useAuth } from "@/providers/AuthProvider";

export default function OnboardingRolePage() {
  const router = useRouter();
  const { login } = useAuth();
  const [selectedNonDoctor, setSelectedNonDoctor] = useState(false);
  const chooseRoleMutation = useChooseRoleMutation();

  const { data: status, isLoading } = useOnboardingStatus();
  const isSubmitting = chooseRoleMutation.isPending;

  const isDoctorUpgradeFlow =
    !!status &&
    Boolean(status.can_upgrade_to_doctor) &&
    status.next_step === "completed";

  const shouldRedirectAway =
    !!status &&
    status.next_step !== "choose_role" &&
    !isDoctorUpgradeFlow;

  useEffect(() => {
    if (!shouldRedirectAway || !status) return;
    router.replace(getOnboardingStepRoute(status.next_step));
  }, [shouldRedirectAway, status, router]);

  const handleDoctorSelect = async () => {
    try {
      const res = await chooseRoleMutation.mutateAsync({ role: "doctor" });
      if (res.access_token) {
        await login(res.access_token);
      }
      toast.success("Роль сохранена");
      router.push(ROUTES.ONBOARDING_PROFILE);
    } catch {
      toast.error("Ошибка сохранения роли");
    }
  };

  const handleNonDoctorSelect = async () => {
    try {
      await chooseRoleMutation.mutateAsync({ role: "user" });
      setSelectedNonDoctor(true);
    } catch {
      toast.error("Ошибка сохранения роли");
    }
  };

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

  if (shouldRedirectAway) {
    return null;
  }

  if (selectedNonDoctor) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 text-2xl font-semibold text-text-primary">
              Спасибо за регистрацию!
            </h1>
            <p className="mb-8 text-text-secondary">
              Ваши данные сохранены. Теперь вы можете узнавать о новостях и мероприятиях
              ассоциации.
            </p>
            <Link href={ROUTES.EVENTS}>
              <Button fullWidth size="lg">
                Перейти к мероприятиям
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-semibold text-text-primary">
          {isDoctorUpgradeFlow
            ? "Продолжить регистрацию врача"
            : "Добро пожаловать! Выберите свою роль"}
        </h1>
        <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <Card hover className="flex flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
              <Stethoscope className="h-6 w-6 text-accent" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">Я — врач</h2>
            <p className="mb-6 flex-1 text-sm text-text-secondary">
              Вступить в ассоциацию, получить сертификат
            </p>
            <Button onClick={handleDoctorSelect} fullWidth disabled={isSubmitting}>
              Выбрать
            </Button>
          </Card>
          <Card hover className="flex flex-col">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
              <User className="h-6 w-6 text-accent" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">Я — не врач</h2>
            <p className="mb-6 flex-1 text-sm text-text-secondary">
              Узнавать о новостях и мероприятиях
            </p>
            <Button onClick={handleNonDoctorSelect} fullWidth variant="secondary" disabled={isSubmitting}>
              Выбрать
            </Button>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
