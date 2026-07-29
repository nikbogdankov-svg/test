"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePersona } from "@/hooks/usePersona";
import { LoadingState } from "@/components/states/LoadingState";

export function HomeRedirect() {
  const { persona } = usePersona();
  const router = useRouter();

  useEffect(() => {
    router.replace(persona.homePath);
  }, [persona.homePath, router]);

  return <LoadingState label="Opening your workspace…" rows={3} />;
}
