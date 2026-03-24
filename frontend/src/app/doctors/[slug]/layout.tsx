import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import { buildMetadata } from "@/shared/lib/seo";
import type { DoctorResponseSchema } from "@/entities/doctor";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await serverFetch<DoctorResponseSchema>(`/api/v1/doctors/${slug}`);
  if (!doctor) return { title: "Врач не найден" };

  const fullName = [doctor.last_name, doctor.first_name, doctor.middle_name]
    .filter(Boolean)
    .join(" ");

  const descriptionParts = [doctor.specialization, doctor.city].filter(
    (p): p is string => typeof p === "string" && p.trim().length > 0,
  );
  const description =
    descriptionParts.length > 0 ? descriptionParts.join(" — ") : `Врач-трихолог — ${fullName}`;

  return buildMetadata(doctor.seo ?? null, {
    title: fullName,
    description,
  });
}

export default function DoctorLayout({ children }: Props) {
  return children;
}
