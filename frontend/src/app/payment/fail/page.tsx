"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, RotateCcw, Mail } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { usePaymentStatus } from "@/entities/payment";
import { useSubscriptionPayMutation } from "@/entities/subscription";
import type { ApiError } from "@/entities/auth";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

function FailContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const { data: paymentStatus } = usePaymentStatus(paymentId ?? "", false);
  const payMutation = useSubscriptionPayMutation();

  const handleRetry = () => {
    payMutation.mutate(
      {
        plan_id: "",
        idempotency_key: crypto.randomUUID(),
      },
      {
        onSuccess: (data) => {
          window.location.href = data.payment_url;
        },
        onError: (error) => {
          const axiosErr = error as AxiosError<ApiError>;
          const code = axiosErr.response?.data?.error?.code;
          if (code === "MEDICAL_DIPLOMA_REQUIRED") {
            toast.error(
              "Для оплаты необходимо загрузить фото медицинского диплома",
            );
          } else {
            toast.error("Не удалось инициировать оплату");
          }
        },
      },
    );
  };

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
        Оплата не прошла
      </h1>

      <p className="mb-8 text-sm leading-relaxed text-text-secondary">
        {paymentStatus
          ? "Платёж был отклонён. Попробуйте ещё раз или свяжитесь с поддержкой."
          : "Возможно, операция была отклонена банком или произошла техническая ошибка. Попробуйте ещё раз или свяжитесь с поддержкой."}
      </p>

      <div className="flex w-full flex-col gap-3">
        <Link href={ROUTES.CABINET_PAYMENTS}>
          <Button fullWidth>
            <RotateCcw className="h-4 w-4" />
            Попробовать снова
          </Button>
        </Link>
        <Button variant="outline" fullWidth>
          <Mail className="h-4 w-4" />
          Связаться с поддержкой
        </Button>
      </div>
    </main>
  );
}

export default function PaymentFailPage() {
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
        <FailContent />
      </Suspense>
      <Footer />
    </>
  );
}
