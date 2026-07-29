import type { Owner, Team, Tenant, NotificationItem } from "@/types/catalog";

/** Dataset steward identity used in mock ownership metadata (not session user). */
export const currentUser: Owner = {
  id: "user-marie-dupont",
  name: "Marie Dupont",
  email: "marie.dupont@ville-metropole.fr",
  team: "Citizen Services",
  avatarInitials: "MD",
  avatarColor: "#2563EB",
};

export const owners: Owner[] = [
  currentUser,
  {
    id: "user-jean-martin",
    name: "Jean Martin",
    email: "jean.martin@ville-metropole.fr",
    team: "Citizen Services",
    avatarInitials: "JM",
    avatarColor: "#0F766E",
  },
  {
    id: "user-sophie-bernard",
    name: "Sophie Bernard",
    email: "sophie.bernard@ville-metropole.fr",
    team: "Urban Planning",
    avatarInitials: "SB",
    avatarColor: "#B45309",
  },
  {
    id: "user-pascal-renard",
    name: "Pascal Renard",
    email: "pascal.renard@ville-metropole.fr",
    team: "Citizen Services",
    avatarInitials: "PR",
    avatarColor: "#7C3AED",
  },
  {
    id: "user-lucas-petit",
    name: "Lucas Petit",
    email: "lucas.petit@ville-metropole.fr",
    team: "Transportation Ops",
    avatarInitials: "LP",
    avatarColor: "#7C3AED",
  },
  {
    id: "user-claire-robert",
    name: "Claire Robert",
    email: "claire.robert@ville-metropole.fr",
    team: "Finance Controllers",
    avatarInitials: "CR",
    avatarColor: "#DC2626",
  },
  {
    id: "user-antoine-lefebvre",
    name: "Antoine Lefebvre",
    email: "antoine.lefebvre@ville-metropole.fr",
    team: "People Operations",
    avatarInitials: "AL",
    avatarColor: "#0891B2",
  },
  {
    id: "user-elise-moreau",
    name: "Élise Moreau",
    email: "elise.moreau@ville-metropole.fr",
    team: "Legal Affairs",
    avatarInitials: "EM",
    avatarColor: "#4B5563",
  },
  {
    id: "user-thomas-garcia",
    name: "Thomas Garcia",
    email: "thomas.garcia@ville-metropole.fr",
    team: "Public Health",
    avatarInitials: "TG",
    avatarColor: "#059669",
  },
  {
    id: "user-nathalie-roux",
    name: "Nathalie Roux",
    email: "nathalie.roux@ville-metropole.fr",
    team: "Environment Services",
    avatarInitials: "NR",
    avatarColor: "#65A30D",
  },
  {
    id: "user-paul-fournier",
    name: "Paul Fournier",
    email: "paul.fournier@ville-metropole.fr",
    team: "Infrastructure",
    avatarInitials: "PF",
    avatarColor: "#C2410C",
  },
];

/** Active customer tenant. Isolated from other cities — not user-switchable. */
export const currentTenant: Tenant = {
  id: "tenant-metropole",
  name: "Ville Métropole",
};

/** Departments within the current tenant (multi-team access control). */
export const teams: Team[] = [
  { id: "team-executive", name: "Executive Office" },
  { id: "team-citizen", name: "Citizen Services" },
  { id: "team-urban", name: "Urban Planning" },
  { id: "team-transport", name: "Transportation Ops" },
  { id: "team-finance", name: "Finance Controllers" },
  { id: "team-people", name: "People Operations" },
  { id: "team-legal", name: "Legal Affairs" },
  { id: "team-health", name: "Public Health" },
  { id: "team-environment", name: "Environment Services" },
  { id: "team-infra", name: "Infrastructure" },
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Access request pending",
    description: "Jean Martin requested Viewer access to Finance Budget FY2026.",
    timestamp: "2026-07-28T08:12:00Z",
    read: false,
  },
  {
    id: "n2",
    title: "Quality check warning",
    description: "Transport Sensors completeness dropped to 91.4%.",
    timestamp: "2026-07-28T06:45:00Z",
    read: false,
  },
  {
    id: "n3",
    title: "Certification renewed",
    description: "Citizen Registry certified through 2027-01-15.",
    timestamp: "2026-07-27T16:20:00Z",
    read: true,
  },
];
