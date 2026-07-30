"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuditTimeline } from "@/components/dataset/AuditTimeline";
import { DatasetHeader } from "@/components/dataset/DatasetHeader";
import { LineageGraph } from "@/components/dataset/LineageGraph";
import {
  MetadataCard,
  MetadataGrid,
} from "@/components/dataset/MetadataCard";
import { PermissionsPanel } from "@/components/dataset/PermissionsPanel";
import { QualityPanel } from "@/components/dataset/QualityPanel";
import { SchemaTable } from "@/components/dataset/SchemaTable";
import { UsageCharts } from "@/components/dataset/UsageCharts";
import { OwnerAvatar } from "@/components/badges/OwnerAvatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersona } from "@/hooks/usePersona";
import { formatBytes, formatDateTime, formatNumber } from "@/lib/format";
import type { Dataset, PersonaRole } from "@/types/catalog";

const tabs = [
  "overview",
  "schema",
  "lineage",
  "permissions",
  "quality",
  "audit",
  "usage",
] as const;

type TabId = (typeof tabs)[number];

function isTab(value: string | null): value is TabId {
  return !!value && (tabs as readonly string[]).includes(value);
}

function tabsForRole(role: PersonaRole): TabId[] {
  if (role === "mayor") return ["overview", "quality"];
  if (role === "compliance_officer") {
    return ["overview", "permissions", "audit", "usage"];
  }
  if (role === "platform_engineer") {
    return ["overview", "lineage", "permissions", "usage"];
  }
  return [...tabs];
}

export function DatasetDetailView({ dataset }: { dataset: Dataset }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { persona } = usePersona();
  const availableTabs = tabsForRole(persona.role);
  const tabParam = searchParams.get("tab");
  const initialTab: TabId = isTab(tabParam) ? tabParam : "overview";
  const [tab, setTab] = useState<TabId>(
    availableTabs.includes(initialTab) ? initialTab : availableTabs[0]
  );
  const [draft, setDraft] = useState(dataset);

  useEffect(() => {
    setDraft(dataset);
  }, [dataset]);

  useEffect(() => {
    if (!availableTabs.includes(tab)) {
      setTab(availableTabs[0]);
    }
  }, [availableTabs, tab]);

  const metadataItems = useMemo(
    () =>
      Object.entries(draft.metadata).map(([label, value]) => ({
        label,
        value,
      })),
    [draft.metadata]
  );

  function changeTab(next: string) {
    const value =
      isTab(next) && availableTabs.includes(next) ? next : availableTabs[0];
    setTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/catalog/${draft.id}?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <div className="space-y-5">
      <DatasetHeader
        dataset={draft}
        onMetadataSave={(update) => {
          setDraft((current) => ({
            ...current,
            ...update,
            updatedAt: new Date().toISOString(),
          }));
        }}
      />

      <Tabs value={tab} onValueChange={changeTab}>
        <TabsList aria-label="Dataset sections">
          {availableTabs.includes("overview") ? (
            <TabsTrigger value="overview">Overview</TabsTrigger>
          ) : null}
          {availableTabs.includes("schema") ? (
            <TabsTrigger value="schema">Schema</TabsTrigger>
          ) : null}
          {availableTabs.includes("lineage") ? (
            <TabsTrigger value="lineage">Lineage</TabsTrigger>
          ) : null}
          {availableTabs.includes("permissions") ? (
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          ) : null}
          {availableTabs.includes("quality") ? (
            <TabsTrigger value="quality">Quality</TabsTrigger>
          ) : null}
          {availableTabs.includes("audit") ? (
            <TabsTrigger value="audit">Audit</TabsTrigger>
          ) : null}
          {availableTabs.includes("usage") ? (
            <TabsTrigger value="usage">Usage</TabsTrigger>
          ) : null}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <MetadataCard title="Business description" className="xl:col-span-2">
              <p className="text-sm leading-relaxed text-neutral-700">
                {draft.businessDescription}
              </p>
            </MetadataCard>
            <MetadataCard title="Key facts">
              <MetadataGrid
                items={[
                  { label: "Source system", value: draft.sourceSystem },
                  {
                    label: "Data owner",
                    value: <OwnerAvatar owner={draft.owner} />,
                  },
                  {
                    label: "Update frequency",
                    value: draft.updateFrequency,
                  },
                  {
                    label: "Rows",
                    value: formatNumber(draft.rowCount),
                  },
                  {
                    label: "Size",
                    value: formatBytes(draft.sizeBytes),
                  },
                  {
                    label: "Created",
                    value: formatDateTime(draft.createdAt),
                  },
                ]}
              />
            </MetadataCard>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <MetadataCard title="Consumers">
              <div className="flex flex-wrap gap-1.5">
                {draft.consumers.map((consumer) => (
                  <Badge key={consumer} variant="default">
                    {consumer}
                  </Badge>
                ))}
              </div>
            </MetadataCard>
            <MetadataCard title="AI applications">
              <div className="flex flex-wrap gap-1.5">
                {draft.aiApplications.length === 0 ? (
                  <span className="text-sm text-neutral-500">
                    No AI applications linked.
                  </span>
                ) : (
                  draft.aiApplications.map((app) => (
                    <Badge key={app} variant="info">
                      {app}
                    </Badge>
                  ))
                )}
              </div>
            </MetadataCard>
            <MetadataCard title="Metadata">
              <MetadataGrid items={metadataItems} />
            </MetadataCard>
          </div>

          <QualityPanel quality={draft.quality} />
        </TabsContent>

        <TabsContent value="schema">
          <SchemaTable columns={draft.columns} />
        </TabsContent>

        <TabsContent value="lineage">
          <LineageGraph
            nodes={draft.lineage.nodes}
            edges={draft.lineage.edges}
          />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsPanel
            datasetId={draft.id}
            datasetName={draft.name}
            pendingRequests={draft.pendingRequests}
          />
        </TabsContent>

        <TabsContent value="quality">
          <QualityPanel quality={draft.quality} />
        </TabsContent>

        <TabsContent value="audit">
          <MetadataCard title="Audit timeline">
            <AuditTimeline events={draft.audit} />
          </MetadataCard>
        </TabsContent>

        <TabsContent value="usage">
          <UsageCharts usage={draft.usage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
