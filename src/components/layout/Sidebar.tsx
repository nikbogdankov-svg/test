"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  FileSearch,
  MessageSquareText,
  PanelLeftClose,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentTenant } from "@/data/users";
import { usePersona } from "@/hooks/usePersona";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import type { NavKey } from "@/types/catalog";

const navItems: { key: NavKey; href: string; label: string; icon: LucideIcon }[] =
  [
    { key: "ask", href: "/ask", label: "Ask", icon: MessageSquareText },
    { key: "catalog", href: "/catalog", label: "Data Catalog", icon: BookOpen },
    { key: "requests", href: "/requests", label: "Access", icon: FileSearch },
    { key: "audit", href: "/audit", label: "Audit Logs", icon: Shield },
  ];

export function Sidebar() {
  const pathname = usePathname();
  const { persona } = usePersona();
  const { open, setOpen } = useSidebar();
  const visibleNav = navItems.filter((item) =>
    persona.navKeys.includes(item.key)
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-neutral-200 bg-[#FAFAFA] transition-transform duration-200 ease-out",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      aria-hidden={!open}
    >
      <div className="flex h-14 items-center gap-2 border-b border-neutral-200 px-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-900 text-white">
          <Boxes className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-neutral-900">
            BullSequana
          </p>
          <p className="truncate text-[11px] text-neutral-500">AI Platform</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => setOpen(false)}
          aria-label="Hide sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3" aria-label="Primary">
        {visibleNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-white text-neutral-900 border border-neutral-200"
                  : "text-neutral-600 hover:bg-white/80 hover:text-neutral-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
          Tenant
        </p>
        <p className="mt-1 text-sm text-neutral-700">{currentTenant.name}</p>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
          Viewing as
        </p>
        <p className="mt-1 text-sm text-neutral-700">{persona.name}</p>
        <p className="text-xs text-neutral-500">{persona.title}</p>
      </div>
    </aside>
  );
}
