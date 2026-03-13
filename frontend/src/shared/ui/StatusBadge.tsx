import { Badge } from "./Badge";

type PaymentStatus = "pending" | "completed" | "failed" | "refunded" | "partially_refunded";
type ModerationStatus = "new" | "pending" | "approved" | "rejected";

const paymentStatusMap: Record<PaymentStatus, { label: string; variant: "warning" | "success" | "error" | "muted" }> = {
  pending: { label: "Ожидает", variant: "warning" },
  completed: { label: "Оплачен", variant: "success" },
  failed: { label: "Ошибка", variant: "error" },
  refunded: { label: "Возврат", variant: "muted" },
  partially_refunded: { label: "Частичный возврат", variant: "muted" },
};

const moderationStatusMap: Record<ModerationStatus, { label: string; variant: "muted" | "warning" | "success" | "error" }> = {
  new: { label: "Новый", variant: "muted" },
  pending: { label: "На модерации", variant: "warning" },
  approved: { label: "Одобрен", variant: "success" },
  rejected: { label: "Отклонён", variant: "error" },
};

export const PaymentStatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = paymentStatusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export const ModerationStatusBadge = ({ status }: { status: ModerationStatus }) => {
  const config = moderationStatusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
