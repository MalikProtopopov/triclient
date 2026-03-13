import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import { buildMetadata } from "@/shared/lib/seo";
import type { DoctorResponseSchema } from "@/entities/doctor";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const doctor = await serverFetch<DoctorResponseSchema>(`/api/v1/doctors/${id}`);
  if (!doctor) return { title: "Врач не найден" };

  const fullName = [doctor.last_name, doctor.first_name, doctor.middle_name]
    .filter(Boolean)
    .join(" ");

  return buildMetadata(doctor.seo ?? null, {
    title: fullName,
    description: `${doctor.specialization} — ${doctor.city}`,
  });
}

export default function DoctorLayout({ children }: Props) {
  return children;
}
