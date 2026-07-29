export type DatasetType =
  | "table"
  | "document"
  | "pipeline"
  | "vector_collection";

export type TrustLevel = "verified" | "on_review" | "untrusted";

export type FreshnessStatus = "fresh" | "stale" | "outdated" | "unknown";

export type PermissionLevel =
  | "owner"
  | "editor"
  | "viewer"
  | "restricted"
  | "none";

export type CertificationStatus =
  | "certified"
  | "pending"
  | "deprecated"
  | "uncertified";

export type OriginalityStatus = "original" | "duplicate";

export type AccessRequestStatus = "pending" | "approved" | "rejected";

export type BusinessDomain =
  | "Citizen Services"
  | "Urban Planning"
  | "Public Safety"
  | "Transportation"
  | "Finance"
  | "Human Resources"
  | "Legal"
  | "Healthcare"
  | "Environment"
  | "Infrastructure";

export interface Owner {
  id: string;
  name: string;
  email: string;
  team: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface DatasetColumn {
  name: string;
  type: string;
  description: string;
  nullable: boolean;
  pii: boolean;
  sampleValue: string;
}

export interface QualityMetrics {
  score: number;
  freshness: number;
  completeness: number;
  duplicates: number;
  nullValues: number;
  validationStatus: "passed" | "warning" | "failed";
  lastValidation: string;
}

export interface UsageStats {
  accessesLast30Days: number;
  accessTrend: { date: string; count: number }[];
  topConsumers: { name: string; type: "team" | "user" | "ai"; count: number }[];
  aiAssistants: { name: string; queries: number; lastUsed: string }[];
  recentQueries: {
    id: string;
    query: string;
    user: string;
    timestamp: string;
    durationMs: number;
  }[];
}

export interface PermissionEntry {
  id: string;
  subject: string;
  subjectType: "user" | "team" | "role";
  role: string;
  level: PermissionLevel;
  grantedAt: string;
  grantedBy: string;
}

export interface AccessRequest {
  id: string;
  datasetId: string;
  datasetName: string;
  requester: Owner;
  reason: string;
  requestedRole: string;
  status: AccessRequestStatus;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  datasetId: string;
  type:
    | "created"
    | "schema_changed"
    | "owner_changed"
    | "permission_granted"
    | "permission_revoked"
    | "viewed_by_ai"
    | "certified"
    | "updated";
  title: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface LineageNode {
  id: string;
  label: string;
  type:
    | "source"
    | "pipeline"
    | "dataset"
    | "vector"
    | "application"
    | "agent";
  description: string;
  x: number;
  y: number;
}

export interface LineageEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Dataset {
  id: string;
  name: string;
  slug: string;
  description: string;
  businessDescription: string;
  type: DatasetType;
  owner: Owner;
  businessDomain: BusinessDomain;
  tags: string[];
  quality: QualityMetrics;
  trust: TrustLevel;
  freshness: FreshnessStatus;
  permission: PermissionLevel;
  certification: CertificationStatus;
  originality: OriginalityStatus;
  containsPii: boolean;
  sourceSystem: string;
  updateFrequency: string;
  consumers: string[];
  aiApplications: string[];
  metadata: Record<string, string>;
  columns: DatasetColumn[];
  permissions: PermissionEntry[];
  pendingRequests: AccessRequest[];
  audit: AuditEvent[];
  usage: UsageStats;
  lineage: {
    nodes: LineageNode[];
    edges: LineageEdge[];
  };
  rowCount: number;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
  apiEndpoint: string;
}

export interface CatalogStats {
  totalDatasets: number;
  certifiedDatasets: number;
  pendingAccessRequests: number;
  piiDatasets: number;
  averageQualityScore: number;
  recentlyUpdated: number;
}

export type QuickFilter =
  | "all"
  | "tables"
  | "documents"
  | "pipelines"
  | "vector_collections"
  | "certified"
  | "contains_pii"
  | "owned_by_me"
  | "recently_updated";

export interface SearchResultMatch {
  field: "name" | "owner" | "tag" | "column" | "description" | "domain";
  value: string;
}

export interface Tenant {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export type PersonaRole =
  | "mayor"
  | "ai_engineer"
  | "data_scientist"
  | "platform_engineer"
  | "compliance_officer";

export type NavKey =
  | "ask"
  | "catalog"
  | "requests"
  | "audit";

export interface PersonaCapabilities {
  canRegister: boolean;
  canImport: boolean;
  canManageTeams: boolean;
  canViewAudit: boolean;
  canRequestAccess: boolean;
  canCopyApi: boolean;
  canOpenNotebook: boolean;
  canViewLineage: boolean;
  seesAskHome: boolean;
  certifiedOnlyInCatalog: boolean;
}

export interface Persona {
  id: string;
  role: PersonaRole;
  name: string;
  title: string;
  team: string;
  email: string;
  avatarInitials: string;
  avatarColor: string;
  homePath: string;
  navKeys: NavKey[];
  capabilities: PersonaCapabilities;
  /**
   * Owning teams whose datasets this persona may see. Own team plus any
   * cross-team grants; "all" is reserved for governance and compliance roles.
   */
  teamAccess: string[] | "all";
  visibleDomains: BusinessDomain[] | "all";
  hiddenDatasetIds: string[];
  description: string;
}
