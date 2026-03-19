"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { subscriptionApi } from "@/entities/subscription";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { clearPendingPayment } from "@/shared/lib/paymentStorage";

type PollState = "polling" | "success" | "timeout";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 30000;

function SuccessContent() {
  const [state, setState] = useState<PollState>("polling");
  const startedAt = useRef(Date.now());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const status = await subscriptionApi.getStatus();
        if (
          status.has_subscription &&
          status.current_subscription?.status === "active"
        ) {
          clearPendingPayment();
          setState("success");
          return;
        }
      } catch {
        /* keep polling */
      }

      if (Date.now() - startedAt.current >= POLL_TIMEOUT_MS) {
        setState("timeout");
        return;
      }

      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => clearTimeout(timer);
  }, []);

  if (state === "success") {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Подписка активирована!
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Оплата прошла успешно. Чек отправлен на ваш email.
        </p>
        <Link href={ROUTES.CABINET} className="w-full">
          <Button fullWidth>Перейти в личный кабинет</Button>
        </Link>
      </main>
    );
  }

  if (state === "timeout") {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Обработка платежа
        </h1>
        <p className="mb-8 text-sm text-text-secondary">
          Обработка может занять несколько минут. Статус подписки обновится в
          личном кабинете.
        </p>
        <Link href={ROUTES.CABINET} className="w-full">
          <Button fullWidth>Перейти в личный кабинет</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
        <Clock className="h-8 w-8 animate-pulse text-amber-500" />
      </div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
        Проверяем оплату...
      </h1>
      <p className="text-sm text-text-secondary">
        Обычно это занимает не более минуты.
      </p>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <main className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center">
            <p className="text-text-muted">Загрузка...</p>
          </main>
        }
      >
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
