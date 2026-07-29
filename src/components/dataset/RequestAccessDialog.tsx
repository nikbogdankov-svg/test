"use client";

import { useState } from "react";
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
import { submitAccessRequest } from "@/mock/api";

interface RequestAccessDialogProps {
  datasetId: string;
  datasetName: string;
  trigger?: React.ReactNode;
}

export function RequestAccessDialog({
  datasetId,
  datasetName,
  trigger,
}: RequestAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("Viewer");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!reason.trim()) return;
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
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? <Button>Request Access</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request access</DialogTitle>
          <DialogDescription>
            Request governed access to {datasetName}. The data owner will review
            your justification.
          </DialogDescription>
        </DialogHeader>

        {submittedId ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            Request submitted ({submittedId}). You will be notified when the
            owner responds.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-role">Requested role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="access-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Service Reader">Service Reader</SelectItem>
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
                placeholder="Describe the business use case, AI application, and retention needs."
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
              <Button type="submit" disabled={submitting || !reason.trim()}>
                {submitting ? "Submitting…" : "Submit request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
