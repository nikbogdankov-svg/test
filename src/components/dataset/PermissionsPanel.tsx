"use client";

import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { PermissionBadge } from "@/components/badges/PermissionBadge";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { RequestAccessDialog } from "@/components/dataset/RequestAccessDialog";
import { Badge } from "@/components/ui/badge";
import { datasets } from "@/data/datasets";
import { personaToOwner } from "@/data/personas";
import { usePersona } from "@/hooks/usePersona";
import { formatDateTime } from "@/lib/format";
import { peopleWithAccessToDataset } from "@/lib/peopleAccess";
import type { AccessRequest } from "@/types/catalog";

interface PermissionsPanelProps {
  datasetId: string;
  datasetName: string;
  pendingRequests: AccessRequest[];
}

export function PermissionsPanel({
  datasetId,
  datasetName,
  pendingRequests,
}: PermissionsPanelProps) {
  const { persona } = usePersona();
  const dataset = datasets.find((item) => item.id === datasetId);
  const people = dataset
    ? peopleWithAccessToDataset(dataset, {
        person: personaToOwner(persona),
        level: dataset.permission,
      })
    : [];
  const alreadyHasAccess = people.some(
    (access) => access.person.email === persona.email
  );
  const canRequest =
    persona.capabilities.canRequestAccess && !alreadyHasAccess;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            Access control
          </h3>
          <p className="text-sm text-neutral-500">
            People who can access this dataset, and pending requests.
          </p>
        </div>
        {canRequest ? (
          <RequestAccessDialog
            datasetId={datasetId}
            datasetName={datasetName}
          />
        ) : null}
      </div>

      <MetadataCard title={`${people.length} people with access`}>
        {people.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No people currently have access to this dataset.
          </p>
        ) : (
          <ul className="space-y-2">
            {people.map((access) => (
              <li
                key={access.person.email}
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-neutral-200 px-3 py-2.5"
              >
                <OwnerAvatar
                  owner={access.person}
                  subtitle={access.department}
                  size="md"
                />
                <div className="flex flex-wrap items-center gap-1.5">
                  <PermissionBadge level={access.level} />
                  <Badge variant="muted">
                    {access.source === "owner"
                      ? "Dataset owner"
                      : access.source === "team"
                        ? "Via department"
                        : "Direct grant"}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </MetadataCard>

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
                  <OwnerAvatar
                    owner={request.requester}
                    subtitle={request.requester.team}
                    size="md"
                  />
                  <Badge variant="warning">{request.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-700">{request.reason}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
                  <span>{request.requestedRole}</span>
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
