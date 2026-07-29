import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
  rows?: number;
}

export function LoadingState({
  label = "Loading catalog…",
  className,
  rows = 6,
}: LoadingStateProps) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-live="polite">
      <p className="text-sm text-neutral-500">{label}</p>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-11 animate-pulse rounded-md bg-neutral-100"
        />
      ))}
    </div>
  );
}
