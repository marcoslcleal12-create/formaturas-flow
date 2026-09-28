import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FileDown, Save, Eye, ShieldCheck, ShieldAlert, Lock } from "lucide-react"
import { toast } from "sonner"
import { contratos as apiContratos } from "@/lib/recursos"
import type { Aluno, Contrato } from "@/lib/entidades"
import {
  CLAUSULAS_PADRAO,
  gerarContratoPdf,
  type ParcelaPdf,
} from "@/lib/contrato-modelo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

export function ContratoDocumento({
  aluno,
  contrato,
  parcelas,
  alunoId,
}: {
  aluno: Aluno
  contrato: Contrato
  parcelas: ParcelaPdf[]
  alunoId: string
}) {
  const queryClient = useQueryClient()
  const [texto, setTexto] = useState(contrato.textoContrato ?? CLAUSULAS_PADRAO)

  /*  A situação da assinatura vem do servidor, não de um campo do contrato:
      é o servidor que recalcula o hash e diz se o texto continua íntegro.  */
  const { data: assinatura } = useQuery({
    queryKey: ["assinatura", contrato.id],
    queryFn: () => apiContratos.assinatura(contrato.id),
  })

  const assinado = assinatura?.assinado ?? false
  const adulterado = assinado && assinatura?.textoIntacto === false

  const salvar = useMutation({
    mutationFn: () => apiContratos.atualizar(contrato.id, {
      pacote: contrato.pacote,
      valorTotal: contrato.valorTotal,
      valorEntrada: contrato.valorEntrada,
      desconto: contrato.desconto,
      numParcelas: contrato.numParcelas,
      diaVencimento: contrato.diaVencimento,
      autorizaImagem: contrato.autorizaImagem,
      formaPagamento: contrato.formaPagamento,
      textoContrato: texto,
    }),
    onSuccess: () => {
      toast.success("Contrato salvo")
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] })
    },
    /*  O servidor recusa alterar o teor de contrato assinado; a mensagem
        dele já explica o porquê e é melhor do que qualquer texto genérico
        que a tela inventasse.  */
    onError: (error) => toast.error((error as Error).message),
  })

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileDown className="size-4 text-primary" /> Contrato de Prestação de Serviços
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Documento contratual referente a {contrato.pacote ?? "—"}
        </p>

        {assinado && (
          <div
            className={`mt-2 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
              adulterado
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            }`}
          >
            {adulterado ? <ShieldAlert className="size-4 mt-0.5 shrink-0" /> : <ShieldCheck className="size-4 mt-0.5 shrink-0" />}
            <div className="space-y-0.5">
              <p className="font-semibold">
                {adulterado
                  ? "O texto foi alterado depois da assinatura"
                  : `Assinado por ${assinatura?.assinanteNome ?? aluno.nomeCompleto}`}
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
                nomeCompleto: aluno.nomeCompleto,
                cpf: aluno.cpf,
                endereco: aluno.endereco,
                cidade: aluno.cidade,
                telefone: aluno.telefone,
                email: aluno.email,
                turmaNome: aluno.turma?.nome ?? null,
              },
              contrato: {
                pacote: contrato.pacote ?? "—",
                valorTotal: Number(contrato.valorTotal),
                desconto: Number(contrato.desconto),
                valorEntrada: Number(contrato.valorEntrada),
                diaVencimento: contrato.diaVencimento ?? 10,
                dataContrato: contrato.dataContrato,
                formaPagamento: contrato.formaPagamento ?? "boleto",
                autorizaImagem: contrato.autorizaImagem,
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
  )
}
