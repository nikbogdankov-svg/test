import { Badge } from "@/components/ui/badge";
import type { PermissionLevel } from "@/types/catalog";

const config: Record<
  PermissionLevel,
  { label: string; variant: "success" | "info" | "warning" | "danger" | "muted" }
> = {
  owner: { label: "Owner", variant: "success" },
  editor: { label: "Editor", variant: "info" },
  viewer: { label: "Viewer", variant: "muted" },
  restricted: { label: "Restricted", variant: "warning" },
  none: { label: "No access", variant: "danger" },
};

export function PermissionBadge({ level }: { level: PermissionLevel }) {
  const item = config[level];
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
