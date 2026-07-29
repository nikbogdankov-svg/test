import { datasets } from "@/data/datasets";
import { personas, personaToOwner } from "@/data/personas";
import { owners } from "@/data/users";
import type {
  AccessRequest,
  Dataset,
  Owner,
  PermissionLevel,
  Persona,
} from "@/types/catalog";
import { visibleDatasetsForPersona } from "@/lib/personaAccess";

export interface PersonDatasetAccess {
  datasetId: string;
  datasetName: string;
  department: string;
  level: PermissionLevel;
  role: string;
  source: "owner" | "team" | "user";
}

export interface PersonAccessProfile {
  person: Owner;
  department: string;
  datasets: PersonDatasetAccess[];
  pendingRequests: AccessRequest[];
}

function directoryPeople(): Owner[] {
  return Array.from(
    new Map(
      [...owners, ...personas.map(personaToOwner)].map((owner) => [
        owner.email,
        owner,
      ])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));
}

function displayLevel(level: PermissionLevel): PermissionLevel {
  if (level === "restricted" || level === "none") return "viewer";
  return level;
}

function displayRole(role: string, level: PermissionLevel): string {
  if (level === "owner" || role === "Owner" || role === "Data Steward") {
    return "Owner";
  }
  if (level === "editor" || role === "Editor") return "Editor";
  return "Viewer";
}

function accessForPersonOnDataset(
  person: Owner,
  dataset: Dataset
): PersonDatasetAccess | null {
  if (dataset.owner.email === person.email) {
    return {
      datasetId: dataset.id,
      datasetName: dataset.name,
      department: dataset.owner.team,
      level: "owner",
      role: "Owner",
      source: "owner",
    };
  }

  const userGrant = dataset.permissions.find(
    (entry) =>
      entry.subjectType === "user" &&
      (entry.subject === person.name || entry.subject === person.email)
  );
  if (userGrant) {
    return {
      datasetId: dataset.id,
      datasetName: dataset.name,
      department: dataset.owner.team,
      level: displayLevel(userGrant.level),
      role: displayRole(userGrant.role, userGrant.level),
      source: "user",
    };
  }

  const teamGrant = dataset.permissions.find(
    (entry) =>
      entry.subjectType === "team" && entry.subject === person.team
  );
  if (teamGrant) {
    return {
      datasetId: dataset.id,
      datasetName: dataset.name,
      department: dataset.owner.team,
      level: displayLevel(teamGrant.level),
      role: displayRole(teamGrant.role, teamGrant.level),
      source: "team",
    };
  }

  return null;
}

export function buildPeopleAccessProfiles(
  allDatasets: Dataset[] = datasets
): PersonAccessProfile[] {
  const allRequests = allDatasets.flatMap((dataset) => dataset.pendingRequests);

  return directoryPeople().map((person) => {
    const personDatasets = allDatasets
      .map((dataset) => accessForPersonOnDataset(person, dataset))
      .filter((item): item is PersonDatasetAccess => item !== null)
      .sort((a, b) => a.datasetName.localeCompare(b.datasetName));

    return {
      person,
      department: person.team,
      datasets: personDatasets,
      pendingRequests: allRequests.filter(
        (request) => request.requester.email === person.email
      ),
    };
  });
}

/** Datasets this persona may request — not already visible via ACL. */
export function requestableDatasetsForPersona(
  persona: Persona,
  allDatasets: Dataset[] = datasets
): Dataset[] {
  const visibleIds = new Set(
    visibleDatasetsForPersona(persona, allDatasets).map((dataset) => dataset.id)
  );

  return allDatasets
    .filter((dataset) => {
      if (visibleIds.has(dataset.id)) return false;
      // Keep sensitive HR/health out of casual discovery unless already allowed
      if (persona.hiddenDatasetIds.includes(dataset.id)) return false;
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
