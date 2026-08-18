import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Camera, ExternalLink, FileDown, Lock, Printer, Calendar, MapPin, Heart, PartyPopper, UserCheck } from "lucide-react";
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

const SELPICS_URL = "https://selpics.com/";

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

  // 1. Check if user is a Formando in Supabase (by user_id or by CPF)
  const { data: aluno } = useQuery({
    queryKey: ["meu-cadastro", user?.id, userDigits],
    enabled: !!user,
    queryFn: async () => {
      // Tenta por user_id se for UUID
      if (user?.id && user.id.includes("-")) {
        const { data } = await supabase
          .from("alunos")
          .select("*, turmas(nome, curso, faculdade, semestre, previsao_formatura)")
          .eq("user_id", user.id)
          .maybeSingle();
        if (data) return data;
      }
      // Tenta por CPF (11 dígitos)
      if (userDigits && userDigits.length === 11) {
        const { data } = await supabase
          .from("alunos")
          .select("*, turmas(nome, curso, faculdade, semestre, previsao_formatura)")
          .eq("cpf", userDigits)
          .maybeSingle();
        if (data) return data;
      }
      return null;
    },
  });

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
              Acesse a plataforma Selpics para escolher as fotos do seu evento com o mesmo CPF do seu acesso.
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
                  <FileDown className="size-4 text-primary" /> Contrato de Prestação de Serviços
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Documento contratual referente a {demandaCliente.pacote}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" onClick={handleBaixarPdf}>
                  <FileDown className="size-4 mr-1.5" /> Baixar Contrato em PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border bg-card/60 p-4 font-mono text-xs leading-relaxed max-h-[250px] overflow-y-auto whitespace-pre-wrap select-text text-foreground/90 shadow-inner">
                {CLAUSULAS_PADRAO}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CASO 2: FORMANDO DE TURMA */}
      {aluno && (
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
              Escolha as fotos da sua formatura na plataforma Selpics usando o mesmo CPF do seu acesso.
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Meus dados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <Info label="Nome" value={aluno.nome_completo} />
              <Info label="CPF" value={aluno.cpf} />
              <Info label="WhatsApp" value={aluno.whatsapp} />
              <Info label="E-mail" value={aluno.email} />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Minha turma</CardTitle>
              <Badge variant="secondary">{aluno.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <Info label="Turma" value={aluno.turmas?.nome} />
              <Info label="Curso" value={aluno.turmas?.curso} />
              <Info label="Faculdade" value={aluno.turmas?.faculdade} />
              <Info label="Semestre" value={aluno.turmas?.semestre} />
            </CardContent>
          </Card>

          <Card className="shadow-card sm:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Acompanhamento Financeiro</CardTitle>
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

          {/* Contrato do Formando */}
          <Card className="shadow-card sm:col-span-2">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileDown className="size-4 text-primary" /> Contrato de Prestação de Serviços
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Documento contratual oficial gerado pela administração (somente leitura)
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 border-border/80 text-muted-foreground text-xs py-1">
                  <Lock className="size-3" /> Bloqueado para edição
                </Badge>
                <Button
                  size="sm"
                  onClick={handleBaixarPdf}
                  disabled={!contrato}
                >
                  <FileDown className="size-4 mr-1.5" /> Baixar em PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {contrato ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-1">
                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                      <p className="text-xs font-medium text-muted-foreground">PACOTE CONTRATADO</p>
                      <p className="text-sm font-semibold mt-1">{contrato.pacote}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total: {brl(Number(contrato.valor_total))}
                        {Number(contrato.desconto) > 0 && ` (Desconto: ${brl(Number(contrato.desconto))})`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Termos e Cláusulas Contratuais
                      </p>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="size-3" /> Modelo definido pelo administrador
                      </span>
                    </div>
                    <div className="rounded-xl border border-border bg-card/60 p-4 font-mono text-xs leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap select-text text-foreground/90 shadow-inner">
                      {contrato.texto_contrato || CLAUSULAS_PADRAO}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground text-center">
                  O modelo e os dados do seu contrato ainda estão sendo preparados pela equipe administrativa da JM Formaturas.
                </div>
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
