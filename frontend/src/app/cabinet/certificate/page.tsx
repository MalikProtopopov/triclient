"use client";

import { useState } from "react";
import { Award, Download, Check, X, Share2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import {
  useCertificates,
  certificateApi,
  type Certificate,
} from "@/entities/certificate";
import { useSubscriptionStatus } from "@/entities/subscription";
import { Card, Button, Badge, EmptyState, PageLoader } from "@/shared/ui";
import { formatShortDate } from "@/shared/lib/format";
import { getApiErrorMessage } from "@/shared/lib/apiError";

export default function CabinetCertificatePage() {
  const {
    data: certificates,
    isLoading,
    isError,
    error: listError,
    refetch,
  } = useCertificates();
  const { data: subscription, isLoading: subLoading } = useSubscriptionStatus();

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (cert: Certificate) => {
    setDownloadingId(cert.id);
    try {
      const blob = await certificateApi.downloadBlob(cert.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cert.certificate_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const fromApi = getApiErrorMessage(err);
      if (fromApi) {
        toast.error(fromApi);
      } else {
        const status = (err as AxiosError)?.response?.status;
        if (status === 403) {
          toast.error("Сертификат больше недействителен");
        } else {
          toast.error("Не удалось скачать сертификат");
        }
      }
    } finally {
      setDownloadingId(null);
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

  if (isError) {
    const message =
      getApiErrorMessage(listError) ??
      "Не удалось загрузить список сертификатов.";
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Сертификаты
        </h1>
        <Card className="border-error/30 bg-error/5 p-6">
          <p className="text-sm leading-relaxed text-error">{message}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => void refetch()}
          >
            Попробовать снова
          </Button>
        </Card>
      </div>
    );
  }

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
                onClick={() => handleDownload(cert)}
                disabled={downloadingId === cert.id}
              >
                <Download className="mr-1.5 h-4 w-4" />
                {downloadingId === cert.id ? "Загрузка…" : "Скачать PDF"}
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
