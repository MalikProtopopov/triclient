"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { useTelegramBinding, useGenerateCode } from "@/entities/telegram";
import { Card, Button, PageLoader } from "@/shared/ui";

export default function CabinetTelegramPage() {
  const { data: binding, isLoading } = useTelegramBinding();
  const generateCodeMutation = useGenerateCode();
  const [codeData, setCodeData] = useState<{
    auth_code: string;
    bot_link: string;
    expires_at: string;
    instruction: string;
  } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!codeData) return;

    const calcRemaining = () => {
      const expiresMs = new Date(codeData.expires_at).getTime();
      const nowMs = Date.now();
      return Math.max(0, Math.floor((expiresMs - nowMs) / 1000));
    };

    setTimeRemaining(calcRemaining());
    const interval = setInterval(() => {
      const remaining = calcRemaining();
      setTimeRemaining(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [codeData]);

  const handleGetCode = () => {
    generateCodeMutation.mutate(undefined, {
      onSuccess: (data) => {
        setCodeData(data);
      },
      onError: () => toast.error("Не удалось получить код"),
    });
  };

  const handleCopy = () => {
    if (!codeData) return;
    navigator.clipboard.writeText(codeData.auth_code);
    toast.success("Код скопирован");
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (isLoading) return <PageLoader />;

  if (binding?.is_linked) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Telegram
        </h1>
        <Card className="max-w-lg">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Check className="h-8 w-8 text-success" />
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold text-text-primary">
                Telegram привязан
              </h2>
              {binding.tg_username && (
                <p className="text-text-secondary">@{binding.tg_username}</p>
              )}
              {binding.is_in_channel && (
                <p className="mt-1 text-sm text-success">
                  Состоит в канале
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Telegram
      </h1>

      <Card className="max-w-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <MessageCircle className="h-8 w-8 text-accent" />
          </div>
          <div>
            <p className="mb-4 text-text-secondary">
              Привяжите Telegram для: уведомлений, доступа к закрытому каналу
            </p>

            {codeData?.instruction && (
              <p className="mb-4 text-sm text-text-secondary">
                {codeData.instruction}
              </p>
            )}

            {!codeData?.instruction && (
              <ol className="mb-6 list-decimal space-y-2 pl-5 text-left text-sm text-text-secondary">
                <li>Нажмите «Получить код»</li>
                <li>Перейдите в Telegram-бота</li>
                <li>Отправьте код боту</li>
              </ol>
            )}

            {!codeData ? (
              <Button
                onClick={handleGetCode}
                disabled={generateCodeMutation.isPending}
              >
                {generateCodeMutation.isPending
                  ? "Получение кода..."
                  : "Получить код"}
              </Button>
            ) : (
              <div className="w-full space-y-4">
                <div className="rounded-xl border border-border bg-bg p-6">
                  <p className="mb-2 text-sm text-text-muted">Ваш код</p>
                  <p className="font-mono text-3xl font-bold tracking-widest text-text-primary">
                    {codeData.auth_code}
                  </p>
                  {timeRemaining > 0 && (
                    <p className="mt-2 text-xs text-text-muted">
                      Действует: {formatTime(timeRemaining)}
                    </p>
                  )}
                  {timeRemaining === 0 && (
                    <p className="mt-2 text-xs text-red-500">
                      Код истёк.{" "}
                      <button
                        onClick={handleGetCode}
                        className="underline hover:no-underline"
                      >
                        Получить новый
                      </button>
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button variant="outline" onClick={handleCopy}>
                    <Copy className="mr-1.5 h-4 w-4" />
                    Копировать
                  </Button>
                  <a
                    href={codeData.bot_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <ExternalLink className="mr-1.5 h-4 w-4" />
                      Открыть Telegram-бота
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
