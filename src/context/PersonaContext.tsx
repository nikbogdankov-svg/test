"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  defaultPersona,
  getPersonaById,
  personaToOwner,
  personas,
} from "@/data/personas";
import type { Owner, Persona } from "@/types/catalog";

const STORAGE_KEY = "bullsequana.activePersonaId";

interface PersonaContextValue {
  persona: Persona;
  owner: Owner;
  personas: Persona[];
  setPersonaId: (id: string, options?: { navigate?: boolean }) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [persona, setPersona] = useState<Persona>(defaultPersona);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const next = stored ? getPersonaById(stored) : undefined;
    if (next) setPersona(next);
    setHydrated(true);
  }, []);

  const setPersonaId = useCallback(
    (id: string, options?: { navigate?: boolean }) => {
      const next = getPersonaById(id);
      if (!next) return;
      setPersona(next);
      window.localStorage.setItem(STORAGE_KEY, next.id);
      if (options?.navigate !== false) {
        router.push(next.homePath);
      }
    },
    [router]
  );

  const value = useMemo<PersonaContextValue>(
    () => ({
      persona,
      owner: personaToOwner(persona),
      personas,
      setPersonaId,
    }),
    [persona, setPersonaId]
  );

  if (!hydrated) {
    return (
      <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
    );
  }

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error("usePersona must be used within PersonaProvider");
  }
  return context;
}
