import {
  Database,
  FileText,
  GitBranch,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DatasetType } from "@/types/catalog";

const icons: Record<DatasetType, LucideIcon> = {
  table: Database,
  document: FileText,
  pipeline: GitBranch,
  vector_collection: Boxes,
};

const tones: Record<DatasetType, string> = {
  table: "bg-sky-50 text-sky-700 border-sky-200",
  document: "bg-amber-50 text-amber-700 border-amber-200",
  pipeline: "bg-violet-50 text-violet-700 border-violet-200",
  vector_collection: "bg-rose-50 text-rose-700 border-rose-200",
};

const labels: Record<DatasetType, string> = {
  table: "Table",
  document: "Document",
  pipeline: "Pipeline",
  vector_collection: "Vector collection",
};

export function DatasetTypeIcon({
  type,
  className,
}: {
  type: DatasetType;
  className?: string;
}) {
  const Icon = icons[type];
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap",
        tones[type],
        className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{labels[type]}</span>
    </div>
  );
}
