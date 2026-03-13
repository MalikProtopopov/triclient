import { cn } from "@/shared/lib";

type BadgeVariant = "default" | "success" | "warning" | "error" | "accent" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-bg text-text-secondary border border-border",
  success: "bg-success/10 text-green-700 border border-success/20",
  warning: "bg-warning/10 text-amber-700 border border-warning/20",
  error: "bg-error/10 text-red-700 border border-error/20",
  accent: "bg-accent/20 text-accent-contrast border border-accent/30",
  muted: "bg-bg text-text-muted border border-border-light",
};

export const Badge = ({ children, variant = "default", className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};
