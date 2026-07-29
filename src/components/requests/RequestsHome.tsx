"use client";

import { useMemo } from "react";
import Link from "next/link";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { RequestDatasetAccessDialog } from "@/components/requests/RequestDatasetAccessDialog";
import { EmptyState } from "@/components/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { datasets } from "@/data/datasets";
import { usePersona } from "@/hooks/usePersona";
import { formatDateTime } from "@/lib/format";

export function RequestsHome() {
  const { persona } = usePersona();
  const canRequest = persona.capabilities.canRequestAccess;
  const canReviewQueue =
    persona.capabilities.canManageTeams || persona.capabilities.canViewAudit;

  const requests = useMemo(() => {
    const all = datasets.flatMap((dataset) => dataset.pendingRequests);
    if (canReviewQueue) return all;
    if (canRequest) {
      return all.filter(
        (request) => request.requester.email === persona.email
      );
    }
    return all;
  }, [canRequest, canReviewQueue, persona.email]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            {canRequest && !canReviewQueue ? "My Requests" : "Requests"}
          </h1>
          {!canRequest || canReviewQueue ? (
            <p className="mt-2 text-sm text-neutral-600">
              Pending access requests awaiting data owner review.
            </p>
          ) : null}
        </div>
        {canRequest ? <RequestDatasetAccessDialog /> : null}
      </div>

      <MetadataCard
        title={
          canRequest && !canReviewQueue
            ? `${requests.length} of your requests`
            : `${requests.length} pending requests`
        }
      >
        {requests.length === 0 ? (
          <EmptyState
            title={
              canRequest && !canReviewQueue
                ? "No requests from you yet"
                : "No pending requests"
            }
            description={
              canRequest && !canReviewQueue
                ? "Use Request access to ask for datasets from other departments."
                : "Access requests will appear here when users ask for governed dataset permissions."
            }
          />
        ) : (
          <ul className="space-y-3">
            {requests.map((request) => (
              <li
                key={request.id}
                className="rounded-md border border-neutral-200 px-3 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <OwnerAvatar owner={request.requester} />
                  <Badge variant="warning">{request.status}</Badge>
                </div>
                <p className="mt-2 text-sm font-medium text-neutral-900">
                  {canReviewQueue ? (
                    <Link
                      href={`/catalog/${request.datasetId}?tab=permissions`}
                      className="hover:underline"
                    >
                      {request.datasetName}
                    </Link>
                  ) : (
                    request.datasetName
                  )}
                </p>
                <p className="mt-1 text-sm text-neutral-600">{request.reason}</p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
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
