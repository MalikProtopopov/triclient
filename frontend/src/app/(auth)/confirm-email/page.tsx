"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ROUTES } from "@/shared/config";
import { useAuth, getPostLoginRedirect } from "@/providers/AuthProvider";
import { authApi } from "@/entities/auth";

type ConfirmState = "loading" | "success" | "error";

function ConfirmEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [state, setState] = useState<ConfirmState>("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setState("error");
      return;
    }

    authApi
      .verifyEmail({ token })
      .then((data) => {
        setState("success");
        login(data.access_token, data.user);
        setTimeout(() => {
          router.push(getPostLoginRedirect(data.user));
        }, 1500);
      })
      .catch(() => {
        setState("error");
      });
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-8 shadow-sm text-center">
          {state === "loading" && (
            <>
              <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-accent" />
              <h1 className="text-xl font-semibold text-text-primary">
                Подтверждаем email...
              </h1>
            </>
          )}
          {state === "success" && (
            <>
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h1 className="text-xl font-semibold text-text-primary">
                Email подтверждён!
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Перенаправление...
              </p>
            </>
          )}
          {state === "error" && (
            <>
              <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h1 className="text-xl font-semibold text-text-primary">
                Ссылка недействительна
              </h1>
              <p className="mt-2 text-sm text-text-secondary">
                Ссылка для подтверждения устарела или уже использована.
              </p>
              <a
                href={ROUTES.LOGIN}
                className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
              >
                Перейти к входу
              </a>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bg">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </main>
          <Footer />
        </div>
      }
    >
      <ConfirmEmailContent />
    </Suspense>
  );
}
