"use client";

import { useState } from "react";

import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  DropdownSelect,
  Modal,
  EmptyState,
  Skeleton,
  SkeletonCard,
  SkeletonTableRow,
  PaymentStatusBadge,
  ModerationStatusBadge,
  PageLoader,
} from "@/shared/ui";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function UiKitPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");
  const [selectValue, setSelectValue] = useState("");

  return (
    <div className="min-h-screen bg-bg">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        <h1 className="mb-2 font-heading text-3xl font-bold text-text-primary">
          UI Kit
        </h1>
        <p className="mb-12 text-text-muted">
          Компоненты из shared/ui, используемые в приложении
        </p>

        <div className="space-y-16">
          <Section title="Button" description="Варианты и размеры">
            <div className="flex flex-wrap gap-3">
              {(
                [
                  "primary",
                  "secondary",
                  "outline",
                  "ghost",
                  "danger",
                ] as const
              ).map((v) => (
                <Button key={v} variant={v}>
                  {v}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button fullWidth className="max-w-xs">
                Full width
              </Button>
              <Button isLoading>Loading</Button>
            </div>
          </Section>

          <Section title="Card">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <p className="text-sm text-text-secondary">
                  Обычная карточка с контентом
                </p>
              </Card>
              <Card hover>
                <p className="text-sm text-text-secondary">
                  Карточка с hover-эффектом
                </p>
              </Card>
            </div>
          </Section>

          <Section title="Badge" description="Варианты Badge">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  "default",
                  "success",
                  "warning",
                  "error",
                  "accent",
                  "muted",
                ] as const
              ).map((v) => (
                <Badge key={v} variant={v}>
                  {v}
                </Badge>
              ))}
            </div>
          </Section>

          <Section title="StatusBadge" description="PaymentStatusBadge и ModerationStatusBadge">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <PaymentStatusBadge status="pending" />
                <PaymentStatusBadge status="succeeded" />
                <PaymentStatusBadge status="failed" />
                <PaymentStatusBadge status="refunded" />
                <PaymentStatusBadge status="expired" />
              </div>
              <div className="flex flex-wrap gap-2">
                <ModerationStatusBadge status="new" />
                <ModerationStatusBadge status="pending" />
                <ModerationStatusBadge status="approved" />
                <ModerationStatusBadge status="rejected" />
              </div>
            </div>
          </Section>

          <Section title="Input" description="С label, error, hint">
            <div className="max-w-md space-y-4">
              <Input placeholder="Простой input" />
              <Input label="Email" type="email" placeholder="email@example.com" />
              <Input
                label="С ошибкой"
                error="Обязательное поле"
                defaultValue="invalid"
              />
              <Input
                label="С подсказкой"
                hint="Минимум 8 символов"
                placeholder="Пароль"
              />
            </div>
          </Section>

          <Section title="Select">
            <div className="max-w-md space-y-4">
              <Select
                label="Город"
                placeholder="Выберите город"
                options={[
                  { value: "msk", label: "Москва" },
                  { value: "spb", label: "Санкт-Петербург" },
                  { value: "ekb", label: "Екатеринбург" },
                ]}
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              />
            </div>
          </Section>

          <Section title="DropdownSelect">
            <div className="max-w-md">
              <DropdownSelect
                label="Специализация"
                placeholder="Выберите специализацию"
                options={[
                  { value: "trichologist", label: "Трихолог" },
                  { value: "dermatologist", label: "Дерматолог" },
                  { value: "therapist", label: "Терапевт" },
                ]}
                value={dropdownValue}
                onChange={(e) => setDropdownValue(e.target.value)}
              />
            </div>
          </Section>

          <Section title="Modal">
            <Button onClick={() => setModalOpen(true)}>Открыть модалку</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Пример модального окна"
            >
              <p className="text-sm text-text-secondary">
                Содержимое модалки. Закройте нажатием вне окна или Escape.
              </p>
            </Modal>
          </Section>

          <Section title="EmptyState" description="Пустое состояние с опциональным действием">
            <Card>
              <EmptyState
                title="Нет данных"
                description="Здесь пока ничего нет"
                action={{
                  label: "Добавить",
                  onClick: () => {},
                }}
              />
            </Card>
            <Card>
              <EmptyState
                title="Просто пусто"
                description="Без кнопки действия"
              />
            </Card>
          </Section>

          <Section title="Skeleton" description="Skeleton, SkeletonCard, SkeletonTableRow">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <SkeletonCard />
              <div className="rounded-lg border border-border p-4">
                <SkeletonTableRow />
                <SkeletonTableRow />
                <SkeletonTableRow />
              </div>
            </div>
          </Section>

          <Section title="PageLoader" description="Полноэкранный индикатор загрузки">
            <div className="rounded-2xl border border-border bg-bg-secondary p-8">
              <PageLoader />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
