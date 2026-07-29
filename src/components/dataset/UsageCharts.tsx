"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetadataCard } from "@/components/dataset/MetadataCard";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { UsageStats } from "@/types/catalog";

interface UsageChartsProps {
  usage: UsageStats;
}

export function UsageCharts({ usage }: UsageChartsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MetadataCard title="Dataset accesses (14 days)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usage.accessTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis tick={{ fontSize: 11, fill: "#737373" }} width={36} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#E5E5E5",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#171717"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {formatNumber(usage.accessesLast30Days)} accesses in the last 30 days
          </p>
        </MetadataCard>

        <MetadataCard title="Top consumers">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usage.topConsumers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#737373" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 11, fill: "#737373" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#E5E5E5",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#404040" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MetadataCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <MetadataCard title="AI assistants using dataset">
          {usage.aiAssistants.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No AI assistants currently query this dataset.
            </p>
          ) : (
            <ul className="space-y-2">
              {usage.aiAssistants.map((assistant) => (
                <li
                  key={assistant.name}
                  className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {assistant.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Last used {formatDateTime(assistant.lastUsed)}
                    </p>
                  </div>
                  <Badge variant="muted">
                    {formatNumber(assistant.queries)} queries
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </MetadataCard>

        <MetadataCard title="Recent queries">
          <ul className="space-y-2">
            {usage.recentQueries.map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-neutral-200 px-3 py-2"
              >
                <p className="font-mono text-xs text-neutral-800 whitespace-pre-wrap">
                  {item.query}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                  <span>{item.user}</span>
                  <span>{formatDateTime(item.timestamp)}</span>
                  <span>{item.durationMs} ms</span>
                </div>
              </li>
            ))}
          </ul>
        </MetadataCard>
      </div>
    </div>
  );
}
