"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePersona } from "@/hooks/usePersona";
import type { NavKey } from "@/types/catalog";
import { LoadingState } from "@/components/states/LoadingState";

export function NavGuard({
  navKey,
  children,
}: {
  navKey: NavKey;
  children: React.ReactNode;
}) {
  const { persona } = usePersona();
  const router = useRouter();
  const allowed = persona.navKeys.includes(navKey);

  useEffect(() => {
    if (!allowed) router.replace(persona.homePath);
  }, [allowed, persona.homePath, router]);

  if (!allowed) {
    return <LoadingState label="Redirecting…" rows={2} />;
  }

  return <>{children}</>;
}
