"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { XCircle, RotateCcw, Mail } from "lucide-react";
import { toast } from "sonner";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { useSubscriptionPayMutation } from "@/entities/subscription";
import {
  getSavedIdempotencyKey,
  getSavedPlanId,
} from "@/shared/lib/paymentStorage";

function FailContent() {
  const router = useRouter();
  const payMutation = useSubscriptionPayMutation();

  const handleRetry = () => {
    const planId = getSavedPlanId();
    const idempotencyKey = getSavedIdempotencyKey();
    if (planId && idempotencyKey) {
      payMutation.mutate(
        { plan_id: planId, idempotency_key: idempotencyKey },
        {
          onSuccess: (data) => {
            window.location.href = data.payment_url;
          },
          onError: () => {
            toast.error("Не удалось повторить оплату");
            router.push(ROUTES.CABINET_PAYMENTS);
          },
        },
      );
    } else {
      router.push(ROUTES.CABINET_PAYMENTS);
    }
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
        Возможно, операция была отклонена банком или произошла техническая
        ошибка. Попробуйте ещё раз или свяжитесь с поддержкой.
      </p>

      <div className="flex w-full flex-col gap-3">
        <Button
          fullWidth
          onClick={handleRetry}
          disabled={payMutation.isPending}
        >
          <RotateCcw className="h-4 w-4" />
          {payMutation.isPending ? "Перенаправление..." : "Попробовать снова"}
        </Button>
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
