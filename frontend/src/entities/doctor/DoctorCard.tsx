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
          "group relative h-full overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-500",
          "hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
          "hover:-translate-y-1",
          className,
        )}
        style={{ perspective: "800px" }}
      >
        <div className="relative overflow-hidden" style={{ height: featured ? 280 : 200 }}>
          {doctor.photo_url ? (
            <Image
              src={doctor.photo_url}
              alt={fullName}
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
              sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
              <span className="font-heading text-4xl font-bold text-accent/40">
                {initials}
              </span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {(doctor.board_role || doctor.academic_degree) && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {doctor.board_role && (
                <span className="rounded-lg bg-accent/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {BOARD_ROLE_LABELS[doctor.board_role]}
                </span>
              )}
              {doctor.academic_degree && (
                <span className="rounded-lg bg-white/80 px-2.5 py-1 text-[10px] font-bold text-text-primary backdrop-blur-sm">
                  {doctor.academic_degree}
                </span>
              )}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className={cn(
              "font-heading font-bold leading-tight text-white",
              featured ? "text-xl" : "text-base",
            )}>
              {fullName}
            </h3>
          </div>
        </div>

        <div className="relative p-4">
          {doctor.specialization && (
            <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">
              {doctor.specialization}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {doctor.city}
                {doctor.clinic_name && ` · ${doctor.clinic_name}`}
              </span>
            </div>
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 transition-all duration-300 group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight className="h-3.5 w-3.5 text-accent transition-colors group-hover:text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
