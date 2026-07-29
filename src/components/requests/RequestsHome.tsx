"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { PermissionBadge } from "@/components/badges/PermissionBadge";
import {
  EditAccessTrigger,
  EditPersonAccessDialog,
} from "@/components/requests/EditPersonAccessDialog";
import { RequestDatasetAccessDialog } from "@/components/requests/RequestDatasetAccessDialog";
import { EmptyState } from "@/components/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { datasets } from "@/data/datasets";
import { usePersona } from "@/hooks/usePersona";
import { formatDateTime } from "@/lib/format";
import {
  buildPeopleAccessProfiles,
  type PersonAccessProfile,
  type PersonDatasetAccess,
} from "@/lib/peopleAccess";
import type { AccessRequest } from "@/types/catalog";

export function RequestsHome() {
  const { persona } = usePersona();
  const canRequest = persona.capabilities.canRequestAccess;
  const canReviewQueue =
    persona.capabilities.canManageTeams || persona.capabilities.canViewAudit;

  const baseProfiles = useMemo(() => buildPeopleAccessProfiles(datasets), []);

  const [grantOverrides, setGrantOverrides] = useState<
    Record<string, PersonDatasetAccess[]>
  >({});
  const [resolvedRequestIds, setResolvedRequestIds] = useState<string[]>([]);

  const profiles = useMemo(
    () =>
      baseProfiles.map((profile) => ({
        ...profile,
        datasets:
          grantOverrides[profile.person.email] ?? profile.datasets,
        pendingRequests: profile.pendingRequests.filter(
          (request) => !resolvedRequestIds.includes(request.id)
        ),
      })),
    [baseProfiles, grantOverrides, resolvedRequestIds]
  );

  const visibleProfiles = useMemo(() => {
    if (canReviewQueue) return profiles;
    if (canRequest) {
      return profiles.filter(
        (profile) => profile.person.email === persona.email
      );
    }
    return profiles;
  }, [canRequest, canReviewQueue, persona.email, profiles]);

  const requests = useMemo(() => {
    const all = datasets.flatMap((dataset) => dataset.pendingRequests);
    const open = all.filter(
      (request) =>
        request.status === "pending" &&
        !resolvedRequestIds.includes(request.id)
    );
    if (canReviewQueue) return open;
    if (canRequest) {
      return open.filter(
        (request) => request.requester.email === persona.email
      );
    }
    return open;
  }, [canRequest, canReviewQueue, persona.email, resolvedRequestIds]);

  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [focusDatasetId, setFocusDatasetId] = useState<string | undefined>();

  const editingProfile =
    profiles.find((profile) => profile.person.email === editingEmail) ?? null;

  function openEditor(email: string, datasetId?: string) {
    setEditingEmail(email);
    setFocusDatasetId(datasetId);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Access
          </h1>
        </div>
        {canRequest ? <RequestDatasetAccessDialog /> : null}
      </div>

      <Tabs defaultValue="people">
        <TabsList>
          <TabsTrigger value="people">
            People
            <span className="ml-2 text-neutral-400">
              {visibleProfiles.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <span className="ml-2 text-neutral-400">{requests.length}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people" className="space-y-3">
          {visibleProfiles.length === 0 ? (
            <EmptyState
              title="No people to show"
              description="People and their dataset access will appear here."
            />
          ) : (
            visibleProfiles.map((profile) => (
              <PersonAccessCard
                key={profile.person.email}
                profile={profile}
                canReviewQueue={canReviewQueue}
                onEdit={() => openEditor(profile.person.email)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-900">
              {canRequest && !canReviewQueue
                ? `${requests.length} of your pending requests`
                : `${requests.length} pending requests`}
            </p>
            {requests.length === 0 ? (
              <EmptyState
                title="No pending requests"
                description={
                  canRequest && !canReviewQueue
                    ? "Request access to a specific dataset when you need data outside your department."
                    : "Open a person in edit mode to grant the datasets they requested."
                }
              />
            ) : (
              <ul className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {requests.map((request) => (
                  <PendingRequestRow
                    key={request.id}
                    request={request}
                    canReviewQueue={canReviewQueue}
                    onEdit={() =>
                      openEditor(request.requester.email, request.datasetId)
                    }
                  />
                ))}
              </ul>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {canReviewQueue ? (
        <EditPersonAccessDialog
          open={Boolean(editingProfile)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingEmail(null);
              setFocusDatasetId(undefined);
            }
          }}
          profile={editingProfile}
          grants={editingProfile?.datasets ?? []}
          focusDatasetId={focusDatasetId}
          onGrant={(grants, resolvedIds) => {
            if (!editingProfile) return;
            setGrantOverrides((current) => ({
              ...current,
              [editingProfile.person.email]: grants,
            }));
            setResolvedRequestIds((current) => [
              ...new Set([...current, ...resolvedIds]),
            ]);
          }}
          onDeny={(resolvedIds) => {
            setResolvedRequestIds((current) => [
              ...new Set([...current, ...resolvedIds]),
            ]);
          }}
        />
      ) : null}
    </div>
  );
}

function PersonAccessCard({
  profile,
  canReviewQueue,
  onEdit,
}: {
  profile: PersonAccessProfile;
  canReviewQueue: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <OwnerAvatar owner={profile.person} />
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="muted">Department: {profile.department}</Badge>
            {profile.pendingRequests.length > 0 ? (
              <Badge variant="warning">
                {profile.pendingRequests.length} pending
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">
            {profile.datasets.length} dataset
            {profile.datasets.length === 1 ? "" : "s"}
          </Badge>
          {canReviewQueue ? <EditAccessTrigger onClick={onEdit} /> : null}
        </div>
      </div>

      {profile.datasets.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">
          No dataset access granted yet.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {profile.datasets.map((access) => (
            <li key={`${profile.person.email}-${access.datasetId}`}>
              {canReviewQueue ? (
                <Link
                  href={`/catalog/${access.datasetId}?tab=permissions`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm text-neutral-800 hover:border-neutral-400"
                >
                  <span>{access.datasetName}</span>
                  <PermissionBadge level={access.level} />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-sm text-neutral-800">
                  <span>{access.datasetName}</span>
                  <PermissionBadge level={access.level} />
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PendingRequestRow({
  request,
  canReviewQueue,
  onEdit,
}: {
  request: AccessRequest;
  canReviewQueue: boolean;
  onEdit: () => void;
}) {
  return (
    <li className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <OwnerAvatar
          owner={request.requester}
          subtitle={request.requester.team}
          size="md"
        />
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
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500">
          <span>{request.requestedRole}</span>
          <span>{formatDateTime(request.createdAt)}</span>
        </div>
        {canReviewQueue ? <EditAccessTrigger onClick={onEdit} /> : null}
      </div>
    </li>
  );
}
