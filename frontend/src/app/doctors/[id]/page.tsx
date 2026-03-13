"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MapPin, Phone, Mail, ArrowLeft } from "lucide-react";

import { useDoctor } from "@/entities/doctor";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Card, SkeletonCard, ContentBlockRenderer } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

export default function DoctorProfilePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const { data: doctor, isLoading } = useDoctor(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
            <div className="mb-6 h-4 w-32 animate-pulse rounded bg-border-light/60" />
            <div className="flex gap-8">
              <div className="h-40 w-40 shrink-0 animate-pulse rounded-full bg-border-light/60" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-48 animate-pulse rounded bg-border-light/60" />
                <div className="h-4 w-32 animate-pulse rounded bg-border-light/60" />
                <div className="h-4 w-24 animate-pulse rounded bg-border-light/60" />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-text-primary">Врач не найден</h2>
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
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
          <Link
            href={ROUTES.DOCTORS}
            className="mb-6 inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Все врачи
          </Link>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-accent/20 text-3xl font-semibold text-text-primary sm:h-40 sm:w-40">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-text-primary">{fullName}</h1>
              <p className="mt-2 text-text-secondary">{doctor.specialization}</p>
              {doctor.academic_degree && (
                <p className="mt-1 text-accent">{doctor.academic_degree}</p>
              )}
              <div className="mt-2 flex items-center gap-2 text-text-muted">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{doctor.city}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-6">
            <Card>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
                Место работы
              </h2>
              <p className="text-text-primary">
                {doctor.clinic_name}
                {doctor.position && ` · ${doctor.position}`}
              </p>
            </Card>

            {doctor.bio && (
              <Card>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
                  О специалисте
                </h2>
                <p className="whitespace-pre-wrap text-text-secondary">{doctor.bio}</p>
              </Card>
            )}

            {(doctor.public_phone || doctor.public_email) && (
              <Card>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
                  Контакты
                </h2>
                <div className="space-y-2">
                  {doctor.public_phone && (
                    <div className="flex items-center gap-2 text-text-primary">
                      <Phone className="h-4 w-4 shrink-0 text-accent" />
                      <a
                        href={`tel:${doctor.public_phone.replace(/\D/g, "")}`}
                        className="hover:text-accent"
                      >
                        {doctor.public_phone}
                      </a>
                    </div>
                  )}
                  {doctor.public_email && (
                    <div className="flex items-center gap-2 text-text-primary">
                      <Mail className="h-4 w-4 shrink-0 text-accent" />
                      <a
                        href={`mailto:${doctor.public_email}`}
                        className="hover:text-accent"
                      >
                        {doctor.public_email}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <ContentBlockRenderer blocks={doctor.content_blocks ?? []} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
