import { apiFetch } from "./client";

export type Parcela = {
  id: string;
  contratoId: string;
  numero: number;
  valor: number;
  valorPago: number;
  vencimento: string;
  dataPagamento?: string | null;
  status: "Pendente" | "Pago" | "Atrasado" | "Cancelado";
  formaPagamento?: string | null;
  observacao?: string | null;
  pspProvider?: string | null;
  pspChargeId?: string | null;
  pspStatus?: string | null;
  boletoUrl?: string | null;
  boletoLinhaDigitavel?: string | null;
  boletoCodigoBarras?: string | null;
  pixCopiaCola?: string | null;
  pixQrCodeUrl?: string | null;
  linkPagamento?: string | null;
  criadaEm: string;
  atualizadaEm: string;
};

export type Contrato = {
  id: string;
  alunoId: string;
  pacote?: string | null;
  valorTotal: number;
  valorEntrada: number;
  numParcelas: number;
  formaPagamento?: string | null;
  dataContrato: string;
  textoContrato?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  parcelas?: Parcela[];
};

export type ContratoInput = {
  alunoId: string;
  pacote?: string | null | undefined;
  valorTotal: number;
  valorEntrada: number;
  numParcelas: number;
  formaPagamento?: string | null | undefined;
  dataContrato: string;
  primeiroVencimento: string;
};

export async function listContratos(opts?: { signal?: AbortSignal }): Promise<Contrato[]> {
  return apiFetch<Contrato[]>({ method: "GET", path: "/api/v1/contratos", ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function getContrato(id: string, opts?: { signal?: AbortSignal }): Promise<Contrato> {
  return apiFetch<Contrato>({ method: "GET", path: `/api/v1/contratos/${id}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createContrato(input: ContratoInput): Promise<Contrato> {
  return apiFetch<Contrato>({ method: "POST", path: "/api/v1/contratos", body: input });
}

export async function listParcelas(opts?: { status?: string; signal?: AbortSignal }): Promise<Parcela[]> {
  const qs = opts?.status ? `?status=${encodeURIComponent(opts.status)}` : "";
  return apiFetch<Parcela[]>({ method: "GET", path: `/api/v1/parcelas${qs}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function baixarParcela(id: string, body: { valorPago?: number; dataPagamento?: string; formaPagamento?: string }): Promise<Parcela> {
  return apiFetch<Parcela>({ method: "POST", path: `/api/v1/parcelas/${id}/baixar`, body });
}

export async function desfazerBaixa(id: string): Promise<Parcela> {
  return apiFetch<Parcela>({ method: "POST", path: `/api/v1/parcelas/${id}/desfazer`, body: {} });
}
