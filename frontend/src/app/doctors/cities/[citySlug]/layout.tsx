import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { serverFetch } from "@/shared/lib/serverFetch";
import { ENV } from "@/shared/config/env";
import type { CityResponseSchema } from "@/entities/doctor";

interface Props {
  params: Promise<{ citySlug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params;
  const city = await serverFetch<CityResponseSchema>(
    `/api/v1/cities/${citySlug}`,
  );
  if (!city) return { title: "Город не найден" };

  const title = `Трихологи в ${city.name} | Ассоциация трихологов`;
  const description = `Список врачей-трихологов в ${city.name}. Специалисты — члены Ассоциации трихологов.`;
  const canonical = `${ENV.SITE_URL}/doctors/cities/${citySlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: ENV.SITE_NAME,
      url: canonical,
      type: "website",
    },
    alternates: {
      canonical,
    },
  };
}

export default async function CityDoctorsLayout({ params, children }: Props) {
  const { citySlug } = await params;
  const city = await serverFetch<CityResponseSchema>(
    `/api/v1/cities/${citySlug}`,
  );
  if (!city) notFound();
  return children;
}
