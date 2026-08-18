import { createFileRoute } from "@tanstack/react-router";
import { PartyPopper } from "lucide-react";
import { DemandaManager } from "@/components/app/DemandaManager";

export const Route = createFileRoute("/_authenticated/demandas/festa-aniversario")({
  head: () => ({
    meta: [
      { title: "Demandas: Festa de Aniversário | JM Formaturas" },
      { name: "description", content: "Gestão de demandas de festas de aniversário e 15 anos com contratos, parcelas e login por CPF." },
      { property: "og:title", content: "Demandas: Festa de Aniversário | JM Formaturas" },
      { property: "og:description", content: "Gestão de aniversários infantis, debutantes 15 anos e eventos comemorativos." },
    ],
  }),
  component: FestaAniversarioPage,
});

function FestaAniversarioPage() {
  return (
    <DemandaManager
      tipo="festa-aniversario"
      titulo="FESTA DE ANIVERSÁRIO"
      subtitulo="Gestão de aniversários, debutantes 15 anos, contratos e parcelamentos com acesso por CPF."
      icon={PartyPopper}
      themeColor="purple"
    />
  );
}
