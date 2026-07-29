import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Owner } from "@/types/catalog";

interface OwnerAvatarProps {
  owner: Owner;
  showName?: boolean;
  subtitle?: string;
  className?: string;
  size?: "sm" | "md";
}

export function OwnerAvatar({
  owner,
  showName = true,
  subtitle,
  className,
  size = "sm",
}: OwnerAvatarProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn("flex items-center gap-2 min-w-0", className)}>
            <Avatar className={size === "sm" ? "h-6 w-6" : "h-8 w-8"}>
              <AvatarFallback
                style={{ backgroundColor: owner.avatarColor }}
                className={size === "sm" ? "text-[9px]" : "text-[11px]"}
              >
                {owner.avatarInitials}
              </AvatarFallback>
            </Avatar>
            {showName ? (
              <div className="min-w-0">
                <p className="truncate text-sm text-neutral-800">
                  {owner.name}
                </p>
                {subtitle ? (
                  <p className="truncate text-xs text-neutral-500">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{owner.name}</p>
          <p className="text-neutral-300">{owner.email}</p>
          <p className="text-neutral-300">{owner.team}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
