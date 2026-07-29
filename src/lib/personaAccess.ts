import type { Dataset, Persona } from "@/types/catalog";
import { getCatalogStats } from "@/data/datasets";

export function canPersonaAccessTeam(persona: Persona, team: string): boolean {
  if (persona.teamAccess === "all") return true;
  return persona.teamAccess.includes(team);
}

export function visibleDatasetsForPersona(
  persona: Persona,
  datasets: Dataset[]
): Dataset[] {
  return datasets.filter((dataset) => {
    if (persona.hiddenDatasetIds.includes(dataset.id)) return false;
    if (!canPersonaAccessTeam(persona, dataset.owner.team)) return false;
    if (persona.visibleDomains !== "all") {
      if (!persona.visibleDomains.includes(dataset.businessDomain)) {
        return false;
      }
    }
    if (
      persona.capabilities.certifiedOnlyInCatalog &&
      dataset.certification !== "certified"
    ) {
      return false;
    }
    return true;
  });
}

export function catalogStatsForDatasets(datasets: Dataset[]) {
  return getCatalogStats(datasets);
}
