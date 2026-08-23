import { createFileRoute } from "@tanstack/react-router";
import { PartyPopper } from "lucide-react";
import { DemandaEventManager } from "@/components/app/DemandaEventManager";

export const Route = createFileRoute("/_authenticated/demandas/festa-aniversario")({
  head: () => ({
    meta: [
      { title: "Demandas: Festa de Aniversário | JM Formaturas" },
      { name: "description", content: "Gestão de eventos de festas de aniversário e 15 anos com contratos, pacotes e links de adesão." },
      { property: "og:title", content: "Demandas: Festa de Aniversário | JM Formaturas" },
      { property: "og:description", content: "Gestão de aniversários infantis, debutantes 15 anos e eventos comemorativos." },
    ],
  }),
  component: FestaAniversarioPage,
});

function FestaAniversarioPage() {
  return (
    <DemandaEventManager
      tipo="festa-aniversario"
      titulo="FESTA DE ANIVERSÁRIO"
      subtitulo="Cadastre eventos de aniversário e 15 anos, gerencie pacotes, gere links de adesão e acompanhe contratos e parcelas."
      icon={PartyPopper}
      themeColor="purple"
    />
  );
}

