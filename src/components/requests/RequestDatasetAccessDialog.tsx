"use client";

import { useState } from "react";
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
import { teams } from "@/data/users";
import { submitGeneralAccessRequest } from "@/mock/api";

interface RequestDatasetAccessDialogProps {
  trigger?: React.ReactNode;
}

export function RequestDatasetAccessDialog({
  trigger,
}: RequestDatasetAccessDialogProps) {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("Viewer");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!reason.trim()) return;
    setSubmitting(true);
    const result = await submitGeneralAccessRequest({
      reason: reason.trim(),
      requestedRole: role,
      department: department || undefined,
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
          setDepartment("");
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
            Describe what you need and the role required for your use case. You
            can optionally suggest a department.
          </DialogDescription>
        </DialogHeader>

        {submittedId ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            Request submitted
            {department ? ` for ${department}` : ""} ({submittedId}). The
            owning department will review it before granting access.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-department">
                Possible department{" "}
                <span className="font-normal text-neutral-400">(optional)</span>
              </Label>
              <Select
                value={department || undefined}
                onValueChange={setDepartment}
              >
                <SelectTrigger id="access-department" className="w-full">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.name}>
                      {team.name}
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
