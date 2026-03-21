import Link from "next/link";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Card, Badge } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { serverFetch } from "@/shared/lib/serverFetch";
import { formatShortDate } from "@/shared/lib/format";
import type { CertificateVerifyResponse } from "@/entities/certificate";

interface Props {
  params: Promise<{ certificateNumber: string }>;
}

export default async function CertificateVerifyPage({ params }: Props) {
  const { certificateNumber } = await params;

  const data = await serverFetch<CertificateVerifyResponse>(
    `/api/v1/public/certificates/verify/${encodeURIComponent(certificateNumber)}`,
  );

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-12 lg:py-20">
          {!data ? (
            <NotFound number={certificateNumber} />
          ) : data.is_valid ? (
            <ValidCertificate data={data} />
          ) : (
            <InvalidCertificate data={data} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ValidCertificate({ data }: { data: CertificateVerifyResponse }) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <div>
        <Badge variant="success" className="mb-4 text-sm">
          Сертификат действителен
        </Badge>
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Подтверждение членства
        </h1>
      </div>

      <Card className="text-left">
        <div className="space-y-4">
          <Row label="Врач">
            <Link
              href={ROUTES.DOCTOR(data.doctor_slug)}
              className="font-medium text-accent hover:underline"
            >
              {data.doctor_full_name}
            </Link>
          </Row>

          <Row label="Тип сертификата">
            {data.certificate_type === "member"
              ? "Членский сертификат"
              : "Сертификат мероприятия"}
          </Row>

          <Row label="Номер">{data.certificate_number}</Row>

          {data.year && <Row label="Год">{data.year}</Row>}

          <Row label="Дата выдачи">{formatShortDate(data.issued_at)}</Row>

          <hr className="border-border-light" />

          <Row label="Организация">{data.organization_name}</Row>

          <Row label={data.president_title}>
            {data.president_full_name}
          </Row>
        </div>
      </Card>
    </div>
  );
}

function InvalidCertificate({ data }: { data: CertificateVerifyResponse }) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error/10">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
      </div>

      <div>
        <Badge variant="error" className="mb-4 text-sm">
          Сертификат недействителен
        </Badge>
        <h1 className="font-heading text-3xl font-bold text-text-primary">
          Сертификат не подтверждён
        </h1>
      </div>

      <Card className="text-left">
        <div className="space-y-4">
          <Row label="Врач">
            <span className="text-text-primary">{data.doctor_full_name}</span>
          </Row>

          <Row label="Номер">{data.certificate_number}</Row>

          {data.invalid_reason && (
            <div className="rounded-lg bg-error/5 p-3">
              <p className="text-sm text-red-700">{data.invalid_reason}</p>
            </div>
          )}
        </div>
      </Card>

      <p className="text-sm text-text-muted">
        Если вы считаете, что это ошибка, свяжитесь с организацией.
      </p>
    </div>
  );
}

function NotFound({ number }: { number: string }) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-warning/10">
          <AlertTriangle className="h-10 w-10 text-amber-600" />
        </div>
      </div>

      <h1 className="font-heading text-3xl font-bold text-text-primary">
        Сертификат не найден
      </h1>

      <p className="text-text-secondary">
        Сертификат с номером <strong>{number}</strong> не найден в системе.
        Проверьте правильность ссылки.
      </p>

      <Link
        href={ROUTES.HOME}
        className="inline-block text-sm text-accent hover:underline"
      >
        ← На главную
      </Link>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="shrink-0 text-sm text-text-muted sm:w-40">
        {label}
      </span>
      <span className="text-text-primary">{children}</span>
    </div>
  );
}
