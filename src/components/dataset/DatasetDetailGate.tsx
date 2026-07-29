"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DatasetDetailView } from "@/components/dataset/DatasetDetailView";
import { ErrorState } from "@/components/states/ErrorState";
import { LoadingState } from "@/components/states/LoadingState";
import { Button } from "@/components/ui/button";
import { usePersona } from "@/hooks/usePersona";
import { visibleDatasetsForPersona } from "@/lib/personaAccess";
import type { Dataset } from "@/types/catalog";

export function DatasetDetailGate({ dataset }: { dataset: Dataset }) {
  const { persona } = usePersona();
  const router = useRouter();
  const canUseCatalog = persona.navKeys.includes("catalog");
  const visible = visibleDatasetsForPersona(persona, [dataset]).length > 0;

  useEffect(() => {
    if (!canUseCatalog) {
      router.replace(persona.homePath);
    }
  }, [canUseCatalog, persona.homePath, router]);

  if (!canUseCatalog) {
    return <LoadingState label="Returning to Ask…" rows={2} />;
  }

  if (!visible) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Dataset not visible for this persona"
          description={`${persona.name} does not have access to ${dataset.name} under current team isolation rules.`}
        />
        <div className="flex justify-center">
          <Button asChild variant="secondary">
            <Link href={persona.homePath}>Back to workspace</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <DatasetDetailView dataset={dataset} />;
}
