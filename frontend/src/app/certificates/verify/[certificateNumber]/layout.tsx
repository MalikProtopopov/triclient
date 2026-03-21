import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import { ENV } from "@/shared/config/env";
import type { CertificateVerifyResponse } from "@/entities/certificate";

interface Props {
  params: Promise<{ certificateNumber: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificateNumber } = await params;

  const data = await serverFetch<CertificateVerifyResponse>(
    `/api/v1/public/certificates/verify/${encodeURIComponent(certificateNumber)}`,
  );

  if (!data) {
    return { title: "Сертификат не найден" };
  }

  const status = data.is_valid ? "действителен" : "недействителен";
  const title = `Верификация сертификата ${data.certificate_number}`;
  const description = `Сертификат ${data.certificate_number} — ${status}. ${data.doctor_full_name}.`;
  const canonical = `${ENV.SITE_URL}/certificates/verify/${encodeURIComponent(certificateNumber)}`;

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

export default function CertificateVerifyLayout({ children }: Props) {
  return children;
}
