"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

import { Button } from "@/shared/ui";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <span className="text-3xl">!</span>
      </div>
      <h1 className="mb-2 font-heading text-2xl font-semibold text-text-primary">
        Произошла ошибка
      </h1>
      <p className="mb-8 max-w-md text-sm text-text-secondary">
        {error.message || "Что-то пошло не так. Попробуйте обновить страницу."}
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Попробовать снова
        </Button>
        <Link href="/">
          <Button variant="secondary">На главную</Button>
        </Link>
      </div>
    </div>
  );
}
