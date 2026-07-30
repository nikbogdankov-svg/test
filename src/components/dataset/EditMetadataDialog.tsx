"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FRESHNESS_LABELS } from "@/lib/catalogFilters";
import type {
  BusinessDomain,
  Dataset,
  FreshnessStatus,
} from "@/types/catalog";

const DOMAINS: BusinessDomain[] = [
  "Citizen Services",
  "Urban Planning",
  "Public Safety",
  "Transportation",
  "Finance",
  "Human Resources",
  "Legal",
  "Healthcare",
  "Environment",
  "Infrastructure",
];

const FRESHNESS_OPTIONS = Object.keys(FRESHNESS_LABELS) as FreshnessStatus[];

export interface DatasetMetadataUpdate {
  description: string;
  businessDescription: string;
  tags: string[];
  businessDomain: BusinessDomain;
  freshness: FreshnessStatus;
}

interface EditMetadataDialogProps {
  dataset: Dataset;
  onSave: (update: DatasetMetadataUpdate) => void;
}

export function EditMetadataDialog({
  dataset,
  onSave,
}: EditMetadataDialogProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(dataset.description);
  const [businessDescription, setBusinessDescription] = useState(
    dataset.businessDescription
  );
  const [tagsText, setTagsText] = useState(dataset.tags.join(", "));
  const [businessDomain, setBusinessDomain] = useState(dataset.businessDomain);
  const [freshness, setFreshness] = useState(dataset.freshness);

  useEffect(() => {
    if (!open) return;
    setDescription(dataset.description);
    setBusinessDescription(dataset.businessDescription);
    setTagsText(dataset.tags.join(", "));
    setBusinessDomain(dataset.businessDomain);
    setFreshness(dataset.freshness);
  }, [open, dataset]);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSave({
      description: description.trim(),
      businessDescription: businessDescription.trim(),
      tags,
      businessDomain,
      freshness,
    });
    setOpen(false);
  }

  const canSubmit =
    description.trim().length > 0 && businessDescription.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary">
          <Pencil className="h-4 w-4" />
          Edit metadata
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit metadata</DialogTitle>
          <DialogDescription>
            Update the catalog record for {dataset.name}. This does not change
            the underlying data — only how it is described and governed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta-description">Description</Label>
            <textarea
              id="meta-description"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-business">Business description</Label>
            <textarea
              id="meta-business"
              required
              value={businessDescription}
              onChange={(event) => setBusinessDescription(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta-tags">Tags</Label>
            <Input
              id="meta-tags"
              value={tagsText}
              onChange={(event) => setTagsText(event.target.value)}
              placeholder="planning, zoning, pdf"
            />
            <p className="text-xs text-neutral-500">Comma-separated.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="meta-domain">Domain</Label>
              <Select
                value={businessDomain}
                onValueChange={(value) =>
                  setBusinessDomain(value as BusinessDomain)
                }
              >
                <SelectTrigger id="meta-domain" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-freshness">Freshness</Label>
              <Select
                value={freshness}
                onValueChange={(value) =>
                  setFreshness(value as FreshnessStatus)
                }
              >
                <SelectTrigger id="meta-freshness" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRESHNESS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {FRESHNESS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
