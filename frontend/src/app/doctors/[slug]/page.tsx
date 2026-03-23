"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MapPin, Phone, Mail, ArrowLeft, Briefcase, Award } from "lucide-react";
import { AxiosError } from "axios";

import { useDoctor } from "@/entities/doctor";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Card, SkeletonCard, DocumentContentBlockRenderer } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { useGSAP } from "@/shared/lib/useGSAP";
import { staggerReveal } from "@/shared/lib/animations";
import gsap from "gsap";

const BOARD_ROLE_LABELS: Record<string, string> = {
  president: "Президент",
  pravlenie: "Член правления",
};

function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export default function DoctorProfilePage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const { data: doctor, isLoading, isError, error } = useDoctor(slug);

  const heroRef = useGSAP(
    (_ctx, el) => {
      if (isLoading || !doctor) return;
      const photo = el.querySelector("[data-hero-photo]");
      if (photo) {
        gsap.fromTo(
          photo,
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 0.9, ease: "power4.inOut" },
        );
      }
      gsap.fromTo(
        el.querySelectorAll("[data-hero-text]"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.3, ease: "power3.out" },
      );
      const badges = el.querySelectorAll("[data-badge]");
      if (badges.length) {
        gsap.fromTo(
          badges,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.5, ease: "back.out(1.7)" },
        );
      }
    },
    [isLoading, doctor],
  );

  const cardsRef = useGSAP(
    (_ctx, el) => {
      if (isLoading || !doctor) return;
      staggerReveal("[data-info-card]", el, { y: 30, stagger: 0.1, duration: 0.6 });
    },
    [isLoading, doctor],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
            <div className="mb-6 h-4 w-32 animate-pulse rounded bg-border-light/60" />
            <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
              <div className="aspect-[3/4] animate-pulse rounded-2xl bg-border-light/60" />
              <div className="space-y-4">
                <div className="h-10 w-64 animate-pulse rounded bg-border-light/60" />
                <div className="h-5 w-48 animate-pulse rounded bg-border-light/60" />
                <div className="h-4 w-32 animate-pulse rounded bg-border-light/60" />
              </div>
            </div>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !doctor) {
    const status = (error as AxiosError)?.response?.status;
    const message = status === 404 ? "Врач временно недоступен" : "Врач не найден";
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-text-primary">{message}</h2>
            <p className="mt-2 text-sm text-text-secondary">
              {status === 404
                ? "Профиль может быть скрыт из-за истечения подписки"
                : "Проверьте ссылку или вернитесь в каталог"}
            </p>
            <Link href={ROUTES.DOCTORS} className="mt-4 inline-block text-accent hover:underline">
              ← Все врачи
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const fullName = [doctor.last_name, doctor.first_name, doctor.middle_name]
    .filter(Boolean)
    .join(" ");
  const initials = getInitials(doctor.first_name, doctor.last_name);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8 lg:py-12">
          <Link
            href={ROUTES.DOCTORS}
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Все врачи
          </Link>

          {/* Hero: photo + info */}
          <div ref={heroRef} className="grid gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
            <div data-hero-photo className="relative overflow-hidden rounded-2xl">
              {doctor.photo_url ? (
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={doctor.photo_url}
                    alt={fullName}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 340px"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-30 blur-[60px]"
                    style={{ background: "#E8638B" }}
                  />
                  <div
                    className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full opacity-20 blur-[50px]"
                    style={{ background: "#5BB5A2" }}
                  />
                  <span className="relative font-heading text-6xl font-bold text-accent/30">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <h1 data-hero-text className="font-heading text-3xl font-bold text-text-primary lg:text-4xl">
                {fullName}
              </h1>
              <p data-hero-text className="mt-3 text-lg text-text-secondary">
                {doctor.specialization}
              </p>

              {(doctor.board_role || doctor.academic_degree) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {doctor.board_role && (
                    <span
                      data-badge
                      className="inline-flex items-center gap-1.5 rounded-xl bg-accent/10 px-4 py-2 text-sm font-medium text-accent"
                    >
                      <Award className="h-4 w-4" />
                      {BOARD_ROLE_LABELS[doctor.board_role]}
                    </span>
                  )}
                  {doctor.academic_degree && (
                    <span
                      data-badge
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-bg-secondary px-4 py-2 text-sm font-medium text-text-primary"
                    >
                      {doctor.academic_degree}
                    </span>
                  )}
                </div>
              )}

              <div data-hero-text className="mt-5 flex items-center gap-2 text-text-muted">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{doctor.city}</span>
              </div>

              {(doctor.public_phone || doctor.public_email) && (
                <div data-hero-text className="mt-6 flex flex-wrap gap-3">
                  {doctor.public_phone && (
                    <a
                      href={`tel:${doctor.public_phone.replace(/\D/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary transition-all duration-300 hover:border-accent/40 hover:shadow-sm"
                    >
                      <Phone className="h-4 w-4 text-accent" />
                      {doctor.public_phone}
                    </a>
                  )}
                  {doctor.public_email && (
                    <a
                      href={`mailto:${doctor.public_email}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary transition-all duration-300 hover:border-accent/40 hover:shadow-sm"
                    >
                      <Mail className="h-4 w-4 text-accent" />
                      {doctor.public_email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info cards */}
          <div ref={cardsRef} className="mt-12 grid gap-6 lg:grid-cols-2">
            {doctor.clinic_name && (
              <Card data-info-card>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Briefcase className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-text-muted">
                      Место работы
                    </h2>
                    <p className="text-text-primary">
                      {doctor.clinic_name}
                      {doctor.position && ` · ${doctor.position}`}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {doctor.bio && (
              <Card data-info-card className={doctor.clinic_name ? "" : "lg:col-span-2"}>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
                  О специалисте
                </h2>
                <p className="whitespace-pre-wrap text-text-secondary">{doctor.bio}</p>
              </Card>
            )}
          </div>

          {doctor.content_blocks && doctor.content_blocks.length > 0 && (
            <div className="mt-8">
              <DocumentContentBlockRenderer blocks={doctor.content_blocks} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
