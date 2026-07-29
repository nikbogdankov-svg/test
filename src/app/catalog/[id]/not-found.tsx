import Link from "next/link";
import { ErrorState } from "@/components/states/ErrorState";
import { Button } from "@/components/ui/button";

export default function DatasetNotFoundPage() {
  return (
    <div className="space-y-4">
      <ErrorState
        title="Dataset not found"
        description="This dataset is not registered in the BullSequana Data Catalog."
      />
      <div className="flex justify-center">
        <Button asChild variant="secondary">
          <Link href="/catalog">Back to Data Catalog</Link>
        </Button>
      </div>
    </div>
  );
}
