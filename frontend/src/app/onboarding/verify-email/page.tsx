"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Loader2 } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { useOnboardingStatus } from "@/entities/auth";
import { getOnboardingStepRoute } from "@/providers/AuthProvider";

export default function OnboardingVerifyEmailPage() {
  const router = useRouter();
  const { data: status, isLoading } = useOnboardingStatus();

  if (status && status.next_step !== "verify_email") {
    router.replace(getOnboardingStepRoute(status.next_step));
    return null;
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

        <p className="mb-8 text-sm leading-relaxed text-text-secondary">
          Мы отправили письмо на ваш email. Перейдите по ссылке в письме для подтверждения.
          После этого вы сможете продолжить регистрацию.
        </p>

        <Link href={ROUTES.LOGIN}>
          <Button variant="outline">Вернуться к входу</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
