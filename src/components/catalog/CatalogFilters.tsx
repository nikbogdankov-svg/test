"use client";

import { type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CERTIFICATION_LABELS,
  DATASET_TYPE_LABELS,
  FRESHNESS_LABELS,
  TRUST_LABELS,
  type CatalogFacets,
} from "@/lib/catalogFilters";
import type { Dataset } from "@/types/catalog";

interface CatalogFiltersProps {
  datasets: Dataset[];
  facets: CatalogFacets;
  onChange: <K extends keyof CatalogFacets>(
    key: K,
    value: CatalogFacets[K]
  ) => void;
  onReset: () => void;
}

export function CatalogFilters({
  datasets,
  facets,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const departments = Array.from(
    new Set(datasets.map((dataset) => dataset.owner.team))
  ).sort((a, b) => a.localeCompare(b));

  const owners = Array.from(
    new Map(
      datasets.map((dataset) => [
        dataset.owner.email,
        { email: dataset.owner.email, name: dataset.owner.name },
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const types = Array.from(
    new Set(datasets.map((dataset) => dataset.type))
  ).sort((a, b) => a.localeCompare(b));

  const certifications = Array.from(
    new Set(datasets.map((dataset) => dataset.certification))
  ).sort((a, b) => a.localeCompare(b));

  const trusts = Array.from(
    new Set(datasets.map((dataset) => dataset.trust))
  ).sort((a, b) => a.localeCompare(b));

  const freshness = Array.from(
    new Set(datasets.map((dataset) => dataset.freshness))
  ).sort((a, b) => a.localeCompare(b));

  const hasActiveFilters = Object.values(facets).some((value) => value !== "all");

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      <FilterField label="Department">
        <Select
          value={facets.department}
          onValueChange={(value) => onChange("department", value)}
        >
          <SelectTrigger className="w-full" aria-label="Filter by department">
            <SelectValue placeholder="All departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Owner">
        <Select
          value={facets.owner}
          onValueChange={(value) => onChange("owner", value)}
        >
          <SelectTrigger className="w-full" aria-label="Filter by owner">
            <SelectValue placeholder="All owners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {owners.map((owner) => (
              <SelectItem key={owner.email} value={owner.email}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Type">
        <Select
          value={facets.type}
          onValueChange={(value) => onChange("type", value)}
        >
          <SelectTrigger className="w-full" aria-label="Filter by type">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {DATASET_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Certification">
        <Select
          value={facets.certification}
          onValueChange={(value) => onChange("certification", value)}
        >
          <SelectTrigger
            className="w-full"
            aria-label="Filter by certification"
          >
            <SelectValue placeholder="All certifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All certifications</SelectItem>
            {certifications.map((status) => (
              <SelectItem key={status} value={status}>
                {CERTIFICATION_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Trust">
        <Select
          value={facets.trust}
          onValueChange={(value) => onChange("trust", value)}
        >
          <SelectTrigger className="w-full" aria-label="Filter by trust">
            <SelectValue placeholder="All trust levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All trust levels</SelectItem>
            {trusts.map((level) => (
              <SelectItem key={level} value={level}>
                {TRUST_LABELS[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Freshness">
        <Select
          value={facets.freshness}
          onValueChange={(value) => onChange("freshness", value)}
        >
          <SelectTrigger className="w-full" aria-label="Filter by freshness">
            <SelectValue placeholder="All freshness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All freshness</SelectItem>
            {freshness.map((status) => (
              <SelectItem key={status} value={status}>
                {FRESHNESS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="PII">
        <Select
          value={facets.pii}
          onValueChange={(value) => onChange("pii", value)}
        >
          <SelectTrigger className="w-full" aria-label="Filter by PII">
            <SelectValue placeholder="All datasets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All datasets</SelectItem>
            <SelectItem value="pii">Contains PII</SelectItem>
            <SelectItem value="non_pii">No PII</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>

      <div className="flex items-end">
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={onReset}
          disabled={!hasActiveFilters}
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </div>
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
