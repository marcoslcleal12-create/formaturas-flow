import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { DemandaManager } from "@/components/app/DemandaManager";

export const Route = createFileRoute("/_authenticated/demandas/casamento")({
  head: () => ({
    meta: [
      { title: "Demandas: Casamentos | JM Formaturas" },
      { name: "description", content: "Gestão de demandas de casamentos com contratos, parcelas e login por CPF." },
      { property: "og:title", content: "Demandas: Casamentos | JM Formaturas" },
      { property: "og:description", content: "Gestão de ensaios, cerimônias e festas de casamentos contratadas." },
    ],
  }),
  component: CasamentosPage,
});

function CasamentosPage() {
  return (
    <DemandaManager
      tipo="casamento"
      titulo="CASAMENTO"
      subtitulo="Gestão de noivos, cerimônias, recepções, contratos e parcelamentos com acesso por CPF."
      icon={Heart}
      themeColor="pink"
    />
  );
}
