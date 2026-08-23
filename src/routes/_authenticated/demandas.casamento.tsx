import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { DemandaEventManager } from "@/components/app/DemandaEventManager";

export const Route = createFileRoute("/_authenticated/demandas/casamento")({
  head: () => ({
    meta: [
      { title: "Demandas: Casamentos | JM Formaturas" },
      { name: "description", content: "Gestão de eventos de casamentos com contratos, parcelas e link de adesão." },
      { property: "og:title", content: "Demandas: Casamentos | JM Formaturas" },
      { property: "og:description", content: "Gestão de ensaios, cerimônias e festas de casamentos contratadas." },
    ],
  }),
  component: CasamentosPage,
});

function CasamentosPage() {
  return (
    <DemandaEventManager
      tipo="casamento"
      titulo="CASAMENTO"
      subtitulo="Cadastre eventos de casamento, gerencie pacotes, gere links de adesão e acompanhe contratos e parcelas."
      icon={Heart}
      themeColor="pink"
    />
  );
}

