import { Inbox } from "lucide-react";

import { cn } from "@/shared/lib";

import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <Inbox className="mb-4 h-12 w-12 text-text-muted" />
      <h3 className="text-lg font-medium text-text-primary">{title}</h3>
      {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      {action && (
        <Button variant="outline" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};
