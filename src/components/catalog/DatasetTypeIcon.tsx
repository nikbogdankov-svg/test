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
  vector_collection: "bg-emerald-50 text-emerald-700 border-emerald-200",
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
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
        tones[type],
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
  );
}
