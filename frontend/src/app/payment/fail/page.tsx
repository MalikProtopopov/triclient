"use client";

import { Suspense } from "react";
import Link from "next/link";
import { XCircle, RotateCcw, Mail } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

function FailContent() {
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
        <Link href={ROUTES.CABINET_PAYMENTS} className="w-full">
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
