import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
  GraduationCap,
  Link2,
  Copy,
  Check,
  Package,
  ExternalLink,
  PlusCircle,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AppShell, brl } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  extrairPacotesTurma,
  serializarPacotesTurma,
  PACOTES_PADRAO,
  type PacoteItem
} from "@/lib/turma-pacotes";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/turmas/$turmaId")({
  head: () => ({
    meta: [
      { title: "Detalhes da turma | JM Formaturas" },
      { name: "description", content: "Formandos, dados de contato e situação da turma de formatura." },
      { property: "og:title", content: "Detalhes da turma | JM Formaturas" },
      { property: "og:description", content: "Lista de formandos e informações da turma na JM Formaturas." },
    ],
  }),
  component: TurmaDetalhe,
});

const alunoSchema = z.object({
  nome_completo: z.string().trim().min(3, "Informe o nome completo").max(120),
  cpf: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  data_nascimento: z.string().trim().max(10).optional(),
});

const turmaEditSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome da turma").max(120),
  curso: z.string().trim().min(2, "Informe o curso").max(120),
  faculdade: z.string().trim().min(2, "Informe a faculdade").max(120),
  cidade: z.string().trim().max(120).optional(),
  semestre: z.string().trim().max(20).optional(),
  previsao_formatura: z.string().trim().max(10).optional(),
  status: z.string().optional(),
});

interface AlunoItem {
  id: string;
  turma_id: string;
  nome_completo: string;
  cpf: string | null;
  whatsapp: string | null;
  email: string | null;
  data_nascimento: string | null;
  user_id: string | null;
  status: string;
}

function TurmaDetalhe() {
  const { turmaId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openEditTurma, setOpenEditTurma] = useState(false);
  const [openDeleteTurma, setOpenDeleteTurma] = useState(false);
  const [openLinkAdesao, setOpenLinkAdesao] = useState(false);
  const [openGerenciarPacotes, setOpenGerenciarPacotes] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [editingAluno, setEditingAluno] = useState<AlunoItem | null>(null);
  const [deletingAluno, setDeletingAluno] = useState<AlunoItem | null>(null);

  // Estado local dos pacotes da turma
  const [pacotes, setPacotes] = useState<PacoteItem[]>(PACOTES_PADRAO);
  const [novoNome, setNovoNome] = useState("");
  const [novoMaterial, setNovoMaterial] = useState("");
  const [novoInvestimento, setNovoInvestimento] = useState("");

  const { data } = useQuery({
    queryKey: ["turma", turmaId],
    queryFn: async () => {
      const [turma, alunos, contratos] = await Promise.all([
        supabase.from("turmas").select("*").eq("id", turmaId).maybeSingle(),
        supabase.from("alunos").select("*").eq("turma_id", turmaId).order("nome_completo"),
        supabase.from("contratos").select("*, parcelas(*)").eq("turma_id", turmaId),
      ]);
      if (turma.error) throw turma.error;
      if (alunos.error) throw alunos.error;
      if (contratos.error) throw contratos.error;
      return { turma: turma.data, alunos: alunos.data as AlunoItem[], contratos: contratos.data };
    },
  });

  const turma = data?.turma;
  const alunos = data?.alunos ?? [];
  const contratos = data?.contratos ?? [];

  useEffect(() => {
    if (turma?.observacoes) {
      setPacotes(extrairPacotesTurma(turma.observacoes));
    }
  }, [turma?.observacoes]);

  const pacotesAtivos = pacotes.filter((p) => p.ativo !== false);
  const linkAdesao = typeof window !== "undefined" ? `${window.location.origin}/adesao/${turmaId}` : `/adesao/${turmaId}`;

  const copiarLink = () => {
    if (typeof navigator !== "undefined") {
      void navigator.clipboard.writeText(linkAdesao);
      setCopiedLink(true);
      toast.success("Link de adesão copiado para a área de transferência!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Salvar Pacotes Mutation
  const salvarPacotes = useMutation({
    mutationFn: async (novosPacotes: PacoteItem[]) => {
      const serialized = serializarPacotesTurma(turma?.observacoes, novosPacotes);
      const { error } = await supabase
        .from("turmas")
        .update({ observacoes: serialized })
        .eq("id", turmaId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Pacotes da turma atualizados com sucesso!");
      setOpenGerenciarPacotes(false);
      void queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) => toast.error(`Erro ao salvar pacotes: ${(error as Error).message}`),
  });

  const togglePacote = (id: string) => {
    const atualizados = pacotes.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p));
    setPacotes(atualizados);
  };

  const adicionarNovoPacote = () => {
    if (!novoNome.trim() || !novoInvestimento) {
      toast.error("Informe o nome e o valor de investimento do pacote.");
      return;
    }
    const val = parseFloat(novoInvestimento.replace(/\./g, "").replace(",", "."));
    if (isNaN(val) || val <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }

    const novo: PacoteItem = {
      id: `custom-${Date.now()}`,
      nome: novoNome.trim(),
      material: novoMaterial.trim() || "Material conforme descrição.",
      investimento: val,
      ativo: true,
    };

    setPacotes([...pacotes, novo]);
    setNovoNome("");
    setNovoMaterial("");
    setNovoInvestimento("");
    toast.success("Novo pacote adicionado à lista. Clique em Salvar para confirmar.");
  };

  const removerPacote = (id: string) => {
    setPacotes(pacotes.filter((p) => p.id !== id));
  };

  // Update Turma Mutation
  const updateTurma = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = turmaEditSchema.parse({
        nome: form.get("nome"),
        curso: form.get("curso"),
        faculdade: form.get("faculdade"),
        cidade: form.get("cidade") || undefined,
        semestre: form.get("semestre") || undefined,
        previsao_formatura: form.get("previsao_formatura") || undefined,
        status: form.get("status") || "ativa",
      });
      const { error } = await supabase
        .from("turmas")
        .update({
          nome: parsed.nome,
          curso: parsed.curso,
          faculdade: parsed.faculdade,
          cidade: parsed.cidade ?? null,
          semestre: parsed.semestre ?? null,
          previsao_formatura: parsed.previsao_formatura || null,
          status: parsed.status ?? "ativa",
        })
        .eq("id", turmaId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Turma atualizada com sucesso!");
      setOpenEditTurma(false);
      void queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  // Delete Turma Mutation
  const deleteTurma = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("turmas").delete().eq("id", turmaId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Turma excluída com sucesso.");
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
      void navigate({ to: "/turmas" });
    },
    onError: (error) => toast.error(`Erro ao excluir turma: ${(error as Error).message}`),
  });

  // Update Aluno Mutation
  const updateAluno = useMutation({
    mutationFn: async (form: FormData) => {
      if (!editingAluno) return;
      const parsed = alunoSchema.parse({
        nome_completo: form.get("nome_completo"),
        cpf: form.get("cpf") || undefined,
        whatsapp: form.get("whatsapp") || undefined,
        email: form.get("email") || undefined,
        data_nascimento: form.get("data_nascimento") || undefined,
      });
      const { error } = await supabase
        .from("alunos")
        .update({
          nome_completo: parsed.nome_completo,
          cpf: parsed.cpf ? parsed.cpf.replace(/\D/g, "") : null,
          whatsapp: parsed.whatsapp ?? null,
          email: parsed.email || null,
          data_nascimento: parsed.data_nascimento || null,
        })
        .eq("id", editingAluno.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dados do formando atualizados!");
      setEditingAluno(null);
      void queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
      void queryClient.invalidateQueries({ queryKey: ["aluno"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  // Delete Aluno Mutation
  const deleteAluno = useMutation({
    mutationFn: async (alunoId: string) => {
      const { error } = await supabase.from("alunos").delete().eq("id", alunoId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Formando excluído com sucesso.");
      setDeletingAluno(null);
      void queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
    },
    onError: (error) => toast.error(`Erro ao excluir formando: ${(error as Error).message}`),
  });

  const hoje = new Date().toISOString().slice(0, 10);
  const todasParcelas = contratos.flatMap((c) => c.parcelas ?? []);
  const contratado = contratos.reduce(
    (s, c) => s + Number(c.valor_total) - Number(c.desconto),
    0,
  );
  const entradas = contratos.reduce((s, c) => s + Number(c.valor_entrada), 0);
  const recebidoParcelas = todasParcelas.reduce((s, p) => s + Number(p.valor_pago), 0);
  const recebido = entradas + recebidoParcelas;
  const aReceber = Math.max(contratado - recebido, 0);
  const atrasado = todasParcelas
    .filter((p) => p.status !== "pago" && p.vencimento < hoje)
    .reduce((s, p) => s + (Number(p.valor) - Number(p.valor_pago)), 0);
  const percentual = contratado > 0 ? Math.round((recebido / contratado) * 100) : 0;

  return (
    <AppShell>
      <Link to="/turmas" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
        <ArrowLeft className="size-4" /> Voltar para Turmas
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{turma?.nome ?? "Turma"}</h1>
            <Badge variant={turma?.status === "ativa" ? "default" : "secondary"}>
              {turma?.status ?? "ativa"}
            </Badge>
            <Badge variant="outline" className="gap-1.5 border-primary/40 text-primary font-medium">
              <Package className="size-3.5" />
              {pacotesAtivos.length} {pacotesAtivos.length === 1 ? "pacote ativo" : "pacotes ativos"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {turma?.curso} · {turma?.faculdade} · {turma?.semestre ?? "Sem semestre"} · {turma?.cidade ?? "Sem cidade"}
          </p>
        </div>

        {/* BARRA DE AÇÕES SUPERIORES */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* BOTÃO LINK DE ADESÃO */}
          <Dialog open={openLinkAdesao} onOpenChange={setOpenLinkAdesao}>
            <Button
              size="sm"
              onClick={() => setOpenLinkAdesao(true)}
              className="gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm"
            >
              <Link2 className="size-4" /> Link de Adesão
            </Button>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 text-primary" /> Link de Adesão dos Formandos
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Compartilhe este link com os formandos da turma <strong>{turma?.nome}</strong>. Ao acessar, eles preencherão o formulário de 4 etapas e criarão automaticamente o login com CPF.
                </p>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border">
                  <Input
                    readOnly
                    value={linkAdesao}
                    className="font-mono text-xs bg-background border-none shadow-none focus-visible:ring-0"
                  />
                  <Button size="sm" onClick={copiarLink} className="gap-1.5 shrink-0">
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
                      const msg = encodeURIComponent(`Olá formandos da turma ${turma?.nome}! Acessem o link para realizar a adesão e escolher o pacote de formatura: ${linkAdesao}`);
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
                  <Package className="size-5 text-primary" /> Pacotes de Formatura da Turma
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-2">
                <p className="text-sm text-muted-foreground">
                  Ative ou desative os pacotes disponíveis para adesão desta turma, ou cadastre novos pacotes personalizados.
                </p>

                {/* Lista de pacotes configurados */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase font-bold text-muted-foreground">Pacotes Cadastrados</Label>
                  <div className="space-y-2.5">
                    {pacotes.map((p) => (
                      <div
                        key={p.id}
                        className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                          p.ativo !== false ? "bg-card border-border" : "bg-muted/40 border-border/50 opacity-60"
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground">{p.nome}</span>
                            <Badge variant={p.ativo !== false ? "default" : "secondary"} className="text-[10px]">
                              {p.ativo !== false ? "Ativo na adesão" : "Desativado"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{p.material}</p>
                          <p className="text-sm font-extrabold text-primary pt-1">{brl(p.investimento)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`switch-${p.id}`} className="text-xs font-normal cursor-pointer hidden sm:inline">
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
                    <PlusCircle className="size-4 text-primary" /> Cadastrar Novo Pacote Personalizado
                  </Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="Nome do pacote (ex: 5º PACOTE - ÁLBUM VIP + QUADRO)"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                    />
                    <Input
                      placeholder="Material/Descrição (ex: Álbum 30x30, 80 fotos, quadro 50x70)"
                      value={novoMaterial}
                      onChange={(e) => setNovoMaterial(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Valor de investimento (ex: 2.800,00)"
                        value={novoInvestimento}
                        onChange={(e) => setNovoInvestimento(e.target.value)}
                      />
                      <Button type="button" variant="secondary" onClick={adicionarNovoPacote} className="shrink-0 gap-1.5">
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

          <Button variant="outline" size="sm" onClick={() => setOpenEditTurma(true)} className="gap-1.5">
            <Edit className="size-4" /> Editar Turma
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDeleteTurma(true)}
            className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" /> Excluir Turma
          </Button>
        </div>
      </div>


      {/* LISTA DE FORMANDOS */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Formandos ({alunos.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {alunos.length === 0 && (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Nenhum formando cadastrado nesta turma ainda.
            </div>
          )}
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 hover:bg-muted/40 transition-colors"
            >
              <Link
                to="/alunos/$alunoId"
                params={{ alunoId: aluno.id }}
                className="flex-1 min-w-[200px]"
              >
                <p className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <User className="size-4 text-primary" /> {aluno.nome_completo}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-3">
                  {aluno.cpf && <span>CPF: {aluno.cpf}</span>}
                  {aluno.whatsapp && <span>WhatsApp: {aluno.whatsapp}</span>}
                  {aluno.email && <span>{aluno.email}</span>}
                </p>
              </Link>

              <div className="flex items-center gap-2">
                <Badge variant={aluno.user_id ? "default" : "secondary"}>
                  {aluno.user_id ? "acesso ativo" : "sem acesso"}
                </Badge>

                <Button asChild variant="outline" size="sm" className="h-8 text-xs">
                  <Link to="/alunos/$alunoId" params={{ alunoId: aluno.id }}>
                    Contrato & Detalhes
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingAluno(aluno)}
                      className="gap-2 cursor-pointer"
                    >
                      <Edit className="size-4" /> Editar Formando
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingAluno(aluno)}
                      className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-4" /> Excluir Formando
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ESTATÍSTICAS FINANCEIRAS */}
      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">
            Estatísticas financeiras da turma ({contratos.length} contrato{contratos.length === 1 ? "" : "s"})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <Estat titulo="Valor contratado" valor={brl(contratado)} />
            <Estat titulo="Já recebido" valor={brl(recebido)} />
            <Estat titulo="Falta receber" valor={brl(aReceber)} />
            <Estat titulo="Em atraso" valor={brl(atrasado)} destaque={atrasado > 0} />
          </div>
          <div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${Math.min(percentual, 100)}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {percentual}% do valor contratado já foi recebido · {todasParcelas.filter((p) => p.status === "pago").length}
              /{todasParcelas.length} parcelas quitadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: EDITAR TURMA */}
      <Dialog open={openEditTurma} onOpenChange={setOpenEditTurma}>
        {turma && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Dados da Turma</DialogTitle>
            </DialogHeader>
            <form
              id="form-edit-turma-page"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateTurma.mutate(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="nome">Nome da turma *</Label>
                <Input id="nome" name="nome" defaultValue={turma.nome} required maxLength={120} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="curso">Curso *</Label>
                  <Input id="curso" name="curso" defaultValue={turma.curso} required maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="faculdade">Faculdade *</Label>
                  <Input id="faculdade" name="faculdade" defaultValue={turma.faculdade} required maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" name="cidade" defaultValue={turma.cidade || ""} maxLength={120} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="semestre">Semestre</Label>
                  <Input id="semestre" name="semestre" defaultValue={turma.semestre || ""} maxLength={20} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="previsao_formatura">Previsão de formatura</Label>
                <Input
                  id="previsao_formatura"
                  name="previsao_formatura"
                  type="date"
                  defaultValue={turma.previsao_formatura || ""}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={turma.status}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="ativa">Ativa</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenEditTurma(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-edit-turma-page" disabled={updateTurma.isPending}>
                {updateTurma.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ALERT DIALOG: EXCLUIR TURMA */}
      <AlertDialog open={openDeleteTurma} onOpenChange={setOpenDeleteTurma}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma <strong>{turma?.nome}</strong>?
              Esta ação removerá todos os formandos e contratos vinculados a esta turma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTurma.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Turma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL: EDITAR FORMANDO */}
      <Dialog open={!!editingAluno} onOpenChange={(v) => !v && setEditingAluno(null)}>
        {editingAluno && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Formando</DialogTitle>
            </DialogHeader>
            <form
              id="form-edit-aluno"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateAluno.mutate(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="edit_nome_completo">Nome completo *</Label>
                <Input
                  id="edit_nome_completo"
                  name="nome_completo"
                  defaultValue={editingAluno.nome_completo}
                  required
                  maxLength={120}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit_cpf">CPF</Label>
                  <Input
                    id="edit_cpf"
                    name="cpf"
                    defaultValue={editingAluno.cpf || ""}
                    placeholder="000.000.000-00"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit_whatsapp">WhatsApp</Label>
                  <Input
                    id="edit_whatsapp"
                    name="whatsapp"
                    defaultValue={editingAluno.whatsapp || ""}
                    placeholder="(11) 99999-9999"
                    maxLength={20}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit_email">E-mail</Label>
                  <Input
                    id="edit_email"
                    name="email"
                    type="email"
                    defaultValue={editingAluno.email || ""}
                    placeholder="aluno@email.com"
                    maxLength={255}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit_data_nascimento">Data de Nascimento</Label>
                  <Input
                    id="edit_data_nascimento"
                    name="data_nascimento"
                    type="date"
                    defaultValue={editingAluno.data_nascimento || ""}
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingAluno(null)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-edit-aluno" disabled={updateAluno.isPending}>
                {updateAluno.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ALERT DIALOG: EXCLUIR FORMANDO */}
      <AlertDialog open={!!deletingAluno} onOpenChange={(v) => !v && setDeletingAluno(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Formando</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o formando <strong>{deletingAluno?.nome_completo}</strong>?
              Esta ação removerá o contrato, parcelas e login associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingAluno && deleteAluno.mutate(deletingAluno.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Formando
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function Estat({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <div className="rounded-xl border border-border px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{titulo}</p>
      <p className={`mt-1 text-lg font-semibold ${destaque ? "text-destructive" : ""}`}>{valor}</p>
    </div>
  );
}
