import { ShieldCheck, ShieldQuestion, ShieldX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrustLevel } from "@/types/catalog";

const config: Record<
  TrustLevel,
  {
    label: string;
    variant: "success" | "warning" | "danger";
    icon: typeof ShieldCheck;
  }
> = {
  trusted: { label: "Trusted", variant: "success", icon: ShieldCheck },
  on_review: { label: "On review", variant: "warning", icon: ShieldQuestion },
  untrusted: { label: "Untrusted", variant: "danger", icon: ShieldX },
};

export function TrustBadge({ level }: { level: TrustLevel }) {
  const item = config[level];
  const Icon = item.icon;
  return (
    <Badge variant={item.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {item.label}
    </Badge>
  );
}
