import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JM Formaturas | Gestão financeira de formaturas" },
      {
        name: "description",
        content:
          "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar.",
      },
      { property: "og:title", content: "JM Formaturas | Gestão financeira de formaturas" },
      {
        property: "og:description",
        content: "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-brand text-primary-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center">
        <span className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gold text-accent-foreground">
          <GraduationCap className="size-8" />
        </span>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">JM Formaturas</h1>
        <p className="mt-4 max-w-xl text-base opacity-80">
          Gestão completa de turmas, formandos, contratos e pagamentos de formatura — com área exclusiva para cada
          formando.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link to="/auth">Acessar minha conta</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          <Feature
            icon={<GraduationCap className="size-5" />}
            title="Turmas e formandos"
            text="Cadastro por curso, faculdade e semestre, com todos os dados do formando."
          />
          <Feature
            icon={<Wallet className="size-5" />}
            title="Financeiro"
            text="Contratos, parcelas, pagamentos e inadimplência sob controle."
          />
          <Feature
            icon={<ShieldCheck className="size-5" />}
            title="Acesso seguro"
            text="Cada formando enxerga apenas os próprios dados e documentos."
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-gold text-accent-foreground">
        {icon}
      </span>
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm opacity-75">{text}</p>
    </div>
  );
}
