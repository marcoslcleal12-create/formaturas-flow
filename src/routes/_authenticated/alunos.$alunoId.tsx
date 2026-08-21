import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  KeyRound, 
  Plus, 
  Edit, 
  Trash2, 
  CreditCard, 
  User, 
  AlertCircle, 
  FileText, 
  CheckCircle2,
  GraduationCap,
  Package,
  FileDown,
  Eye,
  Save,
  Camera,
  ExternalLink,
  UserX
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { criarAcessoFormando } from "@/lib/alunos.functions";
import { AppShell, brl } from "@/components/app/AppShell";
import { CLAUSULAS_PADRAO, FORMAS_PAGAMENTO, gerarContratoPdf } from "@/lib/contrato-modelo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export const Route = createFileRoute("/_authenticated/alunos/$alunoId")({
  head: () => ({
    meta: [
      { title: "Formando | JM Formaturas" },
      { name: "description", content: "Dados do formando, contrato de formatura, parcelas e pagamentos." },
      { property: "og:title", content: "Formando | JM Formaturas" },
      { property: "og:description", content: "Contrato, parcelas e situação financeira do formando." },
    ],
  }),
  component: AlunoDetalhe,
});

const contratoSchema = z.object({
  pacote: z.string().trim().min(2, "Informe o pacote").max(120),
  valor_total: z.number().positive("Valor total deve ser maior que zero"),
  desconto: z.number().min(0).default(0),
  valor_entrada: z.number().min(0).default(0),
  num_parcelas: z.number().int().min(1, "Mínimo 1 parcela").max(60),
  dia_vencimento: z.number().int().min(1).max(31),
  primeiro_vencimento: z.string().min(10, "Data inválida"),
  forma_pagamento: z.string().default("boleto"),
});

const SELPICS_URL = "https://sso.youfocus.com.br/login?app_id=NDVlNGNjMjEtMTE4NC0xMWYxLThiZGYtM2EzZTUwN2Q2MDlh";

const alunoEditSchema = z.object({
  nome_completo: z.string().trim().min(3, "Informe o nome completo").max(120),
  cpf: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  data_nascimento: z.string().trim().max(10).optional(),
  cidade: z.string().trim().max(120).optional(),
  endereco: z.string().trim().max(200).optional(),
});

function num(form: FormData, key: string): number {
  const v = form.get(key);
  if (!v) return 0;
  const n = parseFloat(String(v).replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function AlunoDetalhe() {
  const { alunoId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openCreateContrato, setOpenCreateContrato] = useState(false);
  const [openEditContrato, setOpenEditContrato] = useState(false);
  const [openDeleteContrato, setOpenDeleteContrato] = useState(false);

  const [openEditAluno, setOpenEditAluno] = useState(false);
  const [openDeleteAluno, setOpenDeleteAluno] = useState(false);
  const [openInativarAluno, setOpenInativarAluno] = useState(false);
  const [motivoInativacao, setMotivoInativacao] = useState("");

  const [showDados, setShowDados] = useState(false);
  const [showTurma, setShowTurma] = useState(false);
  const [showPacote, setShowPacote] = useState(false);
  const [showContrato, setShowContrato] = useState(false);
  const [showSel1, setShowSel1] = useState(false);
  const [showSel2, setShowSel2] = useState(false);
  const [showSel3, setShowSel3] = useState(false);
  const [textoContrato, setTextoContrato] = useState<string>(CLAUSULAS_PADRAO);

  const criarAcesso = useServerFn(criarAcessoFormando);

  const { data } = useQuery({
    queryKey: ["aluno", alunoId],
    queryFn: async () => {
      const aluno = await supabase
        .from("alunos")
        .select("*, turmas(id, nome, curso, faculdade, semestre)")
        .eq("id", alunoId)
        .maybeSingle();
      if (aluno.error) throw aluno.error;
      const contrato = await supabase
        .from("contratos")
        .select("*, parcelas(*)")
        .eq("aluno_id", alunoId)
        .maybeSingle();
      if (contrato.error) throw contrato.error;
      return { aluno: aluno.data, contrato: contrato.data };
    },
  });

  const aluno = data?.aluno;
  const contrato = data?.contrato;
  const parcelas = [...(contrato?.parcelas ?? [])].sort((a, b) => a.numero - b.numero);

  useEffect(() => {
    if (contrato?.texto_contrato) {
      setTextoContrato(contrato.texto_contrato);
    }
  }, [contrato?.texto_contrato]);

  // Update Aluno Details Mutation
  const updateAluno = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = alunoEditSchema.parse({
        nome_completo: form.get("nome_completo"),
        cpf: form.get("cpf") || undefined,
        whatsapp: form.get("whatsapp") || undefined,
        email: form.get("email") || undefined,
        data_nascimento: form.get("data_nascimento") || undefined,
        cidade: form.get("cidade") || undefined,
        endereco: form.get("endereco") || undefined,
      });

      const { error } = await supabase
        .from("alunos")
        .update({
          nome_completo: parsed.nome_completo,
          cpf: parsed.cpf ? parsed.cpf.replace(/\D/g, "") : null,
          whatsapp: parsed.whatsapp ?? null,
          email: parsed.email || null,
          data_nascimento: parsed.data_nascimento || null,
          cidade: parsed.cidade ?? null,
          endereco: parsed.endereco ?? null,
        })
        .eq("id", alunoId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dados do formando atualizados com sucesso!");
      setOpenEditAluno(false);
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  // Update Links Aluno Mutation
  const updateLinksAluno = useMutation({
    mutationFn: async (data: {
      link_fotos_selecionadas?: string | null;
      prazo_fotos_selecionadas?: number | null;
      fotos_liberadas?: boolean;
      link_aprovacao_album?: string | null;
      album_liberado?: boolean;
    }) => {
      const updatePayload: any = { ...data };
      if (data.prazo_fotos_selecionadas) {
        const date = new Date();
        date.setDate(date.getDate() + data.prazo_fotos_selecionadas);
        updatePayload.vencimento_fotos_selecionadas = date.toISOString().split("T")[0];
      } else if (data.prazo_fotos_selecionadas === null) {
        updatePayload.vencimento_fotos_selecionadas = null;
      }

      const { error } = await supabase
        .from("alunos")
        .update(updatePayload)
        .eq("id", alunoId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dados de seleção atualizados com sucesso!");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
    },
    onError: (error) => toast.error(`Erro ao salvar: ${(error as Error).message}`),
  });

  // Delete Aluno Mutation
  const deleteAluno = useMutation({
    mutationFn: async () => {
      const turmaId = aluno?.turma_id;
      const { error } = await supabase.from("alunos").delete().eq("id", alunoId);
      if (error) throw error;
      return turmaId;
    },
    onSuccess: (turmaId) => {
      toast.success("Formando excluído com sucesso.");
      void queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
      if (turmaId) {
        void navigate({ to: "/turmas/$turmaId", params: { turmaId } });
      } else {
        void navigate({ to: "/turmas" });
      }
    },
    onError: (error) => toast.error(`Erro ao excluir formando: ${(error as Error).message}`),
  });

  // Inativar Aluno Mutation
  const inativarAluno = useMutation({
    mutationFn: async (motivo: string) => {
      const { error } = await supabase
        .from("alunos")
        .update({
          status: "inativo",
          motivo_inativacao: motivo.trim() || null,
        })
        .eq("id", alunoId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cadastro do formando inativado com sucesso!");
      setOpenInativarAluno(false);
      setMotivoInativacao("");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) => toast.error(`Erro ao inativar cliente: ${(error as Error).message}`),
  });

  // Reativar Aluno Mutation
  const reativarAluno = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("alunos")
        .update({
          status: "ativo",
          motivo_inativacao: null,
        })
        .eq("id", alunoId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cadastro do formando reativado com sucesso!");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) => toast.error(`Erro ao reativar cliente: ${(error as Error).message}`),
  });

  // Generate Access Mutation
  const gerarAcesso = useMutation({
    mutationFn: () => criarAcesso({ data: { alunoId } }),
    onSuccess: (res) => {
      toast.success(`Acesso criado — login e senha: CPF ${res.login}`, {
        duration: 12000,
      });
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
    },
    onError: (error) => toast.error((error as Error).message),
  });

  // Create Contract Mutation
  const criarContrato = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = contratoSchema.parse({
        pacote: form.get("pacote"),
        valor_total: num(form, "valor_total"),
        desconto: num(form, "desconto"),
        valor_entrada: num(form, "valor_entrada"),
        num_parcelas: num(form, "num_parcelas"),
        dia_vencimento: num(form, "dia_vencimento"),
        primeiro_vencimento: String(form.get("primeiro_vencimento") ?? ""),
        forma_pagamento: String(form.get("forma_pagamento") ?? "boleto"),
      });

      const financiado = parsed.valor_total - parsed.desconto - parsed.valor_entrada;
      if (financiado <= 0) throw new Error("O valor a parcelar precisa ser maior que zero.");

      const { data: novo, error } = await supabase
        .from("contratos")
        .insert({
          aluno_id: alunoId,
          turma_id: aluno?.turma_id ?? null,
          pacote: parsed.pacote,
          valor_total: parsed.valor_total,
          desconto: parsed.desconto,
          valor_entrada: parsed.valor_entrada,
          num_parcelas: parsed.num_parcelas,
          dia_vencimento: parsed.dia_vencimento,
          forma_pagamento: parsed.forma_pagamento,
        })
        .select("id")
        .single();
      if (error) throw error;

      const base = Math.floor((financiado / parsed.num_parcelas) * 100) / 100;
      const resto = Math.round((financiado - base * parsed.num_parcelas) * 100) / 100;
      const inicio = new Date(`${parsed.primeiro_vencimento}T12:00:00`);

      const linhas = Array.from({ length: parsed.num_parcelas }, (_, i) => {
        const venc = new Date(inicio);
        venc.setMonth(venc.getMonth() + i);
        return {
          contrato_id: novo.id,
          numero: i + 1,
          valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base,
          vencimento: venc.toISOString().slice(0, 10),
        };
      });
      const hojeIso = new Date().toISOString().slice(0, 10);
      const comEntrada =
        parsed.valor_entrada > 0
          ? [
              {
                contrato_id: novo.id,
                numero: 0,
                valor: parsed.valor_entrada,
                vencimento: hojeIso,
              },
              ...linhas,
            ]
          : linhas;

      const { error: parcelasError } = await supabase.from("parcelas").insert(comEntrada);
      if (parcelasError) throw parcelasError;
    },
    onSuccess: () => {
      toast.success("Contrato e parcelas gerados com sucesso!");
      setOpenCreateContrato(false);
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  // Edit Contract Mutation
  const updateContrato = useMutation({
    mutationFn: async (form: FormData) => {
      if (!contrato) return;
      const parsed = contratoSchema.parse({
        pacote: form.get("pacote"),
        valor_total: num(form, "valor_total"),
        desconto: num(form, "desconto"),
        valor_entrada: num(form, "valor_entrada"),
        num_parcelas: num(form, "num_parcelas"),
        dia_vencimento: num(form, "dia_vencimento"),
        primeiro_vencimento: String(form.get("primeiro_vencimento") ?? ""),
        forma_pagamento: String(form.get("forma_pagamento") ?? "boleto"),
      });

      const { error: updateError } = await supabase
        .from("contratos")
        .update({
          pacote: parsed.pacote,
          valor_total: parsed.valor_total,
          desconto: parsed.desconto,
          valor_entrada: parsed.valor_entrada,
          num_parcelas: parsed.num_parcelas,
          dia_vencimento: parsed.dia_vencimento,
          forma_pagamento: parsed.forma_pagamento,
        })
        .eq("id", contrato.id);
      if (updateError) throw updateError;

      // Check if user wants to recalculate parcelas
      const recalcular = form.get("recalcular_parcelas") === "sim";
      if (recalcular) {
        const financiado = parsed.valor_total - parsed.desconto - parsed.valor_entrada;
        if (financiado <= 0) throw new Error("O valor a parcelar precisa ser maior que zero.");

        // Delete previous parcelas
        await supabase.from("parcelas").delete().eq("contrato_id", contrato.id);

        const base = Math.floor((financiado / parsed.num_parcelas) * 100) / 100;
        const resto = Math.round((financiado - base * parsed.num_parcelas) * 100) / 100;
        const inicio = new Date(`${parsed.primeiro_vencimento}T12:00:00`);

        const linhas = Array.from({ length: parsed.num_parcelas }, (_, i) => {
          const venc = new Date(inicio);
          venc.setMonth(venc.getMonth() + i);
          return {
            contrato_id: contrato.id,
            numero: i + 1,
            valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base,
            vencimento: venc.toISOString().slice(0, 10),
          };
        });
        const hojeIso = new Date().toISOString().slice(0, 10);
        const comEntrada =
          parsed.valor_entrada > 0
            ? [
                {
                  contrato_id: contrato.id,
                  numero: 0,
                  valor: parsed.valor_entrada,
                  vencimento: hojeIso,
                },
                ...linhas,
              ]
            : linhas;

        const { error: parcelasError } = await supabase.from("parcelas").insert(comEntrada);
        if (parcelasError) throw parcelasError;
      }
    },
    onSuccess: () => {
      toast.success("Contrato e pacote atualizados com sucesso!");
      setOpenEditContrato(false);
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  // Delete Contract Mutation
  const deleteContrato = useMutation({
    mutationFn: async () => {
      if (!contrato) return;
      // Delete parcelas first
      await supabase.from("parcelas").delete().eq("contrato_id", contrato.id);
      // Delete contrato
      const { error } = await supabase.from("contratos").delete().eq("id", contrato.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contrato excluído com sucesso. Agora você pode criar um novo.");
      setOpenDeleteContrato(false);
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) => toast.error(`Erro ao excluir contrato: ${(error as Error).message}`),
  });

  // Toggle Parcela Status Mutation
  const toggleParcela = useMutation({
    mutationFn: async ({ id, valor, pago }: { id: string; valor: number; pago: boolean }) => {
      const { error } = await supabase
        .from("parcelas")
        .update(
          pago
            ? { status: "pendente", valor_pago: 0, data_pagamento: null }
            : {
                status: "pago",
                valor_pago: valor,
                data_pagamento: new Date().toISOString().slice(0, 10),
              },
        )
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status da parcela atualizado!");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) => toast.error((error as Error).message),
  });

  // Salvar Cláusulas do Contrato
  const salvarContratoTexto = useMutation({
    mutationFn: async () => {
      if (!contrato) return;
      const { error } = await supabase
        .from("contratos")
        .update({ texto_contrato: textoContrato })
        .eq("id", contrato.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cláusulas do contrato salvas com sucesso!");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) => toast.error(`Erro ao salvar contrato: ${(error as Error).message}`),
  });

  const handleBaixarContratoPdf = () => {
    if (!aluno || !contrato) return;
    gerarContratoPdf({
      aluno: {
        nome_completo: aluno.nome_completo,
        cpf: aluno.cpf,
        endereco: aluno.endereco,
        cidade: aluno.cidade,
        telefone: aluno.whatsapp || aluno.telefone,
        email: aluno.email,
        turma_nome: aluno.turmas?.nome || null,
      },
      contrato: {
        pacote: contrato.pacote,
        valor_total: Number(contrato.valor_total),
        desconto: Number(contrato.desconto || 0),
        valor_entrada: Number(contrato.valor_entrada || 0),
        dia_vencimento: contrato.dia_vencimento || 10,
        data_contrato: contrato.data_contrato || hoje,
        forma_pagamento: contrato.forma_pagamento || "boleto",
        autoriza_imagem: contrato.autoriza_imagem !== false,
      },
      parcelas: parcelas.map((p) => ({
        numero: p.numero,
        valor: Number(p.valor),
        vencimento: p.vencimento,
        status: p.status,
        data_pagamento: p.data_pagamento,
        forma_pagamento: p.forma_pagamento,
      })),
      texto: textoContrato || contrato.texto_contrato || CLAUSULAS_PADRAO,
    });
    toast.success("Download do contrato em PDF iniciado!");
  };

  const hoje = new Date().toISOString().slice(0, 10);
  const totalPago = parcelas.reduce((s, p) => s + Number(p.valor_pago), 0);
  const totalParcelas = parcelas.reduce((s, p) => s + Number(p.valor), 0);
  const atrasadas = parcelas.filter((p) => p.status !== "pago" && p.vencimento < hoje);

  return (
    <AppShell>
      <Link
        to="/turmas/$turmaId"
        params={{ turmaId: aluno?.turma_id ?? "" }}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="size-4" /> Voltar para a turma
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{aluno?.nome_completo ?? "Formando"}</h1>
            {aluno?.status === "inativo" ? (
              <Badge variant="destructive" className="bg-amber-600 hover:bg-amber-700 text-white">Inativo</Badge>
            ) : aluno?.user_id ? (
              <Badge className="bg-emerald-600">Acesso Ativo (CPF: {aluno.login_usuario})</Badge>
            ) : (
              <Badge variant="secondary">Sem acesso gerado</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {aluno?.turmas?.nome ?? "Sem turma"} · CPF: {aluno?.cpf ?? "Não informado"} · Tel: {aluno?.whatsapp ?? "—"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenEditAluno(true)} className="gap-1.5">
            <Edit className="size-4" /> Editar Formando
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDeleteAluno(true)}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" /> Excluir Formando
          </Button>

          {aluno?.status === "inativo" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => reativarAluno.mutate()}
              disabled={reativarAluno.isPending}
              className="gap-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/20"
            >
              <UserX className="size-4" /> Reativar Cadastro
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenInativarAluno(true)}
              className="gap-1.5 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/20"
            >
              <UserX className="size-4" /> Inativar Cliente
            </Button>
          )}

          {!aluno?.user_id && (
            <Button size="sm" onClick={() => gerarAcesso.mutate()} disabled={gerarAcesso.isPending} className="gap-1.5">
              <KeyRound className="size-4" /> Liberar Acesso (Login CPF)
            </Button>
          )}
        </div>
      </div>

      {aluno?.status === "inativo" && (
        <Card className="mb-6 shadow-card border-amber-500/40 bg-amber-500/5">
          <CardContent className="pt-6 text-sm text-foreground flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-700 dark:text-amber-500 block mb-1">Cadastro Inativo</strong>
              <p className="text-muted-foreground text-xs">
                Este formando foi inativado. 
                {aluno.motivo_inativacao ? (
                  <> Motivo registrado: <span className="font-semibold text-foreground">"{aluno.motivo_inativacao}"</span></>
                ) : (
                  " Nenhum motivo foi especificado."
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!aluno?.user_id && (
        <Card className="mb-6 shadow-card border-gold/40 bg-gold/5">
          <CardContent className="pt-6 text-sm text-foreground flex items-center gap-3">
            <KeyRound className="size-5 text-gold shrink-0" />
            <div>
              <strong>Acesso do Formando:</strong> O acesso é liberado usando o <strong>CPF como login</strong> e o <strong>CPF como senha inicial</strong>.
            </div>
          </CardContent>
        </Card>
      )}

      {/* LINHA DE DADOS */}
      {aluno && (
        <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Card 1: Dados do Formando */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <User className="size-4 text-gold shrink-0" />
                Dados do Formando
              </CardTitle>
              <Button
                variant={!showDados ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setShowDados(!showDados)}
              >
                {showDados ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showDados && (
              <CardContent className="p-4 pt-0 space-y-1.5 text-xs border-t border-border/40 mt-1 pt-2.5">
                <Info label="Nome Completo" value={aluno.nome_completo} />
                <Info label="CPF" value={aluno.cpf} />
                {aluno.rg && <Info label="RG" value={aluno.rg} />}
                <Info label="Telefone" value={aluno.telefone || aluno.whatsapp} />
                <Info label="WhatsApp" value={aluno.whatsapp} />
                <Info label="E-mail" value={aluno.email} />
                <Info label="Endereço" value={aluno.endereco} />
                <Info label="Cidade" value={aluno.cidade} />
                {aluno.data_nascimento && (
                  <Info label="Data Nasc." value={new Date(aluno.data_nascimento + "T12:00:00").toLocaleDateString("pt-BR")} />
                )}
              </CardContent>
            )}
          </Card>

          {/* Card 2: Dados da Turma */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3 flex-wrap">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <GraduationCap className="size-4 text-gold shrink-0" />
                Dados da Turma
              </CardTitle>
              <Button
                variant={!showTurma ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setShowTurma(!showTurma)}
              >
                {showTurma ? "Ocultar" : "Visualizar"}
              </Button>
              <Badge variant="secondary" className="text-[11px] py-0 px-1.5 ml-auto">
                {aluno.status ?? "Ativo"}
              </Badge>
            </CardHeader>
            {showTurma && (
              <CardContent className="p-4 pt-0 space-y-1.5 text-xs border-t border-border/40 mt-1 pt-2.5">
                <Info label="Turma" value={aluno.turmas?.nome} />
                <Info label="Curso" value={aluno.turmas?.curso} />
                <Info label="Faculdade" value={aluno.turmas?.faculdade} />
                {aluno.turmas?.semestre && <Info label="Semestre" value={aluno.turmas?.semestre} />}
              </CardContent>
            )}
          </Card>

          {/* Card 3: Pacote Escolhido */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <Package className="size-4 text-gold shrink-0" />
                Pacote Escolhido
              </CardTitle>
              <Button
                variant={!showPacote ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setShowPacote(!showPacote)}
              >
                {showPacote ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showPacote && (
              <CardContent className="p-4 pt-0 space-y-1.5 text-xs border-t border-border/40 mt-1 pt-2.5">
                {contrato ? (
                  <>
                    <Info label="Pacote" value={contrato.pacote} />
                    <Info label="Valor Total" value={brl(Number(contrato.valor_total))} />
                    {Number(contrato.desconto) > 0 && <Info label="Desconto" value={brl(Number(contrato.desconto))} />}
                    {Number(contrato.valor_entrada) > 0 && <Info label="Entrada" value={brl(Number(contrato.valor_entrada))} />}
                    <Info label="Condição" value={`${contrato.num_parcelas}x no ${contrato.forma_pagamento || "boleto"}`} />
                    <Info label="Dia Vencimento" value={`Todo dia ${contrato.dia_vencimento || 10}`} />
                    {aluno?.turmas?.semestre && <Info label="Semestre" value={aluno.turmas.semestre} />}
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs py-2">Nenhum pacote contratado no momento.</p>
                )}
              </CardContent>
            )}
          </Card>

          {/* Card 4: Contrato */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <FileText className="size-4 text-gold shrink-0" />
                Contrato
              </CardTitle>
              <Button
                variant={!showContrato ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md"
                onClick={() => setShowContrato(!showContrato)}
              >
                {showContrato ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showContrato && (
              <CardContent className="p-4 pt-0 space-y-2 text-xs border-t border-border/40 mt-1 pt-2.5">
                {contrato ? (
                  <>
                    <p className="text-muted-foreground text-xs">
                      Documento de <span className="font-medium text-foreground">{contrato.pacote}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 gap-1">
                            <Eye className="size-3.5" /> Ver / Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                          <DialogHeader>
                            <DialogTitle>Contrato</DialogTitle>
                          </DialogHeader>
                          <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="texto-contrato-page" className="font-semibold">Cláusulas (editáveis)</Label>
                              <button
                                type="button"
                                className="text-xs text-muted-foreground underline hover:text-foreground"
                                onClick={() => setTextoContrato(CLAUSULAS_PADRAO)}
                              >
                                restaurar modelo padrão
                              </button>
                            </div>
                            <Textarea
                              id="texto-contrato-page"
                              value={textoContrato}
                              onChange={(e) => setTextoContrato(e.target.value)}
                              className="min-h-[340px] font-mono text-xs leading-relaxed"
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={salvarContratoTexto.isPending}
                              onClick={() => salvarContratoTexto.mutate()}
                              className="gap-1.5"
                            >
                              <Save className="size-4" /> Salvar Alterações
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        className="h-7 text-xs px-2.5 gap-1"
                        onClick={handleBaixarContratoPdf}
                      >
                        <FileDown className="size-3.5" /> Baixar PDF
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-xs py-2">Nenhum contrato gerado ainda.</p>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* LINHA DE SELEÇÃO */}
      {aluno && (
        <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start">
          {/* Card 1: Seleção */}
          <Card className="shadow-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <Camera className="size-4 text-gold shrink-0" />
                SELEÇÃO
              </CardTitle>
              <Button
                variant={!showSel1 ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md ml-auto"
                onClick={() => setShowSel1(!showSel1)}
              >
                {showSel1 ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showSel1 && (
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground border-t border-border/40 mt-1 pt-2.5 flex-1 flex flex-col">
                <p className="mb-3">Plataforma YouFocus. O Formando acessa com o mesmo CPF.</p>
                <Button asChild variant="secondary" size="sm" className="w-full mt-auto">
                  <a href={SELPICS_URL} target="_blank" rel="noopener noreferrer">
                    Acessar Link <ExternalLink className="size-3.5 ml-1" />
                  </a>
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Card 2: Minhas Fotos Selecionadas */}
          <Card className="shadow-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3 flex-wrap">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="size-4 text-gold shrink-0" />
                MINHAS FOTOS SELECIONADAS
              </CardTitle>
              <Button
                variant={!showSel2 ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md ml-auto"
                onClick={() => setShowSel2(!showSel2)}
              >
                {showSel2 ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showSel2 && (
              <CardContent className="p-4 pt-0 border-t border-border/40 mt-1 pt-2.5 flex-1">
                <form 
                  className="space-y-3 flex flex-col h-full"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    const prazoStr = form.get("prazo_fotos_selecionadas") as string;
                    updateLinksAluno.mutate({
                      link_fotos_selecionadas: form.get("link_fotos_selecionadas") as string || null,
                      prazo_fotos_selecionadas: prazoStr ? parseInt(prazoStr, 10) : null,
                      fotos_liberadas: form.get("fotos_liberadas") === "on",
                    });
                  }}
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Link de Hospedagem</Label>
                    <Input 
                      name="link_fotos_selecionadas" 
                      className="h-8 text-xs" 
                      placeholder="https://..." 
                      defaultValue={aluno.link_fotos_selecionadas || ""} 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Prazo de Vencimento (Dias)</Label>
                    <Input 
                      name="prazo_fotos_selecionadas" 
                      type="number" 
                      className="h-8 text-xs" 
                      placeholder="Ex: 150"
                      defaultValue={aluno.prazo_fotos_selecionadas || ""} 
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1 pb-1">
                    <Switch 
                      id="fotos_liberadas" 
                      name="fotos_liberadas" 
                      defaultChecked={aluno.fotos_liberadas || false} 
                    />
                    <Label htmlFor="fotos_liberadas" className="text-xs font-medium cursor-pointer">
                      Liberar visualização
                    </Label>
                  </div>
                  <div className="flex-1"></div>
                  <Button size="sm" className="w-full h-8 text-xs mt-3" disabled={updateLinksAluno.isPending}>
                    {updateLinksAluno.isPending ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>

          {/* Card 3: Aprovação de Álbum */}
          <Card className="shadow-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3 flex-wrap">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                <FileText className="size-4 text-gold shrink-0" />
                APROVAÇÃO DE ÁLBUM
              </CardTitle>
              <Button
                variant={!showSel3 ? "default" : "secondary"}
                size="sm"
                className="h-7 text-xs px-2.5 rounded-md ml-auto"
                onClick={() => setShowSel3(!showSel3)}
              >
                {showSel3 ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showSel3 && (
              <CardContent className="p-4 pt-0 border-t border-border/40 mt-1 pt-2.5 flex-1">
                <form 
                  className="space-y-3 h-full flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    updateLinksAluno.mutate({
                      link_aprovacao_album: form.get("link_aprovacao_album") as string || null,
                      album_liberado: form.get("album_liberado") === "on",
                    });
                  }}
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Link do Álbum</Label>
                    <Input 
                      name="link_aprovacao_album" 
                      className="h-8 text-xs" 
                      placeholder="https://..." 
                      defaultValue={aluno.link_aprovacao_album || ""} 
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-1 pb-1">
                    <Switch 
                      id="album_liberado" 
                      name="album_liberado" 
                      defaultChecked={aluno.album_liberado || false} 
                    />
                    <Label htmlFor="album_liberado" className="text-xs font-medium cursor-pointer">
                      Liberar visualização
                    </Label>
                  </div>
                  <div className="flex-1"></div>
                  <Button size="sm" className="w-full h-8 text-xs mt-auto" disabled={updateLinksAluno.isPending}>
                    {updateLinksAluno.isPending ? "Salvando..." : "Salvar Aprovação"}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* SEÇÃO DO CONTRATO E FINANCEIRO */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="size-5 text-gold" /> Contrato, Pacote & Parcelamento
        </h2>

        {!contrato ? (
          <Dialog open={openCreateContrato} onOpenChange={setOpenCreateContrato}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 rounded-md gap-1.5">
                <Plus className="size-3.5" /> Criar contrato & pacote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Novo Contrato de Formatura</DialogTitle>
              </DialogHeader>
              <form
                id="form-contrato"
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  criarContrato.mutate(new FormData(e.currentTarget));
                }}
              >
                <Campo name="pacote" label="Pacote Contratado *" defaultValue="Pacote Completo (Foto + Álbum)" required />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Campo name="valor_total" label="Valor total (R$) *" type="number" step="0.01" defaultValue="4500" required />
                  <Campo name="desconto" label="Desconto (R$)" type="number" step="0.01" defaultValue="0" />
                  <Campo name="valor_entrada" label="Entrada (R$)" type="number" step="0.01" defaultValue="500" />
                  <Campo name="num_parcelas" label="Nº de parcelas *" type="number" defaultValue="10" required />
                  <Campo name="dia_vencimento" label="Dia de vencimento *" type="number" defaultValue="10" required />
                  <Campo name="primeiro_vencimento" label="1º vencimento *" type="date" defaultValue={hoje} required />
                  <div className="space-y-1.5">
                    <Label htmlFor="forma_pagamento">Forma de pagamento</Label>
                    <select
                      id="forma_pagamento"
                      name="forma_pagamento"
                      defaultValue="boleto"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {FORMAS_PAGAMENTO.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenCreateContrato(false)}>
                  Cancelar
                </Button>
                <Button type="submit" form="form-contrato" disabled={criarContrato.isPending}>
                  {criarContrato.isPending ? "Gerando..." : "Gerar contrato e parcelas"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpenEditContrato(true)} className="h-7 text-xs px-2.5 rounded-md gap-1.5">
              <Edit className="size-3.5" /> Editar Pacote / Contrato
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDeleteContrato(true)}
              className="h-7 text-xs px-2.5 rounded-md gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-3.5" /> Excluir Contrato
            </Button>
          </div>
        )}
      </div>

      {!contrato && (
        <Card className="shadow-card border-dashed p-10 text-center text-muted-foreground">
          <FileText className="mx-auto size-10 opacity-30 mb-2" />
          <p className="font-semibold text-foreground">Nenhum contrato cadastrado para este formando</p>
          <p className="text-xs mt-1">Cadastre o pacote e gere o parcelamento clicando no botão acima.</p>
        </Card>
      )}

      {contrato && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-start gap-3">
            <Resumo titulo="Valor do contrato" valor={brl(Number(contrato.valor_total))} icon={FileText} />
            <Resumo titulo="Total parcelado" valor={brl(totalParcelas)} icon={CreditCard} />
            <Resumo titulo="Recebido" valor={brl(totalPago)} icon={CheckCircle2} />
            <Resumo titulo="Em atraso" valor={String(atrasadas.length)} destaque={atrasadas.length > 0} icon={AlertCircle} />
          </div>

          {/* PARCELAS */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Parcelas · {contrato.pacote} ({parcelas.length})</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Clique para marcar como Pago ou Pendente
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {parcelas.map((p) => {
                const pago = p.status === "pago";
                const atrasada = !pago && p.vencimento < hoje;
                return (
                  <div
                    key={p.id}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${
                      atrasada
                        ? "border-destructive/60 bg-destructive/10 text-destructive font-medium"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${atrasada ? "text-destructive font-bold" : ""}`}>
                        {p.numero === 0 ? "Entrada" : `Parcela ${p.numero}`} · {brl(Number(p.valor))}
                      </p>
                      <p className={`text-xs ${atrasada ? "text-destructive/80 font-medium" : "text-muted-foreground"}`}>
                        Vencimento: {new Date(`${p.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}
                        {p.data_pagamento && ` · Pago em: ${new Date(`${p.data_pagamento}T12:00:00`).toLocaleDateString("pt-BR")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={pago ? "default" : atrasada ? "destructive" : "secondary"}
                        className={pago ? "bg-emerald-600 hover:bg-emerald-700" : atrasada ? "bg-destructive text-destructive-foreground font-bold" : ""}
                      >
                        {pago ? "pago" : atrasada ? "atrasada" : "pendente"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL: EDITAR DADOS DO FORMANDO */}
      <Dialog open={openEditAluno} onOpenChange={setOpenEditAluno}>
        {aluno && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Dados do Formando</DialogTitle>
            </DialogHeader>
            <form
              id="form-edit-aluno-page"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateAluno.mutate(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="nome_completo">Nome completo *</Label>
                <Input id="nome_completo" name="nome_completo" defaultValue={aluno.nome_completo} required maxLength={120} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" name="cpf" defaultValue={aluno.cpf || ""} placeholder="000.000.000-00" maxLength={20} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" defaultValue={aluno.whatsapp || ""} placeholder="(11) 99999-9999" maxLength={20} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" defaultValue={aluno.email || ""} placeholder="aluno@email.com" maxLength={255} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                  <Input id="data_nascimento" name="data_nascimento" type="date" defaultValue={aluno.data_nascimento || ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" name="cidade" defaultValue={aluno.cidade || ""} maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endereco">Endereço Completo</Label>
                  <Input id="endereco" name="endereco" defaultValue={aluno.endereco || ""} maxLength={200} />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenEditAluno(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-edit-aluno-page" disabled={updateAluno.isPending}>
                {updateAluno.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ALERT DIALOG: EXCLUIR FORMANDO */}
      <AlertDialog open={openDeleteAluno} onOpenChange={setOpenDeleteAluno}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" /> Excluir Formando
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o formando <strong>{aluno?.nome_completo}</strong>?
              Esta ação removerá o contrato, histórico de parcelas e login de acesso associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAluno.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Formando
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL: EDITAR CONTRATO & PACOTE */}
      <Dialog open={openEditContrato} onOpenChange={setOpenEditContrato}>
        {contrato && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Editar Pacote e Contrato</DialogTitle>
            </DialogHeader>
            <form
              id="form-edit-contrato"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateContrato.mutate(new FormData(e.currentTarget));
              }}
            >
              <Campo name="pacote" label="Pacote Contratado *" defaultValue={contrato.pacote} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Campo name="valor_total" label="Valor total (R$) *" type="number" step="0.01" defaultValue={String(contrato.valor_total)} required />
                <Campo name="desconto" label="Desconto (R$)" type="number" step="0.01" defaultValue={String(contrato.desconto ?? 0)} />
                <Campo name="valor_entrada" label="Entrada (R$)" type="number" step="0.01" defaultValue={String(contrato.valor_entrada ?? 0)} />
                <Campo name="num_parcelas" label="Nº de parcelas *" type="number" defaultValue={String(contrato.num_parcelas)} required />
                <Campo name="dia_vencimento" label="Dia de vencimento *" type="number" defaultValue={String(contrato.dia_vencimento ?? 10)} required />
                <Campo name="primeiro_vencimento" label="1º vencimento *" type="date" defaultValue={contrato.data_contrato || hoje} required />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="forma_pagamento">Forma de pagamento</Label>
                  <select
                    id="forma_pagamento"
                    name="forma_pagamento"
                    defaultValue={contrato.forma_pagamento}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {FORMAS_PAGAMENTO.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2 p-3 rounded-lg bg-muted/60 border text-xs">
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="recalcular_parcelas" value="sim" defaultChecked className="rounded border-input" />
                    <span>Recalcular e recriar quadro de parcelas automaticamente com os novos valores</span>
                  </Label>
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenEditContrato(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-edit-contrato" disabled={updateContrato.isPending}>
                {updateContrato.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ALERT DIALOG: EXCLUIR CONTRATO */}
      <AlertDialog open={openDeleteContrato} onOpenChange={setOpenDeleteContrato}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="size-5" /> Excluir Contrato & Parcelas
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o contrato e todas as parcelas deste formando?
              Esta ação permite que você cadastre um novo pacote do zero.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteContrato.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Contrato
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG: INATIVAR ALUNO */}
      <Dialog open={openInativarAluno} onOpenChange={setOpenInativarAluno}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-amber-600 flex items-center gap-2">
              <UserX className="size-5" /> Inativar Cliente
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              <strong>Tem certeza que deseja inativar o cadastro de {aluno?.nome_completo}?</strong><br />
              Você está prestes a inativar este formando. Ele não aparecerá mais na listagem ativa da turma.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="motivo">Motivo da Inativação *</Label>
              <Textarea
                id="motivo"
                placeholder="Ex: Formando desistiu da formatura, trancou o curso, etc."
                value={motivoInativacao}
                onChange={(e) => setMotivoInativacao(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenInativarAluno(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => inativarAluno.mutate(motivoInativacao)}
              disabled={!motivoInativacao.trim() || inativarAluno.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {inativarAluno.isPending ? "Inativando..." : "Confirmar Inativação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Resumo({ titulo, valor, destaque, icon: Icon }: { titulo: string; valor: string; destaque?: boolean; icon?: any }) {
  return (
    <Card className="shadow-card h-full flex flex-col min-w-[160px]">
      <CardHeader className="flex flex-row items-center gap-2 p-3 pb-2">
        <CardTitle className="text-[11px] font-semibold flex items-center gap-1.5 shrink-0 uppercase">
          {Icon && <Icon className="size-3.5 text-gold shrink-0" />}
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 text-xs border-t border-border/40 mt-1 pt-2 flex-1 flex flex-col justify-center">
        <p className={`text-base font-semibold ${destaque ? "text-destructive" : ""}`}>{valor}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1 border-b border-border/40 last:border-0">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Campo({
  name,
  label,
  type = "text",
  step,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} step={step} defaultValue={defaultValue} required={required} />
    </div>
  );
}
