"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Copy,
  Check,
  NotebookPen,
} from "lucide-react";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { PermissionBadge } from "@/components/badges/PermissionBadge";
import { TrustBadge } from "@/components/badges/TrustBadge";
import { DatasetTypeIcon } from "@/components/catalog/DatasetTypeIcon";
import {
  EditMetadataDialog,
  type DatasetMetadataUpdate,
} from "@/components/dataset/EditMetadataDialog";
import { RequestAccessDialog } from "@/components/dataset/RequestAccessDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePersona } from "@/hooks/usePersona";
import { currentTenant } from "@/data/users";
import { formatDateTime } from "@/lib/format";
import { peopleWithAccessToDataset } from "@/lib/peopleAccess";
import { personaToOwner } from "@/data/personas";
import type { Dataset } from "@/types/catalog";

interface DatasetHeaderProps {
  dataset: Dataset;
  onMetadataSave?: (update: DatasetMetadataUpdate) => void;
}

export function DatasetHeader({
  dataset,
  onMetadataSave,
}: DatasetHeaderProps) {
  const { persona } = usePersona();
  const [copied, setCopied] = useState(false);
  const caps = persona.capabilities;
  const people = peopleWithAccessToDataset(dataset, {
    person: personaToOwner(persona),
    level: dataset.permission,
  });
  const myAccess = people.find(
    (access) => access.person.email === persona.email
  );
  const myPermission = myAccess?.level ?? dataset.permission;
  const alreadyHasAccess = myPermission !== "none";
  const canEditMetadata =
    myPermission === "owner" || myPermission === "editor";
  const needsAccess =
    caps.canRequestAccess &&
    !alreadyHasAccess &&
    dataset.permission === "none";
  const safeForAi = dataset.trust === "trusted" && alreadyHasAccess;

  async function copyApi() {
    await navigator.clipboard.writeText(dataset.apiEndpoint);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-3">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="-ml-2 text-neutral-600"
      >
        <Link href="/catalog">
          <ArrowLeft className="h-4 w-4" />
          All datasets
        </Link>
      </Button>

      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                {dataset.name}
              </h1>
              <DatasetTypeIcon type={dataset.type} />
              <TrustBadge level={dataset.trust} />
              <PermissionBadge level={myPermission} />
              {dataset.containsPii ? (
                <Badge variant="danger">PII</Badge>
              ) : null}
            </div>
            <p className="mt-2 max-w-3xl text-sm text-neutral-600">
              {dataset.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
              <OwnerAvatar owner={dataset.owner} />
              <span>Updated {formatDateTime(dataset.updatedAt)}</span>
              <span>Trust score · {dataset.quality.score.toFixed(1)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="muted">Tenant: {currentTenant.name}</Badge>
              <Badge variant="muted">Department: {dataset.owner.team}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canEditMetadata && onMetadataSave ? (
              <EditMetadataDialog dataset={dataset} onSave={onMetadataSave} />
            ) : null}
            {needsAccess ? (
              <RequestAccessDialog
                datasetId={dataset.id}
                datasetName={dataset.name}
              />
            ) : null}
            {caps.canOpenNotebook ? (
              <Button variant="secondary" asChild>
                <a
                  href={`https://notebooks.bullsequana.ai/?dataset=${dataset.slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NotebookPen className="h-4 w-4" />
                  Open Notebook
                </a>
              </Button>
            ) : null}
            {persona.role === "compliance_officer" ? (
              <Button variant="secondary" asChild>
                <Link href={`/catalog/${dataset.id}?tab=audit`}>View Audit</Link>
              </Button>
            ) : null}
          </div>
        </div>

        {caps.canCopyApi ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <BookOpen className="h-3.5 w-3.5 shrink-0" />
            <a
              href={dataset.apiEndpoint}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 break-all font-mono text-sm text-neutral-700 hover:text-neutral-900 hover:underline"
            >
              {dataset.apiEndpoint}
            </a>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={copyApi}
              aria-label={copied ? "API endpoint copied" : "Copy API endpoint"}
              title={copied ? "Copied" : "Copy API endpoint"}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            {safeForAi ? <Badge variant="success">Safe for AI</Badge> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
