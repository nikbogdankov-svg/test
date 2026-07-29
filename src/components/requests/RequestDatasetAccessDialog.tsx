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
  const [department, setDepartment] = useState("unknown");
  const [role, setRole] = useState("Viewer");
  const [need, setNeed] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!need.trim()) return;
    setSubmitting(true);
    const result = await submitGeneralAccessRequest({
      department: department === "unknown" ? undefined : department,
      reason: need.trim(),
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
          setNeed("");
          setRole("Viewer");
          setDepartment("unknown");
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
            Describe the data you need, even if it is owned by another
            department. Owners will review your request before granting access.
          </DialogDescription>
        </DialogHeader>

        {submittedId ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
            Request submitted ({submittedId}). The owning department will review
            it and notify you when access is granted or denied.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-need">What do you need?</Label>
              <textarea
                id="access-need"
                required
                value={need}
                onChange={(event) => setNeed(event.target.value)}
                rows={5}
                placeholder="Example: Parking violation records for a Citizen Services RAG assistant answering fine-status questions. Need Viewer access for the last 24 months."
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-department">Department (optional)</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="access-department" className="w-full">
                  <SelectValue placeholder="I don’t know yet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">I don’t know yet</SelectItem>
                  {teams
                    .filter((team) => team.name !== "Executive Office")
                    .map((team) => (
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
                  <SelectItem value="Service Reader">Service Reader</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !need.trim()}>
                {submitting ? "Submitting…" : "Submit request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
