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
import { supabase } from "@/integrations/supabase/client";
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
      { name: "description", content: "Painel de gestão com estatísticas consolidadas de turmas, casamentos, aniversários e ensaios." },
      { property: "og:title", content: "Visão Geral Consolidada | JM Formaturas & Eventos" },
      { property: "og:description", content: "Acompanhe entradas, saldo a receber, inadimplência e desempenho por grupo de demandas." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
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
        supabase.from("turmas").select("*, alunos(count)").order("created_at", { ascending: false }),
        supabase.from("alunos").select("id, turma_id, nome_completo, status"),
        supabase.from("contratos").select("*, parcelas(*), alunos(id, nome_completo, turmas(nome))"),
      ]);
      if (turmas.error) throw turmas.error;
      if (alunos.error) throw alunos.error;
      if (contratos.error) throw contratos.error;
      return { turmas: turmas.data, alunos: alunos.data, contratos: contratos.data };
    },
  });

  const turmas = data?.turmas ?? [];
  const alunos = (data?.alunos ?? []).filter((a) => a.status !== "inativo");
  const contratos = data?.contratos ?? [];
  const todasParcelasTurmas = contratos.flatMap((c) => c.parcelas ?? []);

  // --- 1. MÉTRICAS FINANCEIRAS: TURMAS ---
  const turmasContratado = contratos.reduce(
    (s, c) => s + Number(c.valor_total) - Number(c.desconto),
    0
  );
  const turmasEntradas = contratos.reduce((s, c) => s + Number(c.valor_entrada), 0);
  const turmasRecebidoParcelas = todasParcelasTurmas.reduce((s, p) => s + Number(p.valor_pago), 0);
  const turmasRecebidoTotal = turmasEntradas + turmasRecebidoParcelas;
  const turmasFaltaReceber = Math.max(0, turmasContratado - turmasRecebidoTotal);
  const turmasAtrasadas = todasParcelasTurmas
    .filter((p) => p.status !== "pago" && p.vencimento < hoje)
    .reduce((s, p) => s + (Number(p.valor) - Number(p.valor_pago)), 0);

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
  const totalGeralContratado = turmasContratado + casamentosContratado + festasContratado + ensaiosContratado;
  const totalGeralRecebido = turmasRecebidoTotal + casamentosRecebido + festasRecebido + ensaiosRecebido;
  const totalGeralFaltaReceber = turmasFaltaReceber + casamentosFalta + festasFalta + ensaiosFalta;
  const totalGeralAtrasado = turmasAtrasadas + casamentosAtrasadas + festasAtrasadas + ensaiosAtrasadas;
  const percentualGeralRecebido =
    totalGeralContratado > 0 ? Math.round((totalGeralRecebido / totalGeralContratado) * 100) : 0;

  const totalEventosCount = turmas.length + demandas.length;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Visão Geral Consolidada</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Acompanhamento financeiro e operacional unificado: Turmas, Casamentos, Aniversários e Ensaios.
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
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Contratado
                </span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="size-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-foreground">{brl(totalGeralContratado)}</p>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                <FolderKanban className="size-3" /> {totalEventosCount} contratos & demandas ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Total Recebido (Entradas)
                </span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {brl(totalGeralRecebido)}
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Progresso de recebimento</span>
                  <span className="font-semibold">{percentualGeralRecebido}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(percentualGeralRecebido, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Quanto Falta Receber
                </span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="size-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
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
                <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                  Total em Atraso
                </span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="size-4" />
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-destructive">{brl(totalGeralAtrasado)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {totalGeralAtrasado > 0 ? "Requer cobrança e acompanhamento" : "Nenhuma parcela em atraso 🎉"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ESTATÍSTICAS DETALHADAS POR GRUPOS DE DEMANDAS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <FolderKanban className="size-5 text-gold" /> Desempenho Financeiro por Grupos de Demanda
            </h2>
            <span className="text-xs text-muted-foreground">Dados em tempo real</span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* 1. GRUPO TURMAS */}
            <GroupStatCard
              title="TURMAS DE FORMATURA"
              subtitle={`${turmas.length} turmas cadastradas · ${alunos.length} formandos`}
              icon={GraduationCap}
              colorClass="border-l-4 border-l-primary"
              badgeBg="bg-primary/10 text-primary"
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
              colorClass="border-l-4 border-l-pink-500"
              badgeBg="bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400"
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
              colorClass="border-l-4 border-l-purple-500"
              badgeBg="bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400"
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
              colorClass="border-l-4 border-l-blue-500"
              badgeBg="bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
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
                  <GraduationCap className="size-4 text-primary" /> Turmas Recentes
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
                <p className="text-xs text-muted-foreground py-4 text-center">Nenhuma turma cadastrada.</p>
              )}
              {turmas.slice(0, 5).map((t) => (
                <Link
                  key={t.id}
                  to="/turmas/$turmaId"
                  params={{ turmaId: t.id }}
                  className="flex items-center justify-between rounded-xl border border-border/70 p-3 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{t.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.curso} · {t.faculdade}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {t.alunos?.[0]?.count ?? 0} alunos
                    </span>
                    <Badge variant={t.status === "ativa" ? "default" : "secondary"} className="text-[10px]">
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
                  <Heart className="size-4 text-pink-500" /> Demandas Recentes
                </CardTitle>
                <CardDescription>Casamentos, festas e ensaios com contrato ativo</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {demandas.length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">Nenhuma demanda cadastrada ainda.</p>
              )}
              {demandas.slice(0, 5).map((d) => {
                const linkMap = {
                  casamento: "/demandas/casamento",
                  "festa-aniversario": "/demandas/festa-aniversario",
                  ensaio: "/demandas/ensaio",
                };
                const tagMap = {
                  casamento: { label: "Casamento", color: "bg-pink-100 text-pink-700 dark:bg-pink-950/50" },
                  "festa-aniversario": { label: "Aniversário", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/50" },
                  ensaio: { label: "Ensaio", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50" },
                };
                const tag = tagMap[d.tipo];

                return (
                  <Link
                    key={d.id}
                    to={linkMap[d.tipo]}
                    className="flex items-center justify-between rounded-xl border border-border/70 p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-sm flex items-center gap-2">
                        {d.cliente}
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${tag.color}`}>
                          {tag.label}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <Calendar className="size-3" />
                        {new Date(d.dataEvento + "T00:00:00").toLocaleDateString("pt-BR")} · {d.pacote}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{brl(d.valorTotal)}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        {d.parcelas.filter((p) => p.status === "pago").length}/{d.numParcelas} pagas
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
  colorClass: string;
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
  colorClass,
  badgeBg,
  linkTo,
  contratado,
  recebido,
  falta,
  atrasado,
}: GroupStatCardProps) {
  const percentual = contratado > 0 ? Math.round((recebido / contratado) * 100) : 0;

  return (
    <Card className={`shadow-card ${colorClass} transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-lg ${badgeBg}`}>
              <Icon className="size-5" />
            </span>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">{title}</CardTitle>
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
            <span className="font-semibold text-foreground">{percentual}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(percentual, 100)}%` }}
            />
          </div>
        </div>

        {/* Quadro com 4 Métricas */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
          <div className="p-2.5 rounded-lg bg-muted/50 border text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contratado</p>
            <p className="text-xs font-bold text-foreground mt-0.5">{brl(contratado)}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 text-center">
            <p className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Entradas</p>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{brl(recebido)}</p>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 text-center">
            <p className="text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400">Falta</p>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-0.5">{brl(falta)}</p>
          </div>

          <div className={`p-2.5 rounded-lg border text-center ${atrasado > 0 ? "bg-destructive/10 border-destructive/30" : "bg-muted/50"}`}>
            <p className={`text-[10px] uppercase tracking-wider ${atrasado > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
              Atrasados
            </p>
            <p className={`text-xs font-bold mt-0.5 ${atrasado > 0 ? "text-destructive" : "text-foreground"}`}>
              {brl(atrasado)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
