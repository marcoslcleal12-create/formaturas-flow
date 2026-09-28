import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileDown, Save, Eye, ShieldCheck, ShieldAlert, Lock } from "lucide-react";
import { toast } from "sonner";
import { updateContrato, getAssinatura } from "@/lib/api/contratos";
import { mensagemErro } from "@/lib/api/errors";
import {
  CLAUSULAS_PADRAO,
  FORMAS_PAGAMENTO,
  formaPagamentoLabel,
  gerarContratoPdf,
  type ParcelaPdf,
} from "@/lib/contrato-modelo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Contrato = {
  id: string;
  pacote: string;
  valor_total: number;
  desconto: number;
  valor_entrada: number;
  num_parcelas: number;
  dia_vencimento: number;
  data_contrato: string;
  forma_pagamento: string | null;
  autoriza_imagem: boolean | null;
  texto_contrato: string | null;
};

type Aluno = {
  nome_completo: string;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  telefone: string | null;
  email: string | null;
  turmas?: {
    nome: string;
  } | null;
};

export function ContratoDocumento({
  aluno,
  contrato,
  parcelas,
  alunoId,
}: {
  aluno: Aluno;
  contrato: Contrato;
  parcelas: ParcelaPdf[];
  alunoId: string;
}) {
  const queryClient = useQueryClient();
  const [texto, setTexto] = useState(contrato.texto_contrato ?? CLAUSULAS_PADRAO);

  /*  A situação da assinatura vem do servidor, e não de um campo do
      contrato: é ele que recalcula o hash do texto atual e diz se o
      documento continua sendo o que foi assinado.  */
  const { data: assinatura } = useQuery({
    queryKey: ["assinatura", contrato.id],
    queryFn: () => getAssinatura(contrato.id),
  });

  const assinado = assinatura?.assinado ?? false;
  const adulterado = assinado && assinatura?.textoIntacto === false;
  const [forma, setForma] = useState(contrato.forma_pagamento ?? "boleto");
  const [autoriza, setAutoriza] = useState(contrato.autoriza_imagem ?? true);

  const salvar = useMutation({
    mutationFn: async () => {
      await updateContrato(contrato.id, {
        pacote: contrato.pacote,
        valorTotal: Number(contrato.valor_total),
        valorEntrada: Number(contrato.valor_entrada),
        desconto: Number(contrato.desconto),
        numParcelas: contrato.num_parcelas,
        diaVencimento: contrato.dia_vencimento,
        formaPagamento: forma,
        autorizaImagem: autoriza,
        textoContrato: texto,
        recalcularParcelas: false,
      });
    },
    onSuccess: () => {
      toast.success("Contrato salvo");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
    },
    onError: (error) => toast.error(mensagemErro(error)),
  });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileDown className="size-4 text-primary" /> Contrato de Prestação de Serviços
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Documento contratual referente a {contrato.pacote}
        </p>

        {assinado && (
          <div
            className={`mt-2 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
              adulterado
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {adulterado
              ? <ShieldAlert className="size-4 mt-0.5 shrink-0" />
              : <ShieldCheck className="size-4 mt-0.5 shrink-0" />}
            <div className="space-y-0.5">
              <p className="font-semibold">
                {adulterado
                  ? "O texto foi alterado depois da assinatura"
                  : `Assinado por ${assinatura?.assinanteNome ?? aluno.nome_completo}`}
              </p>
              {assinatura?.assinadoEm && (
                <p className="opacity-80">
                  {new Date(assinatura.assinadoEm).toLocaleString("pt-BR")}
                  {assinatura.assinadoIp ? ` · IP ${assinatura.assinadoIp}` : ""}
                </p>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="size-4" /> Visualizar Contrato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Contrato de Prestação de Serviços</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="texto-contrato" className="font-semibold">
                  {assinado ? "Cláusulas (bloqueadas)" : "Cláusulas (editáveis)"}
                </Label>
                {!assinado && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground underline hover:text-foreground"
                    onClick={() => setTexto(CLAUSULAS_PADRAO)}
                  >
                    restaurar modelo padrão
                  </button>
                )}
              </div>

              {assinado && (
                <p className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5 mt-0.5 shrink-0" />
                  Este contrato foi assinado e seu texto não pode mais ser alterado. Para mudar o
                  teor, emita um novo contrato.
                </p>
              )}

              <Textarea
                id="texto-contrato"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                readOnly={assinado}
                className="min-h-[360px] font-mono text-xs leading-relaxed"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                disabled={assinado || salvar.isPending}
                onClick={() => salvar.mutate()}
                className="gap-1.5"
              >
                <Save className="size-4" /> Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          size="sm"
          onClick={() =>
            gerarContratoPdf({
              aluno: {
                nome_completo: aluno.nome_completo,
                cpf: aluno.cpf,
                endereco: aluno.endereco,
                cidade: aluno.cidade,
                telefone: aluno.telefone,
                email: aluno.email,
                turma_nome: aluno.turmas?.nome || null,
              },
              contrato: {
                pacote: contrato.pacote,
                valor_total: Number(contrato.valor_total),
                desconto: Number(contrato.desconto),
                valor_entrada: Number(contrato.valor_entrada),
                dia_vencimento: contrato.dia_vencimento,
                data_contrato: contrato.data_contrato,
                forma_pagamento: forma,
                autoriza_imagem: autoriza,
              },
              parcelas,
              texto,
              assinatura: assinatura
                ? {
                    imagem: assinatura.assinaturaImagem,
                    assinanteNome: assinatura.assinanteNome,
                    assinanteCpf: assinatura.assinanteCpf,
                    assinadoEm: assinatura.assinadoEm,
                    assinadoIp: assinatura.assinadoIp,
                    hashDocumento: assinatura.hashDocumento,
                    textoIntacto: assinatura.textoIntacto,
                  }
                : null,
            })
          }
          className="gap-1.5"
        >
          <FileDown className="size-4" /> Baixar em PDF
        </Button>
      </CardContent>
    </Card>
  );
}

