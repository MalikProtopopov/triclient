import { cn } from "@/shared/lib";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div className={cn("animate-pulse rounded-lg bg-border-light/60", className)} />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="space-y-4 rounded-2xl border border-border bg-bg-secondary p-6">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};

export const SkeletonTableRow = () => {
  return (
    <div className="flex gap-4 py-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
};
