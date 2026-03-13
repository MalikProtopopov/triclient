"use client";

import { Award, Download, Check, X } from "lucide-react";
import { toast } from "sonner";

import { useCertificates, certificateApi } from "@/entities/certificate";
import { Card, Button, Badge, EmptyState, PageLoader } from "@/shared/ui";
import { formatShortDate } from "@/shared/lib/format";

export default function CabinetCertificatePage() {
  const { data: certificates, isLoading } = useCertificates();

  const handleDownload = async (id: string) => {
    try {
      const url = await certificateApi.download(id);
      window.open(url, "_blank");
    } catch {
      toast.error("Не удалось скачать сертификат");
    }
  };

  if (isLoading) return <PageLoader />;

  if (!certificates || certificates.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Сертификаты
        </h1>
        <EmptyState
          title="Нет сертификатов"
          description="Сертификат будет доступен после оплаты членского взноса"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Сертификаты
      </h1>

      <div className="space-y-4">
        {certificates.map((cert) => (
          <Card key={cert.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-accent/10 p-4">
              <Award className="h-8 w-8 text-accent" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-text-primary">
                  {cert.certificate_type === "member"
                    ? "Членский сертификат"
                    : "Сертификат мероприятия"}
                </p>
                <Badge variant={cert.is_active ? "success" : "error"}>
                  {cert.is_active ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" /> Действителен
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <X className="h-3 w-3" /> Недействителен
                    </span>
                  )}
                </Badge>
              </div>
              {cert.event && (
                <p className="text-sm text-text-secondary">{cert.event.title}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                <span>№ {cert.certificate_number}</span>
                <span>{cert.year} г.</span>
                <span>Выдан {formatShortDate(cert.generated_at)}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(cert.id)}
            >
              <Download className="mr-1.5 h-4 w-4" />
              Скачать PDF
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
