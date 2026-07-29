import { catalogStats, datasets, getCatalogStats } from "@/data/datasets";
import { currentTenant, notifications, teams } from "@/data/users";
import { matchesQuery, matchesQuickFilter } from "@/lib/search";
import type {
  AccessRequest,
  CatalogStats,
  Dataset,
  QuickFilter,
} from "@/types/catalog";

export async function fetchDatasets(options?: {
  query?: string;
  filter?: QuickFilter;
}): Promise<Dataset[]> {
  await delay(80);
  const query = options?.query ?? "";
  const filter = options?.filter ?? "all";

  return datasets.filter(
    (dataset) =>
      matchesQuickFilter(dataset, filter) && matchesQuery(dataset, query)
  );
}

export async function fetchDatasetById(id: string): Promise<Dataset | null> {
  await delay(60);
  return datasets.find((dataset) => dataset.id === id || dataset.slug === id) ?? null;
}

export async function fetchCatalogStats(): Promise<CatalogStats> {
  await delay(40);
  return getCatalogStats(datasets);
}

export async function fetchPendingRequests(): Promise<AccessRequest[]> {
  await delay(50);
  return datasets.flatMap((dataset) => dataset.pendingRequests);
}

export async function submitAccessRequest(input: {
  datasetId: string;
  reason: string;
  requestedRole: string;
}): Promise<{ ok: true; requestId: string }> {
  await delay(120);
  return {
    ok: true,
    requestId: `ar-${Date.now()}`,
  };
}

export async function submitGeneralAccessRequest(input: {
  reason: string;
  requestedRole: string;
  department?: string;
}): Promise<{ ok: true; requestId: string }> {
  await delay(120);
  void input;
  return {
    ok: true,
    requestId: `ar-general-${Date.now()}`,
  };
}

export function getStaticCatalogBootstrap() {
  return {
    datasets,
    stats: catalogStats,
    tenant: currentTenant,
    teams,
    notifications,
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
