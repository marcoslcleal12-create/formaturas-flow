import { apiFetch } from "./client";

export type StatusDespesa = "Pendente" | "Pago";

export type Despesa = {
  id: string;
  descricao: string;
  categoria: string;
  valor: number;
  vencimento: string;
  dataPagamento?: string | null;
  status: StatusDespesa;
  formaPagamento?: string | null;
  observacao?: string | null;
  turmaId?: string | null;
  criadaEm: string;
  atualizadaEm: string;
};

export type DespesaInput = {
  descricao: string;
  categoria?: string | null | undefined;
  valor: number;
  vencimento: string;
  formaPagamento?: string | null | undefined;
  observacao?: string | null | undefined;
  turmaId?: string | null | undefined;
  dataPagamento?: string | null | undefined;
  marcarPago?: boolean | undefined;
};

export async function listDespesas(opts?: { signal?: AbortSignal }): Promise<Despesa[]> {
  return apiFetch<Despesa[]>({ method: "GET", path: "/api/v1/despesas", ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createDespesa(input: DespesaInput): Promise<Despesa> {
  return apiFetch<Despesa>({ method: "POST", path: "/api/v1/despesas", body: input });
}

export async function updateDespesa(id: string, input: DespesaInput): Promise<Despesa> {
  return apiFetch<Despesa>({ method: "PUT", path: `/api/v1/despesas/${id}`, body: input });
}

export async function baixarDespesa(id: string, dataPagamento?: string, formaPagamento?: string): Promise<Despesa> {
  return apiFetch<Despesa>({ method: "POST", path: `/api/v1/despesas/${id}/baixar`, body: { dataPagamento: dataPagamento ?? null, formaPagamento: formaPagamento ?? null } });
}

export async function desfazerDespesa(id: string): Promise<Despesa> {
  return apiFetch<Despesa>({ method: "POST", path: `/api/v1/despesas/${id}/desfazer`, body: {} });
}

export async function deleteDespesa(id: string): Promise<void> {
  await apiFetch({ method: "DELETE", path: `/api/v1/despesas/${id}` });
}
