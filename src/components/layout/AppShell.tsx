"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { PersonaProvider } from "@/context/PersonaContext";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function ShellFrame({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F7F7F5] text-neutral-900">
      <Sidebar />
      <div
        className={cn(
          "transition-[padding] duration-200 ease-out",
          open ? "pl-60" : "pl-0"
        )}
      >
        <TopBar />
        <main className="px-6 py-6">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <PersonaProvider>
      <SidebarProvider>
        <TooltipProvider delayDuration={200}>
          <ShellFrame>{children}</ShellFrame>
        </TooltipProvider>
      </SidebarProvider>
    </PersonaProvider>
  );
}
