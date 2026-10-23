import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { 
  User, 
  Package, 
  Camera, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  ShieldCheck,
  Building2,
  GraduationCap
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { brl } from "@/components/app/AppShell";
import { mensagemErro } from "@/lib/api/errors";
import { AssinaturaPad } from "@/components/app/AssinaturaPad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  extrairPacotesTurma,
  calcularParcelas,
  extrairMaxParcelas,
  extrairDataFormatura,
  extrairAceitaCartao,
  parcelasDisponiveis,
  DIAS_VENCIMENTO,
  type PacoteItem
} from "@/lib/turma-pacotes";
import { apenasDigitos, cpfParaEmail, saveClienteSession } from "@/lib/aluno-login";
import { login as apiLogin } from "@/lib/api/auth";
import { marcarPagamentoPendente } from "@/lib/pagamento-pendente";
import { CLAUSULAS_PADRAO, EMPRESA } from "@/lib/contrato-modelo";
import { realizarAdesaoPublica, buscarTurmaPublica } from "@/lib/alunos.functions";
import { registrarVisitaAdesao } from "@/lib/api/turmas";


export const Route = createFileRoute("/adesao/$turmaId")({
  head: () => ({
    meta: [
      { title: "Adesão de Formatura | JM Formaturas" },
      { name: "description", content: "Formulário oficial de adesão e escolha de pacotes de formatura." },
    ],
  }),
  loader: async ({ params }) => {
    try {
      const turma = await buscarTurmaPublica({ data: params.turmaId });
      return { turma };
    } catch {
      return { turma: null };
    }
  },
  component: AdesaoTurmaPage,
});

const formDadosPessoaisSchema = z.object({
  nome_completo: z.string().trim().min(3, "Nome completo é obrigatório").max(120),
  cpf: z.string().trim().min(11, "CPF inválido").max(14, "CPF inválido"),
  rg: z.string().trim().max(20).optional(),
  telefone: z.string().trim().max(20).optional(),
  whatsapp: z.string().trim().min(8, "WhatsApp é obrigatório").max(20),
  email: z.string().trim().email("E-mail inválido").max(255),
  endereco: z.string().trim().min(3, "Endereço é obrigatório").max(255),
  cidade: z.string().trim().min(2, "Cidade é obrigatória").max(120),
  cep: z.string().trim().max(10).optional(),
});

function AdesaoTurmaPage() {
  const loaderData = Route.useLoaderData();
  const { turmaId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const realizarAdesao = useServerFn(realizarAdesaoPublica);

  // Etapa atual: 1 (Dados), 2 (Pacote e Parcelamento), 3 (Uso de Imagem), 4 (Contrato e Aceite)
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);

  // Estado Etapa 1 - Dados Pessoais
  const [dadosPessoais, setDadosPessoais] = useState({
    nome_completo: "",
    cpf: "",
    rg: "",
    telefone: "",
    whatsapp: "",
    email: "",
    endereco: "",
    cidade: "",
    cep: "",
  });

  // Estado Etapa 2 - Pacote e Financeiro
  // numParcelas e formaPagamento começam "vazios" de propósito: o cliente
  // PRECISA escolher — nada de cadastro gerado com o padrão sem ele selecionar.
  const [pacoteId, setPacoteId] = useState<string>("");
  const [numParcelas, setNumParcelas] = useState<number>(0);
  const [formaPagamento, setFormaPagamento] = useState<"" | "boleto" | "cartao">("");
  const [diaVencimento, setDiaVencimento] = useState<number>(10);

  // Estado Etapa 3 - Uso de Imagem
  const [autorizaImagem, setAutorizaImagem] = useState<"sim" | "nao" | "">("");

  // Estado Etapa 4 - Aceite de Contrato
  const [aceitouContrato, setAceitouContrato] = useState(false);
  const [assinatura, setAssinatura] = useState<string | null>(null);

  const buscarTurma = useServerFn(buscarTurmaPublica);

  // Carrega dados da turma
  const { data: turma, isLoading, error } = useQuery({
    queryKey: ["turma-adesao", turmaId],
    queryFn: async () => {
      const data = await buscarTurma({ data: turmaId });
      if (!data) throw new Error("Turma não encontrada");
      return data;
    },
    initialData: loaderData?.turma || undefined,
  });

  const cursoLower = (turma?.curso || "").toLowerCase();
  const obsLower = (turma?.observacoes || "").toLowerCase();
  const isCasamento = cursoLower.includes("casamento") || obsLower.includes("casamento");
  const isAniversario =
    cursoLower.includes("aniversario") ||
    cursoLower.includes("aniversário") ||
    cursoLower.includes("festa") ||
    obsLower.includes("festa") ||
    obsLower.includes("aniversario");
  const isEnsaio = cursoLower.includes("ensaio") || obsLower.includes("ensaio");

  const tipoEventoNome = isCasamento
    ? "Casamento"
    : isAniversario
    ? "Festa de Aniversário / 15 Anos"
    : isEnsaio
    ? "Ensaio Fotográfico"
    : "Formatura";

  const tipoEventoBadge = isCasamento
    ? "Adesão de Casamento"
    : isAniversario
    ? "Adesão - Festa de Aniversário"
    : isEnsaio
    ? "Adesão de Ensaio Fotográfico"
    : "Adesão de Formatura";

  const contratanteLabel = isCasamento
    ? "Contratante / Noivos"
    : isAniversario
    ? "Contratante / Aniversariante"
    : isEnsaio
    ? "Contratante"
    : "Formando";

  const todosPacotes = extrairPacotesTurma(turma?.observacoes, turma?.curso);
  const pacotesAtivos = todosPacotes.filter((p) => p.ativo !== false);

  /*  Regras de parcelamento da turma: teto configurado pela empresa, reduzido
      dinamicamente pelos meses que faltam ate a formatura (parcelasDisponiveis).  */
  const maxParcelasTurma = extrairMaxParcelas(turma?.observacoes);
  const dataFormaturaTurma =
    extrairDataFormatura(turma?.observacoes) ??
    ((turma as any)?.dataEvento ? String((turma as any).dataEvento).slice(0, 10) : null);
  const maxParcelasPermitido = parcelasDisponiveis(maxParcelasTurma, dataFormaturaTurma);
  const aceitaCartaoTurma = extrairAceitaCartao(turma?.observacoes);

  /*  Garante que o parcelamento escolhido nunca exceda o maximo liberado.  */
  useEffect(() => {
    if (numParcelas > maxParcelasPermitido) setNumParcelas(maxParcelasPermitido);
  }, [maxParcelasPermitido]);

  /*  Turma sem cartao liberado so tem boleto: ja deixa escolhido pra nao pedir
      uma "escolha" de opcao unica. Com cartao, o cliente precisa escolher.  */
  useEffect(() => {
    if (!aceitaCartaoTurma) setFormaPagamento("boleto");
  }, [aceitaCartaoTurma]);

  /*  Conta 1 acesso ao link (uma vez por carregamento da pagina).  */
  useEffect(() => {
    void registrarVisitaAdesao(turmaId);
  }, [turmaId]);

  // O cliente PRECISA escolher o pacote — sem default automático (era isso que
  // deixava concluir o cadastro sem o cliente selecionar nada).
  const pacoteSelecionado = pacotesAtivos.find((p) => p.id === pacoteId);

  const parcelasCalculadas = pacoteSelecionado && numParcelas >= 1
    ? calcularParcelas(pacoteSelecionado.investimento, numParcelas, diaVencimento)
    : [];

  // Submissão do cadastro final
  const finalizarAdesao = useMutation({
    mutationFn: async () => {
      if (!turma) throw new Error("Evento/Turma não encontrado");
      if (!pacoteSelecionado) throw new Error("Selecione um pacote");
      if (!formaPagamento) throw new Error("Escolha a forma de pagamento");
      if (!numParcelas || numParcelas < 1) throw new Error("Escolha o parcelamento");
      if (!autorizaImagem) throw new Error("Responda à autorização de uso de imagem");
      if (!aceitouContrato) throw new Error("Você precisa aceitar os termos do contrato");
      if (!assinatura) throw new Error("Assine o contrato no campo indicado para finalizar");

      const cpfLimpo = apenasDigitos(dadosPessoais.cpf);
      if (cpfLimpo.length !== 11) throw new Error("CPF deve ter 11 dígitos");

      const resumoParcelas = parcelasCalculadas
        .map((p) => `${p.numero}ª Parcela - Vencimento: ${p.vencimento} - ${brl(p.valor)}`)
        .join("\n");

      const textoContratoCompleto = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E CINEMATOGRÁFICOS — ${tipoEventoNome.toUpperCase()}

CONTRATADA: ${EMPRESA.nome}, CNPJ: ${EMPRESA.cnpj}, Contato: ${EMPRESA.contato}.
CONTRATANTE: ${dadosPessoais.nome_completo}, CPF: ${dadosPessoais.cpf}, RG: ${dadosPessoais.rg || "Não informado"}, 
Endereço: ${dadosPessoais.endereco} - ${dadosPessoais.cidade} - CEP: ${dadosPessoais.cep || "Não informado"}, 
Telefone/WhatsApp: ${dadosPessoais.whatsapp}, E-mail: ${dadosPessoais.email}.

EVENTO: ${turma.nome} (${turma.curso} - ${turma.faculdade})

PACOTE SELECIONADO:
${pacoteSelecionado.nome}
Material: ${pacoteSelecionado.material}
Investimento Total: ${brl(pacoteSelecionado.investimento)}
Forma de Pagamento: ${formaPagamento === "cartao" ? "Cartão de Crédito" : "Boleto Bancário / PIX"} (${numParcelas}x de ${brl(pacoteSelecionado.investimento / numParcelas)})
Dia de Vencimento Escolhido: Dia ${diaVencimento}

CRONOGRAMA DE VENCIMENTOS:
${resumoParcelas}

AUTORIZAÇÃO DE USO DE IMAGEM:
${autorizaImagem === "sim" ? "AUTORIZADO pelo CONTRATANTE" : "NÃO AUTORIZADO pelo CONTRATANTE"}

CLÁUSULAS GERAIS:
${CLAUSULAS_PADRAO}`;

      const res = await realizarAdesao({
        data: {
          turmaId: turma.id,
          dadosPessoais: {
            ...dadosPessoais,
            cpf: cpfLimpo,
          },
          pacote: pacoteSelecionado.nome,
          valorTotal: pacoteSelecionado.investimento,
          numParcelas,
          diaVencimento,
          formaPagamento: formaPagamento === "cartao" ? "cartao_credito" : "boleto",
          autorizaImagem: autorizaImagem === "sim",
          textoContratoCompleto,
          parcelas: parcelasCalculadas.map((p) => ({
            numero: p.numero,
            valor: p.valor,
            vencimento: p.vencimento,
          })),
          assinaturaImagem: assinatura,
        },
      });

      /*  ENTRA DE VERDADE.  A adesão só gravava a "sessão do cliente" no
          localStorage, que é enfeite: o painel e o pagamento chamam a API
          pelo NAVEGADOR, com JWT.  Sem este login o formando terminava a
          adesão e caía num painel que respondia 401 em /alunos/me e em
          /pagamentos/* — sem contrato, sem parcela e sem como pagar.
          O login do formando é CPF/CPF, igual ao da tela de entrada.  */
      try {
        await apiLogin(cpfParaEmail(res.cpf), apenasDigitos(res.cpf));
      } catch (err) {
        /*  Não derruba a adesão: ela já está gravada e assinada.  Mas avisa,
            porque o painel sem token fica vazio — era justamente esse
            silêncio que fazia a adesão parecer que "não finalizou".  */
        console.error("adesão: login automático falhou", err);
        toast.warning(
          "Sua adesão foi registrada, mas não conseguimos abrir sua área automaticamente. " +
            "Entre com o seu CPF como login e senha.",
        );
      }

      // Salva sessão local para autenticação imediata
      saveClienteSession({
        cpf: res.cpf,
        nome: res.nome,
        tipo: "aluno",
        email: res.email,
        alunoId: res.alunoId,
      });

      /*  No cartão o pagamento é o passo que fecha o negócio: o painel abre
          o checkout da 1ª parcela sozinho.  */
      if (formaPagamento === "cartao") marcarPagamentoPendente();

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meu-cadastro"] });
      queryClient.invalidateQueries({ queryKey: ["meu-contrato"] });
      router.invalidate();

      toast.success(
        formaPagamento === "cartao"
          ? "Adesão assinada! Agora finalize o pagamento da 1ª parcela no cartão."
          : "Adesão realizada com sucesso! Bem-vindo à sua área exclusiva.",
      );
      void navigate({ to: "/painel" });
    },
    onError: (err) => {
      toast.error(mensagemErro(err, "Erro ao concluir adesão."));
    },
  });

  // Validação da Etapa 1
  const avancarEtapa1 = () => {
    try {
      formDadosPessoaisSchema.parse(dadosPessoais);
      setEtapa(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      if (e instanceof z.ZodError) {
        toast.error(e.issues[0]?.message || "Preencha todos os campos obrigatórios.");
      }
    }
  };

  // Validação da Etapa 2
  const avancarEtapa2 = () => {
    if (!pacoteSelecionado) {
      toast.error("Escolha um pacote para continuar.");
      return;
    }
    if (!formaPagamento) {
      toast.error("Escolha a forma de pagamento (boleto ou cartão).");
      return;
    }
    if (!numParcelas || numParcelas < 1) {
      toast.error("Escolha em quantas vezes deseja pagar.");
      return;
    }
    setEtapa(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Validação da Etapa 3
  const avancarEtapa3 = () => {
    if (!autorizaImagem) {
      toast.error("Por favor, responda se autoriza o uso de imagem.");
      return;
    }
    setEtapa(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando informações da turma...</p>
        </div>
      </div>
    );
  }

  if (error || !turma) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center p-6 space-y-4">
          <h2 className="text-xl font-bold text-destructive">Turma não encontrada</h2>
          <p className="text-sm text-muted-foreground">
            O link acessado é inválido ou a turma não está mais ativa. Verifique com a comissão de formatura.
          </p>
        </Card>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Dados Pessoais", icon: User },
    { num: 2, title: "Pacote e Parcelas", icon: Package },
    { num: 3, title: "Uso de Imagem", icon: Camera },
    { num: 4, title: "Contrato e Aceite", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Cabeçalho da Turma / Evento */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="size-3.5" /> {tipoEventoBadge}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {turma.nome}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1"><GraduationCap className="size-4" /> {turma.curso}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1"><Building2 className="size-4" /> {turma.faculdade}</span>
            {turma.cidade && <><span>•</span><span>{turma.cidade}</span></>}
          </p>
        </div>

        {/* Barra de Progresso das Etapas */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((s) => {
            const Icon = s.icon;
            const isDone = etapa > s.num;
            const isCurrent = etapa === s.num;
            return (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground shadow-md"
                    : isDone
                    ? "bg-primary/15 text-primary"
                    : "bg-background text-muted-foreground border border-border"
                }`}
              >
                <div className="flex items-center justify-center size-7 rounded-full bg-white/20 mb-1">
                  {isDone ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{s.title}</span>
                <span className="text-[10px] font-medium sm:hidden">Etapa {s.num}</span>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            ETAPA 1: DADOS PESSOAIS
           ======================================================== */}
        {etapa === 1 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Área 1: Dados Pessoais do {contratanteLabel}</CardTitle>
                  <CardDescription className="mt-1">
                    Preencha com atenção. Estes dados constarão no seu contrato de prestação de serviços.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">Etapa 1 de 4</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <span className="text-[11px] font-medium text-destructive/80">* Obrigatório</span>
                </div>
                <Input
                  id="nome"
                  placeholder="Seu nome completo"
                  value={dadosPessoais.nome_completo}
                  onChange={(e) => setDadosPessoais({ ...dadosPessoais, nome_completo: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cpf">CPF</Label>
                    <span className="text-[11px] font-medium text-destructive/80">* Obrigatório</span>
                  </div>
                  <Input
                    id="cpf"
                    placeholder="000.000.000-00"
                    value={dadosPessoais.cpf}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cpf: e.target.value })}
                  />
                  <p className="text-[11px] text-muted-foreground">Seu CPF será utilizado como login na sua área exclusiva.</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rg">RG</Label>
                    <span className="text-[11px] font-normal text-muted-foreground">Opcional</span>
                  </div>
                  <Input
                    id="rg"
                    placeholder="Número do seu RG"
                    value={dadosPessoais.rg}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, rg: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="telefone">Telefone</Label>
                    <span className="text-[11px] font-normal text-muted-foreground">Opcional</span>
                  </div>
                  <Input
                    id="telefone"
                    placeholder="(00) 00000-0000"
                    value={dadosPessoais.telefone}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, telefone: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <span className="text-[11px] font-medium text-destructive/80">* Obrigatório</span>
                  </div>
                  <Input
                    id="whatsapp"
                    placeholder="(00) 90000-0000"
                    value={dadosPessoais.whatsapp}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, whatsapp: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">E-mail</Label>
                  <span className="text-[11px] font-medium text-destructive/80">* Obrigatório</span>
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={dadosPessoais.email}
                  onChange={(e) => setDadosPessoais({ ...dadosPessoais, email: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="endereco">Endereço Residencial Completo</Label>
                  <span className="text-[11px] font-medium text-destructive/80">* Obrigatório</span>
                </div>
                <Input
                  id="endereco"
                  placeholder="Rua, número, complemento, bairro"
                  value={dadosPessoais.endereco}
                  onChange={(e) => setDadosPessoais({ ...dadosPessoais, endereco: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cidade">Cidade / UF</Label>
                    <span className="text-[11px] font-medium text-destructive/80">* Obrigatório</span>
                  </div>
                  <Input
                    id="cidade"
                    placeholder="Ex: Araguaína - TO"
                    value={dadosPessoais.cidade}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cidade: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cep">CEP</Label>
                    <span className="text-[11px] font-normal text-muted-foreground">Opcional</span>
                  </div>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={dadosPessoais.cep}
                    onChange={(e) => setDadosPessoais({ ...dadosPessoais, cep: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={avancarEtapa1} className="gap-2 px-6">
                  Avançar para Pacotes <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================
            ETAPA 2: ESCOLHA DO PACOTE E PARCELAMENTO
           ======================================================== */}
        {etapa === 2 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Área 2: Escolha do Pacote e Forma de Pagamento</CardTitle>
                  <CardDescription className="mt-1">
                    Selecione o pacote desejado e defina a quantidade de parcelas e o dia de vencimento.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">Etapa 2 de 4</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Lista de Pacotes Ativos */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Escolha o seu pacote de formatura:</Label>
                <div className="grid gap-3">
                  {pacotesAtivos.map((p) => {
                    const isSelected = (pacoteSelecionado?.id === p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => setPacoteId(p.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40 bg-card"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`size-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}>
                                {isSelected && <span className="size-2 bg-white rounded-full" />}
                              </span>
                              <h3 className="font-bold text-base text-foreground">{p.nome}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">{p.material}</p>
                          </div>
                          <div className="text-right whitespace-nowrap">
                            <span className="text-xs text-muted-foreground block uppercase font-medium">Investimento</span>
                            <span className="text-lg font-extrabold text-primary">{brl(p.investimento)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Opções de Parcelamento e Vencimento */}
              {pacoteSelecionado && (
                <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                    <CreditCard className="size-4 text-primary" /> Condições de Pagamento
                  </h4>

                  {/* Forma de pagamento — OBRIGATÓRIA (sem isso não avança) */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Como você quer pagar?</Label>
                    {aceitaCartaoTurma ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {([
                          { id: "boleto", nome: "Boleto / PIX", desc: "Boleto bancário ou PIX" },
                          { id: "cartao", nome: "Cartão de crédito", desc: "Cada parcela no checkout seguro do Asaas" },
                        ] as const).map((f) => {
                          const sel = formaPagamento === f.id;
                          return (
                            <div
                              key={f.id}
                              onClick={() => setFormaPagamento(f.id)}
                              className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                sel ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 bg-card"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`size-4 rounded-full border flex items-center justify-center ${sel ? "border-primary bg-primary text-white" : "border-muted-foreground"}`}>
                                  {sel && <span className="size-2 bg-white rounded-full" />}
                                </span>
                                <span className="font-semibold text-sm">{f.nome}</span>
                              </div>
                              <p className="text-xs text-muted-foreground pl-6 mt-0.5">{f.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Boleto Bancário / PIX</p>
                    )}

                    {/*  Responde a pergunta que todo mundo faz aqui: "onde eu
                         coloco o cartão?".  Os dados do cartão nunca passam
                         por este site — quem processa é o Asaas, no checkout
                         dele, aberto no fim da adesão.  */}
                    {formaPagamento === "cartao" && (
                      <p className="text-xs text-muted-foreground rounded-lg bg-background/70 border border-border p-3">
                        Os dados do cartão <strong>não são pedidos aqui</strong>. Ao terminar a assinatura,
                        abrimos o checkout seguro do Asaas para você pagar a 1ª parcela — as próximas ficam
                        disponíveis na sua área, no mesmo lugar.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numParcelas">Quantidade de Parcelas (1x a {maxParcelasPermitido}x)</Label>
                      <Select
                        value={numParcelas ? String(numParcelas) : ""}
                        onValueChange={(val) => setNumParcelas(Number(val))}
                      >
                        <SelectTrigger id="numParcelas">
                          <SelectValue placeholder="Escolha o parcelamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: maxParcelasPermitido }, (_, i) => i + 1).map((n) => {
                            const valor = Math.round((pacoteSelecionado.investimento / n) * 100) / 100;
                            return (
                              <SelectItem key={n} value={String(n)}>
                                {n}x de {brl(valor)} {n === 1 ? "(À vista)" : "sem juros"}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {maxParcelasPermitido < maxParcelasTurma && (
                        <p className="text-[11px] font-medium text-amber-600 dark:text-amber-500">
                          {maxParcelasPermitido === 1
                            ? "Pela proximidade da formatura, o pagamento é somente à vista."
                            : `Parcelamento limitado a ${maxParcelasPermitido}x pela proximidade da formatura.`}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diaVencimento">Melhor dia de vencimento</Label>
                      <Select
                        value={String(diaVencimento)}
                        onValueChange={(val) => setDiaVencimento(Number(val))}
                      >
                        <SelectTrigger id="diaVencimento">
                          <SelectValue placeholder="Dia de vencimento" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIAS_VENCIMENTO.map((d) => (
                            <SelectItem key={d} value={String(d)}>
                              Todo dia {String(d).padStart(2, "0")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Simulação detalhada das parcelas */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
                      <span>Simulação das parcelas ({parcelasCalculadas.length}x)</span>
                      <span>Total: {brl(pacoteSelecionado.investimento)}</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-background divide-y divide-border text-xs">
                      {parcelasCalculadas.map((p) => (
                        <div key={p.numero} className="p-2.5 flex items-center justify-between">
                          <span className="font-medium">{p.numero}ª parcela – {p.mesAno}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">Venc: {p.vencimento.split("-").reverse().join("/")}</span>
                            <span className="font-bold text-foreground">{brl(p.valor)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => setEtapa(1)} className="gap-2">
                  <ArrowLeft className="size-4" /> Voltar
                </Button>
                <Button
                  onClick={avancarEtapa2}
                  disabled={!pacoteSelecionado || !formaPagamento || !numParcelas}
                  className="gap-2 px-6"
                >
                  Avançar para Uso de Imagem <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================
            ETAPA 3: AUTORIZAÇÃO DE USO DE IMAGEM
           ======================================================== */}
        {etapa === 3 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Área 3: Termo de Autorização de Uso de Imagem</CardTitle>
                  <CardDescription className="mt-1">
                    Defina sua preferência quanto à divulgação dos registros fotográficos nos canais oficiais da empresa.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">Etapa 3 de 4</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-sm leading-relaxed text-muted-foreground space-y-3">
                <p className="font-medium text-foreground">
                  Termo de Consentimento para Uso de Imagem e Voz:
                </p>
                <p>
                  Autorizo a empresa <strong>{EMPRESA.nome}</strong> a utilizar minha imagem, obtida durante a cobertura dos eventos, sessões de estúdio e colação de grau desta turma, para fins exclusivos de divulgação profissional de seu portfólio em redes sociais, website institucional, mostruários e materiais promocionais, sem qualquer ônus financeiro.
                </p>
                <p className="text-xs text-destructive font-medium">
                  * A resposta a esta pergunta é obrigatória para prosseguir.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold">Você autoriza o uso da sua imagem para divulgação?</Label>
                
                <RadioGroup
                  value={autorizaImagem}
                  onValueChange={(val) => setAutorizaImagem(val as "sim" | "nao")}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <label
                    htmlFor="opt-sim"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      autorizaImagem === "sim"
                        ? "border-primary bg-primary/5 font-semibold text-primary"
                        : "border-border hover:border-primary/40 bg-card text-foreground"
                    }`}
                  >
                    <RadioGroupItem value="sim" id="opt-sim" />
                    <div>
                      <span className="block text-base">Sim, eu autorizo</span>
                      <span className="text-xs text-muted-foreground font-normal">Permitir publicação em redes e portfólio oficial.</span>
                    </div>
                  </label>

                  <label
                    htmlFor="opt-nao"
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      autorizaImagem === "nao"
                        ? "border-primary bg-primary/5 font-semibold text-primary"
                        : "border-border hover:border-primary/40 bg-card text-foreground"
                    }`}
                  >
                    <RadioGroupItem value="nao" id="opt-nao" />
                    <div>
                      <span className="block text-base">Não autorizo</span>
                      <span className="text-xs text-muted-foreground font-normal">Minhas fotos serão de uso estritamente privado.</span>
                    </div>
                  </label>
                </RadioGroup>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => setEtapa(2)} className="gap-2">
                  <ArrowLeft className="size-4" /> Voltar
                </Button>
                <Button onClick={avancarEtapa3} className="gap-2 px-6">
                  Avançar para o Contrato <ArrowRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================
            ETAPA 4: CONTRATO E ACEITE
           ======================================================== */}
        {etapa === 4 && (
          <Card className="shadow-lg border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Área 4: Contrato de Prestação de Serviços</CardTitle>
                  <CardDescription className="mt-1">
                    Leia o contrato gerado com suas opções. Para finalizar, confirme o aceite eletrônico.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">Etapa 4 de 4</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Documento do Contrato (Somente Leitura) */}
              <div className="p-5 sm:p-8 rounded-xl border-2 border-primary/20 bg-card max-h-[60vh] overflow-y-auto text-sm leading-relaxed space-y-5 shadow-inner">
                <div className="text-center pb-4 border-b-2 border-border">
                  <h3 className="font-extrabold text-lg uppercase text-primary">{EMPRESA.nome}</h3>
                  <p className="text-muted-foreground text-xs font-medium">{EMPRESA.cnpj} • {EMPRESA.cidade}</p>
                  <p className="font-bold text-foreground mt-3 text-base">CONTRATO DE ADESÃO INDIVIDUAL DE FORMATURA</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider">1. Identificação das Partes</h4>
                  <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                    <p><strong className="text-foreground">CONTRATADA:</strong> {EMPRESA.nome}, CNPJ: {EMPRESA.cnpj}, Contato: {EMPRESA.contato}.</p>
                    <p><strong className="text-foreground">CONTRATANTE:</strong> {dadosPessoais.nome_completo}, CPF: {dadosPessoais.cpf}, RG: {dadosPessoais.rg || "Não informado"}, Endereço: {dadosPessoais.endereco}, Cidade: {dadosPessoais.cidade}, WhatsApp: {dadosPessoais.whatsapp}, E-mail: {dadosPessoais.email}.</p>
                    <p><strong className="text-foreground">{isEnsaio ? "ENSAIO" : "TURMA"}:</strong> {turma.nome} ({turma.curso} - {turma.faculdade})</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider">2. Pacote Contratado e Valores</h4>
                  <div className="bg-muted/30 p-3 rounded-lg space-y-2">
                    <p><strong className="text-foreground">PACOTE:</strong> {pacoteSelecionado?.nome}</p>
                    <p><strong className="text-foreground">DESCRIÇÃO DO MATERIAL:</strong> {pacoteSelecionado?.material}</p>
                    <p><strong className="text-foreground">VALOR TOTAL:</strong> <span className="text-primary font-bold">{brl(pacoteSelecionado?.investimento || 0)}</span></p>
                    <p><strong className="text-foreground">CONDIÇÃO:</strong> {formaPagamento === "cartao" ? "Cartão de crédito" : "Boleto bancário"} em <span className="font-bold">{numParcelas}x de {brl((pacoteSelecionado?.investimento || 0) / (numParcelas || 1))}</span>{formaPagamento === "cartao" ? "." : ` com vencimento todo dia ${diaVencimento}.`}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider">3. Cronograma de Vencimento</h4>
                  <div className="bg-muted/30 p-3 rounded-lg space-y-1">
                    {parcelasCalculadas.map((p) => (
                      <div key={p.numero} className="flex justify-between border-b border-border/50 pb-1 last:border-0 last:pb-0">
                        <span>{p.numero}ª parcela: {p.mesAno} (Venc. {p.vencimento.split("-").reverse().join("/")})</span>
                        <span className="font-bold">{brl(p.valor)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider">4. Autorização de Uso de Imagem</h4>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p>O CONTRATANTE declara que <strong className="text-foreground uppercase">{autorizaImagem === "sim" ? "AUTORIZA" : "NÃO AUTORIZA"}</strong> o uso de sua imagem para divulgação institucional.</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider">5. Cláusulas Gerais</h4>
                  <div className="bg-muted/10 p-4 rounded-lg border border-border">
                    <p className="whitespace-pre-line text-foreground/80 text-sm">{CLAUSULAS_PADRAO}</p>
                  </div>
                </div>
              </div>

              {/* Assinatura do contratante + aceite */}
              <div className="p-4 sm:p-5 rounded-xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Assinatura do contratante</h4>
                  <p className="text-xs text-muted-foreground">
                    Assine no campo abaixo. Registramos a data, o horário, seu dispositivo e uma
                    impressão digital do texto acima, de modo que o contrato não possa ser alterado
                    depois de assinado.
                  </p>
                </div>

                <AssinaturaPad onChange={setAssinatura} disabled={finalizarAdesao.isPending} />

                <div className="rounded-lg bg-background/60 px-3 py-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {dadosPessoais.nome_completo || "—"}
                  </span>
                  {dadosPessoais.cpf ? ` · CPF ${dadosPessoais.cpf}` : ""}
                </div>

                <label className="flex items-start gap-3 cursor-pointer border-t border-primary/15 pt-3">
                  <input
                    type="checkbox"
                    id="aceite-contrato"
                    checked={aceitouContrato}
                    onChange={(e) => setAceitouContrato(e.target.checked)}
                    className="size-5 rounded border-primary text-primary focus:ring-primary mt-0.5"
                  />
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-foreground block">
                      Li e aceito todos os termos e condições deste contrato
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      Ao finalizar, sua adesão será confirmada e seu login liberado com o CPF.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => setEtapa(3)} className="gap-2">
                  <ArrowLeft className="size-4" /> Voltar
                </Button>
                <Button
                  onClick={() => finalizarAdesao.mutate()}
                  disabled={!aceitouContrato || !assinatura || finalizarAdesao.isPending}
                  className="gap-2 px-6 bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90"
                >
                  <ShieldCheck className="size-4" />
                  {finalizarAdesao.isPending ? "Criando seu acesso..." : "Assinar Contrato e Acessar Minha Área"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
