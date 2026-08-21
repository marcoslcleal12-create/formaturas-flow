import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CalendarDays,
  CalendarRange,
  Trash2,
  Edit,
  FileText,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PieChart as PieChartIcon,
  BarChart3,
  RotateCcw,
  Sparkles,
  Download,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, brl } from "@/components/app/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loadDemandas, type DemandaItem } from "@/lib/demandas-store";

export const Route = createFileRoute("/_authenticated/fluxo-caixa")({
  head: () => ({
    meta: [
      { title: "Fluxo de Caixa & DRE | JM Formaturas" },
      {
        name: "description",
        content: "Controle diário de entradas, saídas justificadas, saldo líquido e relatórios financeiros consolidados.",
      },
      { property: "og:title", content: "Fluxo de Caixa & DRE | JM Formaturas" },
      {
        property: "og:description",
        content: "Acompanhe receitas recebidas, despesas lançadas e saldo operacional diário, mensal e anual.",
      },
    ],
  }),
  component: FluxoCaixaPage,
});

const CATEGORIAS_DESPESA = [
  "Fornecedores de Fotografia / Álbum",
  "Equipe & Fotógrafos",
  "Decoração & Cenografia",
  "Buffet & Alimentação",
  "Espaço / Locação",
  "Som & Iluminação",
  "Transporte & Combustível",
  "Marketing & Publicidade",
  "Impostos & Taxas Bancárias",
  "Despesas Administrativas",
  "Software & Licenças",
  "Outras Despesas",
];

const FORMAS_PAGAMENTO = [
  { id: "pix", label: "Pix" },
  { id: "dinheiro", label: "Dinheiro / Espécie" },
  { id: "boleto", label: "Boleto Bancário" },
  { id: "cartao_credito", label: "Cartão de Crédito" },
  { id: "cartao_debito", label: "Cartão de Débito" },
  { id: "transferencia", label: "Transferência Bancária (TED/DOC)" },
];

const MESES = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

interface MovimentacaoCaixa {
  id: string;
  tipo: "entrada" | "saida";
  data: string; // YYYY-MM-DD
  descricao: string;
  justificativa?: string | null;
  categoria: string;
  origem: string;
  valor: number;
  forma_pagamento: string;
  status: "pago" | "pendente";
  rawDespesaId?: string;
}

export function FluxoCaixaPage() {
  const queryClient = useQueryClient();
  const hoje = new Date().toISOString().slice(0, 10);
  const anoAtual = new Date().getFullYear().toString();
  const mesAtual = String(new Date().getMonth() + 1).padStart(2, "0");

  // Filtros de período
  const [tipoFiltro, setTipoFiltro] = useState<"dia" | "mes" | "ano" | "todos">("mes");
  const [diaFiltro, setDiaFiltro] = useState<string>(hoje);
  const [mesFiltro, setMesFiltro] = useState<string>(mesAtual);
  const [anoFiltro, setAnoFiltro] = useState<string>(anoAtual);
  const [searchExtrato, setSearchExtrato] = useState<string>("");
  const [filtroTipoMov, setFiltroTipoMov] = useState<"todos" | "entrada" | "saida">("todos");

  // Modais de Saídas (Despesas)
  const [openNovaSaida, setOpenNovaSaida] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<any | null>(null);
  const [deletingDespesa, setDeletingDespesa] = useState<any | null>(null);

  // Demandas offline/localStorage
  const [demandas, setDemandas] = useState<DemandaItem[]>([]);
  useEffect(() => {
    setDemandas(loadDemandas());
  }, []);

  // Buscar dados consolidados do Supabase
  const { data, isLoading } = useQuery({
    queryKey: ["fluxo-caixa-data"],
    queryFn: async () => {
      const [contratos, despesas] = await Promise.all([
        supabase
          .from("contratos")
          .select("*, parcelas(*), alunos(id, nome_completo, turmas(nome))"),
        supabase
          .from("despesas")
          .select("*")
          .order("vencimento", { ascending: false }),
      ]);

      if (contratos.error) throw contratos.error;
      if (despesas.error) throw despesas.error;

      return {
        contratos: contratos.data ?? [],
        despesas: despesas.data ?? [],
      };
    },
  });

  const contratos = data?.contratos ?? [];
  const despesas = data?.despesas ?? [];

  // MUTAÇÕES DE SAÍDAS (DESPESAS)
  const salvarSaida = useMutation({
    mutationFn: async (formData: FormData) => {
      const descricao = (formData.get("descricao") as string)?.trim();
      const valor = parseFloat(formData.get("valor") as string);
      const categoria = (formData.get("categoria") as string) || "Outras Despesas";
      const data_pagamento = (formData.get("data_pagamento") as string) || hoje;
      const forma_pagamento = (formData.get("forma_pagamento") as string) || "pix";
      const observacao = (formData.get("observacao") as string)?.trim() || "";

      if (!descricao) throw new Error("Informe a descrição / justificativa da saída.");
      if (isNaN(valor) || valor <= 0) throw new Error("Informe um valor válido maior que zero.");

      if (editingDespesa) {
        const { error } = await supabase
          .from("despesas")
          .update({
            descricao,
            valor,
            categoria,
            vencimento: data_pagamento,
            data_pagamento,
            forma_pagamento,
            observacao,
            status: "pago",
          })
          .eq("id", editingDespesa.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("despesas").insert({
          descricao,
          valor,
          categoria,
          vencimento: data_pagamento,
          data_pagamento,
          forma_pagamento,
          observacao,
          status: "pago",
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(
        editingDespesa
          ? "Saída atualizada com sucesso!"
          : "Nova saída registrada no caixa com sucesso!"
      );
      setOpenNovaSaida(false);
      setEditingDespesa(null);
      void queryClient.invalidateQueries({ queryKey: ["fluxo-caixa-data"] });
      void queryClient.invalidateQueries({ queryKey: ["despesas"] });
    },
    onError: (err) => {
      toast.error((err as Error).message || "Erro ao registrar saída.");
    },
  });

  const excluirSaida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("despesas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saída removida do fluxo de caixa.");
      setDeletingDespesa(null);
      void queryClient.invalidateQueries({ queryKey: ["fluxo-caixa-data"] });
      void queryClient.invalidateQueries({ queryKey: ["despesas"] });
    },
    onError: (err) => {
      toast.error("Erro ao excluir saída: " + (err as Error).message);
    },
  });

  // CONSOLIDAÇÃO DE TODAS AS MOVIMENTAÇÕES (ENTRADAS E SAÍDAS)
  const todasMovimentacoes = useMemo<MovimentacaoCaixa[]>(() => {
    const list: MovimentacaoCaixa[] = [];

    // 1. Entradas das Turmas (Parcelas Pagas)
    for (const contrato of contratos) {
      const alunoNome = contrato.alunos?.nome_completo ?? "Formando";
      const turmaNome = contrato.alunos?.turmas?.nome ?? "Turma";

      // Se houver valor de entrada do contrato
      if (Number(contrato.valor_entrada) > 0) {
        const dataEntrada = contrato.created_at ? contrato.created_at.slice(0, 10) : hoje;
        list.push({
          id: `entrada-contrato-${contrato.id}`,
          tipo: "entrada",
          data: dataEntrada,
          descricao: `Entrada de Contrato - ${alunoNome}`,
          justificativa: `Valor de adesão inicial (${contrato.pacote})`,
          categoria: "Formatura (Entrada Inicial)",
          origem: `Turma: ${turmaNome}`,
          valor: Number(contrato.valor_entrada),
          forma_pagamento: contrato.forma_pagamento || "Boleto/Pix",
          status: "pago",
        });
      }

      // Parcelas pagas
      const parcelas = contrato.parcelas ?? [];
      for (const p of parcelas) {
        const isPago = p.status === "pago";
        if (isPago) {
          const dataPagto = p.data_pagamento || p.vencimento || hoje;
          const valorEfetivo = Number(p.valor_pago) > 0 ? Number(p.valor_pago) : Number(p.valor);
          list.push({
            id: `parcela-turma-${p.id}`,
            tipo: "entrada",
            data: dataPagto,
            descricao: `Mensalidade Formando #${p.numero} - ${alunoNome}`,
            justificativa: `Parcela quitada referente ao pacote ${contrato.pacote}`,
            categoria: "Formatura (Parcela)",
            origem: `Turma: ${turmaNome}`,
            valor: valorEfetivo,
            forma_pagamento: contrato.forma_pagamento || "Boleto/Pix",
            status: "pago",
          });
        }
      }
    }

    // 2. Entradas de Demandas (Casamentos, Aniversários, Ensaios)
    for (const d of demandas) {
      const tipoLabel =
        d.tipo === "casamento"
          ? "Casamento"
          : d.tipo === "festa-aniversario"
          ? "Festa de Aniversário"
          : "Ensaio Fotográfico";

      // Valor de entrada da demanda
      if (Number(d.valorEntrada) > 0) {
        const dataEntrada = d.createdAt ? d.createdAt.slice(0, 10) : hoje;
        list.push({
          id: `entrada-demanda-${d.id}`,
          tipo: "entrada",
          data: dataEntrada,
          descricao: `Entrada de Contrato - ${d.cliente}`,
          justificativa: `Entrada do evento: ${tipoLabel} (${d.pacote})`,
          categoria: `${tipoLabel} (Entrada)`,
          origem: `${tipoLabel}: ${d.cliente}`,
          valor: Number(d.valorEntrada),
          forma_pagamento: d.formaPagamento || "Pix",
          status: "pago",
        });
      }

      // Parcelas pagas da demanda
      for (const p of d.parcelas ?? []) {
        if (p.status === "pago") {
          const dataPagto = p.dataPagamento || p.vencimento || hoje;
          list.push({
            id: `parcela-demanda-${d.id}-${p.numero}`,
            tipo: "entrada",
            data: dataPagto,
            descricao: `Parcela #${p.numero} - ${d.cliente}`,
            justificativa: `Pagamento de parcela: ${tipoLabel} (${d.pacote})`,
            categoria: `${tipoLabel} (Parcela)`,
            origem: `${tipoLabel}: ${d.cliente}`,
            valor: Number(p.valor),
            forma_pagamento: d.formaPagamento || "Pix",
            status: "pago",
          });
        }
      }
    }

    // 3. Saídas / Despesas Lançadas
    for (const d of despesas) {
      const dataPagto = d.data_pagamento || d.vencimento || hoje;
      list.push({
        id: `saida-${d.id}`,
        tipo: "saida",
        data: dataPagto,
        descricao: d.descricao,
        justificativa: d.observacao || "Despesa operacional / fornecedor",
        categoria: d.categoria || "Outras Despesas",
        origem: d.turma_id ? "Turma Específica" : "Geral / Empresa",
        valor: Number(d.valor),
        forma_pagamento: d.forma_pagamento || "Pix",
        status: d.status === "pago" ? "pago" : "pendente",
        rawDespesaId: d.id,
      });
    }

    // Ordenar decrescente por data
    return list.sort((a, b) => b.data.localeCompare(a.data));
  }, [contratos, demandas, despesas, hoje]);

  // FILTRAGEM POR PERÍODO (DIA, MÊS, ANO OU TODOS)
  const movimentacoesFiltradas = useMemo(() => {
    return todasMovimentacoes.filter((m) => {
      // Filtro de texto da busca
      if (searchExtrato.trim()) {
        const query = searchExtrato.toLowerCase();
        const matches =
          m.descricao.toLowerCase().includes(query) ||
          (m.justificativa && m.justificativa.toLowerCase().includes(query)) ||
          m.categoria.toLowerCase().includes(query) ||
          m.origem.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Filtro de tipo (entrada ou saída)
      if (filtroTipoMov !== "todos" && m.tipo !== filtroTipoMov) {
        return false;
      }

      // Filtro Temporal
      if (tipoFiltro === "dia") {
        return m.data === diaFiltro;
      } else if (tipoFiltro === "mes") {
        const prefix = `${anoFiltro}-${mesFiltro}`;
        return m.data.startsWith(prefix);
      } else if (tipoFiltro === "ano") {
        return m.data.startsWith(anoFiltro);
      }

      return true; // 'todos'
    });
  }, [todasMovimentacoes, searchExtrato, filtroTipoMov, tipoFiltro, diaFiltro, mesFiltro, anoFiltro]);

  // MÉTRICAS DO PERÍODO SELECIONADO
  const metricas = useMemo(() => {
    let entradas = 0;
    let saidas = 0;

    for (const m of movimentacoesFiltradas) {
      if (m.tipo === "entrada") {
        entradas += m.valor;
      } else {
        saidas += m.valor;
      }
    }

    const saldo = entradas - saidas;
    const margem = entradas > 0 ? (saldo / entradas) * 100 : saldo < 0 ? -100 : 0;

    return {
      totalEntradas: entradas,
      totalSaidas: saidas,
      saldoLiquido: saldo,
      margemLucro: margem,
      quantidadeMov: movimentacoesFiltradas.length,
      qtdEntradas: movimentacoesFiltradas.filter((m) => m.tipo === "entrada").length,
      qtdSaidas: movimentacoesFiltradas.filter((m) => m.tipo === "saida").length,
    };
  }, [movimentacoesFiltradas]);

  // DADOS PARA OS GRÁFICOS (POR DIA DO MÊS OU POR MÊS DO ANO)
  const dadosGrafico = useMemo(() => {
    if (tipoFiltro === "dia") {
      // No filtro por dia, compara Entrada vs Saída do dia
      return [
        {
          name: diaFiltro.split("-").reverse().join("/"),
          Entradas: metricas.totalEntradas,
          Saídas: metricas.totalSaidas,
          Saldo: metricas.saldoLiquido,
        },
      ];
    }

    if (tipoFiltro === "mes") {
      // Agrupa pelos dias daquele mês
      const mapDias = new Map<string, { Entradas: number; Saídas: number }>();
      const totalDias = new Date(Number(anoFiltro), Number(mesFiltro), 0).getDate();

      for (let d = 1; d <= totalDias; d++) {
        const diaStr = String(d).padStart(2, "0");
        mapDias.set(diaStr, { Entradas: 0, Saídas: 0 });
      }

      for (const m of movimentacoesFiltradas) {
        const dia = m.data.slice(8, 10);
        if (mapDias.has(dia)) {
          const cur = mapDias.get(dia)!;
          if (m.tipo === "entrada") cur.Entradas += m.valor;
          else cur.Saídas += m.valor;
        }
      }

      return Array.from(mapDias.entries()).map(([dia, vals]) => ({
        name: `Dia ${dia}`,
        Entradas: vals.Entradas,
        Saídas: vals.Saídas,
        Saldo: vals.Entradas - vals.Saídas,
      }));
    }

    if (tipoFiltro === "ano" || tipoFiltro === "todos") {
      // Agrupa por mês do ano selecionado
      const mapMeses = new Map<string, { Entradas: number; Saídas: number }>();
      for (const mes of MESES) {
        mapMeses.set(mes.value, { Entradas: 0, Saídas: 0 });
      }

      for (const m of movimentacoesFiltradas) {
        const mes = m.data.slice(5, 7);
        if (mapMeses.has(mes)) {
          const cur = mapMeses.get(mes)!;
          if (m.tipo === "entrada") cur.Entradas += m.valor;
          else cur.Saídas += m.valor;
        }
      }

      return MESES.map((mes) => {
        const vals = mapMeses.get(mes.value) || { Entradas: 0, Saídas: 0 };
        return {
          name: mes.label.slice(0, 3),
          Entradas: vals.Entradas,
          Saídas: vals.Saídas,
          Saldo: vals.Entradas - vals.Saídas,
        };
      });
    }

    return [];
  }, [tipoFiltro, diaFiltro, mesFiltro, anoFiltro, movimentacoesFiltradas, metricas]);

  // CATEGORIAS DE SAÍDAS PARA RESUMO
  const resumoCategoriasSaida = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of movimentacoesFiltradas) {
      if (m.tipo === "saida") {
        map.set(m.categoria, (map.get(m.categoria) || 0) + m.valor);
      }
    }
    return Array.from(map.entries())
      .map(([cat, total]) => ({
        categoria: cat,
        total,
        percentual: metricas.totalSaidas > 0 ? (total / metricas.totalSaidas) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [movimentacoesFiltradas, metricas.totalSaidas]);

  const labelPeriodo = useMemo(() => {
    if (tipoFiltro === "dia") {
      const [y, m, d] = diaFiltro.split("-");
      return `Dia ${d}/${m}/${y}`;
    }
    if (tipoFiltro === "mes") {
      const nomeMes = MESES.find((m) => m.value === mesFiltro)?.label ?? mesFiltro;
      return `${nomeMes} de ${anoFiltro}`;
    }
    if (tipoFiltro === "ano") {
      return `Ano de ${anoFiltro}`;
    }
    return "Todo o Período";
  }, [tipoFiltro, diaFiltro, mesFiltro, anoFiltro]);

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* CABEÇALHO */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20">
                <ArrowLeftRight className="size-5" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight">Fluxo de Caixa Diário & DRE</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Controle detalhado de entradas recebidas, saídas justificadas e saldo operacional líquido.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={openNovaSaida} onOpenChange={setOpenNovaSaida}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingDespesa(null);
                    setOpenNovaSaida(true);
                  }}
                  className="gap-2 bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  <Plus className="size-4" /> Nova Saída / Despesa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-rose-600">
                    <ArrowDownLeft className="size-5" />
                    {editingDespesa ? "Editar Saída / Despesa" : "Lançar Nova Saída / Despesa"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  id="form-saida"
                  className="space-y-3.5 py-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    salvarSaida.mutate(new FormData(e.currentTarget));
                  }}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="descricao" className="text-xs font-semibold">
                      Descrição da Despesa / Saída *
                    </Label>
                    <Input
                      id="descricao"
                      name="descricao"
                      placeholder="Ex: Pagamento Álbum Gráfica, Cachê Fotógrafo..."
                      defaultValue={editingDespesa?.descricao || ""}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="valor" className="text-xs font-semibold">
                        Valor da Saída (R$) *
                      </Label>
                      <Input
                        id="valor"
                        name="valor"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        defaultValue={editingDespesa?.valor || ""}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="data_pagamento" className="text-xs font-semibold">
                        Data do Pagamento *
                      </Label>
                      <Input
                        id="data_pagamento"
                        name="data_pagamento"
                        type="date"
                        defaultValue={
                          editingDespesa?.data_pagamento || editingDespesa?.vencimento || hoje
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="categoria" className="text-xs font-semibold">
                      Categoria da Despesa *
                    </Label>
                    <select
                      id="categoria"
                      name="categoria"
                      defaultValue={editingDespesa?.categoria || "Fornecedores de Fotografia / Álbum"}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                    >
                      {CATEGORIAS_DESPESA.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="forma_pagamento" className="text-xs font-semibold">
                      Forma de Pagamento
                    </Label>
                    <select
                      id="forma_pagamento"
                      name="forma_pagamento"
                      defaultValue={editingDespesa?.forma_pagamento || "pix"}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                    >
                      {FORMAS_PAGAMENTO.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="observacao" className="text-xs font-semibold">
                      Justificativa / Observações Detalhadas
                    </Label>
                    <Textarea
                      id="observacao"
                      name="observacao"
                      placeholder="Descreva a justificativa desta despesa, número de nota fiscal ou informações adicionais..."
                      defaultValue={editingDespesa?.observacao || ""}
                      rows={3}
                      className="text-xs resize-none"
                    />
                  </div>
                </form>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpenNovaSaida(false);
                      setEditingDespesa(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    form="form-saida"
                    disabled={salvarSaida.isPending}
                    className="bg-rose-600 hover:bg-rose-700 text-white"
                  >
                    {salvarSaida.isPending ? "Salvando..." : "Confirmar Lançamento"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* BARRA DE FILTROS TEMPORAIS (DIA, MÊS, ANO) */}
        <Card className="shadow-card border-border/80 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Seleção do Modo de Filtro */}
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase text-muted-foreground">Filtrar por:</span>
                <Tabs
                  value={tipoFiltro}
                  onValueChange={(v) => setTipoFiltro(v as any)}
                  className="w-auto"
                >
                  <TabsList className="h-8">
                    <TabsTrigger value="dia" className="text-xs px-3 h-7 gap-1">
                      <Calendar className="size-3.5" /> Dia
                    </TabsTrigger>
                    <TabsTrigger value="mes" className="text-xs px-3 h-7 gap-1">
                      <CalendarDays className="size-3.5" /> Mês
                    </TabsTrigger>
                    <TabsTrigger value="ano" className="text-xs px-3 h-7 gap-1">
                      <CalendarRange className="size-3.5" /> Ano
                    </TabsTrigger>
                    <TabsTrigger value="todos" className="text-xs px-3 h-7">
                      Geral (Todos)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Controles Dinâmicos de Seleção de Período */}
              <div className="flex flex-wrap items-center gap-3">
                {tipoFiltro === "dia" && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="filtro-dia" className="text-xs font-medium">
                      Data:
                    </Label>
                    <Input
                      id="filtro-dia"
                      type="date"
                      value={diaFiltro}
                      onChange={(e) => setDiaFiltro(e.target.value)}
                      className="h-8 text-xs w-38 bg-background"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDiaFiltro(hoje)}
                      className="h-8 text-xs px-2.5"
                    >
                      Hoje
                    </Button>
                  </div>
                )}

                {(tipoFiltro === "mes" || tipoFiltro === "ano") && (
                  <>
                    {tipoFiltro === "mes" && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="filtro-mes" className="text-xs font-medium">
                          Mês:
                        </Label>
                        <select
                          id="filtro-mes"
                          value={mesFiltro}
                          onChange={(e) => setMesFiltro(e.target.value)}
                          className="h-8 rounded-md border border-input bg-background px-2.5 text-xs"
                        >
                          {MESES.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Label htmlFor="filtro-ano" className="text-xs font-medium">
                        Ano:
                      </Label>
                      <select
                        id="filtro-ano"
                        value={anoFiltro}
                        onChange={(e) => setAnoFiltro(e.target.value)}
                        className="h-8 rounded-md border border-input bg-background px-2.5 text-xs"
                      >
                        {["2024", "2025", "2026", "2027", "2028", "2029", "2030"].map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <Badge variant="outline" className="bg-primary/5 text-primary text-xs font-semibold px-2.5 py-1">
                  Exibindo: {labelPeriodo}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4 CARDS DE INDICADORES / MÉTRICAS PRINCIPAIS */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Entradas */}
          <Card className="shadow-card border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Entradas (Receitas)
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <ArrowUpRight className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {brl(metricas.totalEntradas)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metricas.qtdEntradas} {metricas.qtdEntradas === 1 ? "pagamento recebido" : "pagamentos recebidos"}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Saídas */}
          <Card className="shadow-card border-rose-500/20 bg-rose-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Saídas (Despesas)
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                <ArrowDownLeft className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                {brl(metricas.totalSaidas)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metricas.qtdSaidas} {metricas.qtdSaidas === 1 ? "saída justificada" : "saídas justificadas"}
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Saldo Líquido (Entradas - Saídas) */}
          <Card
            className={`shadow-card ${
              metricas.saldoLiquido >= 0
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-rose-500/40 bg-rose-500/10"
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Saldo Líquido (Caixa)
              </CardTitle>
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${
                  metricas.saldoLiquido >= 0
                    ? "bg-emerald-500/20 text-emerald-600"
                    : "bg-rose-500/20 text-rose-600"
                }`}
              >
                <Wallet className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  metricas.saldoLiquido >= 0
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-rose-700 dark:text-rose-400"
                }`}
              >
                {brl(metricas.saldoLiquido)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metricas.saldoLiquido >= 0 ? "Resultado positivo no período" : "Déficit operacional no período"}
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Margem Operacional */}
          <Card className="shadow-card border-brand/20 bg-brand/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Margem Líquida
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand dark:text-gold">
                <TrendingUp className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metricas.margemLucro.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de {metricas.quantidadeMov} lançamentos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* DASHBOARD GRÁFICO: ENTRADAS VS SAÍDAS VS SALDO */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" />
                Demonstrativo de Fluxo de Caixa ({labelPeriodo})
              </CardTitle>
              <CardDescription className="text-xs">
                Comparativo cronológico de entradas recebidas, despesas efetuadas e saldo acumulado.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {dadosGrafico.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed rounded-lg">
                Nenhum dado registrado para este período.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosGrafico} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" fontSize={11} stroke="#888888" tickLine={false} />
                    <YAxis
                      fontSize={11}
                      stroke="#888888"
                      tickLine={false}
                      tickFormatter={(val) => `R$${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    />
                    <Tooltip
                      formatter={(value: any) => [brl(Number(value)), ""]}
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        borderColor: "#334155",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Bar dataKey="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} name="Entradas (Receitas)" />
                    <Bar dataKey="Saídas" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Saídas (Despesas)" />
                    <Bar dataKey="Saldo" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Saldo Líquido" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* DISTRIBUIÇÃO DE DESPESAS POR CATEGORIA (JUSTIFICATIVAS) */}
        {resumoCategoriasSaida.length > 0 && (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <PieChartIcon className="size-4 text-rose-500" />
                Detalhamento de Saídas por Categoria / Justificativa
              </CardTitle>
              <CardDescription className="text-xs">
                Onde os recursos da empresa estão sendo aplicados no período.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {resumoCategoriasSaida.map((item) => (
                  <div
                    key={item.categoria}
                    className="p-3 rounded-lg border border-border/70 bg-card flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-foreground">{item.categoria}</span>
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 shrink-0">
                        {item.percentual.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                        {brl(item.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* EXTRATO COMPLETO / TABELA UNIFICADA DE MOVIMENTAÇÕES */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Extrato Consolidado de Movimentações ({movimentacoesFiltradas.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Entradas diárias e saídas justificadas ordenadas cronologicamente.
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Filtro Entrada / Saída */}
                <select
                  value={filtroTipoMov}
                  onChange={(e) => setFiltroTipoMov(e.target.value as any)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="todos">Todas as movimentações</option>
                  <option value="entrada">Apenas Entradas (Receitas)</option>
                  <option value="saida">Apenas Saídas (Despesas)</option>
                </select>

                {/* Busca no Extrato */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar no extrato..."
                    value={searchExtrato}
                    onChange={(e) => setSearchExtrato(e.target.value)}
                    className="h-8 pl-8 text-xs w-48 bg-background"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {movimentacoesFiltradas.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma movimentação financeira encontrada para os filtros selecionados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider border-y border-border/60">
                    <tr>
                      <th className="py-2.5 px-4">Data</th>
                      <th className="py-2.5 px-3">Tipo</th>
                      <th className="py-2.5 px-4">Descrição / Origem</th>
                      <th className="py-2.5 px-3">Categoria / Justificativa</th>
                      <th className="py-2.5 px-3">Pagamento</th>
                      <th className="py-2.5 px-4 text-right">Valor</th>
                      <th className="py-2.5 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {movimentacoesFiltradas.map((m) => (
                      <tr
                        key={m.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          m.tipo === "entrada" ? "bg-emerald-500/[0.02]" : "bg-rose-500/[0.02]"
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-medium text-foreground whitespace-nowrap">
                          {m.data.split("-").reverse().join("/")}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {m.tipo === "entrada" ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-0 px-2 gap-1 font-semibold">
                              <ArrowUpRight className="size-3" /> Entrada
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] py-0 px-2 gap-1 font-semibold">
                              <ArrowDownLeft className="size-3" /> Saída
                            </Badge>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-semibold text-foreground">{m.descricao}</p>
                          <p className="text-[11px] text-muted-foreground">{m.origem}</p>
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-medium text-foreground">{m.categoria}</p>
                          {m.justificativa && (
                            <p className="text-[11px] text-muted-foreground italic truncate max-w-xs">
                              "{m.justificativa}"
                            </p>
                          )}
                        </td>

                        <td className="py-3 px-3 text-muted-foreground capitalize">
                          {m.forma_pagamento}
                        </td>

                        <td
                          className={`py-3 px-4 text-right font-bold text-sm whitespace-nowrap ${
                            m.tipo === "entrada"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {m.tipo === "entrada" ? `+ ${brl(m.valor)}` : `- ${brl(m.valor)}`}
                        </td>

                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          {m.rawDespesaId ? (
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  const raw = despesas.find((d) => d.id === m.rawDespesaId);
                                  if (raw) {
                                    setEditingDespesa(raw);
                                    setOpenNovaSaida(true);
                                  }
                                }}
                                title="Editar Saída"
                              >
                                <Edit className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  const raw = despesas.find((d) => d.id === m.rawDespesaId);
                                  if (raw) setDeletingDespesa(raw);
                                }}
                                title="Excluir Saída"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/60 italic">Automático</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* DIALOG DE CONFIRMAÇÃO PARA EXCLUSÃO DE SAÍDA */}
        <AlertDialog open={!!deletingDespesa} onOpenChange={(open) => !open && setDeletingDespesa(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="size-5" /> Excluir Lançamento de Saída
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a saída{" "}
                <strong>"{deletingDespesa?.descricao}"</strong> no valor de{" "}
                <strong>{brl(Number(deletingDespesa?.valor || 0))}</strong>? Esta ação removerá este valor do
                cálculo do fluxo de caixa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletingDespesa && excluirSaida.mutate(deletingDespesa.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, Excluir Saída
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
