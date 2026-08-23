import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  KeyRound,
  User,
  Phone,
  Mail,
  Link2,
  Copy,
  Check,
  Package,
  ExternalLink,
  PlusCircle,
  Sparkles,
  Calendar,
  MapPin,
  Building2,
  Search,
  CheckCircle2,
  FileText,
  FileDown,
  DollarSign,
  CreditCard,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, brl } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  extrairPacotesTurma,
  serializarPacotesTurma,
  obterPacotesPadraoPorTipo,
  calcularParcelas as calcularParcelasHelper,
  type PacoteItem,
} from "@/lib/turma-pacotes";
import { apenasDigitos, cpfParaEmail } from "@/lib/aluno-login";
import { formatarCpf, loadDemandas, saveDemandas, type DemandaItem } from "@/lib/demandas-store";
import { gerarContratoPdf } from "@/lib/contrato-modelo";

interface DemandaEventManagerProps {
  tipo: "casamento" | "festa-aniversario" | "ensaio";
  titulo: string;
  subtitulo: string;
  icon: React.ElementType;
  themeColor: "pink" | "purple" | "blue";
}

interface EventoData {
  id: string;
  nome: string;
  curso: string; // Categoria / Tipo do evento (ex: Casamento)
  faculdade: string; // Local / Espaço
  cidade: string | null;
  semestre: string | null; // Data do evento
  status: string;
  observacoes?: string | null;
  alunos?: { count: number }[];
}

interface ContratanteItem {
  id: string;
  turma_id: string;
  nome_completo: string;
  cpf: string | null;
  whatsapp: string | null;
  email: string | null;
  data_nascimento: string | null;
  user_id: string | null;
  status: string;
  contrato?: any;
}

export function DemandaEventManager({
  tipo,
  titulo,
  subtitulo,
  icon: IconComponent,
  themeColor,
}: DemandaEventManagerProps) {
  const queryClient = useQueryClient();
  const [selectedEventoId, setSelectedEventoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Modais de Evento
  const [openCreateEvento, setOpenCreateEvento] = useState(false);
  const [editingEvento, setEditingEvento] = useState<EventoData | null>(null);
  const [deletingEvento, setDeletingEvento] = useState<EventoData | null>(null);

  // Modais de Detalhes do Evento
  const [openLinkAdesao, setOpenLinkAdesao] = useState(false);
  const [openGerenciarPacotes, setOpenGerenciarPacotes] = useState(false);
  const [openAddContratante, setOpenAddContratante] = useState(false);
  const [editingContratante, setEditingContratante] = useState<ContratanteItem | null>(null);
  const [deletingContratante, setDeletingContratante] = useState<ContratanteItem | null>(null);
  const [viewingContratoItem, setViewingContratoItem] = useState<{
    contratante: ContratanteItem;
    contrato: any;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form Fields Novo Contratante Manual
  const [formNome, setFormNome] = useState("");
  const [formCpf, setFormCpf] = useState("");
  const [formWhatsapp, setFormWhatsapp] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPacoteId, setFormPacoteId] = useState("");
  const [formValorTotal, setFormValorTotal] = useState("");
  const [formValorEntrada, setFormValorEntrada] = useState("0");
  const [formDesconto, setFormDesconto] = useState("0");
  const [formNumParcelas, setFormNumParcelas] = useState("6");
  const [formDiaVencimento, setFormDiaVencimento] = useState("10");

  // Pacotes do Evento Selecionado
  const [pacotes, setPacotes] = useState<PacoteItem[]>(() => obterPacotesPadraoPorTipo(tipo));
  const [novoNomePacote, setNovoNomePacote] = useState("");
  const [novoMaterialPacote, setNovoMaterialPacote] = useState("");
  const [novoInvestimentoPacote, setNovoInvestimentoPacote] = useState("");

  // Cores de tema
  const themeClasses = {
    pink: {
      bgIcon: "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
      badge: "bg-pink-600 hover:bg-pink-700 text-white",
      accentText: "text-pink-600 dark:text-pink-400",
      borderAccent: "border-pink-500/40",
      buttonBg: "bg-pink-600 hover:bg-pink-700 text-white",
    },
    purple: {
      bgIcon: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
      badge: "bg-purple-600 hover:bg-purple-700 text-white",
      accentText: "text-purple-600 dark:text-purple-400",
      borderAccent: "border-purple-500/40",
      buttonBg: "bg-purple-600 hover:bg-purple-700 text-white",
    },
    blue: {
      bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      badge: "bg-blue-600 hover:bg-blue-700 text-white",
      accentText: "text-blue-600 dark:text-blue-400",
      borderAccent: "border-blue-500/40",
      buttonBg: "bg-blue-600 hover:bg-blue-700 text-white",
    },
  }[themeColor];

  // 1. QUERY: Lista de Eventos do tipo (busca na tabela 'turmas' filtrando pela categoria ou observações)
  const { data: eventos = [], isLoading: isLoadingEventos } = useQuery({
    queryKey: ["eventos-demanda", tipo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("turmas")
        .select("*, alunos(count)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Filtra os eventos pertencentes a este tipo de demanda
      const matchType = (t: any) => {
        const c = (t.curso || "").toLowerCase();
        const obs = (t.observacoes || "").toLowerCase();
        if (tipo === "casamento") return c.includes("casamento") || obs.includes("casamento");
        if (tipo === "festa-aniversario")
          return (
            c.includes("aniversario") ||
            c.includes("aniversário") ||
            c.includes("festa") ||
            obs.includes("festa") ||
            obs.includes("aniversario")
          );
        if (tipo === "ensaio") return c.includes("ensaio") || obs.includes("ensaio");
        return false;
      };

      const filtrados = (data as EventoData[]).filter(matchType);
      return filtrados;
    },
  });

  // 2. QUERY: Detalhes do Evento Selecionado
  const { data: eventoDetalhe, isLoading: isLoadingDetalhe } = useQuery({
    queryKey: ["evento-detalhe", selectedEventoId],
    enabled: !!selectedEventoId,
    queryFn: async () => {
      if (!selectedEventoId) return null;
      const [eventoRes, contratantesRes, contratosRes] = await Promise.all([
        supabase.from("turmas").select("*").eq("id", selectedEventoId).maybeSingle(),
        supabase
          .from("alunos")
          .select("*")
          .eq("turma_id", selectedEventoId)
          .neq("status", "inativo")
          .order("nome_completo"),
        supabase.from("contratos").select("*, parcelas(*)").eq("turma_id", selectedEventoId),
      ]);

      if (eventoRes.error) throw eventoRes.error;
      if (contratantesRes.error) throw contratantesRes.error;
      if (contratosRes.error) throw contratosRes.error;

      return {
        evento: eventoRes.data as EventoData,
        contratantes: contratantesRes.data as ContratanteItem[],
        contratos: contratosRes.data || [],
      };
    },
  });

  // Sincroniza pacotes quando o evento selecionado mudar
  useEffect(() => {
    if (eventoDetalhe?.evento) {
      setPacotes(extrairPacotesTurma(eventoDetalhe.evento.observacoes, tipo));
    }
  }, [eventoDetalhe?.evento, tipo]);

  // MUTATION: Criar Evento
  const createEvento = useMutation({
    mutationFn: async (formData: FormData) => {
      const nome = String(formData.get("nome") || "").trim();
      const local = String(formData.get("faculdade") || "").trim();
      const cidade = String(formData.get("cidade") || "").trim();
      const dataEvento = String(formData.get("semestre") || "").trim();

      if (!nome || !local) {
        throw new Error("Preencha o nome do evento e o local.");
      }

      const defaultPacotes = obterPacotesPadraoPorTipo(tipo);
      const observacoesObj = {
        tipo,
        pacotes: defaultPacotes,
        local,
        dataEvento,
      };

      const { data, error } = await supabase
        .from("turmas")
        .insert({
          nome,
          curso:
            tipo === "casamento"
              ? "Casamento"
              : tipo === "festa-aniversario"
              ? "Festa de Aniversário"
              : "Ensaio Fotográfico",
          faculdade: local,
          cidade: cidade || null,
          semestre: dataEvento || null,
          status: "ativa",
          observacoes: JSON.stringify(observacoesObj),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast.success(`Evento "${data.nome}" cadastrado com sucesso!`);
      setOpenCreateEvento(false);
      void queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
      if (data?.id) {
        setSelectedEventoId(data.id);
      }
    },
    onError: (err: any) => toast.error(err.message || "Erro ao criar evento."),
  });

  // MUTATION: Editar Evento
  const updateEvento = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!editingEvento) return;
      const nome = String(formData.get("nome") || "").trim();
      const local = String(formData.get("faculdade") || "").trim();
      const cidade = String(formData.get("cidade") || "").trim();
      const dataEvento = String(formData.get("semestre") || "").trim();
      const status = String(formData.get("status") || "ativa");

      const { error } = await supabase
        .from("turmas")
        .update({
          nome,
          faculdade: local,
          cidade: cidade || null,
          semestre: dataEvento || null,
          status,
        })
        .eq("id", editingEvento.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dados do evento atualizados!");
      setEditingEvento(null);
      void queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
      void queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao atualizar evento."),
  });

  // MUTATION: Excluir Evento
  const deleteEvento = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("turmas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Evento excluído com sucesso.");
      setDeletingEvento(null);
      if (selectedEventoId === deletingEvento?.id) {
        setSelectedEventoId(null);
      }
      void queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao excluir evento."),
  });

  // MUTATION: Salvar Pacotes do Evento
  const salvarPacotes = useMutation({
    mutationFn: async (novosPacotes: PacoteItem[]) => {
      if (!selectedEventoId) return;
      const serialized = serializarPacotesTurma(eventoDetalhe?.evento?.observacoes, novosPacotes);
      const { error } = await supabase
        .from("turmas")
        .update({ observacoes: serialized })
        .eq("id", selectedEventoId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pacotes do evento atualizados!");
      setOpenGerenciarPacotes(false);
      void queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao salvar pacotes."),
  });

  // MUTATION: Adicionar Contratante Manualmente no Evento
  const adicionarContratanteManual = useMutation({
    mutationFn: async () => {
      if (!selectedEventoId) throw new Error("Evento não selecionado.");
      const digitsCpf = apenasDigitos(formCpf);
      if (!formNome.trim() || digitsCpf.length !== 11) {
        throw new Error("Informe o nome completo e um CPF válido (11 dígitos).");
      }

      const pctSelecionado = pacotes.find((p) => p.id === formPacoteId) || pacotes[0];
      const valTotal = parseFloat(formValorTotal) || pctSelecionado?.investimento || 0;
      const valEntrada = parseFloat(formValorEntrada) || 0;
      const valDesc = parseFloat(formDesconto) || 0;
      const qtdParcelas = parseInt(formNumParcelas) || 1;
      const diaVenc = parseInt(formDiaVencimento) || 10;

      // 1. Cadastra Contratante na tabela 'alunos'
      const { data: novoAluno, error: errAluno } = await supabase
        .from("alunos")
        .insert({
          turma_id: selectedEventoId,
          nome_completo: formNome.trim(),
          cpf: digitsCpf,
          whatsapp: formWhatsapp.trim() || null,
          email: formEmail.trim() || cpfParaEmail(digitsCpf),
          status: "ativo",
        })
        .select()
        .single();

      if (errAluno) throw errAluno;

      // 2. Calcula parcelas
      const parcelasCalculadas = calcularParcelasHelper(
        Math.max(0, valTotal - valDesc - valEntrada),
        qtdParcelas,
        diaVenc
      );

      // 3. Cadastra Contrato
      const hoje = new Date().toISOString().slice(0, 10);
      const { data: novoContrato, error: errContrato } = await supabase
        .from("contratos")
        .insert({
          turma_id: selectedEventoId,
          aluno_id: novoAluno.id,
          pacote: pctSelecionado?.nome || "Pacote Personalizado",
          valor_total: valTotal,
          valor_entrada: valEntrada,
          desconto: valDesc,
          num_parcelas: qtdParcelas,
          dia_vencimento: diaVenc,
          forma_pagamento: "pix",
          autoriza_imagem: true,
          status: "ativo",
          data_contrato: hoje,
        })
        .select()
        .single();

      if (errContrato) throw errContrato;

      // 4. Cadastra parcelas
      if (parcelasCalculadas.length > 0) {
        const parcelasInsert = parcelasCalculadas.map((p) => ({
          contrato_id: novoContrato.id,
          numero: p.numero,
          valor: p.valor,
          valor_pago: 0,
          vencimento: p.vencimento,
          status: "pendente",
          forma_pagamento: "pix",
        }));
        await supabase.from("parcelas").insert(parcelasInsert);
      }

      // 5. Salva na store local para acesso imediato
      const allLocal = loadDemandas();
      const novaDemandaStore: DemandaItem = {
        id: novoAluno.id,
        tipo,
        cliente: formNome.trim(),
        cpf: digitsCpf,
        email: formEmail.trim() || cpfParaEmail(digitsCpf),
        whatsapp: formWhatsapp.trim(),
        dataEvento: eventoDetalhe?.evento?.semestre || hoje,
        local: eventoDetalhe?.evento?.faculdade || "Local a definir",
        status: "confirmada",
        pacote: pctSelecionado?.nome || "Pacote",
        valorTotal: valTotal,
        valorEntrada: valEntrada,
        desconto: valDesc,
        numParcelas: qtdParcelas,
        diaVencimento: diaVenc,
        primeiroVencimento: parcelasCalculadas[0]?.vencimento || hoje,
        formaPagamento: "pix",
        loginAtivo: true,
        parcelas: parcelasCalculadas.map((p) => ({
          numero: p.numero,
          vencimento: p.vencimento,
          valor: p.valor,
          status: "pendente",
        })),
        createdAt: new Date().toISOString(),
      };
      saveDemandas([novaDemandaStore, ...allLocal]);

      return novoAluno;
    },
    onSuccess: (aluno) => {
      toast.success(
        `Contratante cadastrado com sucesso! Login liberado com CPF: ${formatarCpf(aluno.cpf || "")}`
      );
      setOpenAddContratante(false);
      setFormNome("");
      setFormCpf("");
      setFormWhatsapp("");
      setFormEmail("");
      void queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
      void queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao cadastrar contratante."),
  });

  // MUTATION: Alternar Status de Parcela (Baixa / Pagamento)
  const toggleParcelaStatus = useMutation({
    mutationFn: async ({ parcelaId, statusAtual }: { parcelaId: string; statusAtual: string }) => {
      const novoStatus = statusAtual === "pago" ? "pendente" : "pago";
      const hoje = new Date().toISOString().slice(0, 10);
      const updateData: { status: string; data_pagamento: string | null; valor_pago?: number } = {
        status: novoStatus,
        data_pagamento: novoStatus === "pago" ? hoje : null,
      };
      if (novoStatus !== "pago") {
        updateData.valor_pago = 0;
      }
      const { error } = await supabase
        .from("parcelas")
        .update(updateData)
        .eq("id", parcelaId);
      if (error) throw error;
      return novoStatus;
    },
    onSuccess: (novoStatus) => {
      toast.success(`Parcela marcada como ${novoStatus === "pago" ? "PAGA" : "PENDENTE"}!`);
      void queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao atualizar parcela."),
  });

  // MUTATION: Excluir Contratante
  const deleteContratante = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alunos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contratante excluído.");
      setDeletingContratante(null);
      void queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
      void queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
    },
    onError: (err: any) => toast.error(err.message || "Erro ao excluir contratante."),
  });

  // Gerenciamento de Pacotes
  const togglePacote = (id: string) => {
    setPacotes(pacotes.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)));
  };

  const adicionarNovoPacote = () => {
    if (!novoNomePacote.trim() || !novoInvestimentoPacote) {
      toast.error("Informe o nome e o valor de investimento do pacote.");
      return;
    }
    const val = parseFloat(novoInvestimentoPacote.replace(/\./g, "").replace(",", "."));
    if (isNaN(val) || val <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    const novo: PacoteItem = {
      id: `custom-${Date.now()}`,
      nome: novoNomePacote.trim(),
      material: novoMaterialPacote.trim() || "Material conforme descrição.",
      investimento: val,
      ativo: true,
    };

    setPacotes([...pacotes, novo]);
    setNovoNomePacote("");
    setNovoMaterialPacote("");
    setNovoInvestimentoPacote("");
    toast.success("Pacote adicionado. Clique em 'Salvar Configurações' para confirmar.");
  };

  const removerPacote = (id: string) => {
    setPacotes(pacotes.filter((p) => p.id !== id));
  };

  // Link de adesão do evento
  const linkAdesao =
    typeof window !== "undefined"
      ? `${window.location.origin}/adesao/${selectedEventoId}`
      : `/adesao/${selectedEventoId}`;

  const copiarLinkAdesao = () => {
    if (typeof navigator !== "undefined") {
      void navigator.clipboard.writeText(linkAdesao);
      setCopiedLink(true);
      toast.success("Link de adesão copiado para a área de transferência!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Filtragem na Lista de Eventos
  const filteredEventos = eventos.filter((e) => {
    const matchQuery =
      e.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.faculdade || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.cidade || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "todos" || e.status === statusFilter;
    return matchQuery && matchStatus;
  });

  // Estatísticas Financeiras do Evento Selecionado
  const contratosEvento = eventoDetalhe?.contratos || [];
  const todasParcelas = contratosEvento.flatMap((c: any) => c.parcelas || []);
  const hojeIso = new Date().toISOString().slice(0, 10);

  const valorContratado = contratosEvento.reduce(
    (s: number, c: any) => s + Number(c.valor_total || 0) - Number(c.desconto || 0),
    0
  );
  const totalEntradas = contratosEvento.reduce(
    (s: number, c: any) => s + Number(c.valor_entrada || 0),
    0
  );
  const totalParcelasPagas = todasParcelas
    .filter((p: any) => p.status === "pago")
    .reduce((s: number, p: any) => s + Number(p.valor || p.valor_pago || 0), 0);
  const totalRecebido = totalEntradas + totalParcelasPagas;
  const saldoAReceber = Math.max(0, valorContratado - totalRecebido);
  const totalEmAtraso = todasParcelas
    .filter((p: any) => p.status !== "pago" && p.vencimento < hojeIso)
    .reduce((s: number, p: any) => s + Number(p.valor || 0), 0);
  const percentualQuitado =
    valorContratado > 0 ? Math.round((totalRecebido / valorContratado) * 100) : 0;
  const pacotesAtivosCount = pacotes.filter((p) => p.ativo !== false).length;

  // Render do Contrato em PDF
  const imprimirContrato = (contratante: ContratanteItem, contrato: any) => {
    gerarContratoPdf({
      aluno: {
        nome_completo: contratante.nome_completo,
        cpf: formatarCpf(contratante.cpf || ""),
        endereco: eventoDetalhe?.evento?.faculdade || "—",
        cidade: eventoDetalhe?.evento?.cidade || "São Paulo, SP",
        telefone: contratante.whatsapp || "—",
        email: contratante.email || cpfParaEmail(contratante.cpf || ""),
      },
      tipoEvento: tipo,
      contrato: {
        pacote: contrato?.pacote || "Pacote de Cobertura",
        valor_total: Number(contrato?.valor_total || 0),
        desconto: Number(contrato?.desconto || 0),
        valor_entrada: Number(contrato?.valor_entrada || 0),
        dia_vencimento: contrato?.dia_vencimento || 10,
        data_contrato: contrato?.data_contrato || hojeIso,
        forma_pagamento: contrato?.forma_pagamento || "pix",
        autoriza_imagem: true,
      },
      parcelas: (contrato?.parcelas || []).map((p: any) => ({
        numero: p.numero,
        vencimento: p.vencimento,
        valor: p.valor,
        status: p.status,
        data_pagamento: p.data_pagamento || null,
        forma_pagamento: contrato?.forma_pagamento || "pix",
      })),
      texto:
        contrato?.texto_contrato ||
        `${titulo.toUpperCase()} — CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E CINEMATOGRÁFICOS

CONTRATANTE: ${contratante.nome_completo.toUpperCase()}, CPF nº ${formatarCpf(contratante.cpf || "")}.
EVENTO: ${eventoDetalhe?.evento?.nome || titulo} — Local: ${
          eventoDetalhe?.evento?.faculdade || "Local do evento"
        } — Data: ${eventoDetalhe?.evento?.semestre || "Data agendada"}.

CLÁUSULA 1ª — DO OBJETO:
O presente contrato tem por objeto a prestação de serviços fotográficos e cinematográficos: "${
          contrato?.pacote
        }".

CLÁUSULA 2ª — DO INVESTIMENTO E PARCELAMENTO:
O valor total ajustado é de ${brl(Number(contrato?.valor_total || 0))}, com entrada de ${brl(
          Number(contrato?.valor_entrada || 0)
        )} e saldo em ${contrato?.num_parcelas || 1} parcelas com vencimento mensal todo dia ${
          contrato?.dia_vencimento || 10
        }.

CLÁUSULA 3ª — DO ACESSO EXCLUSIVO:
O contratante possui acesso liberado ao sistema JM Formaturas & Eventos com login e senha inicial por CPF (${formatarCpf(
          contratante.cpf || ""
        )}).`,
    });
  };

  return (
    <AppShell>
      {/* ========================================================
          VISÃO 1: LISTAGEM DE EVENTOS (QUANDO NENHUM EVENTO ESTÁ SELECIONADO)
         ======================================================== */}
      {!selectedEventoId ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${themeClasses.bgIcon} shadow-sm`}
                >
                  <IconComponent className="size-6" />
                </span>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">DEMANDAS — {titulo}</h1>
                  <p className="text-sm text-muted-foreground">{subtitulo}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setOpenCreateEvento(true)}
              className={`gap-2 shadow-sm ${themeClasses.buttonBg}`}
            >
              <Plus className="size-4" /> Novo Evento ({titulo})
            </Button>
          </div>

          {/* Barra de Busca e Filtro */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`Pesquisar evento de ${titulo.toLowerCase()}, local ou cidade...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativa">Ativo</SelectItem>
                <SelectItem value="concluida">Concluído</SelectItem>
                <SelectItem value="cancelada">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de Cards dos Eventos */}
          {isLoadingEventos && <p className="text-sm text-muted-foreground">Carregando eventos...</p>}

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredEventos.map((evento) => (
              <Card
                key={evento.id}
                className="relative group hover:shadow-elevated transition-all border-border/80 cursor-pointer"
                onClick={() => setSelectedEventoId(evento.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        <IconComponent className={`size-4.5 ${themeClasses.accentText}`} />
                        {evento.nome}
                      </p>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Badge variant={evento.status === "ativa" ? "default" : "secondary"}>
                        {evento.status === "ativa" ? "Ativo" : evento.status}
                      </Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setSelectedEventoId(evento.id)}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="size-4" /> Gerenciar Evento
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEditingEvento(evento)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit className="size-4" /> Editar Evento
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingEvento(evento)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-4" /> Excluir Evento
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <MapPin className={`size-3.5 ${themeClasses.accentText}`} />
                      {evento.faculdade || "Local a definir"}{" "}
                      {evento.cidade ? `· ${evento.cidade}` : ""}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="size-3.5 text-primary" />{" "}
                        {evento.alunos?.[0]?.count ?? 0} contratante(s)
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        {evento.semestre || "Data a definir"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {!isLoadingEventos && filteredEventos.length === 0 && (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
              <IconComponent className="mx-auto size-12 opacity-30 mb-3" />
              <p className="font-semibold text-foreground text-base">
                Nenhum evento de {titulo} cadastrado ainda
              </p>
              <p className="text-sm mt-1">
                Clique em "Novo Evento" acima para cadastrar e gerar links de adesão e contratos.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================
            VISÃO 2: DETALHES E GESTÃO DO EVENTO SELECIONADO (IDÊNTICO A TURMAS.$TURMAID)
           ======================================================== */
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEventoId(null)}
            className="mb-2 -ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Voltar para Lista de {titulo}
          </Button>

          {/* Header do Evento */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${themeClasses.bgIcon} shadow-sm`}
                >
                  <IconComponent className="size-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                      {eventoDetalhe?.evento?.nome ?? "Evento"}
                    </h1>
                    <Badge
                      variant={
                        eventoDetalhe?.evento?.status === "ativa" ? "default" : "secondary"
                      }
                    >
                      {eventoDetalhe?.evento?.status === "ativa"
                        ? "Ativo"
                        : eventoDetalhe?.evento?.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-primary/40 text-primary font-medium"
                    >
                      <Package className="size-3.5" />
                      {pacotesAtivosCount}{" "}
                      {pacotesAtivosCount === 1 ? "pacote ativo" : "pacotes ativos"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />{" "}
                      {eventoDetalhe?.evento?.faculdade || "Local não informado"}
                    </span>
                    {eventoDetalhe?.evento?.cidade && (
                      <span>· {eventoDetalhe?.evento?.cidade}</span>
                    )}
                    {eventoDetalhe?.evento?.semestre && (
                      <span className="flex items-center gap-1">
                        · <Calendar className="size-3.5" /> {eventoDetalhe?.evento?.semestre}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* BARRA DE AÇÕES SUPERIORES */}
            <div className="flex flex-wrap items-center gap-2">
              {/* BOTÃO LINK DE ADESÃO */}
              <Dialog open={openLinkAdesao} onOpenChange={setOpenLinkAdesao}>
                <Button
                  size="sm"
                  onClick={() => setOpenLinkAdesao(true)}
                  className={`gap-1.5 font-semibold shadow-sm ${themeClasses.buttonBg}`}
                >
                  <Link2 className="size-4" /> Link de Adesão
                </Button>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="size-5 text-primary" /> Link de Adesão do Evento
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                      Compartilhe este link com os clientes/noivos/aniversariantes de{" "}
                      <strong>{eventoDetalhe?.evento?.nome}</strong>. Ao acessar, eles escolherão o
                      pacote, preencherão os dados, assinarão o contrato eletronicamente e terão
                      login automático por CPF!
                    </p>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border">
                      <Input
                        readOnly
                        value={linkAdesao}
                        className="font-mono text-xs bg-background border-none shadow-none focus-visible:ring-0"
                      />
                      <Button size="sm" onClick={copiarLinkAdesao} className="gap-1.5 shrink-0">
                        {copiedLink ? <Check className="size-4" /> : <Copy className="size-4" />}
                        {copiedLink ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 flex-1"
                        onClick={() => {
                          const msg = encodeURIComponent(
                            `Olá! Acesse o link oficial para realizar a sua adesão e escolher o pacote de ${titulo.toLowerCase()} (${
                              eventoDetalhe?.evento?.nome
                            }): ${linkAdesao}`
                          );
                          window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
                        }}
                      >
                        <Phone className="size-4 text-green-600" /> Compartilhar no WhatsApp
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 flex-1"
                        onClick={() => window.open(linkAdesao, "_blank")}
                      >
                        <ExternalLink className="size-4" /> Abrir Formulário
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenLinkAdesao(false)}>
                      Fechar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* BOTÃO GERENCIAR PACOTES */}
              <Dialog open={openGerenciarPacotes} onOpenChange={setOpenGerenciarPacotes}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenGerenciarPacotes(true)}
                  className="gap-1.5 border-border"
                >
                  <Package className="size-4 text-primary" /> Gerenciar Pacotes
                </Button>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Package className="size-5 text-primary" /> Pacotes de {titulo} do Evento
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-2">
                    <p className="text-sm text-muted-foreground">
                      Ative ou desative os pacotes disponíveis para adesão deste evento, ou cadastre
                      novos pacotes personalizados.
                    </p>

                    {/* Lista de pacotes configurados */}
                    <div className="space-y-3">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">
                        Pacotes Cadastrados
                      </Label>
                      <div className="space-y-2.5">
                        {pacotes.map((p) => (
                          <div
                            key={p.id}
                            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                              p.ativo !== false
                                ? "bg-card border-border"
                                : "bg-muted/40 border-border/50 opacity-60"
                            }`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-foreground">{p.nome}</span>
                                <Badge
                                  variant={p.ativo !== false ? "default" : "secondary"}
                                  className="text-[10px]"
                                >
                                  {p.ativo !== false ? "Ativo na adesão" : "Desativado"}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{p.material}</p>
                              <p className="text-sm font-extrabold text-primary pt-1">
                                {brl(p.investimento)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 pt-1">
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor={`switch-${p.id}`}
                                  className="text-xs font-normal cursor-pointer hidden sm:inline"
                                >
                                  {p.ativo !== false ? "Ativo" : "Inativo"}
                                </Label>
                                <Switch
                                  id={`switch-${p.id}`}
                                  checked={p.ativo !== false}
                                  onCheckedChange={() => togglePacote(p.id)}
                                />
                              </div>
                              {p.id.startsWith("custom-") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-destructive hover:bg-destructive/10"
                                  onClick={() => removerPacote(p.id)}
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Adicionar novo pacote customizado */}
                    <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-3">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <PlusCircle className="size-4 text-primary" /> Cadastrar Novo Pacote
                        Personalizado
                      </Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Nome do pacote (ex: PACOTE VIP - ÁLBUM + DRONE)"
                          value={novoNomePacote}
                          onChange={(e) => setNovoNomePacote(e.target.value)}
                        />
                        <Input
                          placeholder="Material/Descrição (ex: Cobertura 6h, 1 Álbum 30x30, Drone 4K)"
                          value={novoMaterialPacote}
                          onChange={(e) => setNovoMaterialPacote(e.target.value)}
                        />
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Valor de investimento (ex: 5.500,00)"
                            value={novoInvestimentoPacote}
                            onChange={(e) => setNovoInvestimentoPacote(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={adicionarNovoPacote}
                            className="shrink-0 gap-1.5"
                          >
                            <Plus className="size-4" /> Adicionar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => setOpenGerenciarPacotes(false)}>
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => salvarPacotes.mutate(pacotes)}
                      disabled={salvarPacotes.isPending}
                      className="gap-2"
                    >
                      {salvarPacotes.isPending ? "Salvando..." : "Salvar Configurações de Pacotes"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* BOTÃO + NOVO CONTRATANTE MANUAL */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenAddContratante(true)}
                className="gap-1.5 border-border"
              >
                <Plus className="size-4 text-emerald-600" /> + Novo Contratante
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingEvento(eventoDetalhe?.evento || null)}
                className="gap-1.5"
              >
                <Edit className="size-4" /> Editar Evento
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingEvento(eventoDetalhe?.evento || null)}
                className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" /> Excluir Evento
              </Button>
            </div>
          </div>

          {/* LISTA DE CONTRATANTES / CLIENTES */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4 text-primary" /> Contratantes / Clientes do Evento (
                  {eventoDetalhe?.contratantes?.length || 0})
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Clientes cadastrados via link de adesão online ou inseridos manualmente pela
                  administração.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setOpenAddContratante(true)}
                className="gap-1 text-xs"
              >
                <Plus className="size-3.5" /> Adicionar Contratante
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {eventoDetalhe?.contratantes?.length === 0 && (
                <div className="py-12 text-center text-muted-foreground text-sm rounded-xl border border-dashed p-6">
                  <User className="mx-auto size-10 opacity-30 mb-2" />
                  <p className="font-medium text-foreground">
                    Nenhum contratante cadastrado neste evento ainda.
                  </p>
                  <p className="text-xs mt-1">
                    Envie o link de adesão para os clientes ou clique em "+ Novo Contratante" acima
                    para cadastrar.
                  </p>
                </div>
              )}

              {eventoDetalhe?.contratantes?.map((contratante) => {
                const contrato = eventoDetalhe.contratos.find(
                  (c: any) => c.aluno_id === contratante.id
                );
                const parcelas = contrato?.parcelas || [];
                const parcelasPagas = parcelas.filter((p: any) => p.status === "pago").length;

                return (
                  <div
                    key={contratante.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 hover:bg-muted/40 transition-colors"
                  >
                    <Link
                      to="/alunos/$alunoId"
                      params={{ alunoId: contratante.id }}
                      className="flex-1 min-w-[220px] group/item"
                    >
                      <p className="font-semibold text-foreground group-hover/item:text-primary hover:text-primary transition-colors flex items-center gap-2">
                        <User className="size-4 text-primary" /> {contratante.nome_completo}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap">
                        {contratante.cpf && (
                          <span className="font-mono">CPF: {formatarCpf(contratante.cpf)}</span>
                        )}
                        {contratante.whatsapp && <span>WhatsApp: {contratante.whatsapp}</span>}
                        {contrato?.pacote && (
                          <span className="font-medium text-foreground/80">
                            · {contrato.pacote}
                          </span>
                        )}
                      </p>
                    </Link>

                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2 hidden sm:block">
                        <p className="text-xs font-bold text-foreground">
                          {brl(
                            Number(contrato?.valor_total || 0) - Number(contrato?.desconto || 0)
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {parcelasPagas}/{parcelas.length} parcelas pagas
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[11px] text-emerald-600 border-emerald-300"
                      >
                        Login liberado (CPF)
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingContratoItem({ contratante, contrato })}
                        className="h-8 text-xs gap-1.5"
                      >
                        <FileText className="size-3.5 text-primary" /> Contrato & Parcelas
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground"
                          >
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => imprimirContrato(contratante, contrato)}
                            className="gap-2 cursor-pointer"
                          >
                            <FileDown className="size-4 text-primary" /> Gerar PDF do Contrato
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeletingContratante(contratante)}
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-4" /> Excluir Contratante
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* ESTATÍSTICAS FINANCEIRAS DO EVENTO */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Estatísticas Financeiras do Evento ({contratosEvento.length} contrato
                {contratosEvento.length === 1 ? "" : "s"})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-border px-4 py-3 bg-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Valor Contratado
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">{brl(valorContratado)}</p>
                </div>
                <div className="rounded-xl border border-border px-4 py-3 bg-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Já Recebido</p>
                  <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {brl(totalRecebido)}
                  </p>
                </div>
                <div className="rounded-xl border border-border px-4 py-3 bg-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Falta Receber
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">{brl(saldoAReceber)}</p>
                </div>
                <div className="rounded-xl border border-border px-4 py-3 bg-card">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Em Atraso</p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      totalEmAtraso > 0 ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {brl(totalEmAtraso)}
                  </p>
                </div>
              </div>

              <div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${Math.min(percentualQuitado, 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {percentualQuitado}% do valor contratado arrecadado ·{" "}
                  {todasParcelas.filter((p: any) => p.status === "pago").length}/
                  {todasParcelas.length} parcelas quitadas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================
          MODAL: CADASTRAR NOVO EVENTO
         ======================================================== */}
      <Dialog open={openCreateEvento} onOpenChange={setOpenCreateEvento}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconComponent className={`size-5 ${themeClasses.accentText}`} />
              Cadastrar Novo Evento ({titulo})
            </DialogTitle>
          </DialogHeader>
          <form
            id="form-novo-evento"
            className="space-y-3 py-2"
            onSubmit={(e) => {
              e.preventDefault();
              createEvento.mutate(new FormData(e.currentTarget));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome do Evento / Cliente *</Label>
              <Input
                id="nome"
                name="nome"
                placeholder={
                  tipo === "casamento"
                    ? "Ex: Casamento Mariana & Rodrigo"
                    : tipo === "festa-aniversario"
                    ? "Ex: 15 Anos Sofia Martins"
                    : "Ex: Ensaio Pré-Wedding Gabriela & Lucas"
                }
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="faculdade">{tipo === "ensaio" ? "Local do Ensaio *" : "Local / Espaço do Evento *"}</Label>
                <Input
                  id="faculdade"
                  name="faculdade"
                  placeholder="Ex: Buffet Villa Regia"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cidade">Cidade</Label>
                <Input id="cidade" name="cidade" placeholder="Ex: São Paulo - SP" />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="semestre">{tipo === "ensaio" ? "Data" : "Data do Evento"}</Label>
                <Input id="semestre" name="semestre" type="date" />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpenCreateEvento(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form="form-novo-evento"
              disabled={createEvento.isPending}
              className={themeClasses.buttonBg}
            >
              {createEvento.isPending ? "Salvando..." : "Salvar e Abrir Evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: EDITAR EVENTO
         ======================================================== */}
      <Dialog open={!!editingEvento} onOpenChange={(v) => !v && setEditingEvento(null)}>
        {editingEvento && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{tipo === "ensaio" ? "Editar Dados do Ensaio" : "Editar Dados do Evento"}</DialogTitle>
            </DialogHeader>
            <form
              id="form-edit-evento"
              className="space-y-3 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                updateEvento.mutate(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="edit_nome">Nome do Evento *</Label>
                <Input id="edit_nome" name="nome" defaultValue={editingEvento.nome} required />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit_faculdade">{tipo === "ensaio" ? "Local do Ensaio *" : "Local / Espaço *"}</Label>
                  <Input
                    id="edit_faculdade"
                    name="faculdade"
                    defaultValue={editingEvento.faculdade}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit_cidade">Cidade</Label>
                  <Input
                    id="edit_cidade"
                    name="cidade"
                    defaultValue={editingEvento.cidade || ""}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit_semestre">{tipo === "ensaio" ? "Data" : "Data do Evento"}</Label>
                  <Input
                    id="edit_semestre"
                    name="semestre"
                    type="date"
                    defaultValue={editingEvento.semestre || ""}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit_status">Status</Label>
                  <select
                    id="edit_status"
                    name="status"
                    defaultValue={editingEvento.status}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="ativa">Ativo</option>
                    <option value="concluida">Concluído</option>
                    <option value="cancelada">Cancelado</option>
                  </select>
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingEvento(null)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-edit-evento" disabled={updateEvento.isPending}>
                {updateEvento.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ========================================================
          ALERT: EXCLUIR EVENTO
         ======================================================== */}
      <AlertDialog open={!!deletingEvento} onOpenChange={(v) => !v && setDeletingEvento(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o evento <strong>{deletingEvento?.nome}</strong>? Esta
              ação removerá todos os contratantes, contratos e parcelas associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingEvento && deleteEvento.mutate(deletingEvento.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Evento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ========================================================
          MODAL: ADICIONAR CONTRATANTE MANUALMENTE
         ======================================================== */}
      <Dialog open={openAddContratante} onOpenChange={setOpenAddContratante}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" /> Cadastrar Novo Contratante / Cliente
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              adicionarContratanteManual.mutate();
            }}
            className="space-y-4 py-2"
          >
            <div className="space-y-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground border-b pb-1">
                1. Dados do Contratante & Login por CPF
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="c_nome">Nome Completo do Contratante *</Label>
                  <Input
                    id="c_nome"
                    placeholder="Ex: Mariana & Rodrigo"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_cpf">CPF (Login e Senha de Acesso) *</Label>
                  <Input
                    id="c_cpf"
                    placeholder="000.000.000-00"
                    value={formCpf}
                    onChange={(e) => setFormCpf(e.target.value)}
                    maxLength={14}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_whats">WhatsApp / Telefone</Label>
                  <Input
                    id="c_whats"
                    placeholder="(11) 99999-9999"
                    value={formWhatsapp}
                    onChange={(e) => setFormWhatsapp(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="c_email">E-mail</Label>
                  <Input
                    id="c_email"
                    type="email"
                    placeholder="cliente@email.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-muted-foreground border-b pb-1">
                2. Pacote Contratado & Parcelamento
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="c_pacote">Pacote Selecionado</Label>
                  <Select
                    value={formPacoteId || pacotes[0]?.id || ""}
                    onValueChange={(val) => {
                      setFormPacoteId(val);
                      const pct = pacotes.find((p) => p.id === val);
                      if (pct) setFormValorTotal(pct.investimento.toString());
                    }}
                  >
                    <SelectTrigger id="c_pacote">
                      <SelectValue placeholder="Selecione um pacote" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacotes.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nome} — {brl(p.investimento)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_val">Valor Total (R$) *</Label>
                  <Input
                    id="c_val"
                    type="number"
                    value={formValorTotal || pacotes[0]?.investimento?.toString() || "0"}
                    onChange={(e) => setFormValorTotal(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_entrada">Valor de Entrada (R$)</Label>
                  <Input
                    id="c_entrada"
                    type="number"
                    value={formValorEntrada}
                    onChange={(e) => setFormValorEntrada(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_desc">Desconto (R$)</Label>
                  <Input
                    id="c_desc"
                    type="number"
                    value={formDesconto}
                    onChange={(e) => setFormDesconto(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_parc">Qtd. de Parcelas</Label>
                  <Select value={formNumParcelas} onValueChange={setFormNumParcelas}>
                    <SelectTrigger id="c_parc">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n}x {n === 1 ? "(À vista)" : "parcelas"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c_dia">Dia de Vencimento</Label>
                  <Select value={formDiaVencimento} onValueChange={setFormDiaVencimento}>
                    <SelectTrigger id="c_dia">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 25, 28].map((dia) => (
                        <SelectItem key={dia} value={dia.toString()}>
                          Todo dia {dia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenAddContratante(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={adicionarContratanteManual.isPending}
                className="gap-2"
              >
                {adicionarContratanteManual.isPending
                  ? "Salvando..."
                  : "Cadastrar e Gerar Contrato"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL: VISUALIZAR CONTRATO & PARCELAS (BAIXA DE PARCELAS)
         ======================================================== */}
      <Dialog
        open={!!viewingContratoItem}
        onOpenChange={(v) => !v && setViewingContratoItem(null)}
      >
        {viewingContratoItem && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="size-5 text-primary" />
                    Contrato & Parcelas — {viewingContratoItem.contratante.nome_completo}
                  </DialogTitle>
                  <DialogDescription className="text-xs mt-1">
                    Acompanhe o contrato, controle a quitação de parcelas e gere o PDF do documento.
                  </DialogDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    imprimirContrato(
                      viewingContratoItem.contratante,
                      viewingContratoItem.contrato
                    )
                  }
                  className="gap-1.5 shrink-0"
                >
                  <FileDown className="size-4" /> Gerar PDF
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-3">
              {/* Resumo do Contrato */}
              <div className="rounded-xl border border-border p-4 bg-muted/30 grid gap-3 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    Pacote Contratado
                  </p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {viewingContratoItem.contrato?.pacote || "Pacote Padrão"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">Valor Total</p>
                  <p className="font-bold text-primary mt-0.5">
                    {brl(
                      Number(viewingContratoItem.contrato?.valor_total || 0) -
                        Number(viewingContratoItem.contrato?.desconto || 0)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    Login do Cliente
                  </p>
                  <p className="font-mono font-medium text-foreground mt-0.5 flex items-center gap-1">
                    <KeyRound className="size-3.5 text-gold" />
                    {formatarCpf(viewingContratoItem.contratante.cpf || "")}
                  </p>
                </div>
              </div>

              {/* Tabela de Parcelas com Baixa em 1 Clique */}
              <div className="space-y-3">
                <Label className="text-xs uppercase font-bold text-muted-foreground">
                  Parcelas do Contrato (Clique no botão para dar baixa)
                </Label>
                <div className="space-y-2">
                  {(viewingContratoItem.contrato?.parcelas || []).map((parcela: any) => {
                    const isPaga = parcela.status === "pago";
                    return (
                      <div
                        key={parcela.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isPaga
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
                            : "bg-card border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                              isPaga
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {parcela.numero}ª
                          </span>
                          <div>
                            <p className="font-semibold text-sm text-foreground">
                              {brl(Number(parcela.valor || 0))}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Vencimento:{" "}
                              {new Date(parcela.vencimento + "T00:00:00").toLocaleDateString(
                                "pt-BR"
                              )}
                              {parcela.data_pagamento && ` · Pago em: ${parcela.data_pagamento}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isPaga ? "default" : "secondary"}
                            className={
                              isPaga
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            }
                          >
                            {isPaga ? "PAGO" : "PENDENTE"}
                          </Badge>

                          <Button
                            size="sm"
                            variant={isPaga ? "outline" : "default"}
                            onClick={() =>
                              toggleParcelaStatus.mutate({
                                parcelaId: parcela.id,
                                statusAtual: parcela.status,
                              })
                            }
                            disabled={toggleParcelaStatus.isPending}
                            className="h-8 text-xs gap-1"
                          >
                            <CheckCircle2 className="size-3.5" />
                            {isPaga ? "Estornar" : "Dar Baixa"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingContratoItem(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ========================================================
          ALERT: EXCLUIR CONTRATANTE
         ======================================================== */}
      <AlertDialog
        open={!!deletingContratante}
        onOpenChange={(v) => !v && setDeletingContratante(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Contratante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover{" "}
              <strong>{deletingContratante?.nome_completo}</strong> deste evento? Esta ação removerá
              o contrato e as parcelas associadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingContratante && deleteContratante.mutate(deletingContratante.id)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Contratante
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
