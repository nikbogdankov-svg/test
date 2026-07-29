import { Badge } from "@/components/ui/badge";
import type { OriginalityStatus } from "@/types/catalog";

const config: Record<
  OriginalityStatus,
  { label: string; variant: "success" | "warning" }
> = {
  original: { label: "Yes", variant: "success" },
  duplicate: { label: "Duplicate", variant: "warning" },
};

export function OriginalityBadge({ status }: { status: OriginalityStatus }) {
  const item = config[status];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
