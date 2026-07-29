"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, Plus, MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { DatasetTable } from "@/components/catalog/DatasetTable";
import { SearchBar } from "@/components/catalog/SearchBar";
import { RequestDatasetAccessDialog } from "@/components/requests/RequestDatasetAccessDialog";
import { Button } from "@/components/ui/button";
import { useDatasetSearch } from "@/hooks/useDatasetSearch";
import { usePersona } from "@/hooks/usePersona";

export function CatalogHome() {
  const searchParams = useSearchParams();
  const { persona } = usePersona();
  const {
    query,
    setQuery,
    facets,
    updateFacet,
    resetFacets,
    debouncedQuery,
    results,
    visibleDatasets,
  } = useDatasetSearch();

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setQuery(q);
  }, [searchParams, setQuery]);

  return (
    <div className="space-y-6">
      <div className="grid-12 items-start">
        <div className="col-span-12 lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Data Catalog
            </h1>
          </motion.div>
        </div>
        <div className="col-span-12 flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
          {persona.capabilities.canRequestAccess ? (
            <RequestDatasetAccessDialog />
          ) : null}
          {persona.capabilities.canImport ? (
            <Button variant="secondary">
              <Upload className="h-4 w-4" />
              Import Metadata
            </Button>
          ) : null}
          {persona.capabilities.canRegister ? (
            <Button variant="secondary">
              <Plus className="h-4 w-4" />
              Register Dataset
            </Button>
          ) : null}
          {persona.capabilities.seesAskHome ? (
            <Button variant="secondary" asChild>
              <Link href="/ask">
                <MessageSquareText className="h-4 w-4" />
                Ask instead
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          large
          autoFocus
          placeholder="Search datasets, owners, tags, columns..."
        />
        <CatalogFilters
          datasets={visibleDatasets}
          facets={facets}
          onChange={updateFacet}
          onReset={resetFacets}
        />
      </div>

      <DatasetTable datasets={results} query={debouncedQuery} />
    </div>
  );
}
