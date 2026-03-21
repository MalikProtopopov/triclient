"use client";

import { Award, Download, Check, X, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { useCertificates, certificateApi } from "@/entities/certificate";
import { useSubscriptionStatus } from "@/entities/subscription";
import { Card, Button, Badge, EmptyState, PageLoader } from "@/shared/ui";
import { formatShortDate } from "@/shared/lib/format";

export default function CabinetCertificatePage() {
  const { data: certificates, isLoading } = useCertificates();
  const { data: subscription, isLoading: subLoading } = useSubscriptionStatus();

  const handleDownload = (downloadUrl: string) => {
    window.open(downloadUrl, "_blank");
  };

  const handleDownloadById = async (id: string) => {
    try {
      const url = await certificateApi.download(id);
      window.open(url, "_blank");
    } catch (err) {
      const status = (err as AxiosError)?.response?.status;
      if (status === 403) {
        toast.error("Сертификат больше недействителен");
      } else {
        toast.error("Не удалось скачать сертификат");
      }
    }
  };

  const handleShare = async (verifyUrl: string) => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не удалось скопировать ссылку");
    }
  };

  if (isLoading || subLoading) return <PageLoader />;

  if (!certificates || certificates.length === 0) {
    const isActive =
      subscription?.current_subscription?.status === "active";

    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Сертификаты
        </h1>
        <EmptyState
          title={isActive ? "Сертификат генерируется" : "Нет сертификатов"}
          description={
            isActive
              ? "Сертификат генерируется, пожалуйста подождите"
              : "Оплатите подписку для получения сертификата"
          }
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
          <Card
            key={cert.id}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <div className="flex shrink-0 items-center justify-center rounded-xl bg-accent/10 p-4">
              <Award className="h-8 w-8 text-accent" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-text-primary">
                  {cert.certificate_type === "member"
                    ? `Сертификат члена ассоциации${cert.year ? ` ${cert.year}` : ""}`
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
                <p className="text-sm text-text-secondary">
                  {cert.event.title}
                </p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                <span>№ {cert.certificate_number}</span>
                {cert.year && <span>{cert.year} г.</span>}
                <span>Выдан {formatShortDate(cert.generated_at)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  cert.download_url
                    ? handleDownload(cert.download_url)
                    : handleDownloadById(cert.id)
                }
              >
                <Download className="mr-1.5 h-4 w-4" />
                Скачать PDF
              </Button>
              {cert.verify_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(cert.verify_url)}
                >
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Поделиться
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
