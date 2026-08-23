import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  GraduationCap,
  Heart,
  PartyPopper,
  Camera,
  Wallet,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, brl } from "@/components/app/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  loadDemandas,
  saveDemandas,
  formatarCpf,
  type DemandaItem,
  type ParcelaDemanda,
} from "@/lib/demandas-store";

export const Route = createFileRoute("/_authenticated/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro Consolidado | JM Formaturas & Eventos" },
      {
        name: "description",
        content: "Fluxo de caixa, entradas, saídas, parcelas e inadimplência consolidadas de turmas e demandas.",
      },
      { property: "og:title", content: "Financeiro Consolidado | JM Formaturas & Eventos" },
      {
        property: "og:description",
        content: "Controle financeiro de todas as turmas, casamentos, aniversários, ensaios e despesas.",
      },
    ],
  }),
  component: FinanceiroPage,
});

const dataBR = (iso: string) => {
  if (!iso) return "—";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
};

const MESES = [
  { value: "01", label: "01 - Janeiro" },
  { value: "02", label: "02 - Fevereiro" },
  { value: "03", label: "03 - Março" },
  { value: "04", label: "04 - Abril" },
  { value: "05", label: "05 - Maio" },
  { value: "06", label: "06 - Junho" },
  { value: "07", label: "07 - Julho" },
  { value: "08", label: "08 - Agosto" },
  { value: "09", label: "09 - Setembro" },
  { value: "10", label: "10 - Outubro" },
  { value: "11", label: "11 - Novembro" },
  { value: "12", label: "12 - Dezembro" },
];

interface ParcelaUnificada {
  id: string;
  origem: "turma" | "casamento" | "festa-aniversario" | "ensaio";
  demandaId?: string | null;
  clienteNome: string;
  clienteContato?: string | null;
  tituloEvento: string;
  pacote: string;
  numeroParcela: number;
  valor: number;
  valorPago: number;
  vencimento: string;
  dataPagamento?: string | null;
  status: "pago" | "pendente" | "atrasado";
  linkUrl: string;
}

function FinanceiroPage() {
  const queryClient = useQueryClient();
  const [openNovaDespesa, setOpenNovaDespesa] = useState(false);

  // Filtros Avançados
  const [search, setSearch] = useState("");
  const [filtroGrupo, setFiltroGrupo] = useState<string>("todos");
  const [filtroMes, setFiltroMes] = useState<string>("todos");
  const [filtroAno, setFiltroAno] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");

  const [demandas, setDemandas] = useState<DemandaItem[]>([]);
  const hoje = new Date().toISOString().slice(0, 10);

  // Load demands from store
  useEffect(() => {
    setDemandas(loadDemandas());
  }, []);

  // Fetch Supabase Turma contracts & parcelas
  const { data: parcelasData, isLoading } = useQuery({
    queryKey: ["financeiro-parcelas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parcelas")
        .select("*, contratos(id, pacote, forma_pagamento, alunos(id, nome_completo, whatsapp, cpf, turmas(id, nome)))")
        .order("vencimento");
      if (error) throw error;
      return data;
    },
  });

  // Fetch Despesas
  const { data: despesasData } = useQuery({
    queryKey: ["despesas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("despesas").select("*").order("vencimento");
      if (error) throw error;
      return data;
    },
  });

  const parcelasTurmas = parcelasData ?? [];
  const despesas = despesasData ?? [];

  // 1. Unify all parcelas from Turmas and Demandas
  const listaUnificada: ParcelaUnificada[] = useMemo(() => {
    const list: ParcelaUnificada[] = [];

    // Turmas parcelas
    parcelasTurmas.forEach((p) => {
      const isPago = p.status === "pago";
      const isAtrasado = !isPago && p.vencimento < hoje;
      list.push({
        id: `turma-parc-${p.id}`,
        origem: "turma",
        clienteNome: p.contratos?.alunos?.nome_completo ?? "Formando",
        clienteContato: p.contratos?.alunos?.whatsapp ?? p.contratos?.alunos?.cpf ?? null,
        tituloEvento: p.contratos?.alunos?.turmas?.nome ?? "Turma",
        pacote: p.contratos?.pacote ?? "Pacote Formatura",
        numeroParcela: p.numero,
        valor: Number(p.valor),
        valorPago: Number(p.valor_pago),
        vencimento: p.vencimento,
        dataPagamento: p.data_pagamento ?? null,
        status: isPago ? "pago" : isAtrasado ? "atrasado" : "pendente",
        linkUrl: p.contratos?.alunos?.id ? `/alunos/${p.contratos.alunos.id}` : "/turmas",
      });
    });

    return list;
  }, [parcelasTurmas, demandas, hoje]);

  // Lista dinâmica de anos a partir das parcelas existentes
  const anosDisponiveis = useMemo(() => {
    const anos = new Set<string>();
    listaUnificada.forEach((p) => {
      if (p.vencimento) {
        const ano = p.vencimento.slice(0, 4);
        if (ano) anos.add(ano);
      }
    });
    // Se estiver vazio, adiciona os anos próximos
    if (anos.size === 0) {
      ["2025", "2026", "2027", "2028"].forEach((a) => anos.add(a));
    }
    return Array.from(anos).sort();
  }, [listaUnificada]);

  // KPI Calculations Consolidados
  const entradasPagas = listaUnificada.filter((p) => p.status === "pago");
  const totalEntradas = entradasPagas.reduce((s, p) => s + p.valorPago, 0);

  const pendentesEFaltas = listaUnificada.filter((p) => p.status !== "pago");
  const totalFaltaReceber = pendentesEFaltas.reduce((s, p) => s + (p.valor - p.valorPago), 0);

  const atrasadasTotal = listaUnificada.filter((p) => p.status === "atrasado");
  const totalInadimplencia = atrasadasTotal.reduce((s, p) => s + (p.valor - p.valorPago), 0);

  const saidasPagas = despesas.filter((d) => d.status === "pago");
  const totalSaidas = saidasPagas.reduce((s, d) => s + Number(d.valor), 0);
  const saldoLiquido = totalEntradas - totalSaidas;

  const saidasAtrasadas = despesas.filter((d) => d.status !== "pago" && d.vencimento < hoje);

  // Filtered parcelas list com Busca, Grupo, Mês, Ano e Status
  const parcelasFiltradas = useMemo(() => {
    return listaUnificada.filter((p) => {
      const matchText =
        p.clienteNome.toLowerCase().includes(search.toLowerCase()) ||
        p.pacote.toLowerCase().includes(search.toLowerCase()) ||
        p.tituloEvento.toLowerCase().includes(search.toLowerCase());

      const matchGrupo = filtroGrupo === "todos" || p.origem === filtroGrupo;

      // Parsing de data para Mês e Ano
      const [ano, mes] = p.vencimento ? p.vencimento.split("-") : ["", ""];
      const matchMes = filtroMes === "todos" || mes === filtroMes;
      const matchAno = filtroAno === "todos" || ano === filtroAno;
      const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;

      return matchText && matchGrupo && matchMes && matchAno && matchStatus;
    });
  }, [listaUnificada, search, filtroGrupo, filtroMes, filtroAno, filtroStatus]);

  const temFiltroAtivo =
    search.trim() !== "" ||
    filtroGrupo !== "todos" ||
    filtroMes !== "todos" ||
    filtroAno !== "todos" ||
    filtroStatus !== "todos";

  const totalFiltradoValor = parcelasFiltradas.reduce((s, p) => s + p.valor, 0);
  const totalFiltradoRecebido = parcelasFiltradas
    .filter((p) => p.status === "pago")
    .reduce((s, p) => s + p.valorPago, 0);
  const totalFiltradoPendente = totalFiltradoValor - totalFiltradoRecebido;

  const limparFiltros = () => {
    setSearch("");
    setFiltroGrupo("todos");
    setFiltroMes("todos");
    setFiltroAno("todos");
    setFiltroStatus("todos");
  };

  // Mutations
  const criarDespesa = useMutation({
    mutationFn: async (form: FormData) => {
      const valor = Number(String(form.get("valor") ?? "0").replace(",", ".")) || 0;
      if (valor <= 0) throw new Error("Informe um valor válido.");
      const { error } = await supabase.from("despesas").insert({
        descricao: String(form.get("descricao") ?? "").trim(),
        categoria: String(form.get("categoria") ?? "geral").trim() || "geral",
        valor,
        vencimento: String(form.get("vencimento") ?? hoje),
        status: "pendente",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Despesa / Saída registrada com sucesso!");
      setOpenNovaDespesa(false);
      void queryClient.invalidateQueries({ queryKey: ["despesas"] });
    },
    onError: (error) => toast.error((error as Error).message),
  });

  const baixarDespesa = useMutation({
    mutationFn: async ({ id, pago }: { id: string; pago: boolean }) => {
      const { error } = await supabase
        .from("despesas")
        .update(
          pago
            ? { status: "pendente", data_pagamento: null }
            : { status: "pago", data_pagamento: hoje }
        )
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["despesas"] }),
    onError: (error) => toast.error((error as Error).message),
  });

  // Toggle Parcela Status Handler
  const handleToggleParcelaStatus = async (item: ParcelaUnificada) => {
    if (item.origem === "turma") {
      const realId = item.id.replace("turma-parc-", "");
      const isPago = item.status === "pago";
      const { error } = await supabase
        .from("parcelas")
        .update(
          isPago
            ? { status: "pendente", valor_pago: 0, data_pagamento: null }
            : { status: "pago", valor_pago: item.valor, data_pagamento: hoje }
        )
        .eq("id", realId);
      if (error) {
        toast.error("Erro ao atualizar parcela: " + error.message);
        return;
      }
      toast.success("Status da parcela atualizado!");
      void queryClient.invalidateQueries({ queryKey: ["financeiro-parcelas"] });
    } else if (item.demandaId) {
      const all = loadDemandas();
      const updated = all.map((d) => {
        if (d.id !== item.demandaId) return d;
        const newParcelas = d.parcelas.map((p) => {
          if (p.numero !== item.numeroParcela) return p;
          const newSt: ParcelaDemanda["status"] = p.status === "pago" ? "pendente" : "pago";
          return {
            ...p,
            status: newSt,
            dataPagamento: newSt === "pago" ? hoje : null,
          };
        });
        return { ...d, parcelas: newParcelas };
      });
      saveDemandas(updated);
      setDemandas(updated);
      toast.success("Status da parcela atualizado!");
    }
  };

  const getOrigemBadge = (origem: ParcelaUnificada["origem"]) => {
    switch (origem) {
      case "turma":
        return <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary"><GraduationCap className="size-3" /> Turma</Badge>;
      case "casamento":
        return <Badge variant="secondary" className="gap-1 bg-pink-100 text-pink-700 dark:bg-pink-950/50"><Heart className="size-3" /> Casamento</Badge>;
      case "festa-aniversario":
        return <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 dark:bg-purple-950/50"><PartyPopper className="size-3" /> Aniversário</Badge>;
      case "ensaio":
        return <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700 dark:bg-blue-950/50"><Camera className="size-3" /> Ensaio</Badge>;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Painel Financeiro Consolidado</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestão de entradas, saídas, parcelas futuras e inadimplência de Turmas e Demandas.
            </p>
          </div>

          <Dialog open={openNovaDespesa} onOpenChange={setOpenNovaDespesa}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" /> Registrar Saída / Despesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nova Saída</DialogTitle>
              </DialogHeader>
              <form
                id="form-despesa"
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  criarDespesa.mutate(new FormData(e.currentTarget));
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="descricao">Descrição da Despesa *</Label>
                  <Input id="descricao" name="descricao" placeholder="Ex: Impressão de Álbuns / Cenografia" required />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="valor">Valor (R$) *</Label>
                    <Input id="valor" name="valor" type="number" step="0.01" placeholder="1500.00" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vencimento">Data de Vencimento *</Label>
                    <Input id="vencimento" name="vencimento" type="date" defaultValue={hoje} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="categoria">Categoria</Label>
                  <select
                    id="categoria"
                    name="categoria"
                    defaultValue="laboratorio"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="laboratorio">Laboratório / Impressão</option>
                    <option value="equipe">Equipe / Fotógrafos / Freelancers</option>
                    <option value="locacao">Locação / Estúdio / Cenários</option>
                    <option value="equipamento">Equipamentos e Manutenção</option>
                    <option value="marketing">Marketing e Comercial</option>
                    <option value="geral">Despesas Administrativas Gerais</option>
                  </select>
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenNovaDespesa(false)}>
                  Cancelar
                </Button>
                <Button type="submit" form="form-despesa" disabled={criarDespesa.isPending}>
                  {criarDespesa.isPending ? "Salvando..." : "Salvar Saída"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 5 CARDS DE KPI FINANCEIROS */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            titulo="Total Entradas"
            subtitulo="Já recebido"
            valor={brl(totalEntradas)}
            icon={TrendingUp}
            color="emerald"
          />
          <KpiCard
            titulo="Total Saídas"
            subtitulo="Despesas pagas"
            valor={brl(totalSaidas)}
            icon={TrendingDown}
            color="rose"
          />
          <KpiCard
            titulo="Saldo em Caixa"
            subtitulo="Entradas - Saídas"
            valor={brl(saldoLiquido)}
            icon={Wallet}
            color="primary"
          />
          <KpiCard
            titulo="Falta Receber"
            subtitulo="Saldo a faturar"
            valor={brl(totalFaltaReceber)}
            icon={Clock}
            color="amber"
          />
          <KpiCard
            titulo="Em Atraso"
            subtitulo="Inadimplência total"
            valor={brl(totalInadimplencia)}
            icon={AlertCircle}
            color="destructive"
            destaque={totalInadimplencia > 0}
          />
        </div>

        {/* ABAS FINANCEIRAS */}
        <Tabs defaultValue="todos">
          <div className="mb-4">
            <TabsList className="grid grid-cols-2 sm:flex w-full sm:w-auto">
              <TabsTrigger value="todos">Todas as Parcelas ({listaUnificada.length})</TabsTrigger>
              <TabsTrigger value="atrasados" className="text-destructive font-semibold">
                Atrasados ({atrasadasTotal.length + saidasAtrasadas.length})
              </TabsTrigger>
              <TabsTrigger value="entradas">Entradas Quitadas ({entradasPagas.length})</TabsTrigger>
              <TabsTrigger value="saidas">Saídas & Despesas ({despesas.length})</TabsTrigger>
            </TabsList>
          </div>

          {/* ABA 1: TODAS AS PARCELAS UNIFICADAS COM FILTROS AVANÇADOS */}
          <TabsContent value="todos" className="space-y-4">
            {/* BARRA DE FILTROS: BUSCA, GRUPO, MÊS, ANO E STATUS */}
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {/* 1. Busca por Texto */}
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, formando, pacote ou evento..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-10 text-xs"
                  />
                </div>

                {/* 2. Filtro por Grupo */}
                <Select value={filtroGrupo} onValueChange={setFiltroGrupo}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Grupo de Demanda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Grupos</SelectItem>
                    <SelectItem value="turma">🎓 Turmas</SelectItem>
                    <SelectItem value="casamento">💍 Casamentos</SelectItem>
                    <SelectItem value="festa-aniversario">🎉 Aniversários</SelectItem>
                    <SelectItem value="ensaio">📸 Ensaios</SelectItem>
                  </SelectContent>
                </Select>

                {/* 3. Filtro por Mês */}
                <Select value={filtroMes} onValueChange={setFiltroMes}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Mês de Vencimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Meses</SelectItem>
                    {MESES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 4. Filtro por Ano */}
                <Select value={filtroAno} onValueChange={setFiltroAno}>
                  <SelectTrigger className="h-10 text-xs">
                    <SelectValue placeholder="Ano de Vencimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Anos</SelectItem>
                    {anosDisponiveis.map((ano) => (
                      <SelectItem key={ano} value={ano}>
                        Ano {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs">
                {/* 5. Filtro Rápido por Status */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">Status:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant={filtroStatus === "todos" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroStatus("todos")}
                      className="h-7 text-xs px-2.5"
                    >
                      Todos
                    </Button>
                    <Button
                      variant={filtroStatus === "pendente" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroStatus("pendente")}
                      className="h-7 text-xs px-2.5"
                    >
                      Pendentes
                    </Button>
                    <Button
                      variant={filtroStatus === "pago" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroStatus("pago")}
                      className="h-7 text-xs px-2.5 text-emerald-600 dark:text-emerald-400"
                    >
                      Pagos
                    </Button>
                    <Button
                      variant={filtroStatus === "atrasado" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFiltroStatus("atrasado")}
                      className="h-7 text-xs px-2.5 text-destructive"
                    >
                      Atrasados
                    </Button>
                  </div>
                </div>

                {/* Resumo do Filtro e Botão Limpar */}
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    Exibindo <strong>{parcelasFiltradas.length}</strong> parcelas · Total: <strong>{brl(totalFiltradoValor)}</strong>
                  </span>
                  {temFiltroAtivo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={limparFiltros}
                      className="h-7 text-xs gap-1"
                    >
                      <RotateCcw className="size-3" /> Limpar Filtros
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex flex-wrap items-center justify-between gap-2">
                  <span>Quadro Unificado de Cobranças e Parcelas ({parcelasFiltradas.length})</span>
                  <div className="flex items-center gap-3 text-xs font-normal text-muted-foreground">
                    <span className="text-emerald-600 font-medium">Pago: {brl(totalFiltradoRecebido)}</span>
                    <span className="text-amber-600 font-medium">Pendente: {brl(totalFiltradoPendente)}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {parcelasFiltradas.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground">
                    <Calendar className="mx-auto size-8 opacity-30 mb-2" />
                    <p className="font-semibold text-foreground">Nenhuma parcela encontrada para os filtros aplicados</p>
                    <p className="text-xs mt-1">Tente ajustar o mês, ano, grupo ou termo de busca.</p>
                  </div>
                )}
                {parcelasFiltradas.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-[240px] flex-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{p.clienteNome}</p>
                          {getOrigemBadge(p.origem)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.tituloEvento} · {p.pacote} · {p.numeroParcela === 0 ? "Entrada" : `Parcela ${p.numeroParcela}`}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Vencimento: <strong>{dataBR(p.vencimento)}</strong>
                          {p.dataPagamento && ` · Pago em ${dataBR(p.dataPagamento)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{brl(p.valor)}</p>
                        <Badge
                          variant={p.status === "pago" ? "default" : p.status === "atrasado" ? "destructive" : "secondary"}
                          className={p.status === "pago" ? "bg-emerald-600" : ""}
                        >
                          {p.status === "pago" ? "Pago" : p.status === "atrasado" ? "Atrasado" : "Pendente"}
                        </Badge>
                      </div>

                      <Button
                        size="sm"
                        variant={p.status === "pago" ? "outline" : "default"}
                        className="h-8 text-xs"
                        onClick={() => handleToggleParcelaStatus(p)}
                      >
                        {p.status === "pago" ? "Desfazer" : "Baixar Pago"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 2: ATRASADOS & INADIMPLÊNCIA */}
          <TabsContent value="atrasados" className="space-y-4">
            <Card className="shadow-card border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <AlertCircle className="size-5" /> Parcelas e Boletos em Atraso ({atrasadasTotal.length})
                </CardTitle>
                <CardDescription>
                  Total acumulado em inadimplência: <strong>{brl(totalInadimplencia)}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {atrasadasTotal.length === 0 && (
                  <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma parcela em atraso no momento! 🎉</p>
                )}
                {atrasadasTotal.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-background p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-foreground">{p.clienteNome}</p>
                        {getOrigemBadge(p.origem)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.tituloEvento} · {p.pacote} · {p.numeroParcela === 0 ? "Entrada" : `Parcela ${p.numeroParcela}`}
                      </p>
                      <p className="text-xs text-destructive font-medium mt-1 flex items-center gap-2">
                        <span>Venceu em: {dataBR(p.vencimento)}</span>
                        {p.clienteContato && <span>· Contato: {p.clienteContato}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-base font-bold text-destructive">{brl(p.valor)}</p>
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleToggleParcelaStatus(p)}
                      >
                        Baixar Pagamento
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Saídas em atraso */}
            {saidasAtrasadas.length > 0 && (
              <Card className="shadow-card border-destructive/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-destructive">Saídas / Contas a Pagar em Atraso ({saidasAtrasadas.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {saidasAtrasadas.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-destructive/20 bg-background"
                    >
                      <div>
                        <p className="font-semibold text-sm">{d.descricao}</p>
                        <p className="text-xs text-muted-foreground">{d.categoria} · Venceu em {dataBR(d.vencimento)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-destructive text-sm">{brl(Number(d.valor))}</span>
                        <Button size="sm" variant="outline" onClick={() => baixarDespesa.mutate({ id: d.id, pago: false })}>
                          Dar Baixa
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ABA 3: ENTRADAS QUITADAS */}
          <TabsContent value="entradas" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" /> Entradas e Pagamentos Confirmados ({entradasPagas.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {entradasPagas.length === 0 && (
                  <p className="text-xs text-muted-foreground py-8 text-center">Nenhum pagamento registrado ainda.</p>
                )}
                {entradasPagas.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{p.clienteNome}</p>
                        {getOrigemBadge(p.origem)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.tituloEvento} · {p.pacote} · {p.numeroParcela === 0 ? "Entrada" : `Parcela ${p.numeroParcela}`}
                      </p>
                      <p className="text-xs text-emerald-600 font-medium">
                        Pago em: {p.dataPagamento ? dataBR(p.dataPagamento) : dataBR(p.vencimento)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground text-sm">{brl(p.valorPago)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => handleToggleParcelaStatus(p)}
                      >
                        Desfazer Pago
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA 4: SAÍDAS & DESPESAS */}
          <TabsContent value="saidas" className="space-y-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Controle de Saídas e Despesas ({despesas.length})</CardTitle>
                <Button size="sm" onClick={() => setOpenNovaDespesa(true)} className="gap-1 text-xs">
                  <Plus className="size-3.5" /> Nova Saída
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {despesas.length === 0 && (
                  <p className="text-xs text-muted-foreground py-8 text-center">Nenhuma saída registrada.</p>
                )}
                {despesas.map((d) => {
                  const pago = d.status === "pago";
                  const atrasada = !pago && d.vencimento < hoje;
                  return (
                    <div
                      key={d.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 p-3 hover:bg-muted/40 transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-sm">{d.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          Categoria: <span className="uppercase font-mono">{d.categoria}</span> · Vencimento: {dataBR(d.vencimento)}
                          {d.data_pagamento && ` · Pago em ${dataBR(d.data_pagamento)}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground">{brl(Number(d.valor))}</p>
                          <Badge variant={pago ? "default" : atrasada ? "destructive" : "secondary"}>
                            {pago ? "pago" : atrasada ? "atrasada" : "pendente"}
                          </Badge>
                        </div>

                        <Button
                          size="sm"
                          variant={pago ? "outline" : "default"}
                          className="h-8 text-xs"
                          onClick={() => baixarDespesa.mutate({ id: d.id, pago })}
                        >
                          {pago ? "Desfazer" : "Dar Baixa"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}

function KpiCard({
  titulo,
  subtitulo,
  valor,
  icon: Icon,
  color,
  destaque,
}: {
  titulo: string;
  subtitulo: string;
  valor: string;
  icon: React.ElementType;
  color: "emerald" | "rose" | "primary" | "amber" | "destructive";
  destaque?: boolean;
}) {
  const colorStyles = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    destructive: "bg-destructive/10 text-destructive",
  }[color];

  return (
    <Card className={`shadow-sm border-border/80 ${destaque ? "border-destructive/40 bg-destructive/5" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {titulo}
          </span>
          <span className={`flex size-7 items-center justify-center rounded-lg ${colorStyles}`}>
            <Icon className="size-4" />
          </span>
        </div>
        <p className={`mt-2 text-xl font-bold ${destaque ? "text-destructive" : "text-foreground"}`}>
          {valor}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{subtitulo}</p>
      </CardContent>
    </Card>
  );
}
