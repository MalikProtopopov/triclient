"use client";

import { useState } from "react";
import { Check, Vote, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { AxiosError } from "axios";

import {
  useActiveVoting,
  useVoteMutation,
  votingKeys,
} from "@/entities/voting";
import type { ApiError } from "@/entities/auth";
import { useQueryClient } from "@tanstack/react-query";
import { ROUTES } from "@/shared/config";
import { Card, Button, Modal, EmptyState, PageLoader } from "@/shared/ui";

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};

function formatVotingPeriod(startsAt: string, endsAt: string): string {
  return `${new Date(startsAt).toLocaleDateString("ru-RU", DATE_OPTIONS)} — ${new Date(endsAt).toLocaleDateString("ru-RU", DATE_OPTIONS)}`;
}

export default function CabinetVotingPage() {
  const queryClient = useQueryClient();
  const { data: voting, isLoading } = useActiveVoting();
  const voteMutation = useVoteMutation(voting?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showForbiddenBanner, setShowForbiddenBanner] = useState(false);

  const sortedCandidates = [...(voting?.candidates ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  const handleVote = () => {
    if (!selectedId || !voting) return;
    setShowConfirm(false);

    voteMutation.mutate(selectedId, {
      onSuccess: () => {
        toast.success("Ваш голос учтён!");
      },
      onError: (error) => {
        const axiosErr = error as AxiosError<ApiError>;
        const status = axiosErr.response?.status;
        const code = axiosErr.response?.data?.error?.code;

        if (status === 409 || code === "ALREADY_VOTED") {
          toast.error("Вы уже проголосовали в этом голосовании");
          queryClient.invalidateQueries({ queryKey: votingKeys.active() });
          voteMutation.reset();
          return;
        }
        if (status === 403) {
          toast.error(
            "Только активные члены ассоциации могут голосовать. Проверьте статус подписки.",
          );
          setShowForbiddenBanner(true);
          return;
        }
        toast.error("Не удалось проголосовать");
      },
    });
  };

  if (isLoading) return <PageLoader />;

  if (!voting) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Голосование
        </h1>
        <EmptyState
          title="Нет активных голосований"
          description="Активных голосований нет"
        />
      </div>
    );
  }

  if (voting.has_voted) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Голосование
        </h1>
        <Card className="max-w-lg">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="mb-1 text-lg font-semibold text-text-primary">
                Вы уже проголосовали
              </h2>
            </div>
            <p className="text-sm text-text-muted">
              Результаты будут объявлены после закрытия голосования
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Голосование
      </h1>

      {showForbiddenBanner && (
        <Card className="max-w-2xl border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Только активные члены ассоциации с действующей подпиской могут
                участвовать в голосовании.
              </p>
              <Link
                href={ROUTES.CABINET_PAYMENTS}
                className="mt-2 inline-block text-sm font-medium text-amber-700 hover:underline dark:text-amber-300"
              >
                Оформить подписку →
              </Link>
            </div>
          </div>
        </Card>
      )}

      <Card className="max-w-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-text-primary">
              {voting.title}
            </h2>
            {voting.description && (
              <p className="mb-2 text-sm text-text-secondary">
                {voting.description}
              </p>
            )}
            <p className="text-sm text-text-muted">
              {formatVotingPeriod(voting.starts_at, voting.ends_at)}
            </p>
          </div>

          <div className="space-y-3">
            {sortedCandidates.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-bg p-4 transition-colors hover:bg-bg-secondary/50 has-[:checked]:border-accent has-[:checked]:bg-accent/5"
              >
                <input
                  type="radio"
                  name="candidate"
                  value={c.id}
                  checked={selectedId === c.id}
                  onChange={() => setSelectedId(c.id)}
                  className="mt-1 h-4 w-4 border-border text-accent focus:ring-accent"
                />
                <div className="flex items-start gap-3">
                  {c.photo_url && (
                    <img
                      src={c.photo_url}
                      alt={c.full_name}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-text-primary">
                      {c.full_name}
                    </p>
                    {c.description && (
                      <p className="text-sm text-text-secondary">
                        {c.description}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <Button
            onClick={() => setShowConfirm(true)}
            disabled={!selectedId || voteMutation.isPending}
          >
            <Vote className="mr-1.5 h-4 w-4" />
            {voteMutation.isPending ? "Голосование..." : "Проголосовать"}
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Подтверждение"
      >
        <p className="mb-6 text-text-secondary">
          Вы уверены, что хотите проголосовать за выбранного кандидата? Это
          действие нельзя отменить.
        </p>
        <div className="flex gap-3">
          <Button onClick={handleVote}>Да, проголосовать</Button>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Отмена
          </Button>
        </div>
      </Modal>
    </div>
  );
}
