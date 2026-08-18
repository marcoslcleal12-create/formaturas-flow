import { useState } from "react";
import { Barcode, Check, Copy, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { brl } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EMPRESA, gerarBoletoPdf } from "@/lib/contrato-modelo";

interface PagamentoDialogProps {
  parcelaId: string;
  numero: number;
  valor: number;
  vencimento?: string;
  clienteNome?: string;
  clienteCpf?: string | null;
  pacote?: string;
}

export function PagamentoDialog({
  parcelaId,
  numero,
  valor,
  vencimento = new Date().toISOString().slice(0, 10),
  clienteNome = "Cliente",
  clienteCpf,
  pacote = "Serviços Fotográficos",
}: PagamentoDialogProps) {
  const [open, setOpen] = useState(false);
  const [copiadoBoleto, setCopiadoBoleto] = useState(false);

  // Gera linha digitável fictícia baseada no número e valor
  const randomDigits = Math.abs(Math.sin((numero + 1) * 1000 + valor))
    .toString()
    .slice(2, 10);
  const linhaDigitavel = `34191.79001 01043.510047 91020.150008 1 ${randomDigits}0000${Math.round(valor * 100)}`;

  const copiarLinhaDigitavel = () => {
    navigator.clipboard.writeText(linhaDigitavel);
    setCopiadoBoleto(true);
    toast.success("Linha digitável copiada com sucesso!");
    setTimeout(() => setCopiadoBoleto(false), 2500);
  };

  const handleBaixarBoleto = () => {
    try {
      gerarBoletoPdf({
        clienteNome,
        clienteCpf,
        numeroParcela: numero,
        valor,
        vencimento,
        pacote,
      });
      toast.success("Boleto bancário gerado em PDF com sucesso!");
    } catch (e) {
      toast.error("Erro ao gerar boleto em PDF: " + (e as Error).message);
    }
  };

  const dataFormatada = new Date(`${vencimento}T12:00:00`).toLocaleDateString("pt-BR");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Barcode className="size-3.5" /> Pagar Boleto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center justify-between">
            <span>{numero === 0 ? "Entrada" : `Parcela ${numero}`} · {brl(valor)}</span>
            <span className="text-xs font-normal text-muted-foreground">Vencimento: {dataFormatada}</span>
          </DialogTitle>
          <DialogDescription>
            Boleto bancário de cobrança referente ao contrato.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Caixa da Linha Digitável e Ações */}
          <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Barcode className="size-4 text-primary" /> Linha Digitável
              </span>
              <span>Banco Santander / JM</span>
            </div>

            <div className="rounded-lg bg-background p-3 font-mono text-xs break-all select-all border shadow-inner">
              {linhaDigitavel}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={copiarLinhaDigitavel}
                className="text-xs gap-1.5 h-9"
              >
                {copiadoBoleto ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                {copiadoBoleto ? "Copiado!" : "Copiar Linha"}
              </Button>

              <Button
                size="sm"
                onClick={handleBaixarBoleto}
                className="text-xs gap-1.5 h-9 bg-primary text-primary-foreground font-semibold"
              >
                <Download className="size-3.5" /> Baixar Boleto PDF
              </Button>
            </div>
          </div>

          {/* Dados do Boleto */}
          <div className="rounded-lg border bg-card p-3 text-xs space-y-1.5 text-muted-foreground">
            <div className="flex justify-between">
              <span>Beneficiário:</span>
              <strong className="text-foreground">{EMPRESA.nome}</strong>
            </div>
            <div className="flex justify-between">
              <span>CNPJ:</span>
              <strong className="text-foreground">{EMPRESA.cnpj}</strong>
            </div>
            <div className="flex justify-between">
              <span>Pagador:</span>
              <strong className="text-foreground">{clienteNome}</strong>
            </div>
            <div className="flex justify-between">
              <span>Valor:</span>
              <strong className="text-foreground">{brl(valor)}</strong>
            </div>
          </div>

          {/* Instruções */}
          <div className="text-[11px] text-muted-foreground space-y-1 bg-muted/20 p-2.5 rounded-lg border">
            <p>• Pagável em qualquer agência bancária, internet banking ou casas lotéricas até o vencimento.</p>
            <p>• Após o vencimento, incidirá multa e juros contratuais.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
