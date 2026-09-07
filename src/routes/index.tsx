import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { BrandLottie } from "@/components/BrandLottie";
import { FormandosIcon, FinanceiroIcon, SegurancaIcon } from "@/components/FeatureIcons";

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
        content:
          "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-brand text-primary-foreground">
      <BackgroundGlow />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 flex aspect-[6/5] w-48 items-center justify-center overflow-hidden animate-float sm:w-64">
          <BrandLottie />
        </div>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl animate-in fade-in slide-in-from-bottom-3 duration-700">
          JM Formaturas
        </h1>
        <p className="mt-4 max-w-xl text-base opacity-80 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
          Gestão completa de turmas, formandos, contratos e pagamentos de formatura — com área exclusiva para cada
          formando.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          <Button asChild size="lg" variant="secondary" className="shadow-elevated hover:scale-[1.03] transition-transform">
            <Link to="/auth">Acessar minha conta</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          <Feature
            icon={<FormandosIcon className="size-full" />}
            title="Turmas e formandos"
            text="Cadastro por curso, faculdade e semestre, com todos os dados do formando."
            delayMs={450}
          />
          <Feature
            icon={<FinanceiroIcon className="size-full" />}
            title="Financeiro"
            text="Contratos, parcelas, pagamentos e inadimplência sob controle."
            delayMs={600}
          />
          <Feature
            icon={<SegurancaIcon className="size-full" />}
            title="Acesso seguro"
            text="Cada formando enxerga apenas os próprios dados e documentos."
            delayMs={750}
          />
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
  delayMs,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  delayMs: number;
}) {
  return (
    <div
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="mb-3 flex size-16 items-center justify-center rounded-xl bg-white/10 p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm opacity-75">{text}</p>
    </div>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-gold/25 blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 -left-40 h-80 w-80 rounded-full bg-gold/15 blur-3xl animate-pulse-slow" />
    </div>
  );
}
