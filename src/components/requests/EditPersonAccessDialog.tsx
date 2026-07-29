"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { datasets } from "@/data/datasets";
import type {
  PersonAccessProfile,
  PersonDatasetAccess,
} from "@/lib/peopleAccess";
import type { PermissionLevel } from "@/types/catalog";

const ROLE_OPTIONS = ["Viewer", "Editor", "Owner"] as const;

const ROLE_TO_LEVEL: Record<string, PermissionLevel> = {
  Viewer: "viewer",
  Editor: "editor",
  Owner: "owner",
};

interface EditPersonAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: PersonAccessProfile | null;
  grants: PersonDatasetAccess[];
  focusDatasetId?: string;
  onGrant: (grants: PersonDatasetAccess[], resolvedRequestIds: string[]) => void;
  onDeny: (resolvedRequestIds: string[]) => void;
}

export function EditPersonAccessDialog({
  open,
  onOpenChange,
  profile,
  grants,
  focusDatasetId,
  onGrant,
  onDeny,
}: EditPersonAccessDialogProps) {
  const [draft, setDraft] = useState<PersonDatasetAccess[]>([]);
  const [comment, setComment] = useState("");
  const [adding, setAdding] = useState(false);
  const [newDatasetId, setNewDatasetId] = useState("");

  const focusRequest = useMemo(() => {
    if (!profile) return null;
    if (focusDatasetId) {
      return (
        profile.pendingRequests.find(
          (request) => request.datasetId === focusDatasetId
        ) ?? null
      );
    }
    return profile.pendingRequests[0] ?? null;
  }, [profile, focusDatasetId]);

  useEffect(() => {
    if (!open || !profile) return;

    let next = [...grants];
    const targetId = focusDatasetId ?? focusRequest?.datasetId;
    if (targetId && !next.some((item) => item.datasetId === targetId)) {
      const dataset = datasets.find((item) => item.id === targetId);
      if (dataset) {
        const role = focusRequest?.requestedRole ?? "Viewer";
        next = [
          ...next,
          {
            datasetId: dataset.id,
            datasetName: dataset.name,
            department: dataset.owner.team,
            level: ROLE_TO_LEVEL[role] ?? "viewer",
            role,
            source: "user",
          },
        ];
      }
    }

    setDraft(
      next.sort((a, b) => a.datasetName.localeCompare(b.datasetName))
    );
    setComment("");
    setAdding(false);
    setNewDatasetId("");
  }, [open, profile, grants, focusDatasetId, focusRequest]);

  const grantedIds = useMemo(
    () => new Set(draft.map((item) => item.datasetId)),
    [draft]
  );

  const availableDatasets = useMemo(
    () =>
      datasets
        .filter((dataset) => !grantedIds.has(dataset.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [grantedIds]
  );

  const message =
    focusRequest?.reason ??
    "No request message. You can still adjust this person’s dataset access.";

  function updateRole(datasetId: string, role: string) {
    setDraft((current) =>
      current.map((item) =>
        item.datasetId === datasetId
          ? {
              ...item,
              role,
              level: (ROLE_TO_LEVEL[role] ?? item.level) as PermissionLevel,
            }
          : item
      )
    );
  }

  function removeGrant(datasetId: string) {
    setDraft((current) =>
      current.filter((item) => item.datasetId !== datasetId)
    );
  }

  function confirmAddAccess() {
    const dataset = datasets.find((item) => item.id === newDatasetId);
    if (!dataset) return;
    const grant: PersonDatasetAccess = {
      datasetId: dataset.id,
      datasetName: dataset.name,
      department: dataset.owner.team,
      level: "viewer",
      role: "Viewer",
      source: "user",
    };
    setDraft((current) =>
      [...current, grant].sort((a, b) =>
        a.datasetName.localeCompare(b.datasetName)
      )
    );
    setNewDatasetId("");
    setAdding(false);
  }

  function resolveIdsForDecision() {
    if (!profile) return [];
    if (focusRequest) return [focusRequest.id];
    return profile.pendingRequests.map((request) => request.id);
  }

  function handleGrant() {
    if (!profile) return;
    void comment;
    onGrant(draft, resolveIdsForDecision());
    onOpenChange(false);
  }

  function handleDeny() {
    if (!profile) return;
    void comment;
    onDeny(resolveIdsForDecision());
    onOpenChange(false);
  }

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit access</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <OwnerAvatar owner={profile.person} showName={false} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {profile.person.name}
              </p>
              <p className="truncate text-sm text-neutral-500">
                {profile.department}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              Message
            </p>
            <p className="text-sm leading-relaxed text-neutral-700">
              {message}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
              Current dataset access
            </p>

            {draft.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No datasets assigned yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {draft.map((access) => (
                  <li
                    key={access.datasetId}
                    className="flex items-center gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-900">
                        {access.datasetName}
                      </p>
                      <p className="truncate text-sm text-neutral-500">
                        {access.department}
                      </p>
                    </div>
                    <Select
                      value={
                        ROLE_OPTIONS.includes(
                          access.role as (typeof ROLE_OPTIONS)[number]
                        )
                          ? access.role
                          : access.level === "owner"
                            ? "Owner"
                            : access.level === "editor"
                              ? "Editor"
                              : "Viewer"
                      }
                      onValueChange={(value) =>
                        updateRole(access.datasetId, value)
                      }
                    >
                      <SelectTrigger className="h-8 w-[9.5rem] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-neutral-500"
                      onClick={() => removeGrant(access.datasetId)}
                      aria-label={`Remove ${access.datasetName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {adding ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select value={newDatasetId} onValueChange={setNewDatasetId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDatasets.map((dataset) => (
                      <SelectItem key={dataset.id} value={dataset.id}>
                        {dataset.name} · {dataset.owner.team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setAdding(false);
                      setNewDatasetId("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmAddAccess}
                    disabled={!newDatasetId}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAdding(true)}
                disabled={availableDatasets.length === 0}
              >
                <Plus className="h-4 w-4" />
                Add access
              </Button>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="access-comment" className="text-neutral-500">
              Your comment
            </Label>
            <Input
              id="access-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Value"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleDeny}>
            Deny access
          </Button>
          <Button type="button" onClick={handleGrant}>
            Grant access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EditAccessTrigger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button type="button" variant="secondary" size="sm" onClick={onClick}>
      <Pencil className="h-3.5 w-3.5" />
      Edit access
    </Button>
  );
}
