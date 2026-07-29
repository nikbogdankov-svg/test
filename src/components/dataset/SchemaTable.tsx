"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SearchBar } from "@/components/catalog/SearchBar";
import { HighlightText } from "@/components/catalog/HighlightText";
import { EmptyState } from "@/components/states/EmptyState";
import type { DatasetColumn } from "@/types/catalog";

interface SchemaTableProps {
  columns: DatasetColumn[];
}

export function SchemaTable({ columns }: SchemaTableProps) {
  const [query, setQuery] = useState("");
  const [piiOnly, setPiiOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return columns.filter((column) => {
      if (piiOnly && !column.pii) return false;
      if (!q) return true;
      return (
        column.name.toLowerCase().includes(q) ||
        column.type.toLowerCase().includes(q) ||
        column.description.toLowerCase().includes(q) ||
        column.sampleValue.toLowerCase().includes(q)
      );
    });
  }, [columns, piiOnly, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          id="schema-search"
          value={query}
          onChange={setQuery}
          placeholder="Search columns…"
          className="max-w-md flex-1"
        />
        <div className="flex items-center gap-2">
          <Checkbox
            id="pii-filter"
            checked={piiOnly}
            onCheckedChange={(checked) => setPiiOnly(checked === true)}
          />
          <Label htmlFor="pii-filter" className="cursor-pointer">
            Filter PII
          </Label>
        </div>
        <span className="text-xs text-neutral-500">
          {filtered.length} of {columns.length} columns
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No columns found"
          description="Adjust the column search or disable the PII filter."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-neutral-200 bg-neutral-50">
                <tr>
                  {[
                    "Column",
                    "Type",
                    "Description",
                    "Nullable",
                    "PII",
                    "Sample Value",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-500"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((column) => (
                  <tr
                    key={column.name}
                    className="border-b border-neutral-100 hover:bg-neutral-50/80"
                  >
                    <td className="px-3 py-2.5 font-mono text-sm text-neutral-900">
                      <HighlightText text={column.name} query={query} />
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant="muted">{column.type}</Badge>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-neutral-600 max-w-[320px]">
                      <HighlightText text={column.description} query={query} />
                    </td>
                    <td className="px-3 py-2.5 text-sm text-neutral-700">
                      {column.nullable ? "Yes" : "No"}
                    </td>
                    <td className="px-3 py-2.5">
                      {column.pii ? (
                        <Badge variant="danger">PII</Badge>
                      ) : (
                        <Badge variant="muted">No</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-neutral-600">
                      <HighlightText text={column.sampleValue} query={query} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
