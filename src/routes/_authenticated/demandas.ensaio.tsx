import { createFileRoute } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { DemandaEventManager } from "@/components/app/DemandaEventManager";

export const Route = createFileRoute("/_authenticated/demandas/ensaio")({
  head: () => ({
    meta: [
      { title: "Demandas: Ensaio Fotográfico | JM Formaturas" },
      { name: "description", content: "Gestão de eventos e ensaios fotográficos com contratos, pacotes e links de adesão." },
      { property: "og:title", content: "Demandas: Ensaio Fotográfico | JM Formaturas" },
      { property: "og:description", content: "Gestão de ensaios individuais, corporativos, gestantes e pré-wedding." },
    ],
  }),
  component: EnsaioPage,
});

function EnsaioPage() {
  return (
    <DemandaEventManager
      tipo="ensaio"
      titulo="ENSAIO FOTOGRÁFICO"
      subtitulo="Cadastre eventos de ensaios fotográficos, gerencie pacotes, gere links de adesão e acompanhe contratos e parcelas."
      icon={Camera}
      themeColor="blue"
    />
  );
}
