import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Heart,
  PartyPopper,
  Camera,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  FolderKanban,
  Users,
} from "lucide-react";
import { turmas as apiTurmas, alunos as apiAlunos, contratos as apiContratos } from "@/lib/recursos";
import { AppShell, brl } from "@/components/app/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { loadDemandas, type DemandaItem } from "@/lib/demandas-store";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Visão Geral Consolidada | JM Formaturas & Eventos" },
      {
        name: "description",
        content:
          "Painel de gestão com estatísticas consolidadas de turmas, casamentos, aniversários e ensaios.",
      },
      { property: "og:title", content: "Visão Geral Consolidada | JM Formaturas & Eventos" },
      {
        property: "og:description",
        content:
          "Acompanhe entradas, saldo a receber, inadimplência e desempenho por grupo de demandas.",
      },
    ],
  }),
  component: DashboardPage,
});

export function DashboardPage() {
  const [demandas, setDemandas] = useState<DemandaItem[]>([]);
  const hoje = new Date().toISOString().slice(0, 10);

  // Load demands from store
  useEffect(() => {
    setDemandas(loadDemandas());
  }, []);

  // Fetch Turmas, Alunos, Contratos and Parcelas from Supabase
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-full-data"],
    queryFn: async () => {
      const [turmas, alunos, contratos] = await Promise.all([
        apiTurmas.listar(),
        apiAlunos.listar(),
        apiContratos.listar(),
      ]);
      return { turmas, alunos, contratos };
    },
  });

  const turmas = data?.turmas ?? [];
  const alunos = data?.alunos ?? [];
  const contratos = data?.contratos ?? [];
  const todasParcelasTurmas = contratos.flatMap((c) => c.parcelas ?? []);

  // --- 1. MÉTRICAS FINANCEIRAS: TURMAS ---
  const turmasContratado = contratos.reduce(
    (s, c) => s + Number(c.valorTotal) - Number(c.desconto),
    0,
  );
  const turmasEntradas = contratos.reduce((s, c) => s + Number(c.valorEntrada), 0);
  const turmasRecebidoParcelas = todasParcelasTurmas.reduce((s, p) => s + Number(p.valorPago), 0);
  const turmasRecebidoTotal = turmasEntradas + turmasRecebidoParcelas;
  const turmasFaltaReceber = Math.max(0, turmasContratado - turmasRecebidoTotal);
  const turmasAtrasadas = todasParcelasTurmas
    .filter((p) => p.status !== "Pago" && p.vencimento < hoje)
    .reduce((s, p) => s + (Number(p.valor) - Number(p.valorPago)), 0);

  // --- 2. MÉTRICAS FINANCEIRAS: CASAMENTOS ---
  const casamentos = demandas.filter((d) => d.tipo === "casamento");
  const casamentosContratado = casamentos.reduce((s, d) => s + (d.valorTotal - d.desconto), 0);
  const casamentosRecebido = casamentos.reduce((s, d) => {
    const pagas = d.parcelas.filter((p) => p.status === "pago").reduce((pS, p) => pS + p.valor, 0);
    return s + d.valorEntrada + pagas;
  }, 0);
  const casamentosFalta = Math.max(0, casamentosContratado - casamentosRecebido);
  const casamentosAtrasadas = casamentos.reduce((s, d) => {
    const atrasadas = d.parcelas
      .filter((p) => p.status !== "pago" && p.vencimento < hoje)
      .reduce((pS, p) => pS + p.valor, 0);
    return s + atrasadas;
  }, 0);

  // --- 3. MÉTRICAS FINANCEIRAS: FESTAS DE ANIVERSÁRIO ---
  const festas = demandas.filter((d) => d.tipo === "festa-aniversario");
  const festasContratado = festas.reduce((s, d) => s + (d.valorTotal - d.desconto), 0);
  const festasRecebido = festas.reduce((s, d) => {
    const pagas = d.parcelas.filter((p) => p.status === "pago").reduce((pS, p) => pS + p.valor, 0);
    return s + d.valorEntrada + pagas;
  }, 0);
  const festasFalta = Math.max(0, festasContratado - festasRecebido);
  const festasAtrasadas = festas.reduce((s, d) => {
    const atrasadas = d.parcelas
      .filter((p) => p.status !== "pago" && p.vencimento < hoje)
      .reduce((pS, p) => pS + p.valor, 0);
    return s + atrasadas;
  }, 0);

  // --- 4. MÉTRICAS FINANCEIRAS: ENSAIOS FOTOGRÁFICOS ---
  const ensaios = demandas.filter((d) => d.tipo === "ensaio");
  const ensaiosContratado = ensaios.reduce((s, d) => s + (d.valorTotal - d.desconto), 0);
  const ensaiosRecebido = ensaios.reduce((s, d) => {
    const pagas = d.parcelas.filter((p) => p.status === "pago").reduce((pS, p) => pS + p.valor, 0);
    return s + d.valorEntrada + pagas;
  }, 0);
  const ensaiosFalta = Math.max(0, ensaiosContratado - ensaiosRecebido);
  const ensaiosAtrasadas = ensaios.reduce((s, d) => {
    const atrasadas = d.parcelas
      .filter((p) => p.status !== "pago" && p.vencimento < hoje)
      .reduce((pS, p) => pS + p.valor, 0);
    return s + atrasadas;
  }, 0);

  // --- TOTAL GERAL CONSOLIDADO ---
  const totalGeralContratado =
    turmasContratado + casamentosContratado + festasContratado + ensaiosContratado;
  const totalGeralRecebido =
    turmasRecebidoTotal + casamentosRecebido + festasRecebido + ensaiosRecebido;
  const totalGeralFaltaReceber = turmasFaltaReceber + casamentosFalta + festasFalta + ensaiosFalta;
  const totalGeralAtrasado =
    turmasAtrasadas + casamentosAtrasadas + festasAtrasadas + ensaiosAtrasadas;
  const percentualGeralRecebido =
    totalGeralContratado > 0 ? Math.round((totalGeralRecebido / totalGeralContratado) * 100) : 0;

  const totalEventosCount = turmas.length + demandas.length;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              Visão Geral Consolidada
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Acompanhamento financeiro e operacional unificado: Turmas, Casamentos, Aniversários e
              Ensaios.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/financeiro">Ver Financeiro Completo</Link>
            </Button>
          </div>
        </div>

        {/* CARDS DE KPI GERAIS CONSOLIDADOS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Total Contratado
                </span>
                <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <TrendingUp className="size-4" />
                </span>
              </div>
              <p className="figure mt-3 whitespace-nowrap text-xl font-medium text-foreground">
                {brl(totalGeralContratado)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <FolderKanban className="size-3" /> {totalEventosCount} contratos & demandas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-success">
                  Total Recebido (Entradas)
                </span>
                <span className="flex size-8 items-center justify-center rounded-md bg-success/12 text-success">
                  <CheckCircle2 className="size-4" />
                </span>
              </div>
              <p className="figure mt-3 whitespace-nowrap text-xl font-medium text-success">
                {brl(totalGeralRecebido)}
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Progresso de recebimento</span>
                  <span className="figure font-medium text-foreground">
                    {percentualGeralRecebido}%
                  </span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={percentualGeralRecebido}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progresso de recebimento consolidado"
                >
                  <div
                    className="h-full bg-success transition-[width] duration-(--dur-3) ease-(--ease-doc)"
                    style={{ width: `${Math.min(percentualGeralRecebido, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-warning">
                  Quanto Falta Receber
                </span>
                <span className="flex size-8 items-center justify-center rounded-md bg-warning/12 text-warning">
                  <Clock className="size-4" />
                </span>
              </div>
              <p className="figure mt-3 whitespace-nowrap text-xl font-medium text-warning">
                {brl(totalGeralFaltaReceber)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Saldo pendente a ser liquidado nos vencimentos futuros
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-destructive">
                  Total em Atraso
                </span>
                <span className="flex size-8 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                  <AlertCircle className="size-4" />
                </span>
              </div>
              <p className="figure mt-3 whitespace-nowrap text-xl font-medium text-destructive">
                {brl(totalGeralAtrasado)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {totalGeralAtrasado > 0
                  ? "Requer cobrança e acompanhamento"
                  : "Nenhuma parcela em atraso 🎉"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ESTATÍSTICAS DETALHADAS POR GRUPOS DE DEMANDAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight">
              <FolderKanban className="size-5 text-gold-ink" /> Desempenho Financeiro por Grupos de
              Demanda
            </h2>
            <span className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              Dados em tempo real
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* 1. GRUPO TURMAS */}
            <GroupStatCard
              title="TURMAS DE FORMATURA"
              subtitle={`${turmas.length} turmas cadastradas · ${alunos.length} formandos`}
              icon={GraduationCap}
              ruleColor="var(--turma)"
              badgeBg="bg-turma-surface text-turma"
              linkTo="/turmas"
              contratado={turmasContratado}
              recebido={turmasRecebidoTotal}
              falta={turmasFaltaReceber}
              atrasado={turmasAtrasadas}
            />

            {/* 2. GRUPO CASAMENTO */}
            <GroupStatCard
              title="CASAMENTOS"
              subtitle={`${casamentos.length} casamentos registrados`}
              icon={Heart}
              ruleColor="var(--casamento)"
              badgeBg="bg-casamento-surface text-casamento"
              linkTo="/demandas/casamento"
              contratado={casamentosContratado}
              recebido={casamentosRecebido}
              falta={casamentosFalta}
              atrasado={casamentosAtrasadas}
            />

            {/* 3. GRUPO FESTAS DE ANIVERSÁRIO */}
            <GroupStatCard
              title="FESTAS DE ANIVERSÁRIO & 15 ANOS"
              subtitle={`${festas.length} eventos e aniversários cadastrados`}
              icon={PartyPopper}
              ruleColor="var(--festa)"
              badgeBg="bg-festa-surface text-festa"
              linkTo="/demandas/festa-aniversario"
              contratado={festasContratado}
              recebido={festasRecebido}
              falta={festasFalta}
              atrasado={festasAtrasadas}
            />

            {/* 4. GRUPO ENSAIOS */}
            <GroupStatCard
              title="ENSAIOS FOTOGRÁFICOS"
              subtitle={`${ensaios.length} ensaios fotográficos cadastrados`}
              icon={Camera}
              ruleColor="var(--ensaio)"
              badgeBg="bg-ensaio-surface text-ensaio"
              linkTo="/demandas/ensaio"
              contratado={ensaiosContratado}
              recebido={ensaiosRecebido}
              falta={ensaiosFalta}
              atrasado={ensaiosAtrasadas}
            />
          </div>
        </div>

        {/* DEMANDAS E TURMAS RECENTES */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Turmas Recentes */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="size-4 text-turma" /> Turmas Recentes
                </CardTitle>
                <CardDescription>Últimas turmas cadastradas no sistema</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/turmas" className="gap-1 text-xs">
                  Ver todas <ArrowUpRight className="size-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {isLoading && <p className="text-xs text-muted-foreground">Carregando turmas...</p>}
              {!isLoading && turmas.length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Nenhuma turma cadastrada.
                </p>
              )}
              {turmas.slice(0, 5).map((t) => (
                <Link
                  key={t.id}
                  to="/turmas/$turmaId"
                  params={{ turmaId: t.id }}
                  className="flex items-center justify-between rounded-md border border-border bg-card p-3 transition-colors duration-(--dur-2) ease-(--ease-doc) hover:border-input hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <div>
                    <p className="text-sm font-semibold">{t.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.curso} · {t.faculdade}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      <span className="figure">{alunos.filter((a) => a.turmaId === t.id).length}</span> alunos
                    </span>
                    <Badge
                      variant={t.status === "EmAndamento" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {t.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Demandas Recentes (Casamentos, Festas, Ensaios) */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="size-4 text-casamento" /> Demandas Recentes
                </CardTitle>
                <CardDescription>Casamentos, festas e ensaios com contrato ativo</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {demandas.length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  Nenhuma demanda cadastrada ainda.
                </p>
              )}
              {demandas.slice(0, 5).map((d) => {
                const linkMap = {
                  casamento: "/demandas/casamento",
                  "festa-aniversario": "/demandas/festa-aniversario",
                  ensaio: "/demandas/ensaio",
                };
                const tagMap = {
                  casamento: { label: "Casamento", color: "bg-casamento-surface text-casamento" },
                  "festa-aniversario": {
                    label: "Aniversário",
                    color: "bg-festa-surface text-festa",
                  },
                  ensaio: { label: "Ensaio", color: "bg-ensaio-surface text-ensaio" },
                };
                const tag = tagMap[d.tipo];

                return (
                  <Link
                    key={d.id}
                    to={linkMap[d.tipo]}
                    className="flex items-center justify-between rounded-md border border-border bg-card p-3 transition-colors duration-(--dur-2) ease-(--ease-doc) hover:border-input hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        {d.cliente}
                        <span
                          className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="size-3 shrink-0" />
                        <span className="figure">
                          {new Date(d.dataEvento + "T00:00:00").toLocaleDateString("pt-BR")}
                        </span>
                        · {d.pacote}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="figure text-sm font-medium text-foreground">
                        {brl(d.valorTotal)}
                      </p>
                      <span className="text-[10px] font-medium text-success">
                        <span className="figure">
                          {d.parcelas.filter((p) => p.status === "pago").length}/{d.numParcelas}
                        </span>{" "}
                        pagas
                      </span>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

interface GroupStatCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  ruleColor: string;
  badgeBg: string;
  linkTo: string;
  contratado: number;
  recebido: number;
  falta: number;
  atrasado: number;
}

function GroupStatCard({
  title,
  subtitle,
  icon: Icon,
  ruleColor,
  badgeBg,
  linkTo,
  contratado,
  recebido,
  falta,
  atrasado,
}: GroupStatCardProps) {
  const percentual = contratado > 0 ? Math.round((recebido / contratado) * 100) : 0;

  return (
    /*  A régua vertical tinta+ouro (.rule-start) substitui o border-l-4
        chapado.  O hover deixa de usar shadow-md (fora do sistema) e passa
        a elevar para shadow-elevated.  */
    <Card
      className="rule-start overflow-hidden shadow-card transition-shadow duration-(--dur-2) ease-(--ease-doc) hover:shadow-elevated"
      style={{ "--rule-color": ruleColor } as React.CSSProperties}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`rounded-md p-2 ${badgeBg}`}>
              <Icon className="size-5" />
            </span>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
              <CardDescription className="text-xs">{subtitle}</CardDescription>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs gap-1">
            <Link to={linkTo}>
              Acessar <ArrowUpRight className="size-3" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-1">
        {/* Barra de Progresso */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Recebido vs Contratado</span>
            <span className="figure font-medium text-foreground">{percentual}%</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={percentual}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Recebido em ${title}`}
          >
            <div
              className="h-full transition-[width] duration-(--dur-3) ease-(--ease-doc)"
              style={{ width: `${Math.min(percentual, 100)}%`, backgroundColor: ruleColor }}
            />
          </div>
        </div>

        {/* Quadro com 4 Métricas */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
          <div className="rounded-md border border-border bg-muted/60 p-2.5 text-center">
            <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Contratado
            </p>
            <p className="figure mt-1 text-xs font-medium text-foreground">{brl(contratado)}</p>
          </div>

          <div className="rounded-md border border-success/25 bg-success/8 p-2.5 text-center">
            <p className="text-[10px] uppercase tracking-[0.1em] text-success">Entradas</p>
            <p className="figure mt-1 text-xs font-medium text-success">{brl(recebido)}</p>
          </div>

          <div className="rounded-md border border-warning/25 bg-warning/8 p-2.5 text-center">
            <p className="text-[10px] uppercase tracking-[0.1em] text-warning">Falta</p>
            <p className="figure mt-1 text-xs font-medium text-warning">{brl(falta)}</p>
          </div>

          <div
            className={`rounded-md border p-2.5 text-center ${atrasado > 0 ? "border-destructive/30 bg-destructive/8" : "border-border bg-muted/60"}`}
          >
            <p
              className={`text-[10px] uppercase tracking-[0.1em] ${atrasado > 0 ? "font-semibold text-destructive" : "text-muted-foreground"}`}
            >
              Atrasados
            </p>
            <p
              className={`figure mt-1 text-xs font-medium ${atrasado > 0 ? "text-destructive" : "text-foreground"}`}
            >
              {brl(atrasado)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
