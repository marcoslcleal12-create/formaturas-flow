import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, KeyRound, Plus, Edit, Trash2, CreditCard, User, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { alunos as apiAlunos, contratos as apiContratos, parcelas as apiParcelas } from "@/lib/recursos";
import { cpfParaEmail } from "@/lib/aluno-login";
import { AppShell, brl } from "@/components/app/AppShell";
import { ContratoDocumento } from "@/components/app/ContratoDocumento";
import { FORMAS_PAGAMENTO } from "@/lib/contrato-modelo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  valorTotal: z.number().positive("Valor total inválido"),
  desconto: z.number().min(0),
  valorEntrada: z.number().min(0),
  numParcelas: z.number().int().min(1).max(60),
  diaVencimento: z.number().int().min(1).max(28),
  primeiroVencimento: z.string().min(10, "Informe o primeiro vencimento"),
  formaPagamento: z.string().min(2),
});

const alunoEditSchema = z.object({
  nomeCompleto: z.string().trim().min(3, "Informe o nome completo").max(120),
  cpf: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().max(20).optional(),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  dataNascimento: z.string().trim().max(10).optional(),
  cidade: z.string().trim().max(120).optional(),
  endereco: z.string().trim().max(200).optional(),
});

function num(form: FormData, key: string) {
  return Number(String(form.get(key) ?? "0").replace(",", ".")) || 0;
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

  const [showDados, setShowDados] = useState(false);
  const [showTurma, setShowTurma] = useState(false);


  const { data } = useQuery({
    queryKey: ["aluno", alunoId],
    queryFn: async () => {
      const [aluno, lista] = await Promise.all([
        apiAlunos.obter(alunoId),
        apiContratos.listar({ alunoId }),
      ]);
      return { aluno, contrato: lista[0] ?? null };
    },
  });

  const aluno = data?.aluno;
  const contrato = data?.contrato;
  const parcelas = [...(contrato?.parcelas ?? [])].sort((a, b) => a.numero - b.numero);

  // Update Aluno Details Mutation
  const updateAluno = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = alunoEditSchema.parse({
        nomeCompleto: form.get("nomeCompleto"),
        cpf: form.get("cpf") || undefined,
        whatsapp: form.get("whatsapp") || undefined,
        email: form.get("email") || undefined,
        dataNascimento: form.get("dataNascimento") || undefined,
        cidade: form.get("cidade") || undefined,
        endereco: form.get("endereco") || undefined,
      });

      await apiAlunos.atualizar(alunoId, {
        nomeCompleto: parsed.nomeCompleto,
        cpf: parsed.cpf ? parsed.cpf.replace(/\D/g, "") : null,
        whatsapp: parsed.whatsapp ?? null,
        email: parsed.email || null,
        dataNascimento: parsed.dataNascimento || null,
        cidade: parsed.cidade ?? null,
        endereco: parsed.endereco ?? null,
      });
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

  // Delete Aluno Mutation
  const deleteAluno = useMutation({
    mutationFn: async () => {
      const turmaId = aluno?.turmaId;
      await apiAlunos.remover(alunoId);
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

  // Generate Access Mutation
  const gerarAcesso = useMutation({
    mutationFn: () => {
      /*  O acesso do formando é o CPF; sem ele não há e-mail para vincular.  */
      if (!aluno?.cpf) throw new Error("Cadastre o CPF do formando antes de liberar o acesso.");
      return apiAlunos.vincularAcesso(alunoId, cpfParaEmail(aluno.cpf));
    },
    onSuccess: (res) => {
      toast.success(`Acesso criado — login e senha: CPF ${res.loginUsuario ?? res.cpf ?? ""}`, {
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
        valorTotal: num(form, "valorTotal"),
        desconto: num(form, "desconto"),
        valorEntrada: num(form, "valorEntrada"),
        numParcelas: num(form, "numParcelas"),
        diaVencimento: num(form, "diaVencimento"),
        primeiroVencimento: String(form.get("primeiroVencimento") ?? ""),
        formaPagamento: String(form.get("formaPagamento") ?? "boleto"),
      });

      const financiado = parsed.valorTotal - parsed.desconto - parsed.valorEntrada;
      if (financiado <= 0) throw new Error("O valor a parcelar precisa ser maior que zero.");

      /*  A API cria contrato e parcelas numa transação só; o rateio que
          existia aqui virou regra de servidor, para a tela não ser mais a
          dona do cálculo do dinheiro.  */
      await apiContratos.criar({
        alunoId,
        pacote: parsed.pacote,
        valorTotal: parsed.valorTotal,
        desconto: parsed.desconto,
        valorEntrada: parsed.valorEntrada,
        numParcelas: parsed.numParcelas,
        diaVencimento: parsed.diaVencimento,
        formaPagamento: parsed.formaPagamento,
        primeiroVencimento: parsed.primeiroVencimento,
      });
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
        valorTotal: num(form, "valorTotal"),
        desconto: num(form, "desconto"),
        valorEntrada: num(form, "valorEntrada"),
        numParcelas: num(form, "numParcelas"),
        diaVencimento: num(form, "diaVencimento"),
        primeiroVencimento: String(form.get("primeiroVencimento") ?? ""),
        formaPagamento: String(form.get("formaPagamento") ?? "boleto"),
      });

      const recalcular = form.get("recalcular_parcelas") === "sim";

      /*  `recalcularParcelas` deixa o rateio no servidor, dentro da mesma
          transação do contrato — antes a tela apagava as parcelas e
          reinseria, e qualquer falha no meio deixava contrato sem parcela.  */
      await apiContratos.atualizar(contrato.id, {
        pacote: parsed.pacote,
        valorTotal: parsed.valorTotal,
        desconto: parsed.desconto,
        valorEntrada: parsed.valorEntrada,
        numParcelas: parsed.numParcelas,
        diaVencimento: parsed.diaVencimento,
        formaPagamento: parsed.formaPagamento,
        recalcularParcelas: recalcular,
        primeiroVencimento: parsed.primeiroVencimento,
      });
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
      /*  O servidor remove as parcelas junto com o contrato.  */
      await apiContratos.remover(contrato.id);
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
      if (pago) await apiParcelas.desfazer(id);
      else await apiParcelas.baixar(id, {
        valorPago: valor,
        dataPagamento: new Date().toISOString().slice(0, 10),
      });
    },
    onSuccess: () => {
      toast.success("Status da parcela atualizado!");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
      void queryClient.invalidateQueries({ queryKey: ["turma"] });
    },
    onError: (error) => toast.error((error as Error).message),
  });

  const hoje = new Date().toISOString().slice(0, 10);
  const totalPago = parcelas.reduce((s, p) => s + Number(p.valorPago), 0);
  const totalParcelas = parcelas.reduce((s, p) => s + Number(p.valor), 0);
  const atrasadas = parcelas.filter((p) => p.status !== "Pago" && p.vencimento < hoje);

  return (
    <AppShell>
      <Link
        to="/turmas/$turmaId"
        params={{ turmaId: aluno?.turmaId ?? "" }}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="size-4" /> Voltar para a turma
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{aluno?.nomeCompleto ?? "Formando"}</h1>
            {aluno?.userId ? (
              <Badge className="bg-emerald-600">Acesso Ativo (CPF: {aluno.loginUsuario})</Badge>
            ) : (
              <Badge variant="secondary">Sem acesso gerado</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {aluno?.turma?.nome ?? "Sem turma"} · CPF: {aluno?.cpf ?? "Não informado"} · Tel: {aluno?.whatsapp ?? "—"}
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

          {!aluno?.userId && (
            <Button size="sm" onClick={() => gerarAcesso.mutate()} disabled={gerarAcesso.isPending} className="gap-1.5">
              <KeyRound className="size-4" /> Liberar Acesso (Login CPF)
            </Button>
          )}
        </div>
      </div>

      {!aluno?.userId && (
        <Card className="mb-6 shadow-card border-gold/40 bg-gold/5">
          <CardContent className="pt-6 text-sm text-foreground flex items-center gap-3">
            <KeyRound className="size-5 text-gold shrink-0" />
            <div>
              <strong>Acesso do Formando:</strong> O acesso é liberado usando o <strong>CPF como login</strong> e o <strong>CPF como senha inicial</strong>.
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEÇÃO DE DADOS E TURMA (VISUAL IGUAL À ÁREA DO FORMANDO) */}
      {aluno && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {/* Card Meus Dados */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Meus Dados Cadastrais</CardTitle>
              <Button
                variant={!showDados ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowDados(!showDados)}
              >
                {showDados ? "Ocultar" : "Visualizar"}
              </Button>
            </CardHeader>
            {showDados && (
              <CardContent className="space-y-1.5 text-sm">
                <Info label="Nome Completo" value={aluno.nomeCompleto} />
                <Info label="CPF" value={aluno.cpf} />
                {aluno.rg && <Info label="RG" value={aluno.rg} />}
                <Info label="Telefone" value={aluno.telefone || aluno.whatsapp} />
                <Info label="WhatsApp" value={aluno.whatsapp} />
                <Info label="E-mail" value={aluno.email} />
                <Info label="Endereço" value={aluno.endereco} />
                <Info label="Cidade" value={aluno.cidade} />
              </CardContent>
            )}
          </Card>

          {/* Card Minha Turma e Opções */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Minha Turma & Opções</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{aluno.status ?? "Ativo"}</Badge>
                <Button
                  variant={!showTurma ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setShowTurma(!showTurma)}
                >
                  {showTurma ? "Ocultar" : "Visualizar"}
                </Button>
              </div>
            </CardHeader>
            {showTurma && (
              <CardContent className="space-y-1.5 text-sm">
                <Info label="Turma" value={aluno.turma?.nome} />
                <Info label="Curso" value={aluno.turma?.curso} />
                <Info label="Faculdade" value={aluno.turma?.faculdade} />
                {contrato && (
                  <>
                    <Info label="Pacote" value={contrato.pacote} />
                    <Info label="Valor Total" value={brl(Number(contrato.valorTotal))} />
                    <Info label="Condição" value={`${contrato.numParcelas}x no boleto`} />
                  </>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* SEÇÃO DO CONTRATO E FINANCEIRO */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="size-5 text-gold" /> Contrato, Pacote & Parcelamento
        </h2>

        {!contrato ? (
          <Dialog open={openCreateContrato} onOpenChange={setOpenCreateContrato}>
            <DialogTrigger asChild>
              <Button className="gap-1.5">
                <Plus className="size-4" /> Criar contrato & pacote
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
                  <Campo name="valorTotal" label="Valor total (R$) *" type="number" step="0.01" defaultValue="4500" required />
                  <Campo name="desconto" label="Desconto (R$)" type="number" step="0.01" defaultValue="0" />
                  <Campo name="valorEntrada" label="Entrada (R$)" type="number" step="0.01" defaultValue="500" />
                  <Campo name="numParcelas" label="Nº de parcelas *" type="number" defaultValue="10" required />
                  <Campo name="diaVencimento" label="Dia de vencimento *" type="number" defaultValue="10" required />
                  <Campo name="primeiroVencimento" label="1º vencimento *" type="date" defaultValue={hoje} required />
                  <div className="space-y-1.5">
                    <Label htmlFor="formaPagamento">Forma de pagamento</Label>
                    <select
                      id="formaPagamento"
                      name="formaPagamento"
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
            <Button variant="outline" size="sm" onClick={() => setOpenEditContrato(true)} className="gap-1.5">
              <Edit className="size-4" /> Editar Pacote / Contrato
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenDeleteContrato(true)}
              className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" /> Excluir Contrato
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
          <div className="grid gap-3 sm:grid-cols-4">
            <Resumo titulo="Valor do contrato" valor={brl(Number(contrato.valorTotal))} />
            <Resumo titulo="Total parcelado" valor={brl(totalParcelas)} />
            <Resumo titulo="Recebido" valor={brl(totalPago)} />
            <Resumo titulo="Em atraso" valor={String(atrasadas.length)} destaque={atrasadas.length > 0} />
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
                const pago = p.status === "Pago";
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
                        {p.dataPagamento && ` · Pago em: ${new Date(`${p.dataPagamento}T12:00:00`).toLocaleDateString("pt-BR")}`}
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

          {/* DOCUMENTO OFICIAL DO CONTRATO */}
          {aluno && (
            <ContratoDocumento
              alunoId={alunoId}
              aluno={aluno}
              contrato={contrato}
              parcelas={parcelas.map((p) => ({
                numero: p.numero,
                valor: Number(p.valor),
                vencimento: p.vencimento,
                status: p.status,
                dataPagamento: p.dataPagamento,
                formaPagamento: p.formaPagamento,
              }))}
            />
          )}
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
                <Label htmlFor="nomeCompleto">Nome completo *</Label>
                <Input id="nomeCompleto" name="nomeCompleto" defaultValue={aluno.nomeCompleto} required maxLength={120} />
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
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input id="dataNascimento" name="dataNascimento" type="date" defaultValue={aluno.dataNascimento || ""} />
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
              Tem certeza que deseja excluir o formando <strong>{aluno?.nomeCompleto}</strong>?
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
              <Campo name="pacote" label="Pacote Contratado *" defaultValue={contrato.pacote ?? ""} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Campo name="valorTotal" label="Valor total (R$) *" type="number" step="0.01" defaultValue={String(contrato.valorTotal)} required />
                <Campo name="desconto" label="Desconto (R$)" type="number" step="0.01" defaultValue={String(contrato.desconto ?? 0)} />
                <Campo name="valorEntrada" label="Entrada (R$)" type="number" step="0.01" defaultValue={String(contrato.valorEntrada ?? 0)} />
                <Campo name="numParcelas" label="Nº de parcelas *" type="number" defaultValue={String(contrato.numParcelas)} required />
                <Campo name="diaVencimento" label="Dia de vencimento *" type="number" defaultValue={String(contrato.diaVencimento ?? 10)} required />
                <Campo name="primeiroVencimento" label="1º vencimento *" type="date" defaultValue={contrato.dataContrato || hoje} required />
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="formaPagamento">Forma de pagamento</Label>
                  <select
                    id="formaPagamento"
                    name="formaPagamento"
                    defaultValue={contrato.formaPagamento ?? "boleto"}
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
    </AppShell>
  );
}

function Resumo({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <Card className="shadow-card">
      <CardContent className="pt-6">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{titulo}</p>
        <p className={`mt-1 text-lg font-semibold ${destaque ? "text-destructive" : ""}`}>{valor}</p>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value?: string | null | undefined }) {
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
