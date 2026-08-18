import { createFileRoute } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { DemandaManager } from "@/components/app/DemandaManager";

export const Route = createFileRoute("/_authenticated/demandas/ensaio")({
  head: () => ({
    meta: [
      { title: "Demandas: Ensaio Fotográfico | JM Formaturas" },
      { name: "description", content: "Gestão de ensaios fotográficos com contratos, parcelas e login por CPF." },
      { property: "og:title", content: "Demandas: Ensaio Fotográfico | JM Formaturas" },
      { property: "og:description", content: "Gestão de ensaios individuais, corporativos, gestantes e pré-wedding." },
    ],
  }),
  component: EnsaioPage,
});

function EnsaioPage() {
  return (
    <DemandaManager
      tipo="ensaio"
      titulo="ENSAIO FOTOGRÁFICO"
      subtitulo="Gestão de ensaios pré-wedding, gestante, corporativos e individuais com acesso por CPF."
      icon={Camera}
      themeColor="blue"
    />
  );
}
