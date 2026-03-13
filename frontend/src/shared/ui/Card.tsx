import { cn } from "@/shared/lib";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className, hover, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border bg-bg-secondary p-6 shadow-sm",
        hover &&
          "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
};
