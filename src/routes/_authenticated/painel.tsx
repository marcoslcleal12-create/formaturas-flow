import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { 
  Camera, 
  ExternalLink, 
  FileDown, 
  Lock, 
  Printer, 
  Calendar, 
  MapPin, 
  Heart, 
  PartyPopper, 
  UserCheck, 
  User, 
  Package, 
  FileText, 
  Eye,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { brl } from "@/components/app/AppShell";
import { PagamentoDialog } from "@/components/app/PagamentoDialog";
import {
  CLAUSULAS_PADRAO,
  formaPagamentoLabel,
  gerarContratoPdf,
} from "@/lib/contrato-modelo";
import { loadDemandas, formatarCpf, type DemandaItem } from "@/lib/demandas-store";
import { apenasDigitos } from "@/lib/aluno-login";
import {
  Dialog,
  DialogContent,
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

const SELPICS_URL = "https://jm-studio-fotografico.youfocus.com.br/";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Meu painel | JM Formaturas" },
      { name: "description", content: "Área exclusiva do cliente: seus dados, seu contrato e acompanhamento financeiro." },
      { property: "og:title", content: "Meu painel | JM Formaturas" },
      { property: "og:description", content: "Acompanhe seu contrato e parcelas com a JM Formaturas." },
    ],
  }),
  component: PainelAluno,
});

function PainelAluno() {
  const { user, isStaff, loading } = useAuth();
  const userDigits = apenasDigitos(user?.email?.split("@")[0] ?? user?.id ?? "");

  const [showDados, setShowDados] = useState(false);
  const [showPacote, setShowPacote] = useState(false);
  const [showContrato, setShowContrato] = useState(false);
  const [showOverdueAlert, setShowOverdueAlert] = useState(false);

  const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);

  // 1. Check if user is a Formando in Supabase (by user_id or by CPF)
  const { data: alunos } = useQuery({
    queryKey: ["meu-cadastro", user?.id, userDigits],
    enabled: !!user,
    queryFn: async () => {
      // Tenta por user_id se for UUID
      if (user?.id && user.id.includes("-")) {
        const { data } = await supabase
          .from("alunos")
          .select("*, turmas(nome, curso, faculdade, semestre)")
          .eq("user_id", user.id);
        if (data && data.length > 0) return data;
      }
      // Tenta por CPF (11 dígitos)
      if (userDigits && userDigits.length === 11) {
        const { data } = await supabase
          .from("alunos")
          .select("*, turmas(nome, curso, faculdade, semestre)")
          .eq("cpf", userDigits);
        if (data && data.length > 0) return data;
      }
      return [];
    },
  });

  const aluno = alunos?.find(a => a.id === selectedAlunoId) || alunos?.[0];

  useEffect(() => {
    if (alunos && alunos.length > 0 && !selectedAlunoId) {
      setSelectedAlunoId(alunos[0]!.id);
    }
  }, [alunos, selectedAlunoId]);

  // 2. Check if user has a graduation contract in Supabase
  const { data: contrato } = useQuery({
    queryKey: ["meu-contrato", aluno?.id],
    enabled: !!aluno?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contratos")
        .select("*, parcelas(*)")
        .eq("aluno_id", aluno!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // 3. Check if user is a Demanda Client (Casamento, Festa, Ensaio)
  const demandaCliente: DemandaItem | undefined = (() => {
    if (!userDigits) return undefined;
    const allDemandas = loadDemandas();
    return allDemandas.find((d) => apenasDigitos(d.cpf) === userDigits);
  })();

  const hoje = new Date().toISOString().slice(0, 10);

  // If aluno is found
  const parcelas = [...(contrato?.parcelas ?? [])].sort((a, b) => a.numero - b.numero);
  const pago = parcelas.reduce((s, p) => s + Number(p.valor_pago), 0) + Number(contrato?.valor_entrada ?? 0);
  const emAberto = parcelas.filter((p) => p.status !== "pago").reduce((s, p) => s + Number(p.valor), 0);

  // If demanda is found
  const demandaParcelas = demandaCliente?.parcelas ?? [];
  const demandaPago =
    (demandaCliente?.valorEntrada ?? 0) +
    demandaParcelas
      .filter((p) => p.status === "pago")
      .reduce((s, p) => s + p.valor, 0);
  const demandaEmAberto = Math.max(0, (demandaCliente?.valorTotal ?? 0) - (demandaCliente?.desconto ?? 0) - demandaPago);

  const primeiroNome =
    (aluno?.nome_completo ?? demandaCliente?.cliente ?? user?.email ?? "").split(" ")[0];

  const temBoletosAtrasados = !!(
    (aluno && contrato && parcelas.some((p) => p.status !== "pago" && p.vencimento < hoje)) ||
    (demandaCliente && demandaParcelas.some((p) => p.status !== "pago" && p.vencimento < hoje))
  );

  useEffect(() => {
    if (temBoletosAtrasados) {
      setShowOverdueAlert(true);
      const interval = setInterval(() => {
        setShowOverdueAlert(true);
      }, 120000); // 2 minutos
      return () => clearInterval(interval);
    }
    return undefined;
  }, [temBoletosAtrasados]);

  const handleBaixarPdf = () => {
    if (aluno && contrato) {
      gerarContratoPdf({
        aluno: {
          nome_completo: aluno.nome_completo,
          cpf: aluno.cpf,
          endereco: aluno.endereco ?? null,
          cidade: aluno.cidade ?? null,
          telefone: aluno.whatsapp ?? null,
          email: aluno.email ?? null,
          turma_nome: aluno.turmas?.nome ?? null,
        },
        contrato: {
          pacote: contrato.pacote,
          valor_total: Number(contrato.valor_total),
          desconto: Number(contrato.desconto ?? 0),
          valor_entrada: Number(contrato.valor_entrada ?? 0),
          dia_vencimento: contrato.dia_vencimento ?? 10,
          data_contrato: contrato.data_contrato ?? hoje,
          forma_pagamento: contrato.forma_pagamento ?? "boleto",
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
        texto: contrato.texto_contrato ?? CLAUSULAS_PADRAO,
      });
      toast.success("Download do contrato em PDF iniciado!");
    } else if (demandaCliente) {
      gerarContratoPdf({
        aluno: {
          nome_completo: demandaCliente.cliente,
          cpf: formatarCpf(demandaCliente.cpf),
          endereco: demandaCliente.local,
          cidade: demandaCliente.local.split("-")[1]?.trim() || "São Paulo, SP",
          telefone: demandaCliente.whatsapp || "—",
          email: demandaCliente.email || user?.email || "—",
        },
        contrato: {
          pacote: demandaCliente.pacote,
          valor_total: demandaCliente.valorTotal,
          desconto: demandaCliente.desconto,
          valor_entrada: demandaCliente.valorEntrada,
          dia_vencimento: demandaCliente.diaVencimento,
          data_contrato: demandaCliente.dataEvento,
          forma_pagamento: demandaCliente.formaPagamento,
          autoriza_imagem: true,
        },
        parcelas: demandaCliente.parcelas.map((p) => ({
          numero: p.numero,
          vencimento: p.vencimento,
          valor: p.valor,
          status: p.status,
          data_pagamento: p.dataPagamento ?? null,
          forma_pagamento: demandaCliente.formaPagamento ?? null,
        })),
        texto: CLAUSULAS_PADRAO,
      });
      toast.success("Download do contrato em PDF iniciado!");
    } else {
      toast.error("Contrato não encontrado para download.");
    }
  };

  const tipoDemandaLabel = {
    casamento: "Casamento",
    "festa-aniversario": "Festa de Aniversário",
    ensaio: "Ensaio Fotográfico",
  };

  return (
    <AppShell>
      <h1 className="text-2xl font-bold tracking-tight">Olá, {primeiroNome} 👋</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Bem-vindo à sua área exclusiva na JM Formaturas & Eventos.
      </p>

      {isStaff && (
        <Card className="mb-4 shadow-card">
          <CardContent className="pt-6 text-sm">
            Você tem acesso de equipe administrativa.{" "}
            <Link to="/dashboard" className="text-primary underline underline-offset-4">
              Ir para a visão geral
            </Link>
          </CardContent>
        </Card>
      )}

      {/* CASO 1: CLIENTE DE DEMANDA (Casamento, Aniversário, Ensaio) */}
      {demandaCliente && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="shadow-card sm:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="size-4 text-primary" /> Seleção de fotos
              </CardTitle>
              <Button asChild variant="secondary" size="sm">
                <a href={SELPICS_URL} target="_blank" rel="noopener noreferrer">
                  Selecionar minhas fotos <ExternalLink className="size-4" />
                </a>
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Acesse a plataforma YouFocus para escolher as fotos do seu evento com o mesmo CPF do seu acesso.
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Meus Dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <Info label="Nome / Contratante" value={demandaCliente.cliente} />
              <Info label="CPF" value={formatarCpf(demandaCliente.cpf)} />
              <Info label="WhatsApp" value={demandaCliente.whatsapp ?? null} />
              <Info label="E-mail" value={demandaCliente.email ?? null} />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Dados do Evento</CardTitle>
              <Badge>{tipoDemandaLabel[demandaCliente.tipo] || "Evento"}</Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <Info label="Tipo de Evento" value={tipoDemandaLabel[demandaCliente.tipo]} />
              <Info label="Data do Evento" value={new Date(demandaCliente.dataEvento + "T00:00:00").toLocaleDateString("pt-BR")} />
              <Info label="Local" value={demandaCliente.local} />
              <Info label="Status" value={demandaCliente.status.toUpperCase()} />
            </CardContent>
          </Card>

          {/* Acompanhamento Financeiro Demanda */}
          <Card className="shadow-card sm:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Acompanhamento Financeiro & Parcelas</CardTitle>
              <Badge variant="secondary">{demandaCliente.pacote}</Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-2 sm:grid-cols-3">
                <Info label="Valor total" value={brl(demandaCliente.valorTotal)} />
                <Info label="Já pago" value={brl(demandaPago)} />
                <Info label="Em aberto" value={brl(demandaEmAberto)} />
              </div>
              <div className="space-y-2 mt-4">
                {demandaParcelas.map((p) => {
                  const quitada = p.status === "pago";
                  const atrasada = !quitada && p.vencimento < hoje;
                  return (
                    <div
                      key={p.numero}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium">
                          Parcela {p.numero}/{demandaParcelas.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Vencimento: {new Date(`${p.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{brl(p.valor)}</span>
                        <Badge
                          variant={quitada ? "default" : atrasada ? "destructive" : "secondary"}
                          className={quitada ? "bg-emerald-600" : ""}
                        >
                          {quitada ? "pago" : atrasada ? "atrasada" : "pendente"}
                        </Badge>
                        {!quitada && (
                          <PagamentoDialog
                            parcelaId={`dem-${demandaCliente.id}-${p.numero}`}
                            numero={p.numero}
                            valor={p.valor}
                            vencimento={p.vencimento}
                            clienteNome={demandaCliente.cliente}
                            clienteCpf={demandaCliente.cpf}
                            pacote={demandaCliente.pacote}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contrato da Demanda */}
          <Card className="shadow-card sm:col-span-2">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileDown className="size-4 text-primary" /> Contrato
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Documento contratual referente a {demandaCliente.pacote}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Visualizar Contrato
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Contrato</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2">
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Termos e Cláusulas Contratuais
                      </p>
                      <div className="rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text text-foreground/90 shadow-inner">
                        {CLAUSULAS_PADRAO}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="sm" onClick={handleBaixarPdf}>
                <FileDown className="size-4 mr-1.5" /> Baixar em PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CASO 2: FORMANDO DE TURMA */}
      {aluno && (
        <div className="space-y-4">
          {alunos && alunos.length > 1 && (
            <Card className="shadow-sm border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm">Você possui múltiplos vínculos</h3>
                  <p className="text-xs text-muted-foreground">Selecione a turma que deseja visualizar no painel:</p>
                </div>
                <Select value={selectedAlunoId || ""} onValueChange={(val) => setSelectedAlunoId(val)}>
                  <SelectTrigger className="w-full sm:w-[300px] h-9 text-xs">
                    <SelectValue placeholder="Selecione a turma" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((a) => (
                      <SelectItem key={a.id} value={a.id} className="text-xs">
                        {a.turmas?.nome} ({a.turmas?.curso})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* LINHA DE SELEÇÃO */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start">
            {/* Card 1: Seleção de Fotos */}
            <Card className="shadow-card h-full flex flex-col">
              <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                  <Camera className="size-4 text-primary shrink-0" />
                  SELEÇÃO DE FOTOS
                </CardTitle>
                <Button asChild variant="secondary" size="sm" className="h-7 text-xs px-2.5 rounded-md ml-auto">
                  <a href={SELPICS_URL} target="_blank" rel="noopener noreferrer">
                    Selecionar minhas fotos <ExternalLink className="size-3.5 ml-1" />
                  </a>
                </Button>
              </CardHeader>
              <CardContent className="p-4 pt-0 text-xs text-muted-foreground border-t border-border/40 mt-1 pt-2.5 flex-1">
                Escolha as fotos da sua formatura na plataforma YouFocus usando o mesmo CPF do seu acesso.
              </CardContent>
            </Card>

            {/* Card 2: Minhas Fotos Selecionadas */}
            {aluno.fotos_liberadas && (
              <Card className="shadow-card h-full flex flex-col">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    MINHAS FOTOS SELECIONADAS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 border-t border-border/40 mt-1 pt-2.5 flex-1 flex flex-col justify-center">
                {(() => {
                  const expirou = aluno.vencimento_fotos_selecionadas && new Date() > new Date(aluno.vencimento_fotos_selecionadas + "T23:59:59");
                  if (expirou) {
                    return (
                      <div className="text-[11px] text-destructive text-justify leading-relaxed">
                        <p className="mb-2 font-medium">Verificamos que o link de acesso às suas fotos já expirou, pois ultrapassou o prazo de armazenamento estabelecido pela empresa.</p>
                        <p className="mb-2">Durante esse período, as fotos permaneceram armazenadas em nosso sistema, o que gerou custos de manutenção e backup dos arquivos. Como o prazo estipulado já foi ultrapassado, o acesso às fotos não está mais disponível pelo link anterior.</p>
                        <p>Caso queira recuperar o acesso às suas fotos, pedimos que entre em contato conosco para verificarmos a disponibilidade dos arquivos e realizarmos uma nova negociação referente ao período adicional de armazenamento e recuperação.</p>
                      </div>
                    );
                  }
                  return (
                    <Button asChild className="w-full h-8 text-xs" disabled={!aluno.link_fotos_selecionadas}>
                      {aluno.link_fotos_selecionadas ? (
                        <a href={aluno.link_fotos_selecionadas} target="_blank" rel="noopener noreferrer">
                          Acessar Fotos <ExternalLink className="size-3.5 ml-1.5" />
                        </a>
                      ) : (
                        <span className="pointer-events-none opacity-50">Acessar Fotos</span>
                      )}
                    </Button>
                  );
                })()}
              </CardContent>
            </Card>
            )}

            {/* Card 3: Aprovação de Álbum */}
            {aluno.album_liberado && (
              <Card className="shadow-card h-full flex flex-col">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                    <FileText className="size-4 text-primary shrink-0" />
                    APROVAÇÃO DE ÁLBUM
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 border-t border-border/40 mt-1 pt-2.5 flex-1 flex flex-col justify-center">
                  <Button asChild className="w-full h-8 text-xs" disabled={!aluno.link_aprovacao_album}>
                    {aluno.link_aprovacao_album ? (
                      <a href={aluno.link_aprovacao_album} target="_blank" rel="noopener noreferrer">
                        Acessar Álbum <ExternalLink className="size-3.5 ml-1.5" />
                      </a>
                    ) : (
                      <span className="pointer-events-none opacity-50">Acessar Álbum</span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* LINHA DE DADOS */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 items-start">
            {/* Card 1: Meus Dados Cadastrais */}
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center gap-2 p-4 pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5 shrink-0">
                  <User className="size-4 text-gold shrink-0" />
                  Meus Dados Cadastrais
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
                  <Info label="CPF (Login)" value={aluno.cpf} />
                  {aluno.rg && <Info label="RG" value={aluno.rg} />}
                  <Info label="Telefone" value={aluno.telefone || aluno.whatsapp} />
                  <Info label="WhatsApp" value={aluno.whatsapp} />
                  <Info label="E-mail" value={aluno.email} />
                  <Info label="Endereço" value={aluno.endereco} />
                  <Info label="Cidade" value={aluno.cidade} />
                </CardContent>
              )}
            </Card>

            {/* Card 2: Pacote Escolhido */}
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
                      <Info label="Vencimento dos Boletos" value={`Todo dia ${contrato.dia_vencimento || 10}`} />
                      <Info
                        label="Uso de Imagem"
                        value={contrato.autoriza_imagem !== false ? "Sim, autorizado para divulgação" : "Não autorizado"}
                      />
                      {aluno?.turmas?.semestre && (
                        <Info label="Semestre" value={aluno.turmas.semestre} />
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs py-2">Seu pacote ainda está sendo definido pela administração.</p>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Card 3: Contrato */}
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
                        Documento oficial referente a <span className="font-medium text-foreground">{contrato.pacote}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 gap-1">
                              <Eye className="size-3.5" /> Visualizar Contrato
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Contrato</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2">
                              <div className="rounded-xl border border-border bg-muted/40 p-3">
                                <p className="text-xs font-medium text-muted-foreground">PACOTE CONTRATADO</p>
                                <p className="text-sm font-semibold mt-0.5">{contrato.pacote}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Total: {brl(Number(contrato.valor_total))}
                                  {Number(contrato.desconto) > 0 && ` (Desconto: ${brl(Number(contrato.desconto))})`}
                                </p>
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Termos e Cláusulas Contratuais
                                </p>
                                <div className="rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text text-foreground/90 shadow-inner">
                                  {contrato.texto_contrato || CLAUSULAS_PADRAO}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          className="h-7 text-xs px-2.5 gap-1"
                          onClick={handleBaixarPdf}
                        >
                          <FileDown className="size-3.5" /> Baixar em PDF
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground text-xs py-2">
                      O modelo do seu contrato ainda está sendo preparado pela equipe da JM Formaturas.
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Acompanhamento Financeiro */}
          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Acompanhamento Financeiro (Boletos)</CardTitle>
              {contrato && <Badge variant="secondary">{contrato.pacote}</Badge>}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!contrato && (
                <p className="text-muted-foreground">
                  Seu contrato ainda não foi lançado pela equipe da JM Formaturas.
                </p>
              )}
              {contrato && (
                <>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Info label="Valor total" value={brl(Number(contrato.valor_total))} />
                    <Info label="Já pago" value={brl(pago)} />
                    <Info label="Em aberto" value={brl(emAberto)} />
                  </div>
                  <div className="space-y-2">
                    {parcelas.map((p) => {
                      const quitada = p.status === "pago";
                      const atrasada = !quitada && p.vencimento < hoje;
                      return (
                        <div
                          key={p.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                        >
                          <div>
                            <p className="font-medium">
                              Parcela {p.numero}/{parcelas.length}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Vencimento: {new Date(`${p.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{brl(Number(p.valor))}</span>
                            <Badge
                              variant={quitada ? "default" : atrasada ? "destructive" : "secondary"}
                              className={quitada ? "bg-emerald-600" : ""}
                            >
                              {quitada ? "pago" : atrasada ? "atrasada" : "pendente"}
                            </Badge>
                            {!quitada && (
                              <PagamentoDialog
                                parcelaId={p.id}
                                numero={p.numero}
                                valor={Number(p.valor) - Number(p.valor_pago)}
                                vencimento={p.vencimento}
                                clienteNome={aluno.nome_completo}
                                clienteCpf={aluno.cpf}
                                pacote={contrato.pacote}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !aluno && !demandaCliente && !isStaff && (
        <Card className="shadow-card">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            Seu login ainda não está vinculado a um cadastro de formando ou cliente. Entre em contato com a equipe da JM
            Formaturas para liberar o acesso.
          </CardContent>
        </Card>
      )}

      {showOverdueAlert && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-destructive/30 bg-destructive/95 text-destructive-foreground p-4 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-sm flex items-center gap-1.5">
                <span>⚠️</span> Atenção: Parcelas Atrasadas
              </p>
              <p className="text-xs opacity-90 leading-normal">
                Identificamos que você possui parcelas com o boleto vencido. Regularize seu pagamento para evitar suspensão dos serviços.
              </p>
            </div>
            <button
              onClick={() => setShowOverdueAlert(false)}
              className="text-destructive-foreground/70 hover:text-destructive-foreground hover:bg-white/10 rounded p-1 transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value?: string | null }) {
  return (
    <p className="flex justify-between gap-4 border-b border-border/60 py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </p>
  );
}
