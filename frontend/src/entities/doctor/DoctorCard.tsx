"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";

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
  featured?: boolean;
}

export const DoctorCard = ({ doctor, className, featured }: DoctorCardProps) => {
  const initials = getInitials(doctor);
  const fullName = [doctor.last_name, doctor.first_name, doctor.middle_name]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={ROUTES.DOCTOR(doctor.slug || doctor.id)} className="block h-full">
      <div
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-300",
          "hover:border-accent/40 hover:shadow-lg",
          "hover:-translate-y-1",
          className,
        )}
      >
        {/* Фото — компактный портрет */}
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden bg-gradient-to-br from-accent/15 to-accent/5",
            featured ? "aspect-[4/5]" : "aspect-[4/5]",
          )}
        >
          {doctor.photo_url ? (
            <Image
              src={doctor.photo_url}
              alt={fullName}
              fill
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-heading text-3xl font-bold text-accent/30">
                {initials}
              </span>
            </div>
          )}
          {(doctor.board_role || doctor.academic_degree) && (
            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
              {doctor.board_role && (
                <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  {BOARD_ROLE_LABELS[doctor.board_role]}
                </span>
              )}
              {doctor.academic_degree && (
                <span className="rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-text-primary shadow-sm">
                  {doctor.academic_degree}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Подпись под фото */}
        <div className="flex flex-1 flex-col p-3">
          <h3 className="font-heading text-sm font-bold leading-snug text-text-primary line-clamp-2">
            {fullName}
          </h3>
          {doctor.specialization && (
            <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-text-secondary">
              {doctor.specialization}
            </p>
          )}
          {(doctor.city || doctor.clinic_name) && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-text-muted">
              <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
              <span className="truncate">
                {[doctor.city, doctor.clinic_name].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}
          <div className="mt-auto flex justify-end pt-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
