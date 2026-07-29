"use client";

import { useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePersona } from "@/hooks/usePersona";
import { requestableDatasetsForPersona } from "@/lib/peopleAccess";
import { submitAccessRequest } from "@/mock/api";

interface RequestDatasetAccessDialogProps {
  trigger?: React.ReactNode;
}

export function RequestDatasetAccessDialog({
  trigger,
}: RequestDatasetAccessDialogProps) {
  const { persona } = usePersona();
  const [open, setOpen] = useState(false);
  const [datasetId, setDatasetId] = useState("");
  const [role, setRole] = useState("Viewer");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const requestable = useMemo(
    () => requestableDatasetsForPersona(persona),
    [persona]
  );

  const selected = requestable.find((dataset) => dataset.id === datasetId);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!datasetId || !reason.trim()) return;
    setSubmitting(true);
    const result = await submitAccessRequest({
      datasetId,
      reason: reason.trim(),
      requestedRole: role,
    });
    setSubmitting(false);
    setSubmittedId(result.requestId);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSubmittedId(null);
          setReason("");
          setRole("Viewer");
          setDatasetId("");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="secondary">
            <KeyRound className="h-4 w-4" />
            Request access
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request dataset access</DialogTitle>
          <DialogDescription>
            Access is granted per dataset only. Pick the dataset you need and
            the role required for your use case.
          </DialogDescription>
        </DialogHeader>

        {submittedId ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            Request submitted for {selected?.name ?? "dataset"} ({submittedId}).
            The owning department will review it before granting access.
          </div>
        ) : requestable.length === 0 ? (
          <p className="text-sm text-neutral-600">
            There are no additional datasets available to request right now.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-dataset">Dataset</Label>
              <Select value={datasetId} onValueChange={setDatasetId}>
                <SelectTrigger id="access-dataset" className="w-full">
                  <SelectValue placeholder="Select a dataset" />
                </SelectTrigger>
                <SelectContent>
                  {requestable.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name} · {dataset.owner.team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-role">Requested role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="access-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-reason">Business justification</Label>
              <textarea
                id="access-reason"
                required
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                placeholder="Example: Need Viewer access to Building Permits for an Urban Planning model validating construction timelines."
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !datasetId || !reason.trim()}
              >
                {submitting ? "Submitting…" : "Submit request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
