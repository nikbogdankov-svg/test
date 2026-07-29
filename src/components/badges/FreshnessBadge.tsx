import { Badge } from "@/components/ui/badge";
import type { FreshnessStatus } from "@/types/catalog";

const config: Record<
  FreshnessStatus,
  { label: string; variant: "success" | "warning" | "danger" | "muted" }
> = {
  fresh: { label: "Fresh", variant: "success" },
  stale: { label: "Stale", variant: "warning" },
  outdated: { label: "Outdated", variant: "danger" },
  unknown: { label: "Unknown", variant: "muted" },
};

export function FreshnessBadge({ status }: { status: FreshnessStatus }) {
  const item = config[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
