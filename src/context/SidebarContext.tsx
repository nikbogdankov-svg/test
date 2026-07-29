"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePersona } from "@/hooks/usePersona";

const STORAGE_KEY = "bullsequana.sidebarOpen";

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const { persona } = usePersona();
  // Default closed — chat-first personas (Mayor) prefer a clean Ask canvas.
  const [open, setOpenState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true" || stored === "false") {
      setOpenState(stored === "true");
    } else {
      // Multi-nav roles start open; Ask-only roles stay collapsed.
      setOpenState(persona.navKeys.length > 1);
    }
    setHydrated(true);
  }, [persona.id, persona.navKeys.length]);

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
  }, []);

  const toggle = useCallback(() => {
    setOpenState((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ open: hydrated ? open : false, setOpen, toggle }),
    [hydrated, open, setOpen, toggle]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
