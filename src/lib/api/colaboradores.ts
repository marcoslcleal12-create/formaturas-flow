import { apiFetch } from "./client";

export type StatusColaborador = "Ativo" | "Inativo";
export type TipoLancamento = "Entrada" | "Saida";

export type Colaborador = {
  id: string;
  nome: string;
  funcao: string;
  salarioBase: number;
  telefone?: string | null;
  chavePix?: string | null;
  email?: string | null;
  status: StatusColaborador;
  dataAdmissao?: string | null;
  observacoes?: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type ColaboradorInput = {
  nome: string;
  funcao: string;
  salarioBase: number;
  telefone?: string | null | undefined;
  chavePix?: string | null | undefined;
  email?: string | null | undefined;
  dataAdmissao?: string | null | undefined;
  observacoes?: string | null | undefined;
};

export type ColaboradorUpdateInput = ColaboradorInput & { status?: StatusColaborador | undefined };

export type LancamentoColaborador = {
  id: string;
  colaboradorId: string;
  tipo: TipoLancamento;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  referenciaMesAno?: string | null;
  criadoEm: string;
};

export type LancamentoInput = {
  colaboradorId: string;
  tipo: TipoLancamento;
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  referenciaMesAno?: string | null | undefined;
};

export async function listColaboradores(opts?: { status?: StatusColaborador; signal?: AbortSignal }): Promise<Colaborador[]> {
  const qs = opts?.status ? `?status=${opts.status}` : "";
  return apiFetch<Colaborador[]>({ method: "GET", path: `/api/v1/colaboradores${qs}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createColaborador(input: ColaboradorInput): Promise<Colaborador> {
  return apiFetch<Colaborador>({ method: "POST", path: "/api/v1/colaboradores", body: input });
}

export async function updateColaborador(id: string, input: ColaboradorUpdateInput): Promise<Colaborador> {
  return apiFetch<Colaborador>({ method: "PUT", path: `/api/v1/colaboradores/${id}`, body: input });
}

export async function deleteColaborador(id: string): Promise<void> {
  await apiFetch({ method: "DELETE", path: `/api/v1/colaboradores/${id}` });
}

export async function listLancamentos(opts?: { colaboradorId?: string; mesAno?: string; signal?: AbortSignal }): Promise<LancamentoColaborador[]> {
  const params = new URLSearchParams();
  if (opts?.colaboradorId) params.set("colaboradorId", opts.colaboradorId);
  if (opts?.mesAno) params.set("mesAno", opts.mesAno);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return apiFetch<LancamentoColaborador[]>({ method: "GET", path: `/api/v1/lancamentos-colaboradores${qs}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createLancamento(input: LancamentoInput): Promise<LancamentoColaborador> {
  return apiFetch<LancamentoColaborador>({ method: "POST", path: "/api/v1/lancamentos-colaboradores", body: input });
}

export async function deleteLancamento(id: string): Promise<void> {
  await apiFetch({ method: "DELETE", path: `/api/v1/lancamentos-colaboradores/${id}` });
}
