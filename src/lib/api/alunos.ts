import { apiFetch } from "./client";

export type Aluno = {
  id: string;
  turmaId: string;
  turma?: unknown;
  userId?: string | null;
  nomeCompleto: string;
  cpf?: string | null;
  rg?: string | null;
  email?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  cep?: string | null;
  loginUsuario?: string | null;
  asaasCustomerId?: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

export type AlunoListItem = {
  id: string;
  turmaId: string;
  nomeCompleto: string;
  cpf?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  telefone?: string | null;
  criadoEm: string;
};

export type AlunoInput = {
  turmaId: string;
  nomeCompleto: string;
  cpf?: string | null | undefined;
  rg?: string | null | undefined;
  email?: string | null | undefined;
  telefone?: string | null | undefined;
  whatsapp?: string | null | undefined;
  endereco?: string | null | undefined;
  cidade?: string | null | undefined;
  cep?: string | null | undefined;
};

export type AlunoUpdateInput = Omit<AlunoInput, "turmaId">;

export async function listAlunos(opts?: { turmaId?: string; signal?: AbortSignal }): Promise<AlunoListItem[]> {
  const qs = opts?.turmaId ? `?turmaId=${encodeURIComponent(opts.turmaId)}` : "";
  return apiFetch<AlunoListItem[]>({ method: "GET", path: `/api/v1/alunos${qs}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function getAluno(id: string, opts?: { signal?: AbortSignal }): Promise<Aluno> {
  return apiFetch<Aluno>({ method: "GET", path: `/api/v1/alunos/${id}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createAluno(input: AlunoInput): Promise<Aluno> {
  return apiFetch<Aluno>({ method: "POST", path: "/api/v1/alunos", body: input });
}

export async function updateAluno(id: string, input: AlunoUpdateInput): Promise<Aluno> {
  return apiFetch<Aluno>({ method: "PUT", path: `/api/v1/alunos/${id}`, body: input });
}

export async function deleteAluno(id: string): Promise<void> {
  await apiFetch({ method: "DELETE", path: `/api/v1/alunos/${id}` });
}
