import {
  Eye,
  FilePlus2,
  KeyRound,
  KeySquare,
  PencilLine,
  UserRoundCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CatalogAuditEntry } from "@/lib/audit";
import type { AuditEvent } from "@/types/catalog";

const icons = {
  created: FilePlus2,
  schema_changed: PencilLine,
  owner_changed: UserRoundCog,
  permission_granted: KeyRound,
  permission_revoked: KeySquare,
  viewed_by_ai: Eye,
  updated: PencilLine,
};

interface AuditTimelineProps {
  events: Array<AuditEvent | CatalogAuditEntry>;
}

function isCatalogEntry(
  event: AuditEvent | CatalogAuditEntry
): event is CatalogAuditEntry {
  return "department" in event && "containsPii" in event;
}

export function AuditTimeline({ events }: AuditTimelineProps) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <ol className="space-y-0">
      {sorted.map((event, index) => {
        const Icon = icons[event.type];
        const catalog = isCatalogEntry(event) ? event : null;
        const isFirst = index === 0;
        const isLast = index === sorted.length - 1;

        return (
          <li
            key={event.id}
            className={cn("flex gap-3", !isLast && "pb-6")}
          >
            <div className="relative w-6 shrink-0 self-stretch">
              {!isFirst ? (
                <span className="absolute bottom-1/2 left-1/2 top-0 w-px -translate-x-1/2 bg-neutral-200" />
              ) : null}
              {!isLast ? (
                <span className="absolute -bottom-6 left-1/2 top-1/2 w-px -translate-x-1/2 bg-neutral-200" />
              ) : null}
              <span className="absolute left-1/2 top-1/2 z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white">
                <Icon className="h-3 w-3 text-neutral-600" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="rounded-md border border-neutral-200 bg-white px-3 py-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium text-neutral-900">
                      {event.title}
                    </p>
                    {catalog ? (
                      <Badge variant="info" className="px-2 py-1 text-xs">
                        {catalog.datasetName}
                      </Badge>
                    ) : null}
                  </div>
                  <time className="text-xs text-neutral-500">
                    {formatDateTime(event.timestamp)}
                  </time>
                </div>
                <p className="mt-1 text-sm text-neutral-600">
                  {event.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge variant="muted" className="px-2 py-1 text-xs">
                    Actor: {event.actor}
                  </Badge>
                  {catalog ? (
                    <>
                      <Badge variant="muted" className="px-2 py-1 text-xs">
                        Department: {catalog.department}
                      </Badge>
                      <Badge variant="muted" className="px-2 py-1 text-xs">
                        Permission: {catalog.permission}
                      </Badge>
                      {catalog.containsPii ? (
                        <Badge variant="danger" className="px-2 py-1 text-xs">
                          PII
                        </Badge>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
