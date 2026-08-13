import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/** Registra acessos às páginas públicas da loja para as métricas do painel. */
export function VisitTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    void supabase.from("site_visits").insert({ caminho: pathname });
  }, [pathname]);

  return null;
}
