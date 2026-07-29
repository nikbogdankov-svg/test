"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  large?: boolean;
  autoFocus?: boolean;
  id?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search datasets, owners, tags, columns...",
  className,
  large = false,
  autoFocus = false,
  id = "catalog-search",
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400",
          large ? "h-4.5 w-4.5" : "h-4 w-4"
        )}
      />
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "pl-9 pr-9",
          large && "h-11 text-[15px] border-neutral-300"
        )}
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
