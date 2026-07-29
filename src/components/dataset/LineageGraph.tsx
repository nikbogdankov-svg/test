"use client";

import { useMemo, useRef, useState } from "react";
import {
  Boxes,
  Database,
  GitBranch,
  Bot,
  AppWindow,
  Minus,
  Plus,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LineageEdge, LineageNode } from "@/types/catalog";

interface LineageGraphProps {
  nodes: LineageNode[];
  edges: LineageEdge[];
}

const nodeIcons = {
  source: Database,
  pipeline: GitBranch,
  dataset: Database,
  vector: Boxes,
  application: AppWindow,
  agent: Bot,
};

const nodeStyles = {
  source: "border-sky-200 bg-sky-50",
  pipeline: "border-violet-200 bg-violet-50",
  dataset: "border-neutral-300 bg-white",
  vector: "border-emerald-200 bg-emerald-50",
  application: "border-amber-200 bg-amber-50",
  agent: "border-cyan-200 bg-cyan-50",
};

const NODE_WIDTH = 170;
const NODE_HEIGHT = 72;

export function LineageGraph({ nodes, edges }: LineageGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 40, y: 30 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null
  );

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes]
  );

  const width = Math.max(...nodes.map((node) => node.x + NODE_WIDTH + 80), 900);
  const height = Math.max(...nodes.map((node) => node.y + NODE_HEIGHT + 80), 360);

  function onPointerDown(event: React.PointerEvent) {
    if ((event.target as HTMLElement).closest("[data-node]")) return;
    setDragging(true);
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!dragging || !dragStart.current) return;
    setOffset({
      x: dragStart.current.ox + (event.clientX - dragStart.current.x),
      y: dragStart.current.oy + (event.clientY - dragStart.current.y),
    });
  }

  function onPointerUp() {
    setDragging(false);
    dragStart.current = null;
  }

  function resetView() {
    setScale(1);
    setOffset({ x: 40, y: 30 });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2">
        <div>
          <p className="text-sm font-medium text-neutral-900">Lineage graph</p>
          <p className="text-xs text-neutral-500">
            Drag to pan · use controls to zoom
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon"
            aria-label="Zoom out"
            onClick={() => setScale((value) => Math.max(0.5, value - 0.1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Zoom in"
            onClick={() => setScale((value) => Math.min(1.8, value + 0.1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            aria-label="Reset view"
            onClick={resetView}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "relative h-[420px] cursor-grab overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#E5E5E5_1px,transparent_0)] [background-size:16px_16px]",
          dragging && "cursor-grabbing"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            width,
            height,
            position: "relative",
          }}
        >
          <svg
            width={width}
            height={height}
            className="absolute inset-0 pointer-events-none"
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L7,3 L0,6 Z" fill="#A3A3A3" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const source = nodeMap[edge.source];
              const target = nodeMap[edge.target];
              if (!source || !target) return null;
              const x1 = source.x + NODE_WIDTH;
              const y1 = source.y + NODE_HEIGHT / 2;
              const x2 = target.x;
              const y2 = target.y + NODE_HEIGHT / 2;
              const midX = (x1 + x2) / 2;
              return (
                <g key={edge.id}>
                  <path
                    d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                    stroke="#A3A3A3"
                    strokeWidth="1.5"
                    fill="none"
                    markerEnd="url(#arrow)"
                  />
                  {edge.label ? (
                    <text
                      x={midX}
                      y={(y1 + y2) / 2 - 6}
                      textAnchor="middle"
                      className="fill-neutral-500 text-[10px]"
                    >
                      {edge.label}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => {
            const Icon = nodeIcons[node.type];
            return (
              <div
                key={node.id}
                data-node
                className={cn(
                  "absolute rounded-lg border px-3 py-2",
                  nodeStyles[node.type]
                )}
                style={{
                  left: node.x,
                  top: node.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                }}
              >
                <div className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-700" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-neutral-900">
                      {node.label}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-neutral-600">
                      {node.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
