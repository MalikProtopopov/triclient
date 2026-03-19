import { Badge } from "./Badge";

type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded"
  | "expired"
  | "partially_refunded";
type ModerationStatus = "new" | "pending" | "approved" | "rejected";

const paymentStatusMap: Record<
  PaymentStatus,
  { label: string; variant: "warning" | "success" | "error" | "muted" }
> = {
  pending: { label: "Ожидает", variant: "warning" },
  succeeded: { label: "Оплачен", variant: "success" },
  failed: { label: "Отклонён", variant: "error" },
  refunded: { label: "Возврат", variant: "muted" },
  expired: { label: "Истёк", variant: "muted" },
  partially_refunded: { label: "Частичный возврат", variant: "muted" },
};

const moderationStatusMap: Record<
  ModerationStatus,
  { label: string; variant: "muted" | "warning" | "success" | "error" }
> = {
  new: { label: "Новый", variant: "muted" },
  pending: { label: "На модерации", variant: "warning" },
  approved: { label: "Одобрен", variant: "success" },
  rejected: { label: "Отклонён", variant: "error" },
};

export const PaymentStatusBadge = ({
  status,
  statusLabel,
}: {
  status: PaymentStatus;
  statusLabel?: string;
}) => {
  const config = paymentStatusMap[status];
  const label = statusLabel ?? config?.label ?? status;
  return <Badge variant={config?.variant ?? "muted"}>{label}</Badge>;
};

export const ModerationStatusBadge = ({
  status,
}: {
  status: ModerationStatus;
}) => {
  const config = moderationStatusMap[status];
  return <Badge variant={config?.variant ?? "muted"}>{config?.label ?? status}</Badge>;
};
