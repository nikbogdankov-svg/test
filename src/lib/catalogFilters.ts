import type {
  Dataset,
  DatasetType,
  FreshnessStatus,
  TrustLevel,
} from "@/types/catalog";

export interface CatalogFacets {
  department: string;
  owner: string;
  type: string;
  trust: string;
  freshness: string;
  pii: string;
}

export const EMPTY_CATALOG_FACETS: CatalogFacets = {
  department: "all",
  owner: "all",
  type: "all",
  trust: "all",
  freshness: "all",
  pii: "all",
};

export const DATASET_TYPE_LABELS: Record<DatasetType, string> = {
  table: "Table",
  document: "Document",
  pipeline: "Pipeline",
  vector_collection: "Vector collection",
};

export const TRUST_LABELS: Record<TrustLevel, string> = {
  trusted: "Trusted",
  on_review: "On review",
  untrusted: "Untrusted",
};

export const FRESHNESS_LABELS: Record<FreshnessStatus, string> = {
  fresh: "Fresh",
  stale: "Stale",
  outdated: "Outdated",
  unknown: "Unknown",
};

export function matchesCatalogFacets(
  dataset: Dataset,
  facets: CatalogFacets
): boolean {
  if (
    facets.department !== "all" &&
    dataset.owner.team !== facets.department
  ) {
    return false;
  }
  if (facets.owner !== "all" && dataset.owner.email !== facets.owner) {
    return false;
  }
  if (facets.type !== "all" && dataset.type !== facets.type) {
    return false;
  }
  if (facets.trust !== "all" && dataset.trust !== facets.trust) {
    return false;
  }
  if (facets.freshness !== "all" && dataset.freshness !== facets.freshness) {
    return false;
  }
  if (facets.pii === "pii" && !dataset.containsPii) return false;
  if (facets.pii === "non_pii" && dataset.containsPii) return false;
  return true;
}
