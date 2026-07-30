"use client";

import { cn } from "@/lib/utils";
import type { QuickFilter } from "@/types/catalog";

const filters: { id: QuickFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "tables", label: "Tables" },
  { id: "documents", label: "Documents" },
  { id: "pipelines", label: "Pipelines" },
  { id: "vector_collections", label: "Vector Collections" },
  { id: "contains_pii", label: "Contains PII" },
  { id: "owned_by_me", label: "Owned by me" },
  { id: "recently_updated", label: "Recently Updated" },
];

interface QuickFiltersProps {
  value: QuickFilter;
  onChange: (value: QuickFilter) => void;
}

export function QuickFilters({ value, onChange }: QuickFiltersProps) {
  return (
    <div
      className="flex flex-wrap gap-1.5"
      role="tablist"
      aria-label="Quick filters"
    >
      {filters.map((filter) => {
        const active = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "h-8 cursor-pointer rounded-md border px-2.5 text-xs font-medium transition-colors",
              active
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
