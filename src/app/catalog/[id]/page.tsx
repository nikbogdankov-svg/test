import { Suspense } from "react";
import { notFound } from "next/navigation";
import { DatasetDetailGate } from "@/components/dataset/DatasetDetailGate";
import { LoadingState } from "@/components/states/LoadingState";
import { datasets } from "@/data/datasets";

interface DatasetPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return datasets.map((dataset) => ({ id: dataset.id }));
}

export default async function DatasetPage({ params }: DatasetPageProps) {
  const { id } = await params;
  const dataset = datasets.find((item) => item.id === id || item.slug === id);

  if (!dataset) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingState label="Loading dataset…" />}>
      <DatasetDetailGate dataset={dataset} />
    </Suspense>
  );
}
