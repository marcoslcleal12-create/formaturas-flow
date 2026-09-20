import { useState, useEffect } from "react";
import { Barcode, Check, Copy, Download, ExternalLink, QrCode, CreditCard } from "lucide-react";
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
import {
  emitirCobrancaRoteada,
  listarMetodos,
  type MetodoPagamento,
  type TipoProjeto,
  type CobrancaResponse,
} from "@/lib/api/pagamentos-router";
import { mensagemErro } from "@/lib/api/errors";

interface PagamentoDialogProps {
  parcelaId: string;
  numero: number;
  valor: number;
  vencimento?: string;
  clienteNome?: string;
  clienteCpf?: string | null;
  clienteEmail?: string | null;
  clienteTelefone?: string | null;
  pacote?: string;
  tipoProjeto?: TipoProjeto;
}

/*  Dialogo unico de pagamento. Roteia pela nova arquitetura (Cora para
    Formatura, Asaas para Casamento) chamando POST /api/v1/pagamentos/cobrancas.
    Fluxo:
      1. Ao abrir, GET /pagamentos/metodos/{tipoProjeto} para listar
         Pix/Boleto/Cartao suportados pelo dominio.
      2. Usuario escolhe o metodo.
      3. Botao "Gerar cobranca" emite a cobranca de verdade no PSP e
         renderiza QR (Pix), linha digitavel + link do boleto ou link do
         checkout do cartao. */
export function PagamentoDialog({
  parcelaId,
  numero,
  valor,
  vencimento = new Date().toISOString().slice(0, 10),
  clienteNome = "Cliente",
  clienteCpf,
  clienteEmail,
  clienteTelefone,
  pacote = "Serviços Fotográficos",
  tipoProjeto = "Formatura",
}: PagamentoDialogProps) {
  const [open, setOpen] = useState(false);
  const [metodosDisponiveis, setMetodosDisponiveis] = useState<MetodoPagamento[]>([]);
  const [provider, setProvider] = useState<string>("");
  const [metodoSelecionado, setMetodoSelecionado] = useState<MetodoPagamento | null>(null);
  const [carregandoMetodos, setCarregandoMetodos] = useState(false);
  const [emitindo, setEmitindo] = useState(false);
  const [cobranca, setCobranca] = useState<CobrancaResponse | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let ativo = true;
    setCarregandoMetodos(true);
    listarMetodos(tipoProjeto)
      .then((res) => {
        if (!ativo) return;
        setMetodosDisponiveis(res.metodos);
        setProvider(res.provider);
        setMetodoSelecionado(res.metodos[0] ?? null);
      })
      .catch((err) => {
        if (!ativo) return;
        toast.error(mensagemErro(err, "Não foi possível listar métodos de pagamento."));
      })
      .finally(() => ativo && setCarregandoMetodos(false));
    return () => {
      ativo = false;
    };
  }, [open, tipoProjeto]);

  const handleReset = () => {
    setCobranca(null);
    setCopiado(null);
  };

  const handleEmitir = async () => {
    if (!metodoSelecionado || !clienteCpf) {
      toast.error("Cadastro incompleto: falta CPF do cliente para gerar a cobrança.");
      return;
    }
    setEmitindo(true);
    try {
      const resp = await emitirCobrancaRoteada({
        tipoProjeto,
        metodo: metodoSelecionado,
        valor,
        vencimento,
        descricao: `Parcela ${numero === 0 ? "Entrada" : numero} · ${pacote}`,
        referenciaExterna: `parcela:${parcelaId}`,
        pagador: {
          nome: clienteNome,
          documento: clienteCpf,
          email: clienteEmail ?? null,
          telefone: clienteTelefone ?? null,
        },
        parcelaId,
      });
      setCobranca(resp);
      toast.success(`Cobrança emitida via ${resp.provider}.`);
    } catch (err) {
      toast.error(mensagemErro(err, "Falha ao emitir cobrança."));
    } finally {
      setEmitindo(false);
    }
  };

  const copiar = (texto: string, chave: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(chave);
    toast.success("Copiado!");
    setTimeout(() => setCopiado(null), 2000);
  };

  const dataFormatada = new Date(`${vencimento}T12:00:00`).toLocaleDateString("pt-BR");

  const labelMetodo = (m: MetodoPagamento) =>
    m === "Pix" ? "Pix" : m === "Boleto" ? "Boleto" : m === "CartaoCredito" ? "Cartão de crédito" : "Checkout";

  const iconeMetodo = (m: MetodoPagamento) =>
    m === "Pix" ? <QrCode className="size-4" /> :
    m === "Boleto" ? <Barcode className="size-4" /> :
    <CreditCard className="size-4" />;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) handleReset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1.5 text-xs">
          <Barcode className="size-3.5" /> Pagar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center justify-between">
            <span>{numero === 0 ? "Entrada" : `Parcela ${numero}`} · {brl(valor)}</span>
            <span className="text-xs font-normal text-muted-foreground">Vencimento: {dataFormatada}</span>
          </DialogTitle>
          <DialogDescription>
            {cobranca
              ? `Cobrança gerada pelo ${cobranca.provider}. Compartilhe ou finalize o pagamento abaixo.`
              : `Escolha a forma de pagamento. ${provider ? `Provedor: ${provider}.` : ""}`}
          </DialogDescription>
        </DialogHeader>

        {!cobranca && (
          <div className="space-y-4 pt-1">
            {carregandoMetodos && (
              <p className="text-xs text-muted-foreground text-center py-6">Carregando métodos disponíveis...</p>
            )}

            {!carregandoMetodos && metodosDisponiveis.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {metodosDisponiveis.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMetodoSelecionado(m)}
                    className={`rounded-xl border p-3 text-left flex items-center gap-2 transition-colors ${
                      metodoSelecionado === m
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border hover:bg-muted/40"
                    }`}
                  >
                    {iconeMetodo(m)}
                    <span className="text-sm font-medium">{labelMetodo(m)}</span>
                  </button>
                ))}
              </div>
            )}

            <Button
              onClick={handleEmitir}
              disabled={emitindo || !metodoSelecionado}
              className="w-full h-10 gap-1.5"
            >
              {emitindo ? "Gerando cobrança..." : `Gerar cobrança${metodoSelecionado ? ` — ${labelMetodo(metodoSelecionado)}` : ""}`}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              Cliente: <strong>{clienteNome}</strong> · CPF: <strong>{clienteCpf ?? "—"}</strong>
            </p>
          </div>
        )}

        {cobranca && (
          <div className="space-y-4 pt-1">
            {cobranca.pixCopiaCola && (
              <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <QrCode className="size-4 text-primary" /> Pix Copia e Cola
                  </span>
                </div>
                {cobranca.pixQrCodeUrl && (
                  <img
                    src={cobranca.pixQrCodeUrl}
                    alt="QR Code Pix"
                    className="mx-auto rounded-lg border bg-white p-2 size-48"
                  />
                )}
                <div className="rounded-lg bg-background p-3 font-mono text-[10px] break-all border shadow-inner max-h-24 overflow-y-auto">
                  {cobranca.pixCopiaCola}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copiar(cobranca.pixCopiaCola!, "pix")}
                  className="w-full text-xs gap-1.5 h-9"
                >
                  {copiado === "pix" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  {copiado === "pix" ? "Copiado!" : "Copiar Pix"}
                </Button>
              </div>
            )}

            {cobranca.boletoLinhaDigitavel && (
              <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Barcode className="size-4 text-primary" /> Linha Digitável
                  </span>
                </div>
                <div className="rounded-lg bg-background p-3 font-mono text-xs break-all select-all border shadow-inner">
                  {cobranca.boletoLinhaDigitavel}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copiar(cobranca.boletoLinhaDigitavel!, "linha")}
                    className="text-xs gap-1.5 h-9"
                  >
                    {copiado === "linha" ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                    {copiado === "linha" ? "Copiado!" : "Copiar Linha"}
                  </Button>
                  {cobranca.boletoUrl && (
                    <Button asChild size="sm" className="text-xs gap-1.5 h-9 bg-primary text-primary-foreground font-semibold">
                      <a href={cobranca.boletoUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="size-3.5" /> Baixar Boleto
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {cobranca.linkPagamento && !cobranca.pixCopiaCola && !cobranca.boletoLinhaDigitavel && (
              <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
                <p className="text-xs text-muted-foreground">Finalize o pagamento no checkout seguro do provedor:</p>
                <Button asChild className="w-full h-10 gap-1.5">
                  <a href={cobranca.linkPagamento} target="_blank" rel="noopener noreferrer">
                    Abrir checkout <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            )}

            <div className="text-[11px] text-muted-foreground space-y-1">
              <p>ID da cobrança: <span className="font-mono">{cobranca.chargeId}</span></p>
              <p>Status: <strong>{cobranca.status}</strong> · via {cobranca.provider}</p>
            </div>

            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
              Emitir com outro método
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
