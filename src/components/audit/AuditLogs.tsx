"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Download, RotateCcw } from "lucide-react";
import { AuditTimeline } from "@/components/dataset/AuditTimeline";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { Button } from "@/components/ui/button";
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
import {
  AUDIT_EVENT_TYPE_LABELS,
  buildCatalogAuditEntries,
  buildCnilEvidenceReport,
  EMPTY_AUDIT_FILTERS,
  filterCatalogAuditEntries,
  type AuditEventType,
  type AuditFilters,
} from "@/lib/audit";
import { formatNumber } from "@/lib/format";

const ALL_ENTRIES = buildCatalogAuditEntries();

export function AuditLogs() {
  const [filters, setFilters] = useState<AuditFilters>(EMPTY_AUDIT_FILTERS);

  const datasetOptions = useMemo(
    () =>
      [...datasets]
        .map((dataset) => ({
          id: dataset.id,
          name: dataset.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const personOptions = useMemo(
    () =>
      Array.from(new Set(ALL_ENTRIES.map((entry) => entry.actor))).sort(
        (a, b) => a.localeCompare(b)
      ),
    []
  );

  const departmentOptions = useMemo(
    () =>
      Array.from(new Set(ALL_ENTRIES.map((entry) => entry.department))).sort(
        (a, b) => a.localeCompare(b)
      ),
    []
  );

  const eventTypeOptions = useMemo(
    () =>
      (
        Object.keys(AUDIT_EVENT_TYPE_LABELS) as AuditEventType[]
      ).map((type) => ({
        value: type,
        label: AUDIT_EVENT_TYPE_LABELS[type],
      })),
    []
  );

  const filtered = useMemo(
    () => filterCatalogAuditEntries(ALL_ENTRIES, filters),
    [filters]
  );

  function updateFilter<K extends keyof AuditFilters>(
    key: K,
    value: AuditFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(EMPTY_AUDIT_FILTERS);
  }

  function exportCnilReport() {
    const report = buildCnilEvidenceReport(filtered, filters);
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `cnil-evidence-report-${stamp}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Audit Logs
        </h1>
      </div>

      <MetadataCard title="Filters">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FilterField label="Dataset">
            <Select
              value={filters.datasetId}
              onValueChange={(value) => updateFilter("datasetId", value)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by dataset">
                <SelectValue placeholder="All datasets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All datasets</SelectItem>
                {datasetOptions.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Person">
            <Select
              value={filters.person}
              onValueChange={(value) => updateFilter("person", value)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by person">
                <SelectValue placeholder="All people" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All people</SelectItem>
                {personOptions.map((person) => (
                  <SelectItem key={person} value={person}>
                    {person}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Department">
            <Select
              value={filters.department}
              onValueChange={(value) => updateFilter("department", value)}
            >
              <SelectTrigger
                className="w-full"
                aria-label="Filter by department"
              >
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {departmentOptions.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Event type">
            <Select
              value={filters.eventType}
              onValueChange={(value) => updateFilter("eventType", value)}
            >
              <SelectTrigger
                className="w-full"
                aria-label="Filter by event type"
              >
                <SelectValue placeholder="All event types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All event types</SelectItem>
                {eventTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Date from">
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(event) => updateFilter("dateFrom", event.target.value)}
              aria-label="Filter from date"
            />
          </FilterField>

          <FilterField label="Date to">
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(event) => updateFilter("dateTo", event.target.value)}
              aria-label="Filter to date"
            />
          </FilterField>

          <FilterField label="PII">
            <Select
              value={filters.pii}
              onValueChange={(value) => updateFilter("pii", value)}
            >
              <SelectTrigger className="w-full" aria-label="Filter by PII">
                <SelectValue placeholder="All datasets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All datasets</SelectItem>
                <SelectItem value="pii">PII only</SelectItem>
                <SelectItem value="non_pii">Non-PII only</SelectItem>
              </SelectContent>
            </Select>
          </FilterField>

          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={resetFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </Button>
          </div>
        </div>
      </MetadataCard>

      <MetadataCard
        title={`Catalog activity · ${formatNumber(filtered.length)} events`}
        action={
          <Button type="button" size="sm" onClick={exportCnilReport}>
            <Download className="h-4 w-4" />
            Export CNIL evidence
          </Button>
        }
      >
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No audit events match the selected filters. Adjust filters or reset
            to continue the CNIL evidence review.
          </p>
        ) : (
          <AuditTimeline events={filtered} />
        )}
      </MetadataCard>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
