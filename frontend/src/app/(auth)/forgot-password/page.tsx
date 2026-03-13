"use client";

import { useState } from "react";
import Link from "next/link";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, Input } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { authApi } from "@/entities/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
    } catch {
      // Always show success to avoid revealing if email exists
    } finally {
      setIsLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-semibold text-text-primary">
            Восстановление пароля
          </h1>

          {submitted ? (
            <div className="space-y-6">
              <p className="text-text-secondary">
                Если аккаунт существует, письмо отправлено на{" "}
                <strong className="text-text-primary">{email}</strong>
              </p>
              <Link href={ROUTES.LOGIN}>
                <Button variant="secondary" fullWidth>
                  Назад к входу
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.ru"
                required
                autoComplete="email"
              />
              <Button type="submit" fullWidth isLoading={isLoading}>
                Отправить инструкцию
              </Button>
            </form>
          )}

          {!submitted && (
            <p className="mt-6 text-center">
              <Link href={ROUTES.LOGIN} className="text-sm text-accent hover:underline">
                ← Назад к входу
              </Link>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
