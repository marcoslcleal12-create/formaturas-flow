import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  MapPin,
  Building2,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Briefcase,
  List,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
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

export const Route = createFileRoute("/_authenticated/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de Eventos & Trabalhos | JM Formaturas" },
      {
        name: "description",
        content: "Agenda interligada de agendamentos e eventos da JM Formaturas e empresas parceiras.",
      },
    ],
  }),
  component: AgendaPage,
});

export interface AgendaEvento {
  id: string;
  titulo: string;
  empresa_tipo: "jm" | "outra";
  empresa_nome: string;
  local_evento: string | null;
  cidade: string | null;
  data_evento: string; // YYYY-MM-DD
  horario_inicio: string | null;
  horario_fim: string | null;
  status: "confirmado" | "pendente" | "concluido" | "cancelado";
  observacoes: string | null;
  created_at?: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function AgendaPage() {
  const queryClient = useQueryClient();
  const hoje = new Date();
  
  const [dataAtual, setDataAtual] = useState(new Date());
  const [visao, setVisao] = useState<"calendario" | "lista">("calendario");
  const [filtroEmpresa, setFiltroEmpresa] = useState<"todos" | "jm" | "outra">("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const [openModalNovo, setOpenModalNovo] = useState(false);
  const [editingEvento, setEditingEvento] = useState<AgendaEvento | null>(null);
  const [deletingEvento, setDeletingEvento] = useState<AgendaEvento | null>(null);
  const [selectedDateForNew, setSelectedDateForNew] = useState<string | null>(null);

  // Form states
  const [formTipoEmpresa, setFormTipoEmpresa] = useState<"jm" | "outra">("jm");

  // Buscar eventos compartilhados do Supabase
  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ["agenda-eventos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agenda_eventos")
        .select("*")
        .order("data_evento", { ascending: true });

      if (error) {
        // Se a tabela ainda nao existir no schema remoto, retorna array vazio graciosamente
        console.warn("Tabela agenda_eventos ainda não configurada no DB remoto:", error.message);
        return [];
      }
      return (data ?? []) as AgendaEvento[];
    },
  });

  // Salvar / Criar / Editar Evento Mutation
  const salvarEvento = useMutation({
    mutationFn: async (formData: FormData) => {
      const titulo = (formData.get("titulo") as string)?.trim();
      const empresa_tipo = (formData.get("empresa_tipo") as "jm" | "outra") || "jm";
      let empresa_nome = (formData.get("empresa_nome") as string)?.trim();
      if (empresa_tipo === "jm" || !empresa_nome) {
        empresa_nome = "JM Formaturas & Eventos";
      }
      const local_evento = (formData.get("local_evento") as string)?.trim() || null;
      const cidade = (formData.get("cidade") as string)?.trim() || null;
      const data_evento = (formData.get("data_evento") as string);
      const horario_inicio = (formData.get("horario_inicio") as string) || null;
      const horario_fim = (formData.get("horario_fim") as string) || null;
      const status = (formData.get("status") as any) || "confirmado";
      const observacoes = (formData.get("observacoes") as string)?.trim() || null;

      if (!titulo) throw new Error("Informe o nome do evento.");
      if (!data_evento) throw new Error("Informe a data do evento.");

      const payload = {
        titulo,
        empresa_tipo,
        empresa_nome,
        local_evento,
        cidade,
        data_evento,
        horario_inicio,
        horario_fim,
        status,
        observacoes,
      };

      if (editingEvento) {
        const { error } = await supabase
          .from("agenda_eventos")
          .update(payload)
          .eq("id", editingEvento.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("agenda_eventos")
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingEvento ? "Evento atualizado na agenda!" : "Novo evento agendado com sucesso!");
      setOpenModalNovo(false);
      setEditingEvento(null);
      setSelectedDateForNew(null);
      void queryClient.invalidateQueries({ queryKey: ["agenda-eventos"] });
    },
    onError: (err) => {
      toast.error((err as Error).message || "Erro ao salvar evento na agenda.");
    },
  });

  // Excluir Evento Mutation
  const excluirEvento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("agenda_eventos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento removido da agenda.");
      setDeletingEvento(null);
      void queryClient.invalidateQueries({ queryKey: ["agenda-eventos"] });
    },
    onError: (err) => {
      toast.error("Erro ao excluir evento: " + (err as Error).message);
    },
  });

  // Navegação de mês
  const mesAtualNome = MESES[dataAtual.getMonth()];
  const anoAtual = dataAtual.getFullYear();

  const proximoMes = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1));
  };

  const mesAnterior = () => {
    setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1));
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  // Filtragem dos eventos
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      // Filtro de empresa
      if (filtroEmpresa !== "todos" && ev.empresa_tipo !== filtroEmpresa) {
        return false;
      }

      // Filtro de busca textual
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitulo = ev.titulo.toLowerCase().includes(q);
        const matchEmpresa = ev.empresa_nome.toLowerCase().includes(q);
        const matchLocal = ev.local_evento?.toLowerCase().includes(q) ?? false;
        const matchCidade = ev.cidade?.toLowerCase().includes(q) ?? false;
        const matchData = ev.data_evento.includes(q);
        return matchTitulo || matchEmpresa || matchLocal || matchCidade || matchData;
      }

      return true;
    });
  }, [eventos, filtroEmpresa, searchQuery]);

  // Dias do calendário para o mês selecionado
  const diasCalendario = useMemo(() => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDiaMes = new Date(ano, mes, 1);
    const diaSemanaInicio = primeiroDiaMes.getDay(); // 0 = Domingo
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();

    const dias = [];

    // Preencher dias do mês anterior para completar a primeira semana
    const diaMesAnterior = new Date(ano, mes, 0).getDate();
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const dataStr = new Date(ano, mes - 1, diaMesAnterior - i).toISOString().slice(0, 10);
      dias.push({
        dia: diaMesAnterior - i,
        outroMes: true,
        dataStr,
      });
    }

    // Dias do mês atual
    for (let d = 1; d <= ultimoDiaMes; d++) {
      const mm = String(mes + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dataStr = `${ano}-${mm}-${dd}`;
      dias.push({
        dia: d,
        outroMes: false,
        dataStr,
      });
    }

    // Preencher dias do próximo mês para completar 35 ou 42 slots
    const slotsTotais = dias.length > 35 ? 42 : 35;
    const faltam = slotsTotais - dias.length;
    for (let i = 1; i <= faltam; i++) {
      const dataStr = new Date(ano, mes + 1, i).toISOString().slice(0, 10);
      dias.push({
        dia: i,
        outroMes: true,
        dataStr,
      });
    }

    return dias;
  }, [dataAtual]);

  // Mapear eventos por data YYYY-MM-DD
  const eventosPorData = useMemo(() => {
    const map: Record<string, AgendaEvento[]> = {};
    for (const ev of eventosFiltrados) {
      if (!map[ev.data_evento]) {
        map[ev.data_evento] = [];
      }
      map[ev.data_evento].push(ev);
    }
    return map;
  }, [eventosFiltrados]);

  // Métricas do mês
  const metricasMes = useMemo(() => {
    const mm = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const prefixo = `${anoAtual}-${mm}`;

    const doMes = eventos.filter((e) => e.data_evento.startsWith(prefixo));
    const jmCount = doMes.filter((e) => e.empresa_tipo === "jm").length;
    const outraCount = doMes.filter((e) => e.empresa_tipo === "outra").length;

    return {
      totalMes: doMes.length,
      jmCount,
      outraCount,
    };
  }, [eventos, dataAtual, anoAtual]);

  const abrirNovoParaData = (dataStr: string) => {
    setSelectedDateForNew(dataStr);
    setEditingEvento(null);
    setFormTipoEmpresa("jm");
    setOpenModalNovo(true);
  };

  const abrirEdicao = (ev: AgendaEvento) => {
    setEditingEvento(ev);
    setFormTipoEmpresa(ev.empresa_tipo);
    setOpenModalNovo(true);
  };

  return (
    <AppShell>
      {/* CABEÇALHO DA AGENDA */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CalendarDays className="size-6 text-gold" />
              Agenda de Eventos
            </h1>
            <Badge variant="outline" className="border-gold/50 text-gold bg-gold/5">
              Compartilhada
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Agendamentos interligados entre administradores. Eventos da JM Formaturas e terceirizados.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              setEditingEvento(null);
              setSelectedDateForNew(hoje.toISOString().slice(0, 10));
              setFormTipoEmpresa("jm");
              setOpenModalNovo(true);
            }}
            className="gap-2 bg-brand text-primary-foreground hover:bg-brand/90 dark:bg-gold dark:text-brand dark:hover:bg-gold/90"
          >
            <Plus className="size-4" /> Novo Evento na Agenda
          </Button>
        </div>
      </div>

      {/* CARDS DE RESUMO DO MÊS */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="shadow-card border-brand/20 dark:border-gold/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Eventos em {mesAtualNome}
            </CardTitle>
            <CalendarIcon className="size-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metricasMes.totalMes}</div>
            <p className="text-xs text-muted-foreground mt-1">Agendados para este mês</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              JM Formaturas & Eventos
            </CardTitle>
            <Building2 className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{metricasMes.jmCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Eventos próprios da empresa</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-purple-500/20 bg-purple-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Outras Empresas (Terceirizados)
            </CardTitle>
            <Briefcase className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metricasMes.outraCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Eventos contratados por terceiros</p>
          </CardContent>
        </Card>
      </div>

      {/* CONTROLES DE NAVEGAÇÃO E FILTROS */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 bg-card shadow-card">
        {/* Mês/Ano & Troca */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={mesAnterior} title="Mês Anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-base font-bold min-w-[140px] text-center">
            {mesAtualNome} {anoAtual}
          </h2>
          <Button variant="outline" size="icon" onClick={proximoMes} title="Próximo Mês">
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={irParaHoje} className="text-xs ml-1">
            Hoje
          </Button>
        </div>

        {/* Busca e Tipo de Visão */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar evento, empresa, local ou cidade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Select value={filtroEmpresa} onValueChange={(v: any) => setFiltroEmpresa(v)}>
            <SelectTrigger className="w-[180px] h-9 text-xs">
              <Filter className="size-3.5 mr-1.5" />
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as Empresas</SelectItem>
              <SelectItem value="jm">Apenas JM Formaturas</SelectItem>
              <SelectItem value="outra">Outras Empresas</SelectItem>
            </SelectContent>
          </Select>

          {/* Toggle Visão: Calendário vs Lista */}
          <div className="flex items-center rounded-lg border p-1 bg-muted/40">
            <Button
              variant={visao === "calendario" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5 gap-1"
              onClick={() => setVisao("calendario")}
            >
              <CalendarDays className="size-3.5" /> Calendário
            </Button>
            <Button
              variant={visao === "lista" ? "secondary" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5 gap-1"
              onClick={() => setVisao("lista")}
            >
              <List className="size-3.5" /> Lista
            </Button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL: CALENDÁRIO OU LISTA */}
      {isLoading ? (
        <Card className="shadow-card p-12 text-center text-muted-foreground">
          <CalendarIcon className="mx-auto size-8 animate-pulse text-gold mb-2" />
          <p className="text-sm font-medium">Carregando eventos da agenda...</p>
        </Card>
      ) : visao === "calendario" ? (
        /* VISÃO CALENDÁRIO MENSAL */
        <Card className="shadow-card overflow-hidden">
          <CardContent className="p-0">
            {/* Dias da semana */}
            <div className="grid grid-cols-7 border-b bg-muted/50 text-center text-xs font-semibold uppercase tracking-wider py-2">
              {DIAS_SEMANA.map((dia) => (
                <div key={dia} className="py-1">
                  {dia}
                </div>
              ))}
            </div>

            {/* Grid dos Dias */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border">
              {diasCalendario.map((slot, index) => {
                const evs = eventosPorData[slot.dataStr] ?? [];
                const isHoje = slot.dataStr === hoje.toISOString().slice(0, 10);

                return (
                  <div
                    key={index}
                    className={`min-h-[110px] p-2 flex flex-col transition-colors group relative ${
                      slot.outroMes ? "bg-muted/10 opacity-40" : "hover:bg-muted/20"
                    } ${isHoje ? "bg-gold/5 dark:bg-gold/10 font-bold" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`inline-flex size-6 items-center justify-center rounded-full text-xs ${
                          isHoje ? "bg-gold text-accent-foreground font-bold" : "text-muted-foreground"
                        }`}
                      >
                        {slot.dia}
                      </span>
                      <button
                        type="button"
                        onClick={() => abrirNovoParaData(slot.dataStr)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
                        title="Agendar neste dia"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    {/* Badge de Eventos no dia */}
                    <div className="space-y-1.5 overflow-y-auto max-h-[85px] pr-0.5">
                      {evs.map((ev) => {
                        const isJM = ev.empresa_tipo === "jm";
                        return (
                          <div
                            key={ev.id}
                            onClick={() => abrirEdicao(ev)}
                            className={`cursor-pointer text-[11px] p-1.5 rounded-md border transition-all hover:scale-[1.02] shadow-sm leading-snug ${
                              isJM
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-300"
                                : "bg-purple-500/10 border-purple-500/30 text-purple-950 dark:text-purple-300"
                            }`}
                          >
                            <div className="font-bold truncate flex items-center gap-1">
                              <span
                                className={`size-1.5 rounded-full shrink-0 ${
                                  isJM ? "bg-emerald-500" : "bg-purple-500"
                                }`}
                              />
                              {ev.titulo}
                            </div>
                            <div className="text-[10px] opacity-85 truncate flex items-center gap-1 mt-0.5">
                              <Building2 className="size-2.5 shrink-0" />
                              {ev.empresa_nome}
                            </div>
                            {ev.cidade && (
                              <div className="text-[10px] opacity-75 truncate flex items-center gap-1">
                                <MapPin className="size-2.5 shrink-0" />
                                {ev.cidade}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* VISÃO LISTA DETALHADA */
        <div className="space-y-3">
          {eventosFiltrados.length === 0 ? (
            <Card className="shadow-card p-10 text-center text-muted-foreground">
              <CalendarIcon className="mx-auto size-10 opacity-30 mb-2" />
              <p className="font-semibold text-foreground">Nenhum evento encontrado</p>
              <p className="text-xs mt-1">
                {searchQuery || filtroEmpresa !== "todos"
                  ? "Tente ajustar os filtros de busca para visualizar os agendamentos."
                  : "Clique no botão 'Novo Evento na Agenda' para agendar seu primeiro compromisso."}
              </p>
            </Card>
          ) : (
            eventosFiltrados.map((ev) => {
              const isJM = ev.empresa_tipo === "jm";
              const dataFormatada = new Date(`${ev.data_evento}T12:00:00`).toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "2-digit",
                month: "long",
                year: "numeric",
              });

              return (
                <Card
                  key={ev.id}
                  className={`shadow-card transition-all hover:border-gold/50 ${
                    isJM ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-purple-500"
                  }`}
                >
                  <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1 flex-1 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base">{ev.titulo}</h3>
                        <Badge
                          variant="secondary"
                          className={
                            isJM
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30"
                          }
                        >
                          {isJM ? "JM Formaturas" : ev.empresa_nome}
                        </Badge>
                        <Badge variant="outline" className="capitalize text-[11px]">
                          {ev.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <CalendarIcon className="size-3.5 text-gold shrink-0" />
                          {dataFormatada}
                        </span>

                        {(ev.horario_inicio || ev.horario_fim) && (
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5 text-muted-foreground shrink-0" />
                            {ev.horario_inicio || "—"} {ev.horario_fim ? `até ${ev.horario_fim}` : ""}
                          </span>
                        )}

                        {ev.local_evento && (
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3.5 text-muted-foreground shrink-0" />
                            {ev.local_evento}
                          </span>
                        )}

                        {ev.cidade && (
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                            {ev.cidade}
                          </span>
                        )}
                      </div>

                      {ev.observacoes && (
                        <p className="text-xs text-muted-foreground/90 italic pt-1">
                          Obs: "{ev.observacoes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => abrirEdicao(ev)} className="gap-1 text-xs">
                        <Edit className="size-3.5" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingEvento(ev)}
                        className="gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" /> Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* DIALOG: NOVO / EDITAR EVENTO NA AGENDA */}
      <Dialog open={openModalNovo} onOpenChange={setOpenModalNovo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="size-5 text-gold" />
              {editingEvento ? "Editar Evento da Agenda" : "Novo Evento na Agenda"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Preencha os dados do compromisso. Ele será visível para todos os administradores.
            </DialogDescription>
          </DialogHeader>

          <form
            id="form-agenda"
            className="space-y-3.5 pt-2"
            onSubmit={(e) => {
              e.preventDefault();
              salvarEvento.mutate(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="titulo">Nome / Título do Evento *</Label>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Ex: Cobertura Baile de Formatura Medicina XVII"
                defaultValue={editingEvento?.titulo || ""}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="empresa_tipo">Empresa Contratante / Responsável *</Label>
              <select
                id="empresa_tipo"
                name="empresa_tipo"
                value={formTipoEmpresa}
                onChange={(e) => setFormTipoEmpresa(e.target.value as "jm" | "outra")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="jm">JM Formaturas & Eventos (Própria)</option>
                <option value="outra">Outra Empresa / Terceirizado</option>
              </select>
            </div>

            {formTipoEmpresa === "outra" && (
              <div className="space-y-1.5">
                <Label htmlFor="empresa_nome">Nome da Empresa Contratante *</Label>
                <Input
                  id="empresa_nome"
                  name="empresa_nome"
                  placeholder="Ex: Produtora Eventos Alpha"
                  defaultValue={editingEvento?.empresa_nome || ""}
                  required
                />
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="data_evento">Data do Evento *</Label>
                <Input
                  id="data_evento"
                  name="data_evento"
                  type="date"
                  defaultValue={editingEvento?.data_evento || selectedDateForNew || hoje.toISOString().slice(0, 10)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingEvento?.status || "confirmado"}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="confirmado">Confirmado</option>
                  <option value="pendente">Pendente</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="horario_inicio">Horário de Início</Label>
                <Input
                  id="horario_inicio"
                  name="horario_inicio"
                  type="time"
                  defaultValue={editingEvento?.horario_inicio || ""}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="horario_fim">Horário de Término</Label>
                <Input
                  id="horario_fim"
                  name="horario_fim"
                  type="time"
                  defaultValue={editingEvento?.horario_fim || ""}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="local_evento">Local do Evento</Label>
                <Input
                  id="local_evento"
                  name="local_evento"
                  placeholder="Ex: Espaço Master"
                  defaultValue={editingEvento?.local_evento || ""}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  placeholder="Ex: Araguaína-TO"
                  defaultValue={editingEvento?.cidade || ""}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="observacoes">Observações / Detalhes</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                placeholder="Ex: Equipe de 4 fotógrafos, levar iluminação de estúdio."
                defaultValue={editingEvento?.observacoes || ""}
                rows={3}
              />
            </div>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenModalNovo(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="form-agenda"
              disabled={salvarEvento.isPending}
              className="bg-brand text-primary-foreground hover:bg-brand/90 dark:bg-gold dark:text-brand"
            >
              {salvarEvento.isPending ? "Salva..." : editingEvento ? "Salvar Alterações" : "Agendar Evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ALERT DIALOG: EXCLUIR EVENTO */}
      <AlertDialog open={!!deletingEvento} onOpenChange={(o) => !o && setDeletingEvento(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" /> Excluir Agendamento
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o evento <strong>"{deletingEvento?.titulo}"</strong> da agenda compartilhada?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEvento && excluirEvento.mutate(deletingEvento.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
