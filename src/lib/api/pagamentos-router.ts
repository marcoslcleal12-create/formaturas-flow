import { apiFetch } from "./client";

export type TipoProjeto = "Formatura" | "Casamento";
export type MetodoPagamento = "Pix" | "Boleto" | "CartaoCredito" | "Checkout";

export type MetodosDisponiveis = {
  tipoProjeto: TipoProjeto;
  provider: "Cora" | "Asaas";
  metodos: MetodoPagamento[];
};

export type PagadorInfo = {
  nome: string;
  documento: string;
  email?: string | null;
  telefone?: string | null;
  cep?: string | null;
  numeroEndereco?: string | null;
};

export type CobrancaRoteadaInput = {
  tipoProjeto: TipoProjeto;
  metodo: MetodoPagamento;
  valor: number;
  vencimento: string;
  descricao: string;
  referenciaExterna: string;
  pagador: PagadorInfo;
  parcelaId?: string | null;
};

export type CobrancaResponse = {
  provider: string;
  chargeId: string;
  metodo: string;
  status: string;
  linkPagamento?: string | null;
  boletoUrl?: string | null;
  boletoLinhaDigitavel?: string | null;
  boletoCodigoBarras?: string | null;
  pixCopiaCola?: string | null;
  pixQrCodeUrl?: string | null;
};

export async function listarMetodos(tipoProjeto: TipoProjeto): Promise<MetodosDisponiveis> {
  return apiFetch<MetodosDisponiveis>({ method: "GET", path: `/api/v1/pagamentos/metodos/${tipoProjeto}` });
}

export async function emitirCobrancaRoteada(input: CobrancaRoteadaInput): Promise<CobrancaResponse> {
  return apiFetch<CobrancaResponse>({ method: "POST", path: "/api/v1/pagamentos/cobrancas", body: input });
}
