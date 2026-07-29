import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { PermissionBadge } from "@/components/badges/PermissionBadge";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { RequestAccessDialog } from "@/components/dataset/RequestAccessDialog";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import type { AccessRequest, PermissionEntry } from "@/types/catalog";

interface PermissionsPanelProps {
  datasetId: string;
  datasetName: string;
  permissions: PermissionEntry[];
  pendingRequests: AccessRequest[];
}

export function PermissionsPanel({
  datasetId,
  datasetName,
  permissions,
  pendingRequests,
}: PermissionsPanelProps) {
  const users = permissions.filter((item) => item.subjectType === "user");
  const teams = permissions.filter((item) => item.subjectType === "team");
  const roles = permissions.filter((item) => item.subjectType === "role");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Access control
          </h3>
          <p className="text-sm text-neutral-500">
            Users, teams, roles and pending access requests.
          </p>
        </div>
        <RequestAccessDialog datasetId={datasetId} datasetName={datasetName} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PermissionGroup title="Users" items={users} empty="No direct user grants." />
        <PermissionGroup title="Teams" items={teams} empty="No team grants." />
        <PermissionGroup title="Roles" items={roles} empty="No role grants." />
      </div>

      <MetadataCard title="Pending requests">
        {pendingRequests.length === 0 ? (
          <p className="text-sm text-neutral-500">No pending access requests.</p>
        ) : (
          <ul className="space-y-2">
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                className="rounded-md border border-neutral-200 px-3 py-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <OwnerAvatar owner={request.requester} />
                  <Badge variant="warning">{request.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-700">{request.reason}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                  <span>Role · {request.requestedRole}</span>
                  <span>{formatDateTime(request.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </MetadataCard>
    </div>
  );
}

function PermissionGroup({
  title,
  items,
  empty,
}: {
  title: string;
  items: PermissionEntry[];
  empty: string;
}) {
  return (
    <MetadataCard title={title}>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-md border border-neutral-200 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-neutral-900">
                  {item.subject}
                </p>
                <PermissionBadge level={item.level} />
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {item.role} · granted {formatDateTime(item.grantedAt)} by{" "}
                {item.grantedBy}
              </p>
            </li>
          ))}
        </ul>
      )}
    </MetadataCard>
  );
}
