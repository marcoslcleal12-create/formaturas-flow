import { apiFetch } from "./client";

export type TipoPagamento = "pix" | "boleto" | "cartao" | "checkout";
export type TipoEvento = "Formatura" | "Casamento" | "Outro";
export type StatusCobranca = "Pendente" | "Confirmado" | "Vencido" | "Cancelado" | "Estornado";

export type CriarCobrancaInput = {
  externalReference: string;
  clienteNome: string;
  clienteCpf?: string | undefined;
  clienteEmail?: string | undefined;
  clienteWhatsapp?: string | undefined;
  clienteTelefone?: string | undefined;
  valor: number;
  vencimento: string;
  descricao: string;
  tipo: TipoPagamento;
  numParcelasCartao?: number | undefined;
  tipoEvento?: TipoEvento | undefined;
};

export type Cobranca = {
  id: string;
  externalReference: string;
  clienteNome: string;
  clienteCpf?: string;
  clienteEmail?: string;
  valor: number;
  valorPago: number;
  vencimento: string;
  dataPagamento?: string;
  descricao: string;
  tipoPagamento: string;
  numParcelasCartao?: number;
  tipoEvento: TipoEvento;
  status: StatusCobranca;
  pspProvider?: string;
  pspChargeId?: string;
  pspStatus?: string;
  boletoUrl?: string;
  boletoLinhaDigitavel?: string;
  boletoCodigoBarras?: string;
  pixCopiaCola?: string;
  pixQrCodeUrl?: string;
  linkPagamento?: string;
  criadaEm: string;
  atualizadaEm: string;
};

export type CriarCobrancaResponse = Cobranca | { existente: true; cobranca: Cobranca };

export async function criarCobranca(
  input: CriarCobrancaInput,
  opts?: { token?: string; signal?: AbortSignal },
): Promise<Cobranca> {
  const resp = await apiFetch<CriarCobrancaResponse>({
    method: "POST",
    path: "/api/v1/cobrancas",
    body: input,
    ...(opts?.token ? { token: opts.token } : {}),
    ...(opts?.signal ? { signal: opts.signal } : {}),
  });
  return "existente" in resp ? resp.cobranca : resp;
}

export async function buscarCobrancaPorRef(
  externalRef: string,
  opts?: { token?: string; signal?: AbortSignal },
): Promise<Cobranca | null> {
  try {
    return await apiFetch<Cobranca>({
      method: "GET",
      path: `/api/v1/cobrancas/by-ref/${encodeURIComponent(externalRef)}`,
      ...(opts?.token ? { token: opts.token } : {}),
      ...(opts?.signal ? { signal: opts.signal } : {}),
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("404")) return null;
    throw err;
  }
}
