"use client";

import Image from "next/image";
import Link from "next/link";

import { useDoctors } from "@/entities/doctor";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { resolvePendingPhotoUrl } from "@/shared/config";

const BOARD_ROLE_LABELS: Record<string, string> = {
  president: "Президент ассоциации",
  pravlenie: "Член правления",
};

export default function PravleniePage() {
  const { data: doctorsData, isLoading } = useDoctors({
    board_role: ["president", "pravlenie"],
    limit: 50,
  });

  const doctors = doctorsData?.data ?? [];
  const sorted = [...doctors].sort((a, b) => {
    if (a.board_role === "president" && b.board_role !== "president") return -1;
    if (a.board_role !== "president" && b.board_role === "president") return 1;
    return 0;
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        {/* Шапка */}
        <div className="border-b border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Ассоциация трихологов
            </p>
            <h1 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
              Правление
            </h1>
            <p className="mt-3 max-w-xl text-text-secondary">
              Руководство «Профессионального общества трихологов» — ведущие
              эксперты в области трихологии и дерматологии России
            </p>
          </div>
        </div>

        {/* Карточки правления */}
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          {isLoading ? (
            <div className="space-y-0 divide-y divide-border">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="grid gap-8 py-14 first:pt-0 last:pb-0 lg:grid-cols-[320px_1fr] lg:gap-14"
                >
                  <div className="h-[360px] animate-pulse rounded-2xl bg-border-light/60 lg:h-[400px]" />
                  <div className="space-y-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-border-light/60" />
                    <div className="h-8 w-64 animate-pulse rounded bg-border-light/60" />
                    <div className="h-4 w-32 animate-pulse rounded bg-border-light/60" />
                    <div className="h-4 w-48 animate-pulse rounded bg-border-light/60" />
                    <div className="h-20 w-full animate-pulse rounded bg-border-light/60" />
                  </div>
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <EmptyState
              title="Нет данных о правлении"
              description="Информация о членах правления пока не добавлена"
            />
          ) : (
            <div className="space-y-0 divide-y divide-border">
              {sorted.map((doctor, i) => {
                const fullName = [doctor.last_name, doctor.first_name, doctor.middle_name]
                  .filter(Boolean)
                  .join(" ");
                const roleLabel =
                  doctor.board_role
                    ? BOARD_ROLE_LABELS[doctor.board_role] ?? "Член правления"
                    : "Член правления";
                const photoSrc = resolvePendingPhotoUrl(
                  doctor.photo_url ?? undefined,
                );

                return (
                  <div
                    key={doctor.id}
                    className="group grid gap-8 py-14 first:pt-0 last:pb-0 lg:grid-cols-[320px_1fr] lg:gap-14"
                  >
                    {/* Фото */}
                    <div className="relative">
                      <div className="relative overflow-hidden rounded-2xl">
                        {photoSrc ? (
                          <Image
                            src={photoSrc}
                            alt={fullName}
                            width={320}
                            height={400}
                            className="h-[360px] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] lg:h-[400px]"
                          />
                        ) : (
                          <div className="flex h-[360px] w-full items-center justify-center bg-border-light/30 lg:h-[400px]">
                            <span className="font-heading text-6xl font-bold text-border-light">
                              {fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                        {/* Нижний градиент */}
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#4a4a4a]/50 to-transparent" />
                      </div>
                      {/* Роль поверх фото внизу */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <span
                          className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-[#4a4a4a] backdrop-blur-sm"
                          style={{ background: "rgba(237,190,204,0.9)" }}
                        >
                          {roleLabel}
                        </span>
                      </div>

                      {/* Порядковый номер */}
                      <div
                        className="absolute -top-4 -right-4 hidden font-heading text-[80px] font-bold leading-none text-border-light/50 select-none lg:block"
                      >
                        0{i + 1}
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="flex flex-col justify-center">
                      <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
                        {roleLabel}
                      </p>
                      <Link
                        href={ROUTES.DOCTOR(doctor.slug)}
                        className="font-heading text-2xl font-bold text-text-primary transition-colors hover:text-accent lg:text-3xl"
                      >
                        {fullName}
                      </Link>

                      {doctor.academic_degree && (
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span
                            className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-[#4a4a4a]"
                            style={{ background: "rgba(237,190,204,0.3)" }}
                          >
                            {doctor.academic_degree}
                          </span>
                        </div>
                      )}

                      <p className="mt-4 text-sm font-medium text-text-secondary">
                        {doctor.specialization}
                      </p>

                      {doctor.bio && (
                        <>
                          <div
                            className="my-5 h-[1px] w-12"
                            style={{ background: "#edbecc" }}
                          />
                          <div className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                            {doctor.bio}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
