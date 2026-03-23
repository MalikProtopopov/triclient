"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Play, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  useEvent,
  useEventRegisterMutation,
  useConfirmGuestMutation,
} from "@/entities/event";
import type { EventTariff, EventRegistrationResponse } from "@/entities/event";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Card, Button, Badge, Modal, Input, DocumentContentBlockRenderer } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDateTime, formatPrice } from "@/shared/lib/format";
import { deriveEventStatus } from "@/shared/lib/mediaUrl";
import { useAuth } from "@/providers/AuthProvider";

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

function getRegistrationErrorMessage(error: unknown): string {
  const msg =
    (error as { response?: { data?: { error?: { message?: string } } } })
      ?.response?.data?.error?.message ?? "";
  if (/email is required for guest registration/i.test(msg)) return "Войдите в аккаунт или укажите email для регистрации гостя";
  if (/no seats available/i.test(msg)) return "Места закончились";
  if (/invalid verification code/i.test(msg)) {
    const m = msg.match(/(\d+)\s*attempt/i);
    return m ? `Неверный код. Осталось попыток: ${m[1]}` : "Неверный код подтверждения";
  }
  if (/verification code expired/i.test(msg)) return "Код истёк. Запросите новый";
  if (/too many verification attempts/i.test(msg)) return "Слишком много попыток. Запросите новый код";
  if (/too many verification codes sent/i.test(msg)) return "Слишком много запросов. Попробуйте через 10 минут";
  if (/registration is closed/i.test(msg)) return "Регистрация закрыта";
  if (/not found/i.test(msg)) return "Мероприятие или тариф не найдены";
  return msg || "Ошибка регистрации. Попробуйте ещё раз.";
}

function formatDurationSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h} ч ${m} мин`;
  if (h > 0) return `${h} ч`;
  return `${m} мин`;
}

function TariffCard({
  tariff,
  onRegister,
  isRegistering,
  isRegistered,
}: {
  tariff: EventTariff;
  onRegister: (tariffId: string) => void;
  isRegistering: boolean;
  isRegistered: boolean;
}) {
  const seatsLeft =
    tariff.seats_available != null
      ? tariff.seats_available
      : tariff.seats_limit != null && tariff.seats_taken != null
        ? tariff.seats_limit - tariff.seats_taken
        : null;
  const soldOut = seatsLeft !== null && seatsLeft <= 0;

  return (
    <Card className="flex flex-col">
      <h3 className="mb-1 font-medium text-text-primary">{tariff.name}</h3>
      {tariff.description && (
        <p className="mb-3 text-sm text-text-secondary">{tariff.description}</p>
      )}
      {tariff.conditions && (
        <p className="mb-2 text-sm text-text-muted">{tariff.conditions}</p>
      )}
      {tariff.details && (
        <p className="mb-2 text-sm text-text-muted">{tariff.details}</p>
      )}
      <div className="mb-2 text-sm text-text-secondary">
        <span className="font-medium text-text-primary">{formatPrice(tariff.price)}</span>
        {tariff.member_price !== tariff.price && (
          <span className="ml-2">(членам: {formatPrice(tariff.member_price)})</span>
        )}
      </div>
      {tariff.benefits && tariff.benefits.length > 0 && (
        <ul className="mb-3 space-y-1">
          {tariff.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {seatsLeft !== null && tariff.seats_limit != null && (
        <p className="mb-4 text-xs text-text-muted">
          {soldOut ? "Мест нет" : `Мест: ${seatsLeft} из ${tariff.seats_limit}`}
        </p>
      )}
      {isRegistered ? (
        <Badge variant="accent" className="mt-auto self-start">Вы зарегистрированы</Badge>
      ) : (
        <Button
          size="sm"
          className="mt-auto"
          disabled={soldOut || isRegistering || tariff.is_active === false}
          onClick={() => onRegister(tariff.id)}
        >
          {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Зарегистрироваться
        </Button>
      )}
    </Card>
  );
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 60;
const CODE_VALID_MINUTES = 10;

function OtpInput({
  value,
  onChange,
  onComplete,
  error,
  disabled,
}: {
  value: string[];
  onChange: (digits: string[]) => void;
  onComplete: () => void;
  error: string | null;
  disabled: boolean;
}) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;
    const next = [...value];
    next[index] = digit.slice(-1);
    onChange(next);
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (next.every(Boolean) && next.length === OTP_LENGTH) {
      onComplete();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      const next = pasted.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
      onChange(next);
      const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      if (next.every(Boolean)) onComplete();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            disabled={disabled}
            className="h-12 w-11 rounded-lg border border-border bg-bg text-center text-lg font-medium focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
          />
        ))}
      </div>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}

function GuestModal({
  isOpen,
  onClose,
  eventId,
  selectedTariffId,
  tariffName,
  tariffPrice,
  onStep1Submit,
  onStep2Submit,
  registerLoading,
  confirmLoading,
  actionType,
  maskedEmail,
  step1Error,
  step2Error,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  selectedTariffId: string;
  tariffName: string;
  tariffPrice: number;
  onStep1Submit: (data: {
    email: string;
    guest_full_name?: string;
    guest_workplace?: string;
    guest_specialization?: string;
  }) => void;
  onStep2Submit: (data: { email: string; code: string }) => void;
  registerLoading: boolean;
  confirmLoading: boolean;
  actionType: "verify_existing" | "verify_new_email" | null;
  maskedEmail: string | null;
  step1Error: string | null;
  step2Error: string | null;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);

  const isOtpStep = step === 2 && actionType;

  const resetToStep1 = () => {
    setStep(1);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onStep1Submit({
      email,
      guest_full_name: fullName || undefined,
      guest_workplace: workplace || undefined,
      guest_specialization: specialization || undefined,
    });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== OTP_LENGTH) return;
    onStep2Submit({ email, code });
  };

  const handleOtpComplete = () => {
    const code = otpDigits.join("");
    if (code.length === OTP_LENGTH) {
      onStep2Submit({ email, code });
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN_SEC);
    setCodeExpiresAt(Date.now() + CODE_VALID_MINUTES * 60 * 1000);
    onStep1Submit({
      email,
      guest_full_name: fullName || undefined,
      guest_workplace: workplace || undefined,
      guest_specialization: specialization || undefined,
    });
  };

  useEffect(() => {
    if (actionType && maskedEmail) {
      setStep(2);
      setCodeExpiresAt(Date.now() + CODE_VALID_MINUTES * 60 * 1000);
      setResendCooldown(RESEND_COOLDOWN_SEC);
    }
  }, [actionType, maskedEmail]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setFullName("");
    setWorkplace("");
    setSpecialization("");
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Регистрация на мероприятие">
      {isOtpStep ? (
        <form onSubmit={handleStep2Submit} className="space-y-4">
          <div className="mb-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            Код подтверждения отправлен на {maskedEmail ?? email}. Введите 6 цифр из письма.
          </div>
          {step1Error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {step1Error}
            </div>
          )}
          <OtpInput
            value={otpDigits}
            onChange={setOtpDigits}
            onComplete={handleOtpComplete}
            error={step2Error}
            disabled={confirmLoading}
          />
          {codeExpiresAt != null && (
            <p className="text-center text-xs text-text-muted">
              Код действителен 10 минут
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={resendCooldown > 0 || registerLoading}
            onClick={handleResend}
          >
            {resendCooldown > 0
              ? `Отправить повторно (${resendCooldown} с)`
              : "Отправить повторно"}
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={resetToStep1} className="flex-1">
              Назад
            </Button>
            <Button type="submit" isLoading={confirmLoading} disabled={otpDigits.join("").length !== OTP_LENGTH} className="flex-1">
              Подтвердить
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          <p className="text-sm text-text-muted">
            Тариф: {tariffName} — {formatPrice(tariffPrice)}
          </p>
          {step1Error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {step1Error}
            </div>
          )}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@mail.ru"
          />
          <Input
            label="ФИО"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Иванов Иван Иванович"
          />
          <Input
            label="Место работы"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            placeholder="Клиника"
          />
          <Input
            label="Специализация"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            placeholder="Трихология"
          />
          <Button type="submit" fullWidth isLoading={registerLoading}>
            Продолжить
          </Button>
        </form>
      )}
    </Modal>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated, login } = useAuth();

  const { data: event, isLoading, error } = useEvent(slug);
  const registerMutation = useEventRegisterMutation(event?.id ?? "");
  const confirmMutation = useConfirmGuestMutation(event?.id ?? "");

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedTariffId, setSelectedTariffId] = useState<string | null>(null);
  const [registrationResult, setRegistrationResult] = useState<EventRegistrationResponse | null>(null);
  const [guestIdempotencyKey, setGuestIdempotencyKey] = useState<string | null>(null);
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  const isRegistered = !!event?.user_registration?.registration_id;

  const selectedTariff = event?.tariffs?.find((t) => t.id === selectedTariffId);

  const handleRegister = async (tariffId: string) => {
    if (!isAuthenticated) {
      setSelectedTariffId(tariffId);
      setStep1Error(null);
      setStep2Error(null);
      setShowGuestModal(true);
      return;
    }

    setStep1Error(null);
    try {
      const result = await registerMutation.mutateAsync({
        tariff_id: tariffId,
        idempotency_key: generateIdempotencyKey(),
      });

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else if (result.action) {
        setRegistrationResult(result);
        setSelectedTariffId(tariffId);
        setShowGuestModal(true);
      } else {
        toast.success("Вы успешно зарегистрированы!");
      }
    } catch (err) {
      toast.error(getRegistrationErrorMessage(err));
    }
  };

  const handleGuestStep1Submit = async (data: {
    email: string;
    guest_full_name?: string;
    guest_workplace?: string;
    guest_specialization?: string;
  }) => {
    if (!selectedTariffId || !event?.id) return;
    setStep1Error(null);
    const idempotencyKey = generateIdempotencyKey();
    setGuestIdempotencyKey(idempotencyKey);
    try {
      const result = await registerMutation.mutateAsync({
        tariff_id: selectedTariffId,
        idempotency_key: idempotencyKey,
        guest_email: data.email,
        guest_full_name: data.guest_full_name,
        guest_workplace: data.guest_workplace,
        guest_specialization: data.guest_specialization,
      });

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else if (result.action) {
        setRegistrationResult(result);
      } else {
        toast.success("Вы успешно зарегистрированы!");
        setShowGuestModal(false);
      }
    } catch (err) {
      setStep1Error(getRegistrationErrorMessage(err));
    }
  };

  const handleGuestStep2Submit = async (data: { email: string; code: string }) => {
    if (!selectedTariffId || !event?.id) return;
    setStep2Error(null);
    const idempotencyKey = guestIdempotencyKey ?? generateIdempotencyKey();
    try {
      const result = await confirmMutation.mutateAsync({
        email: data.email,
        code: data.code,
        tariff_id: selectedTariffId,
        idempotency_key: idempotencyKey,
      });

      if (result.access_token) {
        await login(result.access_token);
        if (result.refresh_token) {
          sessionStorage.setItem("refresh_token", result.refresh_token);
        }
      }
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        toast.success("Вы успешно зарегистрированы!");
        setShowGuestModal(false);
      }
    } catch (err) {
      setStep2Error(getRegistrationErrorMessage(err));
    }
  };

  if (isLoading || !event) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
          <div className="mb-6 h-6 w-48 animate-pulse rounded bg-border-light" />
          <div className="mb-8 h-64 animate-pulse rounded-xl bg-border-light" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-border-light" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-border-light" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
          <p className="text-error">Мероприятие не найдено</p>
        </main>
        <Footer />
      </div>
    );
  }

  const derivedStatus = event.status ?? deriveEventStatus(event.event_date);
  const isUpcoming = derivedStatus === "upcoming" || derivedStatus === "ongoing";

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
        <Link
          href={ROUTES.EVENTS}
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
        >
          ← Все мероприятия
        </Link>

        {event.cover_image_url ? (
          <div className="relative mb-8 aspect-video w-full max-h-80 overflow-hidden rounded-xl bg-metal-light">
            <Image
              src={event.cover_image_url!}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </div>
        ) : (
          <div className="mb-8 h-64 w-full max-h-80 overflow-hidden rounded-xl bg-metal-light" />
        )}

        <h1 className="mb-2 font-heading text-3xl font-semibold text-text-primary">
          {event.title}
        </h1>
        <p className="mb-2 text-text-secondary">
          {formatDateTime(event.event_date)} — {formatDateTime(event.event_end_date)}
        </p>
        <div className="mb-8 flex items-center gap-2 text-text-secondary">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{event.location}</span>
        </div>

        {event.description && (
          <div
            className="prose prose-sm max-w-none text-text-primary prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary mb-10"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}

        {isUpcoming && (event.tariffs?.length ?? 0) > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
              Тарифы
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {event.tariffs
                .filter((t) => t.is_active !== false)
                .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                .map((tariff) => (
                  <TariffCard
                    key={tariff.id}
                    tariff={tariff}
                    onRegister={handleRegister}
                    isRegistering={registerMutation.isPending}
                    isRegistered={isRegistered}
                  />
                ))}
            </div>
          </section>
        )}

        <DocumentContentBlockRenderer blocks={event.content_blocks ?? []} className="mb-10 space-y-6" />

        {!isUpcoming && (
          <>
            {event.galleries.length > 0 && (
              <section className="mb-10">
                <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
                  Галереи
                </h2>
                <div className="space-y-3">
                  {event.galleries.map((gallery) => (
                    <div
                      key={gallery.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-bg-secondary px-4 py-3"
                    >
                      <span className="font-medium text-text-primary">
                        {gallery.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={gallery.access_level === "members_only" ? "accent" : "default"}
                        >
                          {gallery.access_level === "members_only" ? "Только для членов" : "Публичная"}
                        </Badge>
                        <span className="text-sm text-text-muted">
                          {gallery.photos_count} фото
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {event.recordings.length > 0 && (
              <section>
                <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
                  Записи
                </h2>
                <div className="space-y-3">
                  {event.recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center gap-4 rounded-xl border border-border bg-bg-secondary px-4 py-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                        {recording.video_playback_url ? (
                          <a href={recording.video_playback_url} target="_blank" rel="noopener noreferrer">
                            <Play className="h-5 w-5" />
                          </a>
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-text-primary">
                          {recording.video_playback_url ? (
                            <a
                              href={recording.video_playback_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-accent"
                            >
                              {recording.title}
                            </a>
                          ) : (
                            recording.title
                          )}
                        </p>
                        {recording.duration_seconds != null && (
                          <p className="text-sm text-text-muted">
                            {formatDurationSeconds(recording.duration_seconds)}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          recording.access_level === "members_only" || recording.access_level === "participants_only"
                            ? "accent"
                            : "default"
                        }
                      >
                        {recording.access_level === "public"
                          ? "Публичный"
                          : recording.access_level === "members_only"
                            ? "Только для членов"
                            : "Только для участников"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {selectedTariff && (
        <GuestModal
          isOpen={showGuestModal}
          onClose={() => {
            setShowGuestModal(false);
            setSelectedTariffId(null);
            setRegistrationResult(null);
            setGuestIdempotencyKey(null);
            setStep1Error(null);
            setStep2Error(null);
          }}
          eventId={event.id}
          selectedTariffId={selectedTariffId!}
          tariffName={selectedTariff.name}
          tariffPrice={selectedTariff.price}
          onStep1Submit={handleGuestStep1Submit}
          onStep2Submit={handleGuestStep2Submit}
          registerLoading={registerMutation.isPending}
          confirmLoading={confirmMutation.isPending}
          actionType={registrationResult?.action ?? null}
          maskedEmail={registrationResult?.masked_email ?? null}
          step1Error={step1Error}
          step2Error={step2Error}
        />
      )}

      <Footer />
    </div>
  );
}
