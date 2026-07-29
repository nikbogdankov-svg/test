"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatsCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "rounded-lg border border-neutral-200 bg-white px-4 py-3",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-900">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-neutral-500">{hint}</p>
          ) : null}
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50">
          <Icon className="h-4 w-4 text-neutral-600" />
        </div>
      </div>
    </motion.div>
  );
}
