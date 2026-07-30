import { datasets } from "@/data/datasets";
import { currentTenant } from "@/data/users";
import { formatDateTime } from "@/lib/format";
import type { AuditEvent, Dataset } from "@/types/catalog";

export type AuditEventType = AuditEvent["type"];

export interface CatalogAuditEntry extends AuditEvent {
  datasetName: string;
  department: string;
  containsPii: boolean;
  permission: Dataset["permission"];
}

export const AUDIT_EVENT_TYPE_LABELS: Record<AuditEventType, string> = {
  created: "Created",
  schema_changed: "Schema changed",
  owner_changed: "Owner changed",
  permission_granted: "Permission granted",
  permission_revoked: "Permission revoked",
  viewed_by_ai: "Viewed by AI",
  updated: "Updated",
};

export function buildCatalogAuditEntries(): CatalogAuditEntry[] {
  return datasets
    .flatMap((dataset) =>
      dataset.audit.map((event) => ({
        ...event,
        datasetName: dataset.name,
        department: dataset.owner.team,
        containsPii: dataset.containsPii,
        permission: dataset.permission,
        description: `${event.description} · ${dataset.name}`,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
}

export interface AuditFilters {
  datasetId: string;
  person: string;
  department: string;
  dateFrom: string;
  dateTo: string;
  eventType: string;
  pii: string;
}

export const EMPTY_AUDIT_FILTERS: AuditFilters = {
  datasetId: "all",
  person: "all",
  department: "all",
  dateFrom: "",
  dateTo: "",
  eventType: "all",
  pii: "all",
};

export function filterCatalogAuditEntries(
  entries: CatalogAuditEntry[],
  filters: AuditFilters
): CatalogAuditEntry[] {
  return entries.filter((entry) => {
    if (filters.datasetId !== "all" && entry.datasetId !== filters.datasetId) {
      return false;
    }
    if (filters.person !== "all" && entry.actor !== filters.person) {
      return false;
    }
    if (
      filters.department !== "all" &&
      entry.department !== filters.department
    ) {
      return false;
    }
    if (filters.eventType !== "all" && entry.type !== filters.eventType) {
      return false;
    }
    if (filters.pii === "pii" && !entry.containsPii) return false;
    if (filters.pii === "non_pii" && entry.containsPii) return false;

    const ts = new Date(entry.timestamp).getTime();
    if (filters.dateFrom) {
      const from = new Date(`${filters.dateFrom}T00:00:00`).getTime();
      if (ts < from) return false;
    }
    if (filters.dateTo) {
      const to = new Date(`${filters.dateTo}T23:59:59`).getTime();
      if (ts > to) return false;
    }
    return true;
  });
}

export function buildCnilEvidenceReport(
  entries: CatalogAuditEntry[],
  filters: AuditFilters
): string {
  const generatedAt = formatDateTime(new Date().toISOString());
  const lines = [
    "CNIL / DPIA EVIDENCE REPORT",
    "BullSequana AI Platform · Data Catalog",
    "=====================================",
    "",
    `Tenant: ${currentTenant.name}`,
    `Generated at: ${generatedAt}`,
    `Events included: ${entries.length}`,
    "",
    "Applied filters",
    "---------------",
    `Dataset: ${filters.datasetId === "all" ? "All datasets" : filters.datasetId}`,
    `Person / actor: ${filters.person === "all" ? "All actors" : filters.person}`,
    `Department: ${filters.department === "all" ? "All departments" : filters.department}`,
    `Date from: ${filters.dateFrom || "Any"}`,
    `Date to: ${filters.dateTo || "Any"}`,
    `Event type: ${
      filters.eventType === "all"
        ? "All types"
        : AUDIT_EVENT_TYPE_LABELS[filters.eventType as AuditEventType] ??
          filters.eventType
    }`,
    `PII scope: ${
      filters.pii === "all"
        ? "All datasets"
        : filters.pii === "pii"
          ? "PII datasets only"
          : "Non-PII datasets only"
    }`,
    "",
    "Purpose",
    "-------",
    "This report supports accountability evidence for CNIL / DPIA review:",
    "who accessed or changed which dataset, when, and under which catalog permission state.",
    "",
    "Audit events",
    "------------",
  ];

  if (entries.length === 0) {
    lines.push("No audit events match the selected filters.");
  } else {
    entries.forEach((entry, index) => {
      lines.push(
        `${index + 1}. [${formatDateTime(entry.timestamp)}] ${entry.title}`,
        `   Event ID: ${entry.id}`,
        `   Type: ${AUDIT_EVENT_TYPE_LABELS[entry.type]}`,
        `   Actor: ${entry.actor}`,
        `   Dataset: ${entry.datasetName} (${entry.datasetId})`,
        `   Department: ${entry.department}`,
        `   Contains PII: ${entry.containsPii ? "Yes" : "No"}`,
        `   Permission state at catalog: ${entry.permission}`,
        `   Details: ${entry.description}`,
        ""
      );
    });
  }

  lines.push(
    "Notes",
    "-----",
    "- This export is generated from governed catalog audit metadata.",
    "- Retain this file with the related DPIA / access-request evidence pack.",
    ""
  );

  return lines.join("\n");
}
