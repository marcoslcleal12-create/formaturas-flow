import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  Building2,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated/agenda")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Agenda de Eventos | JM Formaturas" }],
  }),
  component: AgendaPage,
});

// ─── tipos ────────────────────────────────────────────────────────────────────
interface AgendaEvento {
  id: string;
  descricao: string;
  empresa_tipo: "jm" | "outra";
  empresa_nome: string;
  local_evento: string;
  cidade: string;
  fotografo: string;
  data_evento: string;
  created_at?: string;
}

interface FormState {
  descricao: string;
  empresa_tipo: "jm" | "outra";
  empresa_nome: string;
  local_evento: string;
  cidade: string;
  fotografo: string;
  data_evento: string;
}

const FORM_VAZIO: FormState = {
  descricao: "",
  empresa_tipo: "jm",
  empresa_nome: "JM Formaturas & Eventos",
  local_evento: "",
  cidade: "",
  fotografo: "",
  data_evento: new Date().toISOString().slice(0, 10),
};

const MESES = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const DIAS_SEM = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function localYMD(year: number, month: number, day: number) {
  const d = new Date(year, month, day);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// ─── componente principal ──────────────────────────────────────────────────────
function AgendaPage() {
  const qc = useQueryClient();
  const hoje = localYMD(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // estado de navegação de mês
  const [ano, setAno] = useState(new Date().getFullYear());
  const [mes, setMes] = useState(new Date().getMonth()); // 0-based

  // modal
  const [modalAberto, setModalAberto] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(FORM_VAZIO);

  // confirmação exclusão
  const [deletandoId, setDeletandoId] = useState<string | null>(null);

  // ── query ──
  const { data: eventos = [], isLoading } = useQuery<AgendaEvento[]>({
    queryKey: ["agenda"],
    queryFn: async () => {
      const res = await (supabase.from as any)("agenda_eventos")
        .select("*")
        .order("data_evento", { ascending: true });
      if (res.error) { console.warn(res.error.message); return []; }
      return res.data ?? [];
    },
  });

  // ── mutação salvar ──
  const salvar = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        titulo: f.descricao.trim(),        // NOT NULL na tabela original
        descricao: f.descricao.trim(),
        empresa_tipo: f.empresa_tipo,
        empresa_nome: f.empresa_tipo === "jm" ? "JM Formaturas & Eventos" : f.empresa_nome.trim(),
        local_evento: f.local_evento.trim(),
        cidade: f.cidade.trim(),
        fotografo: f.fotografo.trim(),
        data_evento: f.data_evento,
      };
      if (editId) {
        const { error } = await (supabase.from as any)("agenda_eventos").update(payload).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from as any)("agenda_eventos").insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editId ? "Evento atualizado!" : "Evento adicionado à agenda!");
      setModalAberto(false);
      void qc.invalidateQueries({ queryKey: ["agenda"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao salvar evento."),
  });

  // ── mutação excluir ──
  const excluir = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from as any)("agenda_eventos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento removido.");
      setDeletandoId(null);
      void qc.invalidateQueries({ queryKey: ["agenda"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Erro ao excluir."),
  });

  // ── navegação de mês ──
  const irAnterior = () => { if (mes === 0) { setMes(11); setAno(a => a-1); } else setMes(m => m-1); };
  const irProximo  = () => { if (mes === 11) { setMes(0);  setAno(a => a+1); } else setMes(m => m+1); };
  const irHoje     = () => { setAno(new Date().getFullYear()); setMes(new Date().getMonth()); };

  // ── grade do calendário ──
  const grade = useMemo(() => {
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const ultimoDia   = new Date(ano, mes+1, 0).getDate();
    const ultAnterior = new Date(ano, mes, 0).getDate();
    const cells: { data: string; outroMes: boolean; dia: number }[] = [];

    for (let i = primeiroDia-1; i >= 0; i--)
      cells.push({ dia: ultAnterior-i, outroMes: true,  data: localYMD(ano, mes-1, ultAnterior-i) });
    for (let d = 1; d <= ultimoDia; d++)
      cells.push({ dia: d,             outroMes: false, data: localYMD(ano, mes,   d) });
    const faltam = (cells.length <= 35 ? 35 : 42) - cells.length;
    for (let i = 1; i <= faltam; i++)
      cells.push({ dia: i,             outroMes: true,  data: localYMD(ano, mes+1, i) });
    return cells;
  }, [ano, mes]);

  // ── eventos indexados por data ──
  const porData = useMemo(() => {
    const m: Record<string, AgendaEvento[]> = {};
    for (const ev of eventos) {
      if (!m[ev.data_evento]) m[ev.data_evento] = [];
      m[ev.data_evento].push(ev);
    }
    return m;
  }, [eventos]);

  // ── eventos do mês corrente (lista) ──
  const eventosMes = useMemo(() => {
    const pref = `${ano}-${String(mes+1).padStart(2,"0")}`;
    return eventos.filter(e => e.data_evento?.startsWith(pref));
  }, [eventos, ano, mes]);

  // ── abrir modal ──
  const abrirNovo = (data?: string) => {
    setEditId(null);
    setForm({ ...FORM_VAZIO, data_evento: data ?? hoje });
    setModalAberto(true);
  };

  const abrirEditar = (ev: AgendaEvento) => {
    setEditId(ev.id);
    setForm({
      descricao:    ev.descricao,
      empresa_tipo: ev.empresa_tipo,
      empresa_nome: ev.empresa_nome,
      local_evento: ev.local_evento ?? "",
      cidade:       ev.cidade ?? "",
      fotografo:    ev.fotografo ?? "",
      data_evento:  ev.data_evento,
    });
    setModalAberto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.descricao.trim())    { toast.error("Informe a descrição do evento."); return; }
    if (!form.data_evento)         { toast.error("Informe a data do evento."); return; }
    if (!form.fotografo.trim())    { toast.error("Informe o nome do fotógrafo."); return; }
    if (!form.local_evento.trim()) { toast.error("Informe o local do evento."); return; }
    if (!form.cidade.trim())       { toast.error("Informe a cidade."); return; }
    if (form.empresa_tipo === "outra" && !form.empresa_nome.trim()) {
      toast.error("Informe o nome da empresa contratante."); return;
    }
    salvar.mutate(form);
  };

  const set = (k: keyof FormState, v: string) => setForm(f => ({ ...f, [k]: v }));

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <AppShell>
      {/* cabeçalho */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <CalendarDays className="size-6 text-gold" />
            Agenda de Eventos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agenda compartilhada entre fotógrafos/administradores em tempo real.
          </p>
        </div>
        <button
          onClick={() => abrirNovo()}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand/90 dark:bg-gold dark:text-brand dark:hover:bg-gold/90"
        >
          <Plus className="size-4" /> Novo Evento
        </button>
      </div>

      {/* contadores do mês */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total em {MESES[mes]}</p>
          <p className="mt-1 text-3xl font-bold">{eventosMes.length}</p>
        </div>
        <div className="rounded-xl border bg-emerald-50 dark:bg-emerald-950/20 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">JM Formaturas</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {eventosMes.filter(e => e.empresa_tipo === "jm").length}
          </p>
        </div>
        <div className="rounded-xl border bg-purple-50 dark:bg-purple-950/20 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-400">Outras Empresas</p>
          <p className="mt-1 text-3xl font-bold text-purple-600 dark:text-purple-400">
            {eventosMes.filter(e => e.empresa_tipo === "outra").length}
          </p>
        </div>
      </div>

      {/* navegação de mês */}
      <div className="mb-4 flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={irAnterior} className="rounded-lg border p-1.5 hover:bg-muted"><ChevronLeft className="size-4" /></button>
          <span className="min-w-[160px] text-center text-base font-bold">{MESES[mes]} {ano}</span>
          <button onClick={irProximo} className="rounded-lg border p-1.5 hover:bg-muted"><ChevronRight className="size-4" /></button>
          <button onClick={irHoje} className="ml-1 rounded-lg px-3 py-1 text-xs font-medium hover:bg-muted border">Hoje</button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-muted-foreground">Carregando agenda...</div>
      ) : (
        <>
          {/* calendário */}
          <div className="mb-8 overflow-hidden rounded-xl border bg-card shadow-sm overflow-x-auto">
            <div className="min-w-[800px]">
              {/* header dias da semana */}
              <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-sm font-bold uppercase tracking-wide">
                {DIAS_SEM.map(d => <div key={d} className="py-3">{d}</div>)}
              </div>
              {/* grid */}
              <div className="grid grid-cols-7 divide-x divide-y divide-border">
                {grade.map((cell, idx) => {
                  const evs = porData[cell.data] ?? [];
                  const isHoje = cell.data === hoje;
                  return (
                    <div
                      key={idx}
                      className={`group relative flex flex-col min-h-[200px] p-2 transition-colors ${cell.outroMes ? "opacity-30" : "hover:bg-muted/20"} ${isHoje ? "bg-gold/10" : ""}`}
                    >
                      {/* número do dia + botão adicionar */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`flex size-7 items-center justify-center rounded-full text-base font-bold ${isHoje ? "bg-gold text-white dark:text-brand" : "text-muted-foreground"}`}>
                          {cell.dia}
                        </span>
                        {!cell.outroMes && (
                          <button
                            onClick={() => abrirNovo(cell.data)}
                            className="hidden group-hover:flex size-7 items-center justify-center rounded-full bg-muted hover:bg-muted-foreground/20"
                            title="Adicionar evento"
                          >
                            <Plus className="size-4" />
                          </button>
                        )}
                      </div>

                      {/* eventos */}
                      <div className="flex flex-col gap-2 flex-1">
                        {evs.map(ev => (
                          <button
                            key={ev.id}
                            onClick={() => abrirEditar(ev)}
                            className={`w-full rounded-xl p-3 text-left shadow-sm transition hover:brightness-95 active:scale-[0.98] ${
                              ev.empresa_tipo === "jm"
                                ? "bg-emerald-100 dark:bg-emerald-900/50"
                                : "bg-purple-100 dark:bg-purple-900/50"
                            }`}
                          >
                            {/* fotógrafo em destaque */}
                            <div className={`flex items-center gap-1.5 font-bold text-sm leading-tight mb-1 ${
                              ev.empresa_tipo === "jm"
                                ? "text-emerald-900 dark:text-emerald-100"
                                : "text-purple-900 dark:text-purple-100"
                            }`}>
                              <Camera className="size-4 shrink-0" />
                              <span className="break-words">{ev.fotografo || "—"}</span>
                            </div>
                            {/* descrição */}
                            <div className={`text-sm font-semibold leading-snug break-words ${
                              ev.empresa_tipo === "jm"
                                ? "text-emerald-800 dark:text-emerald-200"
                                : "text-purple-800 dark:text-purple-200"
                            }`}>
                              {ev.descricao || ev.titulo}
                            </div>
                            {/* local */}
                            {ev.cidade && (
                              <div className={`text-xs font-medium leading-snug mt-1 break-words ${
                                ev.empresa_tipo === "jm"
                                  ? "text-emerald-700 dark:text-emerald-300"
                                  : "text-purple-700 dark:text-purple-300"
                              }`}>
                                📍 {ev.cidade}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* lista do mês */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Eventos de {MESES[mes]}
            </h2>
            {eventosMes.length === 0 ? (
              <p className="rounded-xl border bg-card py-10 text-center text-sm text-muted-foreground shadow-sm">
                Nenhum evento agendado para {MESES[mes]}. Clique em <strong>+ Novo Evento</strong> para adicionar.
              </p>
            ) : (
              <div className="space-y-3">
                {eventosMes.map(ev => {
                  const dataFormatada = new Date(`${ev.data_evento}T12:00:00`).toLocaleDateString("pt-BR", {
                    weekday: "long", day: "2-digit", month: "long",
                  });
                  const isJM = ev.empresa_tipo === "jm";
                  return (
                    <div
                      key={ev.id}
                      className={`flex flex-wrap items-start justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm ${isJM ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-purple-500"}`}
                    >
                      <div className="flex-1 space-y-1 min-w-[200px]">
                        <p className="font-bold">{ev.descricao}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <CalendarDays className="size-3.5 text-gold" />
                            {dataFormatada}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3.5" />
                            {ev.empresa_nome}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {ev.local_evento}{ev.cidade ? `, ${ev.cidade}` : ""}
                          </span>
                          <span className="flex items-center gap-1">
                            <Camera className="size-3.5" />
                            {ev.fotografo}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirEditar(ev)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                          <Pencil className="size-3" /> Editar
                        </button>
                        <button
                          onClick={() => setDeletandoId(ev.id)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3" /> Excluir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── MODAL NOVO / EDITAR ── */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalAberto(false)}>
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-bold text-lg">
                <CalendarDays className="size-5 text-gold" />
                {editId ? "Editar Evento" : "Novo Evento na Agenda"}
              </h2>
              <button onClick={() => setModalAberto(false)} className="rounded-lg p-1 hover:bg-muted">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* descrição */}
              <div>
                <label className="mb-1 block text-xs font-semibold">Descrição do Evento *</label>
                <input
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Ex: Cobertura Baile de Formatura – Medicina XXIII"
                  value={form.descricao}
                  onChange={e => set("descricao", e.target.value)}
                />
              </div>

              {/* data */}
              <div>
                <label className="mb-1 block text-xs font-semibold">Data do Evento *</label>
                <input
                  type="date"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  value={form.data_evento}
                  onChange={e => set("data_evento", e.target.value)}
                />
              </div>

              {/* empresa */}
              <div>
                <label className="mb-1 block text-xs font-semibold">Evento para qual empresa? *</label>
                <select
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  value={form.empresa_tipo}
                  onChange={e => set("empresa_tipo", e.target.value as "jm" | "outra")}
                >
                  <option value="jm">JM Formaturas & Eventos (própria)</option>
                  <option value="outra">Outra empresa (terceirizado)</option>
                </select>
              </div>

              {/* nome empresa – só se outra */}
              {form.empresa_tipo === "outra" && (
                <div>
                  <label className="mb-1 block text-xs font-semibold">Nome da empresa contratante *</label>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Ex: Studio Alpha Fotografia"
                    value={form.empresa_nome === "JM Formaturas & Eventos" ? "" : form.empresa_nome}
                    onChange={e => set("empresa_nome", e.target.value)}
                  />
                </div>
              )}

              {/* local */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold">Local do Evento *</label>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Ex: Espaço Master"
                    value={form.local_evento}
                    onChange={e => set("local_evento", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold">Cidade *</label>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Ex: Araguaína-TO"
                    value={form.cidade}
                    onChange={e => set("cidade", e.target.value)}
                  />
                </div>
              </div>

              {/* fotógrafo */}
              <div>
                <label className="mb-1 block text-xs font-semibold">Nome do Fotógrafo Responsável *</label>
                <input
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Ex: João Silva"
                  value={form.fotografo}
                  onChange={e => set("fotografo", e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalAberto(false)} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvar.isPending}
                  className="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-60 dark:bg-gold dark:text-brand"
                >
                  {salvar.isPending ? "Salvando..." : editId ? "Salvar Alterações" : "Adicionar à Agenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRMAR EXCLUSÃO ── */}
      {deletandoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDeletandoId(null)}>
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="mb-2 font-bold text-destructive">Confirmar exclusão</h2>
            <p className="mb-4 text-sm text-muted-foreground">Tem certeza que deseja remover este evento da agenda compartilhada?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeletandoId(null)} className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Cancelar</button>
              <button
                onClick={() => excluir.mutate(deletandoId)}
                disabled={excluir.isPending}
                className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90 disabled:opacity-60"
              >
                {excluir.isPending ? "Removendo..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
