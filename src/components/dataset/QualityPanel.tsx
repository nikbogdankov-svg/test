import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { Progress } from "@/components/ui/progress";
import { formatDateTime, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { QualityMetrics } from "@/types/catalog";

interface QualityPanelProps {
  quality: QualityMetrics;
}

function Metric({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const display = inverse ? Math.max(0, 100 - value) : value;
  const tone =
    display >= 95
      ? "bg-emerald-600"
      : display >= 90
        ? "bg-sky-600"
        : display >= 80
          ? "bg-amber-500"
          : "bg-red-500";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-neutral-600">{label}</span>
        <span className="font-medium text-neutral-900">
          {formatPercent(value)}
        </span>
      </div>
      <Progress value={Math.min(value, 100)} indicatorClassName={tone} />
    </div>
  );
}

export function QualityPanel({ quality }: QualityPanelProps) {
  const StatusIcon =
    quality.validationStatus === "passed"
      ? CheckCircle2
      : quality.validationStatus === "warning"
        ? AlertTriangle
        : XCircle;

  const statusTone =
    quality.validationStatus === "passed"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : quality.validationStatus === "warning"
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <MetadataCard title="Overall quality" className="lg:col-span-1">
        <p className="text-4xl font-semibold tracking-tight text-neutral-900">
          {quality.score.toFixed(1)}
        </p>
        <p className="mt-1 text-sm text-neutral-500">Composite quality score</p>
        <div
          className={cn(
            "mt-4 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium capitalize",
            statusTone
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          Validation {quality.validationStatus}
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Last validation · {formatDateTime(quality.lastValidation)}
        </p>
      </MetadataCard>

      <MetadataCard title="Quality dimensions" className="lg:col-span-2">
        <div className="space-y-4">
          <Metric label="Freshness" value={quality.freshness} />
          <Metric label="Completeness" value={quality.completeness} />
          <Metric label="Duplicates" value={quality.duplicates} />
          <Metric label="Null values" value={quality.nullValues} />
        </div>
      </MetadataCard>
    </div>
  );
}
