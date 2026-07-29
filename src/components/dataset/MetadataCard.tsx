import { cn } from "@/lib/utils";

interface MetadataCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function MetadataCard({
  title,
  children,
  className,
  action,
}: MetadataCardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-neutral-200 bg-white p-4",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function MetadataGrid({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wide text-neutral-450 text-neutral-500">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm text-neutral-800">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
