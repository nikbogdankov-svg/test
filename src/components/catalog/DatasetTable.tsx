"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { DatasetRow } from "@/components/catalog/DatasetRow";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import type { Dataset } from "@/types/catalog";

interface DatasetTableProps {
  datasets: Dataset[];
  query: string;
}

const columns: ColumnDef<Dataset>[] = [
  { accessorKey: "name", header: "Dataset", enableSorting: true },
  {
    id: "owner",
    accessorFn: (row) => row.owner.name,
    header: "Owner",
    enableSorting: false,
  },
  {
    id: "department",
    accessorFn: (row) => row.owner.team,
    header: "Department",
    enableSorting: false,
  },
  {
    id: "quality",
    accessorFn: (row) => row.quality.score,
    header: "Quality",
    enableSorting: false,
  },
  { accessorKey: "originality", header: "Originality", enableSorting: false },
  { accessorKey: "trust", header: "Trust", enableSorting: false },
  { accessorKey: "freshness", header: "Freshness", enableSorting: false },
  { accessorKey: "permission", header: "Permissions", enableSorting: false },
  { accessorKey: "updatedAt", header: "Updated", enableSorting: true },
];

export function DatasetTable({ datasets, query }: DatasetTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true },
  ]);

  const data = useMemo(() => datasets, [datasets]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (datasets.length === 0) {
    return (
      <EmptyState
        title="No datasets match your search"
        description="Try a broader query, clear filters, or search by owner, tag, or column name. Example: datasets containing citizen addresses"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] border-collapse text-left">
          <thead className="bg-neutral-50/90 border-b border-neutral-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-500"
                    >
                      {header.column.getCanSort() ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-2 h-7 gap-1 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 hover:text-neutral-800"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : sorted === "desc" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </Button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <DatasetRow
                key={row.id}
                dataset={row.original}
                query={query}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2.5 text-xs text-neutral-500">
        <span>
          Showing {datasets.length} dataset{datasets.length === 1 ? "" : "s"}
        </span>
        <span>Sorted for enterprise discovery density</span>
      </div>
    </div>
  );
}
