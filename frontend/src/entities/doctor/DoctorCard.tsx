"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";

import type { DoctorResponseSchema } from "./types";

const BOARD_ROLE_LABELS: Record<NonNullable<DoctorResponseSchema["board_role"]>, string> = {
  president: "Президент",
  pravlenie: "Член правления",
};

function getInitials(doctor: DoctorResponseSchema): string {
  const first = doctor.first_name?.charAt(0) ?? "";
  const last = doctor.last_name?.charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "?";
}

interface DoctorCardProps {
  doctor: DoctorResponseSchema;
  className?: string;
}

export const DoctorCard = ({ doctor, className }: DoctorCardProps) => {
  const initials = getInitials(doctor);
  const fullName = [doctor.last_name, doctor.first_name, doctor.middle_name]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={ROUTES.DOCTOR(doctor.slug || doctor.id)}>
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-300 hover:border-accent/40 hover:shadow-[0_4px_24px_rgba(237,190,204,0.15)]",
          className,
        )}
      >
        {/* Accent линия сверху — bookmark эффект */}
        <div
          className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
          style={{ background: "#edbecc" }}
        />

        <div className="p-5">
          {/* Аватар + имя в одной строке */}
          <div className="flex items-start gap-4">
            {doctor.photo_url ? (
              <img
                src={doctor.photo_url}
                alt={fullName}
                className="h-14 w-14 flex-shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold text-[#4a4a4a] transition-transform duration-300 group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, rgba(237,190,204,0.25), rgba(237,190,204,0.1))" }}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-heading text-sm font-semibold leading-snug text-text-primary">
                {fullName}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {doctor.board_role && (
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-[#4a4a4a]"
                    style={{ background: "rgba(237,190,204,0.25)" }}
                  >
                    {BOARD_ROLE_LABELS[doctor.board_role]}
                  </span>
                )}
                {doctor.academic_degree && (
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-[#4a4a4a]"
                    style={{ background: "rgba(237,190,204,0.25)" }}
                  >
                    {doctor.academic_degree}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Специализация */}
          <p className="mt-3 text-xs text-text-secondary line-clamp-1">
            {doctor.specialization}
          </p>

          {/* Город + клиника */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {doctor.city}
                {doctor.clinic_name && ` · ${doctor.clinic_name}`}
              </span>
            </div>
          </div>

          {/* CTA — появляется при ховере */}
          <div className="mt-4 flex items-center justify-between">
            <div className="h-px flex-1 bg-border-light" />
            <span className="ml-3 flex items-center gap-1 text-[11px] font-medium text-text-muted transition-all duration-300 group-hover:gap-2 group-hover:text-text-primary">
              Профиль
              <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
