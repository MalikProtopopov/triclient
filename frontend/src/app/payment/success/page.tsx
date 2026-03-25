"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Clock, AlertCircle, XCircle, Home } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { paymentApi } from "@/entities/payment";
import type { PaymentStatusResponse } from "@/entities/payment";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { clearPendingPayment } from "@/shared/lib/paymentStorage";

type PollState =
  | "no_payment_id"
  | "polling"
  | "success"
  | "failed"
  | "timeout"
  | "not_found";

const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 30000;

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("MNT_TRANSACTION_ID");
  const [state, setState] = useState<PollState>(
    paymentId ? "polling" : "no_payment_id",
  );
  const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(
    null,
  );
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!paymentId) {
      setState("no_payment_id");
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const data = await paymentApi.getStatus(paymentId);

        if (data.status === "succeeded") {
          clearPendingPayment();
          setPaymentData(data);
          setState("success");
          return;
        }

        if (data.status === "failed" || data.status === "expired") {
          setPaymentData(data);
          setState("failed");
          return;
        }

        if (Date.now() - startedAt.current >= POLL_TIMEOUT_MS) {
          setState("timeout");
          return;
        }

        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err: unknown) {
        const status = err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
        if (status === 404) {
          setState("not_found");
          return;
        }
        if (Date.now() - startedAt.current >= POLL_TIMEOUT_MS) {
          setState("timeout");
          return;
        }
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    poll();
    return () => clearTimeout(timer);
  }, [paymentId]);

  const mainClass =
    "mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center";

  if (state === "no_payment_id") {
    return (
      <main className={mainClass}>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Некорректная ссылка возврата
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Отсутствует идентификатор платежа. Если вы оплатили подписку или
          билет, проверьте статус в личном кабинете.
        </p>
        <Link href={ROUTES.HOME} className="w-full">
          <Button fullWidth>
            <Home className="h-4 w-4" />
            На главную
          </Button>
        </Link>
      </main>
    );
  }

  if (state === "not_found") {
    return (
      <main className={mainClass}>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Платёж не найден
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Проверьте ссылку или обратитесь в поддержку.
        </p>
        <Link href={ROUTES.HOME} className="w-full">
          <Button fullWidth>
            <Home className="h-4 w-4" />
            На главную
          </Button>
        </Link>
      </main>
    );
  }

  if (state === "success" && paymentData) {
    const isEvent = paymentData.product_type === "event";
    const isArrears = paymentData.product_type === "membership_arrears";
    return (
      <main className={mainClass}>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          {isEvent
            ? "Билет оплачен!"
            : isArrears
              ? "Задолженность оплачена"
              : "Подписка активирована!"}
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          {isEvent
            ? paymentData.event_title
              ? `Мероприятие: ${paymentData.event_title}`
              : "Оплата прошла успешно."
            : isArrears
              ? "Оплата прошла успешно. Статус задолженности обновится в личном кабинете."
              : "Оплата прошла успешно. Чек отправлен на ваш email."}
        </p>
        <Link
          href={
            isEvent
              ? ROUTES.CABINET_EVENTS
              : isArrears
                ? ROUTES.CABINET_PAYMENTS
                : ROUTES.CABINET
          }
          className="w-full"
        >
          <Button fullWidth>
            {isEvent
              ? "Мои мероприятия"
              : isArrears
                ? "К оплатам и подписке"
                : "Перейти в личный кабинет"}
          </Button>
        </Link>
      </main>
    );
  }

  if (state === "failed") {
    return (
      <main className={mainClass}>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Оплата не прошла
        </h1>
        <p className="mb-6 text-sm text-text-secondary">
          Операция была отклонена или истекла. Попробуйте снова или свяжитесь с
          поддержкой.
        </p>
        <div className="flex w-full flex-col gap-3">
          <Link href={ROUTES.PAYMENT_FAIL} className="w-full">
            <Button fullWidth>Попробовать снова</Button>
          </Link>
          <Link href={ROUTES.HOME} className="w-full">
            <Button variant="outline" fullWidth>
              <Home className="h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (state === "timeout") {
    return (
      <main className={mainClass}>
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <AlertCircle className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
          Обработка платежа
        </h1>
        <p className="mb-8 text-sm text-text-secondary">
          Обработка может занять несколько минут. Статус обновится в личном
          кабинете.
        </p>
        <Link href={ROUTES.CABINET} className="w-full">
          <Button fullWidth>Перейти в личный кабинет</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className={mainClass}>
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
