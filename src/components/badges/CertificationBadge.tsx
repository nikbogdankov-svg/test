import { BadgeCheck, Clock3, Ban, CircleDashed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CertificationStatus } from "@/types/catalog";

const config: Record<
  CertificationStatus,
  {
    label: string;
    variant: "success" | "warning" | "danger" | "muted";
    icon: typeof BadgeCheck;
  }
> = {
  certified: { label: "Certified", variant: "success", icon: BadgeCheck },
  pending: { label: "Pending", variant: "warning", icon: Clock3 },
  deprecated: { label: "Deprecated", variant: "danger", icon: Ban },
  uncertified: { label: "Uncertified", variant: "muted", icon: CircleDashed },
};

export function CertificationBadge({
  status,
}: {
  status: CertificationStatus;
}) {
  const item = config[status];
  const Icon = item.icon;
  return (
    <Badge variant={item.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {item.label}
    </Badge>
  );
}
