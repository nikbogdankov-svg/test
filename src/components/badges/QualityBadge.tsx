import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QualityBadgeProps {
  score: number;
  showBar?: boolean;
  className?: string;
}

function scoreColor(score: number) {
  if (score >= 95) return "bg-emerald-600";
  if (score >= 90) return "bg-sky-600";
  if (score >= 80) return "bg-amber-500";
  return "bg-red-500";
}

export function QualityBadge({
  score,
  showBar = true,
  className,
}: QualityBadgeProps) {
  return (
    <div className={cn("inline-grid grid-cols-[max-content]", className)}>
      <div className="flex items-baseline gap-1 text-xs font-medium tabular-nums text-neutral-700">
        <span>{score.toFixed(1)}</span>
        <span className="text-neutral-400">/ 100</span>
      </div>
      {showBar ? (
        <Progress
          value={score}
          className="h-1.5 w-full"
          indicatorClassName={scoreColor(score)}
        />
      ) : null}
    </div>
  );
}
