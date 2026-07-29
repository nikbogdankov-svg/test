"use client";

import { MetadataCard, MetadataGrid } from "@/components/dataset/MetadataCard";
import { NavGuard } from "@/components/layout/NavGuard";
import { Badge } from "@/components/ui/badge";
import { currentTenant } from "@/data/users";
import { usePersona } from "@/hooks/usePersona";

export default function SettingsPage() {
  const { persona } = usePersona();

  return (
    <NavGuard navKey="settings">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
          Settings
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Workspace preferences for the BullSequana Data Catalog.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MetadataCard title="Profile">
          <MetadataGrid
            items={[
              { label: "Name", value: persona.name },
              { label: "Email", value: persona.email },
              { label: "Team", value: persona.team },
              {
                label: "Role",
                value: <Badge variant="info">{persona.title}</Badge>,
              },
            ]}
          />
        </MetadataCard>

        <MetadataCard title="Tenant">
          <MetadataGrid
            items={[
              { label: "Organization", value: currentTenant.name },
              {
                label: "Isolation",
                value: (
                  <Badge variant="success">Fixed · no city switching</Badge>
                ),
              },
              {
                label: "Access model",
                value: "Multi-team within this tenant",
              },
              {
                label: "Note",
                value:
                  "Other municipalities are separate tenants and are never visible here.",
              },
            ]}
          />
        </MetadataCard>

        <MetadataCard title="Persona capabilities">
          <MetadataGrid
            items={[
              {
                label: "Register datasets",
                value: persona.capabilities.canRegister ? "Allowed" : "Hidden",
              },
              {
                label: "Audit access",
                value: persona.capabilities.canViewAudit
                  ? "Allowed"
                  : "Not in nav",
              },
              {
                label: "Manage teams",
                value: persona.capabilities.canManageTeams
                  ? "Allowed"
                  : "View only / hidden",
              },
              {
                label: "Default home",
                value: persona.homePath,
              },
            ]}
          />
        </MetadataCard>

        <MetadataCard title="Integrations">
          <MetadataGrid
            items={[
              { label: "Notebooks", value: "BullSequana Notebooks" },
              { label: "Vector store", value: "BullSequana Vector" },
              { label: "Orchestration", value: "Airflow + dbt" },
              { label: "Identity", value: "Municipal SSO" },
            ]}
          />
        </MetadataCard>
      </div>
    </div>
    </NavGuard>
  );
}
