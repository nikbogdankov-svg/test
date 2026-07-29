import { Suspense } from "react";
import { CatalogHome } from "@/components/catalog/CatalogHome";
import { NavGuard } from "@/components/layout/NavGuard";
import { LoadingState } from "@/components/states/LoadingState";

export default function CatalogPage() {
  return (
    <NavGuard navKey="catalog">
      <Suspense fallback={<LoadingState label="Loading data catalog…" />}>
        <CatalogHome />
      </Suspense>
    </NavGuard>
  );
}
