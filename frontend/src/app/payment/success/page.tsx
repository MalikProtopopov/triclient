"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Clock, Download } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { usePaymentStatus, paymentApi } from "@/entities/payment";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatPrice } from "@/shared/lib/format";
import { toast } from "sonner";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const { data: paymentStatus } = usePaymentStatus(paymentId ?? "", !!paymentId);

  const isSucceeded = paymentStatus?.status === "completed";
  const isPending = paymentId && !isSucceeded;

  const handleReceipt = async () => {
    if (!paymentId) return;
    try {
      const data = await paymentApi.getReceipt(paymentId);
      window.open(data.receipt_url, "_blank");
    } catch {
      toast.error("Не удалось получить чек");
    }
  };

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      {isSucceeded ? (
        <>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
            Оплата прошла успешно!
          </h1>
          <p className="mb-6 text-sm text-text-secondary">
            Чек отправлен на ваш email.
          </p>
          <div className="flex w-full flex-col gap-3">
            <Link href={ROUTES.CABINET}>
              <Button fullWidth>Перейти в личный кабинет</Button>
            </Link>
            <Button variant="outline" fullWidth onClick={handleReceipt}>
              <Download className="h-4 w-4" />
              Скачать чек
            </Button>
          </div>
        </>
      ) : isPending ? (
        <>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
            Платёж обрабатывается
          </h1>
          <p className="mb-8 text-sm text-text-secondary">
            Мы обновим статус платежа в вашем личном кабинете. Обычно это
            занимает не более минуты.
          </p>
          <Link href={ROUTES.CABINET}>
            <Button fullWidth>Перейти в личный кабинет</Button>
          </Link>
        </>
      ) : (
        <>
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="mb-2 font-heading text-2xl font-bold text-text-primary">
            Оплата прошла успешно!
          </h1>
          <p className="mb-6 text-sm text-text-secondary">
            Чек отправлен на ваш email.
          </p>
          <Link href={ROUTES.CABINET}>
            <Button fullWidth>Перейти в личный кабинет</Button>
          </Link>
        </>
      )}
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
