import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  CalendarDays,
  Trash2,
  Edit,
  FileText,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Sparkles,
  Printer,
  ChevronRight,
  BadgePercent,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertTriangle,
  Receipt,
  Phone,
  QrCode,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
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
import {
  getColaboradores,
  getLancamentos,
  addColaborador,
  updateColaborador,
  deleteColaborador,
  addLancamento,
  deleteLancamento,
  calcularTotaisColaborador,
  type Colaborador,
  type LancamentoColaborador,
  type CategoriaEntrada,
  type CategoriaSaida,
} from "@/lib/colaboradores-store";

export const Route = createFileRoute("/_authenticated/colaboradores")({
  head: () => ({
    meta: [
      { title: "Colaboradores & Folha | JM Formaturas" },
      {
        name: "description",
        content: "Gestão de equipe, salários, freelas, horas extras, vales e cálculo líquido final.",
      },
      { property: "og:title", content: "Colaboradores & Folha | JM Formaturas" },
      {
        property: "og:description",
        content: "Controle de colaboradores, adicionais extras e vales por colaborador.",
      },
    ],
  }),
  component: ColaboradoresPage,
});

const CATEGORIAS_ENTRADA: CategoriaEntrada[] = [
  "Freelancer",
  "Horas Extras",
  "Comissão",
  "Bônus / Premiação",
  "Diária Externa",
  "Reembolso",
  "Outros Acréscimos",
];

const CATEGORIAS_SAIDA: CategoriaSaida[] = [
  "Vale / Adiantamento",
  "Desconto de Falta",
  "Adiantamento Salarial",
  "Atrasos / Deduções",
  "Empréstimo",
  "Outros Descontos",
];

const FUNCOES_SUGERIDAS = [
  "Fotógrafo Principal",
  "Fotógrafo Assistente",
  "Editor de Vídeo & Reels",
  "Designer & Tratamento de Álbuns",
  "Cerimonialista & Produção",
  "Coordenador de Eventos",
  "Atendimento & Comercial",
  "Assistente de Iluminação / Produção",
  "Financeiro & Administrativo",
];

function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [lancamentos, setLancamentos] = useState<LancamentoColaborador[]>([]);
  const [activeTab, setActiveTab] = useState<"colaboradores" | "lancamentos" | "holerite">("colaboradores");

  // Filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativo" | "inativo">("todos");
  const [filtroMes, setFiltroMes] = useState<string>("mes_atual");
  const [filtroTipoLancamento, setFiltroTipoLancamento] = useState<"todos" | "entrada" | "saida">("todos");
  const [filtroColaboradorLancamento, setFiltroColaboradorLancamento] = useState<string>("todos");

  // Modais de Colaborador
  const [isColabDialogOpen, setIsColabDialogOpen] = useState(false);
  const [editingColab, setEditingColab] = useState<Colaborador | null>(null);
  const [colabFormData, setColabFormData] = useState({
    nome: "",
    funcao: "",
    salarioBase: "",
    telefone: "",
    chavePix: "",
    email: "",
    dataAdmissao: new Date().toISOString().split("T")[0],
    observacoes: "",
    status: "ativo" as "ativo" | "inativo",
  });

  // Modais de Lançamento (Entrada/Saída)
  const [isLancamentoDialogOpen, setIsLancamentoDialogOpen] = useState(false);
  const [selectedColabForLancamento, setSelectedColabForLancamento] = useState<string>("");
  const [lancamentoFormData, setLancamentoFormData] = useState({
    colaboradorId: "",
    tipo: "entrada" as "entrada" | "saida",
    categoria: "Freelancer",
    descricao: "",
    valor: "",
    data: new Date().toISOString().split("T")[0],
  });

  // Modal de Extrato / Detalhes
  const [selectedColabForDetails, setSelectedColabForDetails] = useState<Colaborador | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Confirmação para Deletar
  const [colabToDelete, setColabToDelete] = useState<Colaborador | null>(null);
  const [lancamentoToDelete, setLancamentoToDelete] = useState<LancamentoColaborador | null>(null);

  // Carregar dados
  const recarregarDados = () => {
    setColaboradores(getColaboradores());
    setLancamentos(getLancamentos());
  };

  useEffect(() => {
    recarregarDados();
  }, []);

  // Determina mês de referência atual (YYYY-MM)
  const hoje = new Date();
  const mesAtualStr = hoje.toISOString().substring(0, 7);

  // Lista de meses disponíveis para filtro
  const mesesOpcoes = useMemo(() => {
    const mesesSet = new Set<string>();
    mesesSet.add(mesAtualStr);

    lancamentos.forEach((l) => {
      if (l.referenciaMesAno) mesesSet.add(l.referenciaMesAno);
      else if (l.data) mesesSet.add(l.data.substring(0, 7));
    });

    const ordenados = Array.from(mesesSet).sort().reverse();
    return ordenados;
  }, [lancamentos, mesAtualStr]);

  const mesFiltroAtivo = useMemo(() => {
    if (filtroMes === "mes_atual") return mesAtualStr;
    if (filtroMes === "todos") return "todos";
    return filtroMes;
  }, [filtroMes, mesAtualStr]);

  const formatarMesNome = (anoMes: string) => {
    if (anoMes === "todos") return "Todos os Períodos";
    const partes = anoMes.split("-");
    const ano = parseInt(partes[0] ?? "2026", 10);
    const mes = parseInt(partes[1] ?? "1", 10);
    const data = new Date(ano, mes - 1, 1);
    return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  // Cálculos de resumo geral
  const totaisGerais = useMemo(() => {
    const colabsAtivos = colaboradores.filter((c) => c.status === "ativo");
    const totalSalarioBase = colabsAtivos.reduce((acc, c) => acc + (Number(c.salarioBase) || 0), 0);

    const lancamentosFiltrados = lancamentos.filter((l) => {
      if (mesFiltroAtivo !== "todos") {
        const ref = l.referenciaMesAno || l.data.substring(0, 7);
        if (ref !== mesFiltroAtivo) return false;
      }
      return true;
    });

    const totalEntradas = lancamentosFiltrados
      .filter((l) => l.tipo === "entrada")
      .reduce((acc, l) => acc + (Number(l.valor) || 0), 0);

    const totalSaidas = lancamentosFiltrados
      .filter((l) => l.tipo === "saida")
      .reduce((acc, l) => acc + (Number(l.valor) || 0), 0);

    const totalLiquidoFinal = Math.max(0, totalSalarioBase + totalEntradas - totalSaidas);

    return {
      qtdAtivos: colabsAtivos.length,
      qtdInativos: colaboradores.length - colabsAtivos.length,
      totalSalarioBase,
      totalEntradas,
      totalSaidas,
      totalLiquidoFinal,
      qtdLancamentos: lancamentosFiltrados.length,
    };
  }, [colaboradores, lancamentos, mesFiltroAtivo]);

  // Lista filtrada de colaboradores
  const colaboradoresFiltrados = useMemo(() => {
    return colaboradores.filter((colab) => {
      if (filtroStatus !== "todos" && colab.status !== filtroStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNome = colab.nome.toLowerCase().includes(q);
        const matchFuncao = colab.funcao.toLowerCase().includes(q);
        const matchPix = (colab.chavePix || "").toLowerCase().includes(q);
        if (!matchNome && !matchFuncao && !matchPix) return false;
      }
      return true;
    });
  }, [colaboradores, filtroStatus, searchQuery]);

  // Lista filtrada de lançamentos
  const lancamentosFiltradosLista = useMemo(() => {
    return lancamentos.filter((l) => {
      if (filtroTipoLancamento !== "todos" && l.tipo !== filtroTipoLancamento) return false;
      if (filtroColaboradorLancamento !== "todos" && l.colaboradorId !== filtroColaboradorLancamento) return false;
      if (mesFiltroAtivo !== "todos") {
        const ref = l.referenciaMesAno || l.data.substring(0, 7);
        if (ref !== mesFiltroAtivo) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const colab = colaboradores.find((c) => c.id === l.colaboradorId);
        const matchColab = colab?.nome.toLowerCase().includes(q);
        const matchDesc = l.descricao.toLowerCase().includes(q);
        const matchCat = l.categoria.toLowerCase().includes(q);
        if (!matchColab && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [lancamentos, filtroTipoLancamento, filtroColaboradorLancamento, mesFiltroAtivo, searchQuery, colaboradores]);

  // Handlers para Colaboradores
  const handleOpenNewColab = () => {
    setEditingColab(null);
    setColabFormData({
      nome: "",
      funcao: "",
      salarioBase: "",
      telefone: "",
      chavePix: "",
      email: "",
      dataAdmissao: new Date().toISOString().split("T")[0],
      observacoes: "",
      status: "ativo",
    });
    setIsColabDialogOpen(true);
  };

  const handleOpenEditColab = (c: Colaborador) => {
    setEditingColab(c);
    setColabFormData({
      nome: c.nome,
      funcao: c.funcao,
      salarioBase: String(c.salarioBase),
      telefone: c.telefone || "",
      chavePix: c.chavePix || "",
      email: c.email || "",
      dataAdmissao: c.dataAdmissao || new Date().toISOString().split("T")[0],
      observacoes: c.observacoes || "",
      status: c.status,
    });
    setIsColabDialogOpen(true);
  };

  const handleSaveColaborador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colabFormData.nome.trim()) {
      toast.error("Nome do colaborador é obrigatório");
      return;
    }
    if (!colabFormData.funcao.trim()) {
      toast.error("Função / Cargo é obrigatório");
      return;
    }
    const salarioNum = parseFloat(colabFormData.salarioBase.replace(",", ".")) || 0;

    if (editingColab) {
      updateColaborador(editingColab.id, {
        nome: colabFormData.nome.trim(),
        funcao: colabFormData.funcao.trim(),
        salarioBase: salarioNum,
        telefone: colabFormData.telefone.trim() || undefined,
        chavePix: colabFormData.chavePix.trim() || undefined,
        email: colabFormData.email.trim() || undefined,
        dataAdmissao: colabFormData.dataAdmissao || undefined,
        observacoes: colabFormData.observacoes.trim() || undefined,
        status: colabFormData.status,
      });
      toast.success(`Colaborador "${colabFormData.nome}" atualizado com sucesso!`);
    } else {
      addColaborador({
        nome: colabFormData.nome.trim(),
        funcao: colabFormData.funcao.trim(),
        salarioBase: salarioNum,
        telefone: colabFormData.telefone.trim() || undefined,
        chavePix: colabFormData.chavePix.trim() || undefined,
        email: colabFormData.email.trim() || undefined,
        dataAdmissao: colabFormData.dataAdmissao || undefined,
        observacoes: colabFormData.observacoes.trim() || undefined,
        status: colabFormData.status,
      });
      toast.success(`Colaborador "${colabFormData.nome}" cadastrado com sucesso!`);
    }

    recarregarDados();
    setIsColabDialogOpen(false);
  };

  const handleConfirmDeleteColaborador = () => {
    if (!colabToDelete) return;
    deleteColaborador(colabToDelete.id);
    toast.success(`Colaborador "${colabToDelete.nome}" removido.`);
    setColabToDelete(null);
    if (selectedColabForDetails?.id === colabToDelete.id) {
      setIsDetailsOpen(false);
    }
    recarregarDados();
  };

  // Handlers para Lançamentos
  const handleOpenNewLancamento = (colaboradorId?: string, tipoPadrao: "entrada" | "saida" = "entrada") => {
    const colabId = colaboradorId || (colaboradores[0]?.id ?? "");
    setSelectedColabForLancamento(colabId);
    setLancamentoFormData({
      colaboradorId: colabId,
      tipo: tipoPadrao,
      categoria: tipoPadrao === "entrada" ? "Freelancer" : "Vale / Adiantamento",
      descricao: "",
      valor: "",
      data: new Date().toISOString().split("T")[0],
    });
    setIsLancamentoDialogOpen(true);
  };

  const handleSaveLancamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lancamentoFormData.colaboradorId) {
      toast.error("Selecione um colaborador");
      return;
    }
    const valorNum = parseFloat(lancamentoFormData.valor.replace(",", ".")) || 0;
    if (valorNum <= 0) {
      toast.error("O valor deve ser maior que zero");
      return;
    }
    if (!lancamentoFormData.descricao.trim()) {
      toast.error("Informe uma descrição / justificativa");
      return;
    }

    addLancamento({
      colaboradorId: lancamentoFormData.colaboradorId,
      tipo: lancamentoFormData.tipo,
      categoria: lancamentoFormData.categoria,
      descricao: lancamentoFormData.descricao.trim(),
      valor: valorNum,
      data: lancamentoFormData.data || new Date().toISOString().split("T")[0] || "2026-08-21",
    });

    const colab = colaboradores.find((c) => c.id === lancamentoFormData.colaboradorId);
    const tipoTxt = lancamentoFormData.tipo === "entrada" ? "Acréscimo (+)" : "Vale/Desconto (-)";
    toast.success(`Lançamento de ${tipoTxt} registrado para ${colab?.nome || "colaborador"}!`);

    recarregarDados();
    setIsLancamentoDialogOpen(false);
  };

  const handleConfirmDeleteLancamento = () => {
    if (!lancamentoToDelete) return;
    deleteLancamento(lancamentoToDelete.id);
    toast.success("Lançamento removido com sucesso!");
    setLancamentoToDelete(null);
    recarregarDados();
  };

  const handleOpenExtrato = (colab: Colaborador) => {
    setSelectedColabForDetails(colab);
    setIsDetailsOpen(true);
  };

  return (
    <AppShell>
      <div className="space-y-6 pb-12">
        {/* Cabeçalho Principal */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-gold/20 text-brand dark:text-gold border border-brand/20 shadow-sm">
                <Users className="size-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Colaboradores & Folha
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestão da equipe, salários base, adicionais (freelancer e horas extras) e vales com cálculo líquido final.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Seletor de Período / Mês */}
            <Select value={filtroMes} onValueChange={setFiltroMes}>
              <SelectTrigger className="w-[180px] bg-background">
                <Calendar className="mr-2 size-4 text-brand dark:text-gold" />
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes_atual">Mês Atual ({formatarMesNome(mesAtualStr)})</SelectItem>
                <SelectItem value="todos">Todos os Períodos</SelectItem>
                {mesesOpcoes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {formatarMesNome(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => handleOpenNewLancamento(undefined, "entrada")}
              className="gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
            >
              <Plus className="size-4" />
              <span>+ Lançamento</span>
            </Button>

            <Button
              onClick={handleOpenNewColab}
              className="gap-2 bg-brand hover:bg-brand/90 text-white shadow-sm"
            >
              <UserPlus className="size-4" />
              <span>Novo Colaborador</span>
            </Button>
          </div>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Card 1: Equipe */}
          <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Colaboradores
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <Users className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totaisGerais.qtdAtivos}{" "}
                <span className="text-xs font-normal text-muted-foreground">ativos</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {totaisGerais.qtdInativos > 0 ? `${totaisGerais.qtdInativos} inativo(s)` : "100% da equipe ativa"}
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Salário Base */}
          <Card className="border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Salários Base
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <Wallet className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {brl(totaisGerais.totalSalarioBase)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Folha base de colaboradores ativos
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Entradas / Freelas / Horas Extras (+) */}
          <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                (+) Entradas / Extras
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                +{brl(totaisGerais.totalEntradas)}
              </div>
              <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">
                Freelancers, horas extras e comissões
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Saídas / Vales (-) */}
          <Card className="border-rose-500/20 bg-rose-500/5 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                (-) Vales & Descontos
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <ArrowDownLeft className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                -{brl(totaisGerais.totalSaidas)}
              </div>
              <p className="mt-1 text-xs text-rose-700/80 dark:text-rose-300/80">
                Vales adiantados e descontos
              </p>
            </CardContent>
          </Card>

          {/* Card 5: Total Líquido Final a Pagar (=) */}
          <Card className="border-brand/30 bg-gradient-to-br from-brand/10 via-brand/5 to-gold/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-gold">
                (=) Total Líquido
              </CardTitle>
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand/20 text-brand dark:text-gold">
                <Receipt className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {brl(totaisGerais.totalLiquidoFinal)}
              </div>
              <p className="mt-1 text-xs font-medium text-brand dark:text-gold">
                Salário + Extras - Vales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Abas e Listagens */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-3">
            <TabsList className="bg-muted/80 p-1">
              <TabsTrigger value="colaboradores" className="gap-2 text-xs sm:text-sm">
                <Users className="size-4" />
                <span>Colaboradores & Folha ({colaboradoresFiltrados.length})</span>
              </TabsTrigger>
              <TabsTrigger value="lancamentos" className="gap-2 text-xs sm:text-sm">
                <Layers className="size-4" />
                <span>Histórico de Lançamentos ({lancamentosFiltradosLista.length})</span>
              </TabsTrigger>
              <TabsTrigger value="holerite" className="gap-2 text-xs sm:text-sm">
                <Printer className="size-4" />
                <span>Extratos & Relatórios</span>
              </TabsTrigger>
            </TabsList>

            {/* Barra de Pesquisa e Filtros */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[220px]">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar colaborador ou função..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs sm:text-sm h-9"
                />
              </div>

              {activeTab === "colaboradores" && (
                <Select value={filtroStatus} onValueChange={(v) => setFiltroStatus(v as any)}>
                  <SelectTrigger className="w-[130px] h-9 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="ativo">Apenas Ativos</SelectItem>
                    <SelectItem value="inativo">Apenas Inativos</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {activeTab === "lancamentos" && (
                <>
                  <Select value={filtroTipoLancamento} onValueChange={(v) => setFiltroTipoLancamento(v as any)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="Tipo Lançamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Tipos</SelectItem>
                      <SelectItem value="entrada">Acréscimos (+)</SelectItem>
                      <SelectItem value="saida">Vales / Saídas (-)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filtroColaboradorLancamento} onValueChange={setFiltroColaboradorLancamento}>
                    <SelectTrigger className="w-[160px] h-9 text-xs">
                      <SelectValue placeholder="Colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos Colaboradores</SelectItem>
                      {colaboradores.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>

          {/* ABA 1: Colaboradores & Folha */}
          <TabsContent value="colaboradores" className="mt-4 space-y-4">
            {colaboradoresFiltrados.length === 0 ? (
              <Card className="p-8 text-center border-dashed">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                  <Users className="size-6 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-base font-semibold">Nenhum colaborador encontrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cadastre um novo membro da equipe ou ajuste os filtros de busca.
                </p>
                <Button onClick={handleOpenNewColab} className="mt-4 gap-2" variant="outline">
                  <UserPlus className="size-4" />
                  <span>Cadastrar Colaborador</span>
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {colaboradoresFiltrados.map((colab) => {
                  const totais = calcularTotaisColaborador(colab, lancamentos, mesFiltroAtivo);
                  const isAtivo = colab.status === "ativo";

                  return (
                    <Card
                      key={colab.id}
                      className={`overflow-hidden border transition-all duration-200 hover:shadow-md ${
                        !isAtivo ? "opacity-70 bg-muted/30" : "bg-card"
                      }`}
                    >
                      <div className="p-5">
                        {/* Topo do Card: Avatar, Nome, Função e Status */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-gold/20 font-bold text-brand dark:text-gold border border-brand/20 text-base shadow-sm">
                              {colab.nome.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-foreground leading-tight">
                                  {colab.nome}
                                </h3>
                                <Badge
                                  variant={isAtivo ? "default" : "secondary"}
                                  className={
                                    isAtivo
                                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]"
                                      : "bg-muted text-muted-foreground text-[11px]"
                                  }
                                >
                                  {isAtivo ? "Ativo" : "Inativo"}
                                </Badge>
                              </div>
                              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <Briefcase className="size-3 text-gold" />
                                {colab.funcao}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-muted-foreground hover:text-foreground"
                              title="Editar Colaborador"
                              onClick={() => handleOpenEditColab(colab)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                              title="Excluir Colaborador"
                              onClick={() => setColabToDelete(colab)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Dados de Contato e Pix */}
                        <div className="mt-3 flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground border-y py-2 border-border/50">
                          {colab.telefone && (
                            <span className="flex items-center gap-1">
                              <Phone className="size-3 text-brand" />
                              {colab.telefone}
                            </span>
                          )}
                          {colab.chavePix && (
                            <span className="flex items-center gap-1">
                              <QrCode className="size-3 text-gold" />
                              Pix: <strong className="font-mono text-foreground">{colab.chavePix}</strong>
                            </span>
                          )}
                          {colab.dataAdmissao && (
                            <span className="flex items-center gap-1">
                              <CalendarDays className="size-3" />
                              Início: {new Date(colab.dataAdmissao + "T12:00:00").toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>

                        {/* Grade de Cálculos do Período */}
                        <div className="mt-3 rounded-lg bg-muted/40 p-3 border border-border/40">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                            <span>Demonstrativo ({formatarMesNome(mesFiltroAtivo)})</span>
                            <span className="text-[10px] font-normal lowercase">
                              {totais.lancamentos.length} lançamento(s)
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            {/* Salário Base */}
                            <div className="rounded-md bg-background/80 p-2 border border-border/30">
                              <div className="text-[10px] text-muted-foreground font-medium">Salário Base</div>
                              <div className="text-xs sm:text-sm font-bold text-foreground">
                                {brl(totais.salarioBase)}
                              </div>
                            </div>

                            {/* Entradas */}
                            <div className="rounded-md bg-emerald-500/10 p-2 border border-emerald-500/20">
                              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                                (+) Freelas / Extras
                              </div>
                              <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                +{brl(totais.totalEntradas)}
                              </div>
                            </div>

                            {/* Saídas */}
                            <div className="rounded-md bg-rose-500/10 p-2 border border-rose-500/20">
                              <div className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">
                                (-) Vales / Descontos
                              </div>
                              <div className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
                                -{brl(totais.totalSaidas)}
                              </div>
                            </div>

                            {/* Valor Final */}
                            <div className="rounded-md bg-brand/10 p-2 border border-brand/30">
                              <div className="text-[10px] text-brand dark:text-gold font-bold">
                                (=) A Pagar Líquido
                              </div>
                              <div className="text-xs sm:text-sm font-extrabold text-brand dark:text-gold">
                                {brl(totais.valorFinal)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botões de Ação do Colaborador */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenNewLancamento(colab.id, "entrada")}
                              className="h-8 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                            >
                              <Plus className="size-3 mr-1" />
                              + Extra / Freela
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenNewLancamento(colab.id, "saida")}
                              className="h-8 text-xs border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                            >
                              <Plus className="size-3 mr-1" />
                              - Vale
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleOpenExtrato(colab)}
                            className="h-8 text-xs gap-1.5 bg-brand text-white hover:bg-brand/90"
                          >
                            <Receipt className="size-3.5" />
                            <span>Extrato & Histórico</span>
                            <ChevronRight className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ABA 2: Histórico de Lançamentos */}
          <TabsContent value="lancamentos" className="mt-4 space-y-4">
            <Card className="border-border/60 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b">
                    <tr>
                      <th className="py-3 px-4">Data</th>
                      <th className="py-3 px-4">Colaborador</th>
                      <th className="py-3 px-4">Tipo & Categoria</th>
                      <th className="py-3 px-4">Descrição / Justificativa</th>
                      <th className="py-3 px-4 text-right">Valor</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {lancamentosFiltradosLista.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          Nenhum lançamento encontrado para os filtros selecionados.
                        </td>
                      </tr>
                    ) : (
                      lancamentosFiltradosLista.map((lanc) => {
                        const colab = colaboradores.find((c) => c.id === lanc.colaboradorId);
                        const isEntrada = lanc.tipo === "entrada";

                        return (
                          <tr key={lanc.id} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(lanc.data + "T12:00:00").toLocaleDateString("pt-BR")}
                            </td>
                            <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                              {colab ? (
                                <div>
                                  <span className="font-semibold">{colab.nome}</span>
                                  <span className="block text-xs text-muted-foreground">{colab.funcao}</span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">Colaborador removido</span>
                              )}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge
                                variant="outline"
                                className={
                                  isEntrada
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-medium"
                                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs font-medium"
                                }
                              >
                                {isEntrada ? <ArrowUpRight className="size-3 mr-1 inline" /> : <ArrowDownLeft className="size-3 mr-1 inline" />}
                                {lanc.categoria}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-xs text-foreground/90 max-w-[320px]">
                              {lanc.descricao}
                            </td>
                            <td className="py-3 px-4 text-right font-bold text-sm whitespace-nowrap">
                              <span className={isEntrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                                {isEntrada ? "+" : "-"}{brl(lanc.valor)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                                title="Excluir lançamento"
                                onClick={() => setLancamentoToDelete(lanc)}
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* ABA 3: Extratos & Relatórios de Folha */}
          <TabsContent value="holerite" className="mt-4 space-y-4">
            <Card className="p-6 border-border/60 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Folha Consolidada - {formatarMesNome(mesFiltroAtivo)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Relatório geral para conferência financeira e fechamento da equipe.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="gap-2 border-border/60 text-xs"
                >
                  <Printer className="size-4" />
                  <span>Imprimir Relatório</span>
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground border-b text-[11px]">
                    <tr>
                      <th className="py-3 px-3">Colaborador</th>
                      <th className="py-3 px-3">Função</th>
                      <th className="py-3 px-3">Pix / Contato</th>
                      <th className="py-3 px-3 text-right">Salário Base</th>
                      <th className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">(+) Extras</th>
                      <th className="py-3 px-3 text-right text-rose-600 dark:text-rose-400">(-) Vales</th>
                      <th className="py-3 px-3 text-right font-bold text-foreground">(=) Total Líquido</th>
                      <th className="py-3 px-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {colaboradores.map((colab) => {
                      const totais = calcularTotaisColaborador(colab, lancamentos, mesFiltroAtivo);
                      return (
                        <tr key={colab.id} className="hover:bg-muted/10">
                          <td className="py-3 px-3 font-semibold text-foreground">{colab.nome}</td>
                          <td className="py-3 px-3 text-muted-foreground">{colab.funcao}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground">
                            {colab.chavePix || colab.telefone || "—"}
                          </td>
                          <td className="py-3 px-3 text-right font-medium">{brl(totais.salarioBase)}</td>
                          <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                            +{brl(totais.totalEntradas)}
                          </td>
                          <td className="py-3 px-3 text-right text-rose-600 dark:text-rose-400 font-medium">
                            -{brl(totais.totalSaidas)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-brand dark:text-gold">
                            {brl(totais.valorFinal)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => handleOpenExtrato(colab)}
                            >
                              Ver Extrato
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-muted/40 font-bold border-t border-border">
                    <tr>
                      <td colSpan={3} className="py-3 px-3 text-foreground uppercase tracking-wider text-xs">
                        Total Geral Folha
                      </td>
                      <td className="py-3 px-3 text-right text-foreground">{brl(totaisGerais.totalSalarioBase)}</td>
                      <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400">
                        +{brl(totaisGerais.totalEntradas)}
                      </td>
                      <td className="py-3 px-3 text-right text-rose-600 dark:text-rose-400">
                        -{brl(totaisGerais.totalSaidas)}
                      </td>
                      <td className="py-3 px-3 text-right text-base text-brand dark:text-gold">
                        {brl(totaisGerais.totalLiquidoFinal)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* DIALOG: Cadastrar / Editar Colaborador */}
        <Dialog open={isColabDialogOpen} onOpenChange={setIsColabDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="size-5 text-brand dark:text-gold" />
                {editingColab ? "Editar Colaborador" : "Novo Colaborador"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveColaborador} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="colab-nome">Nome Completo *</Label>
                <Input
                  id="colab-nome"
                  placeholder="Ex: Carlos Eduardo Mendes"
                  value={colabFormData.nome}
                  onChange={(e) => setColabFormData({ ...colabFormData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="colab-funcao">Função / Cargo *</Label>
                  <Input
                    id="colab-funcao"
                    placeholder="Ex: Fotógrafo, Editor..."
                    value={colabFormData.funcao}
                    onChange={(e) => setColabFormData({ ...colabFormData, funcao: e.target.value })}
                    required
                    list="funcoes-list"
                  />
                  <datalist id="funcoes-list">
                    {FUNCOES_SUGERIDAS.map((f) => (
                      <option key={f} value={f} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="colab-salario">Salário Base (R$) *</Label>
                  <Input
                    id="colab-salario"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={colabFormData.salarioBase}
                    onChange={(e) => setColabFormData({ ...colabFormData, salarioBase: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="colab-pix">Chave Pix</Label>
                  <Input
                    id="colab-pix"
                    placeholder="CPF, E-mail ou Telefone"
                    value={colabFormData.chavePix}
                    onChange={(e) => setColabFormData({ ...colabFormData, chavePix: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="colab-tel">WhatsApp / Telefone</Label>
                  <Input
                    id="colab-tel"
                    placeholder="(00) 00000-0000"
                    value={colabFormData.telefone}
                    onChange={(e) => setColabFormData({ ...colabFormData, telefone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="colab-data">Data de Admissão / Início</Label>
                  <Input
                    id="colab-data"
                    type="date"
                    value={colabFormData.dataAdmissao}
                    onChange={(e) => setColabFormData({ ...colabFormData, dataAdmissao: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="colab-status">Status</Label>
                  <Select
                    value={colabFormData.status}
                    onValueChange={(v) => setColabFormData({ ...colabFormData, status: v as any })}
                  >
                    <SelectTrigger id="colab-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="colab-obs">Observações / Detalhes</Label>
                <Textarea
                  id="colab-obs"
                  rows={2}
                  placeholder="Informações adicionais, disponibilidade de eventos..."
                  value={colabFormData.observacoes}
                  onChange={(e) => setColabFormData({ ...colabFormData, observacoes: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsColabDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-brand text-white hover:bg-brand/90">
                  {editingColab ? "Salvar Alterações" : "Cadastrar Colaborador"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DIALOG: Novo Lançamento (Entrada/Saída) */}
        <Dialog open={isLancamentoDialogOpen} onOpenChange={setIsLancamentoDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="size-5 text-brand dark:text-gold" />
                Novo Lançamento Financeiro
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveLancamento} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="lanc-colab">Colaborador *</Label>
                <Select
                  value={lancamentoFormData.colaboradorId}
                  onValueChange={(v) => setLancamentoFormData({ ...lancamentoFormData, colaboradorId: v })}
                >
                  <SelectTrigger id="lanc-colab">
                    <SelectValue placeholder="Selecione o colaborador" />
                  </SelectTrigger>
                  <SelectContent>
                    {colaboradores.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome} ({c.funcao})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Tipo de Lançamento *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={lancamentoFormData.tipo === "entrada" ? "default" : "outline"}
                    className={
                      lancamentoFormData.tipo === "entrada"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }
                    onClick={() =>
                      setLancamentoFormData({
                        ...lancamentoFormData,
                        tipo: "entrada",
                        categoria: "Freelancer",
                      })
                    }
                  >
                    <ArrowUpRight className="size-4 mr-1.5" />
                    (+) Entrada / Extra
                  </Button>

                  <Button
                    type="button"
                    variant={lancamentoFormData.tipo === "saida" ? "default" : "outline"}
                    className={
                      lancamentoFormData.tipo === "saida"
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "border-rose-500/30 text-rose-600 dark:text-rose-400"
                    }
                    onClick={() =>
                      setLancamentoFormData({
                        ...lancamentoFormData,
                        tipo: "saida",
                        categoria: "Vale / Adiantamento",
                      })
                    }
                  >
                    <ArrowDownLeft className="size-4 mr-1.5" />
                    (-) Saída / Vale
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lanc-cat">Categoria</Label>
                  <Select
                    value={lancamentoFormData.categoria}
                    onValueChange={(v) => setLancamentoFormData({ ...lancamentoFormData, categoria: v })}
                  >
                    <SelectTrigger id="lanc-cat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {lancamentoFormData.tipo === "entrada"
                        ? CATEGORIAS_ENTRADA.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))
                        : CATEGORIAS_SAIDA.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lanc-valor">Valor (R$) *</Label>
                  <Input
                    id="lanc-valor"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={lancamentoFormData.valor}
                    onChange={(e) => setLancamentoFormData({ ...lancamentoFormData, valor: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lanc-data">Data do Lançamento *</Label>
                <Input
                  id="lanc-data"
                  type="date"
                  value={lancamentoFormData.data}
                  onChange={(e) => setLancamentoFormData({ ...lancamentoFormData, data: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lanc-desc">Descrição / Justificativa *</Label>
                <Textarea
                  id="lanc-desc"
                  rows={2}
                  placeholder="Ex: Cobertura Baile Turma Medicina, Vale adiantado quinzenal..."
                  value={lancamentoFormData.descricao}
                  onChange={(e) => setLancamentoFormData({ ...lancamentoFormData, descricao: e.target.value })}
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsLancamentoDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-brand text-white hover:bg-brand/90">
                  Confirmar Lançamento
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DIALOG: Extrato Individual do Colaborador */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          {selectedColabForDetails && (
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <Receipt className="size-5 text-brand dark:text-gold" />
                    Extrato Individual & Histórico
                  </DialogTitle>
                </div>
              </DialogHeader>

              {(() => {
                const totais = calcularTotaisColaborador(selectedColabForDetails, lancamentos, mesFiltroAtivo);
                return (
                  <div className="space-y-5 pt-2">
                    {/* Header do Colaborador */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-muted/40 border">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">{selectedColabForDetails.nome}</h2>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Briefcase className="size-3.5 text-gold" />
                          {selectedColabForDetails.funcao}
                        </p>
                      </div>
                      <div className="text-right text-xs space-y-0.5">
                        {selectedColabForDetails.chavePix && (
                          <div className="font-mono text-muted-foreground">
                            Pix: <strong className="text-foreground">{selectedColabForDetails.chavePix}</strong>
                          </div>
                        )}
                        {selectedColabForDetails.telefone && (
                          <div className="text-muted-foreground">Tel: {selectedColabForDetails.telefone}</div>
                        )}
                      </div>
                    </div>

                    {/* Resumo Financeiro */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-card border">
                        <div className="text-[11px] text-muted-foreground">Salário Base</div>
                        <div className="text-sm font-bold text-foreground">{brl(totais.salarioBase)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">(+) Extras/Freelas</div>
                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{brl(totais.totalEntradas)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <div className="text-[11px] text-rose-700 dark:text-rose-400">(-) Vales/Descontos</div>
                        <div className="text-sm font-bold text-rose-600 dark:text-rose-400">-{brl(totais.totalSaidas)}</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-brand/10 border border-brand/30">
                        <div className="text-[11px] text-brand dark:text-gold font-bold">(=) Líquido Final</div>
                        <div className="text-base font-extrabold text-brand dark:text-gold">{brl(totais.valorFinal)}</div>
                      </div>
                    </div>

                    {/* Lançamentos do Colaborador */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Lançamentos ({formatarMesNome(mesFiltroAtivo)})
                        </h4>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            onClick={() => handleOpenNewLancamento(selectedColabForDetails.id, "entrada")}
                          >
                            + Extra
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px] border-rose-500/30 text-rose-600 dark:text-rose-400"
                            onClick={() => handleOpenNewLancamento(selectedColabForDetails.id, "saida")}
                          >
                            - Vale
                          </Button>
                        </div>
                      </div>

                      {totais.lancamentos.length === 0 ? (
                        <div className="text-center py-6 border rounded-lg bg-muted/20 text-xs text-muted-foreground">
                          Nenhum lançamento de extra ou vale registrado para este período.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {totais.lancamentos.map((l) => {
                            const isEntrada = l.tipo === "entrada";
                            return (
                              <div
                                key={l.id}
                                className="flex items-center justify-between p-2.5 rounded-lg border bg-card/60 hover:bg-muted/20 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`flex size-7 items-center justify-center rounded-md ${
                                      isEntrada
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                    }`}
                                  >
                                    {isEntrada ? <ArrowUpRight className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-foreground">{l.categoria}</div>
                                    <div className="text-muted-foreground text-[11px]">{l.descricao}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className={`font-bold ${isEntrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                      {isEntrada ? "+" : "-"}{brl(l.valor)}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                      {new Date(l.data + "T12:00:00").toLocaleDateString("pt-BR")}
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-6 text-muted-foreground hover:text-rose-600"
                                    onClick={() => setLancamentoToDelete(l)}
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              <DialogFooter className="pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => window.print()}
                >
                  <Printer className="size-3.5" />
                  Imprimir Extrato
                </Button>
                <Button type="button" onClick={() => setIsDetailsOpen(false)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>

        {/* ALERT DIALOG: Confirmação para Excluir Colaborador */}
        <AlertDialog open={!!colabToDelete} onOpenChange={(open) => !open && setColabToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                Excluir Colaborador
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o colaborador{" "}
                <strong>"{colabToDelete?.nome}"</strong>? Todos os lançamentos e o histórico financeiro
                associados também serão apagados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDeleteColaborador}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* ALERT DIALOG: Confirmação para Excluir Lançamento */}
        <AlertDialog open={!!lancamentoToDelete} onOpenChange={(open) => !open && setLancamentoToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                Excluir Lançamento
              </AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este lançamento de{" "}
                <strong>{lancamentoToDelete ? brl(lancamentoToDelete.valor) : ""}</strong> (
                {lancamentoToDelete?.categoria})? Os cálculos do colaborador serão recalculados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDeleteLancamento}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sim, Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
