"use client";

import Link from "next/link";
import { CertificationBadge } from "@/components/badges/CertificationBadge";
import { FreshnessBadge } from "@/components/badges/FreshnessBadge";
import { OriginalityBadge } from "@/components/badges/OriginalityBadge";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { PermissionBadge } from "@/components/badges/PermissionBadge";
import { QualityBadge } from "@/components/badges/QualityBadge";
import { TrustBadge } from "@/components/badges/TrustBadge";
import { HighlightText } from "@/components/catalog/HighlightText";
import { Badge } from "@/components/ui/badge";
import { formatRelative } from "@/lib/format";
import type { Dataset } from "@/types/catalog";

interface DatasetRowProps {
  dataset: Dataset;
  query: string;
}

export function DatasetRow({ dataset, query }: DatasetRowProps) {
  return (
    <tr className="group border-b border-neutral-100 hover:bg-neutral-50/80 transition-colors">
      <td className="px-3 py-3 align-top">
        <Link
          href={`/catalog/${dataset.id}`}
          className="block min-w-[200px]"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium text-neutral-900">
                <HighlightText text={dataset.name} query={query} />
              </span>
              {dataset.certification === "certified" ? (
                <CertificationBadge status={dataset.certification} />
              ) : null}
              {dataset.containsPii ? (
                <Badge variant="danger">PII</Badge>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs text-neutral-500 capitalize">
              {dataset.type.replace("_", " ")}
            </p>
          </div>
        </Link>
      </td>
      <td className="px-3 py-3 align-top">
        <OwnerAvatar owner={dataset.owner} />
      </td>
      <td className="px-3 py-3 align-top">
        <Badge variant="muted">
          <HighlightText text={dataset.owner.team} query={query} />
        </Badge>
      </td>
      <td className="px-3 py-3 align-top">
        <QualityBadge score={dataset.quality.score} />
      </td>
      <td className="px-3 py-3 align-top">
        <OriginalityBadge status={dataset.originality} />
      </td>
      <td className="px-3 py-3 align-top">
        <TrustBadge level={dataset.trust} />
      </td>
      <td className="px-3 py-3 align-top">
        <FreshnessBadge status={dataset.freshness} />
      </td>
      <td className="px-3 py-3 align-top">
        <PermissionBadge level={dataset.permission} />
      </td>
      <td className="px-3 py-3 align-top whitespace-nowrap">
        <span className="text-sm text-neutral-600">
          {formatRelative(dataset.updatedAt)}
        </span>
      </td>
    </tr>
  );
}
