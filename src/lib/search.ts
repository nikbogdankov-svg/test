import type { Dataset, QuickFilter, SearchResultMatch } from "@/types/catalog";

const NATURAL_LANGUAGE_HINTS: { pattern: RegExp; tags?: string[]; pii?: boolean; domains?: string[] }[] = [
  {
    pattern: /citizen\s+address/i,
    tags: ["address", "pii", "citizen"],
    pii: true,
    domains: ["Citizen Services"],
  },
  {
    pattern: /building\s+permit/i,
    tags: ["permits", "construction"],
    domains: ["Urban Planning"],
  },
  {
    pattern: /parking/i,
    tags: ["parking", "violations"],
    domains: ["Transportation"],
  },
  {
    pattern: /budget|finance/i,
    tags: ["budget", "finance"],
    domains: ["Finance"],
  },
  {
    pattern: /sensor|iot/i,
    tags: ["iot", "sensors"],
    domains: ["Transportation", "Infrastructure"],
  },
];

export function getSearchMatches(
  dataset: Dataset,
  query: string
): SearchResultMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches: SearchResultMatch[] = [];

  if (dataset.name.toLowerCase().includes(q)) {
    matches.push({ field: "name", value: dataset.name });
  }
  if (dataset.owner.name.toLowerCase().includes(q)) {
    matches.push({ field: "owner", value: dataset.owner.name });
  }
  if (dataset.businessDomain.toLowerCase().includes(q)) {
    matches.push({ field: "domain", value: dataset.businessDomain });
  }
  if (dataset.description.toLowerCase().includes(q)) {
    matches.push({ field: "description", value: dataset.description });
  }

  dataset.tags.forEach((tag) => {
    if (tag.toLowerCase().includes(q)) {
      matches.push({ field: "tag", value: tag });
    }
  });

  dataset.columns.forEach((column) => {
    if (
      column.name.toLowerCase().includes(q) ||
      column.description.toLowerCase().includes(q)
    ) {
      matches.push({ field: "column", value: column.name });
    }
  });

  return matches;
}

function matchesNaturalLanguage(dataset: Dataset, query: string): boolean {
  return NATURAL_LANGUAGE_HINTS.some((hint) => {
    if (!hint.pattern.test(query)) return false;
    const tagHit = hint.tags?.some((tag) =>
      dataset.tags.some((d) => d.toLowerCase().includes(tag))
    );
    const domainHit = hint.domains?.includes(dataset.businessDomain);
    const piiHit = hint.pii ? dataset.containsPii : false;
    return Boolean(tagHit || domainHit || piiHit);
  });
}

export function matchesQuery(dataset: Dataset, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  if (getSearchMatches(dataset, q).length > 0) return true;
  return matchesNaturalLanguage(dataset, q);
}

export function matchesQuickFilter(
  dataset: Dataset,
  filter: QuickFilter,
  ownerId?: string
): boolean {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  switch (filter) {
    case "all":
      return true;
    case "tables":
      return dataset.type === "table";
    case "documents":
      return dataset.type === "document";
    case "pipelines":
      return dataset.type === "pipeline";
    case "vector_collections":
      return dataset.type === "vector_collection";
    case "certified":
      return dataset.certification === "certified";
    case "contains_pii":
      return dataset.containsPii;
    case "owned_by_me":
      return ownerId
        ? dataset.owner.id === ownerId || dataset.owner.email === ownerId
        : false;
    case "recently_updated":
      return new Date(dataset.updatedAt).getTime() >= sevenDaysAgo;
    default:
      return true;
  }
}

export function highlightSegments(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  const q = query.trim();
  if (!q) return [{ text, highlight: false }];

  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "ig");
  const parts = text.split(regex);

  return parts.filter(Boolean).map((part) => ({
    text: part,
    highlight: part.toLowerCase() === q.toLowerCase(),
  }));
}
