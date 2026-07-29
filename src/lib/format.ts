import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatDate(value: string): string {
  return format(parseISO(value), "MMM d, yyyy");
}

export function formatDateTime(value: string): string {
  return format(parseISO(value), "MMM d, yyyy · HH:mm");
}

export function formatRelative(value: string): string {
  return formatDistanceToNow(parseISO(value), { addSuffix: true });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}
