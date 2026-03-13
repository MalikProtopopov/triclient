"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Play, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useEvent, useEventRegisterMutation } from "@/entities/event";
import type { EventTariff, EventRegistrationResponse } from "@/entities/event";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Card, Button, Badge, Modal, Input, ContentBlockRenderer } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDateTime, formatPrice } from "@/shared/lib/format";
import { useAuth } from "@/providers/AuthProvider";

function generateIdempotencyKey(): string {
  return crypto.randomUUID();
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
  const seatsLeft = tariff.seats_limit !== null ? tariff.seats_limit - tariff.seats_taken : null;
  const soldOut = seatsLeft !== null && seatsLeft <= 0;

  return (
    <Card className="flex flex-col">
      <h3 className="mb-1 font-medium text-text-primary">{tariff.name}</h3>
      {tariff.description && (
        <p className="mb-3 text-sm text-text-secondary">{tariff.description}</p>
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
      {seatsLeft !== null && (
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
          disabled={soldOut || isRegistering || !tariff.is_active}
          onClick={() => onRegister(tariff.id)}
        >
          {isRegistering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Зарегистрироваться
        </Button>
      )}
    </Card>
  );
}

function GuestModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  actionType,
  maskedEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; full_name: string; workplace: string; specialization: string }) => void;
  isLoading: boolean;
  actionType: "verify_existing" | "verify_new_email" | null;
  maskedEmail: string | null;
}) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [specialization, setSpecialization] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, full_name: fullName, workplace, specialization });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Регистрация на мероприятие">
      {actionType && maskedEmail && (
        <div className="mb-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          {actionType === "verify_existing"
            ? `Аккаунт с email ${maskedEmail} уже существует. Проверьте почту для подтверждения.`
            : `Код подтверждения отправлен на ${maskedEmail}.`}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          required
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
        <Button type="submit" fullWidth isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </form>
    </Modal>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isAuthenticated } = useAuth();

  const { data: event, isLoading, error } = useEvent(slug);
  const registerMutation = useEventRegisterMutation(event?.id ?? "");

  const [showGuestModal, setShowGuestModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<EventRegistrationResponse | null>(null);

  const isRegistered = !!event?.user_registration?.registration_id;

  const handleRegister = async (tariffId: string) => {
    if (!isAuthenticated) {
      setShowGuestModal(true);
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({
        tariff_id: tariffId,
        idempotency_key: generateIdempotencyKey(),
      });

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else if (result.action) {
        setRegistrationResult(result);
        setShowGuestModal(true);
      } else {
        toast.success("Вы успешно зарегистрированы!");
      }
    } catch {
      toast.error("Ошибка регистрации. Попробуйте ещё раз.");
    }
  };

  const handleGuestSubmit = async (data: {
    email: string;
    full_name: string;
    workplace: string;
    specialization: string;
  }) => {
    if (!event?.tariffs[0]) return;

    try {
      const result = await registerMutation.mutateAsync({
        tariff_id: event.tariffs[0].id,
        idempotency_key: generateIdempotencyKey(),
        guest_email: data.email,
        guest_full_name: data.full_name,
        guest_workplace: data.workplace,
        guest_specialization: data.specialization,
      });

      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else if (result.action) {
        setRegistrationResult(result);
        toast.info("Проверьте почту для подтверждения");
      } else {
        toast.success("Вы успешно зарегистрированы!");
        setShowGuestModal(false);
      }
    } catch {
      toast.error("Ошибка регистрации");
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

  const isUpcoming = event.status === "upcoming";

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

        <div className="mb-8 h-64 w-full max-h-80 overflow-hidden rounded-xl bg-metal-light" />

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

        {isUpcoming && event.tariffs.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-heading text-xl font-semibold text-text-primary">
              Тарифы
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {event.tariffs
                .filter((t) => t.is_active)
                .sort((a, b) => a.sort_order - b.sort_order)
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

        <ContentBlockRenderer blocks={event.content_blocks ?? []} className="mb-10 space-y-6" />

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
                          {gallery.photo_count} фото
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
                        <p className="text-sm text-text-muted">{recording.duration}</p>
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

      <GuestModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onSubmit={handleGuestSubmit}
        isLoading={registerMutation.isPending}
        actionType={registrationResult?.action ?? null}
        maskedEmail={registrationResult?.masked_email ?? null}
      />

      <Footer />
    </div>
  );
}
