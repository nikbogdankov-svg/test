"use client";

import { useMemo, useState } from "react";
import { datasets } from "@/data/datasets";
import { useDebounce } from "@/hooks/useDebounce";
import { usePersona } from "@/hooks/usePersona";
import {
  EMPTY_CATALOG_FACETS,
  matchesCatalogFacets,
  type CatalogFacets,
} from "@/lib/catalogFilters";
import { visibleDatasetsForPersona } from "@/lib/personaAccess";
import { matchesQuery } from "@/lib/search";
import type { Dataset } from "@/types/catalog";

export function useDatasetSearch() {
  const { persona } = usePersona();
  const [query, setQuery] = useState("");
  const [facets, setFacets] = useState<CatalogFacets>(EMPTY_CATALOG_FACETS);
  const debouncedQuery = useDebounce(query, 180);

  const visibleDatasets = useMemo(
    () => visibleDatasetsForPersona(persona, datasets),
    [persona]
  );

  const results = useMemo(() => {
    return visibleDatasets.filter(
      (dataset) =>
        matchesCatalogFacets(dataset, facets) &&
        matchesQuery(dataset, debouncedQuery)
    );
  }, [visibleDatasets, debouncedQuery, facets]);

  function updateFacet<K extends keyof CatalogFacets>(
    key: K,
    value: CatalogFacets[K]
  ) {
    setFacets((prev) => ({ ...prev, [key]: value }));
  }

  function resetFacets() {
    setFacets(EMPTY_CATALOG_FACETS);
  }

  return {
    query,
    setQuery,
    facets,
    updateFacet,
    resetFacets,
    debouncedQuery,
    results,
    total: visibleDatasets.length,
    visibleDatasets,
  };
}

export function useDataset(id: string): Dataset | undefined {
  const { persona } = usePersona();
  return useMemo(() => {
    const visible = visibleDatasetsForPersona(persona, datasets);
    return visible.find((dataset) => dataset.id === id || dataset.slug === id);
  }, [id, persona]);
}
