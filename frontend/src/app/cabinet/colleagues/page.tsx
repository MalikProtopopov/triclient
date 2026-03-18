"use client";

import { useState, useDeferredValue } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";

import { useColleagues } from "@/entities/colleague";
import { Card, Button, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

const PAGE_SIZE = 20;

export default function ColleaguesPage() {
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, isError } = useColleagues({
    limit: PAGE_SIZE,
    offset,
    search: deferredSearch || undefined,
  });

  const colleagues = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasNext = offset + PAGE_SIZE < total;
  const hasPrev = offset > 0;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        Коллеги
      </h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          placeholder="Поиск по имени..."
          className="w-full rounded-lg border border-border bg-bg py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none transition-colors focus:border-accent"
        />
      </div>

      {isError && (
        <Card className="border-error/30 bg-error/5">
          <p className="text-sm text-error">
            Не удалось загрузить список коллег. Возможно, нужна активная
            подписка.
          </p>
        </Card>
      )}

      {!isLoading && !isError && colleagues.length === 0 && (
        <EmptyState
          title="Коллеги не найдены"
          description={
            deferredSearch
              ? "Попробуйте изменить поисковый запрос"
              : "Список коллег пока пуст"
          }
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colleagues.map((colleague) => (
          <Link key={colleague.id} href={ROUTES.DOCTOR(colleague.slug)}>
            <Card hover className="flex items-center gap-4 p-4">
              {colleague.photo_url ? (
                <img
                  src={colleague.photo_url}
                  alt={`${colleague.last_name} ${colleague.first_name}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {colleague.first_name?.[0]}
                  {colleague.last_name?.[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-text-primary">
                  {colleague.last_name} {colleague.first_name}
                  {colleague.patronymic ? ` ${colleague.patronymic}` : ""}
                </p>
                {colleague.specialization && (
                  <p className="truncate text-xs text-text-secondary">
                    {colleague.specialization}
                  </p>
                )}
                {colleague.city && (
                  <p className="flex items-center gap-1 text-xs text-text-muted">
                    <MapPin className="h-3 w-3" />
                    {colleague.city}
                  </p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasPrev}
            onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
          >
            Назад
          </Button>
          <span className="text-sm text-text-muted">
            {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} из {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!hasNext}
            onClick={() => setOffset((o) => o + PAGE_SIZE)}
          >
            Далее
          </Button>
        </div>
      )}
    </div>
  );
}
