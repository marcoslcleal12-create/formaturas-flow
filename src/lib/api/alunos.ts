import { apiFetch } from "./client";

export type StatusAluno = "Ativo" | "Inativo";

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
  dataNascimento?: string | null;
  status: StatusAluno;
  motivoInativacao?: string | null;
  linkFotosSelecionadas?: string | null;
  prazoFotosSelecionadas?: number | null;
  vencimentoFotosSelecionadas?: string | null;
  fotosLiberadas: boolean;
  linkAprovacaoAlbum?: string | null;
  albumLiberado: boolean;
  asaasCustomerId?: string | null;
  criadoEm: string;
  atualizadoEm: string;
  contratos?: unknown[];
};

export type AlunoListItem = {
  id: string;
  turmaId: string;
  nomeCompleto: string;
  cpf?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  telefone?: string | null;
  status: StatusAluno;
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
  dataNascimento?: string | null | undefined;
};

export type AlunoUpdateInput = Omit<AlunoInput, "turmaId">;

export type AlunoLinksInput = {
  linkFotosSelecionadas?: string | null | undefined;
  prazoFotosSelecionadas?: number | null | undefined;
  vencimentoFotosSelecionadas?: string | null | undefined;
  fotosLiberadas?: boolean | undefined;
  linkAprovacaoAlbum?: string | null | undefined;
  albumLiberado?: boolean | undefined;
};

export async function listAlunos(opts?: { turmaId?: string; status?: StatusAluno; signal?: AbortSignal }): Promise<AlunoListItem[]> {
  const params = new URLSearchParams();
  if (opts?.turmaId) params.set("turmaId", opts.turmaId);
  if (opts?.status) params.set("status", opts.status);
  const qs = params.toString() ? `?${params.toString()}` : "";
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

export async function inativarAluno(id: string, motivo?: string): Promise<Aluno> {
  return apiFetch<Aluno>({ method: "POST", path: `/api/v1/alunos/${id}/inativar`, body: { motivo: motivo ?? null } });
}

export async function reativarAluno(id: string): Promise<Aluno> {
  return apiFetch<Aluno>({ method: "POST", path: `/api/v1/alunos/${id}/reativar`, body: {} });
}

export async function updateAlunoLinks(id: string, input: AlunoLinksInput): Promise<Aluno> {
  return apiFetch<Aluno>({ method: "PUT", path: `/api/v1/alunos/${id}/links`, body: input });
}
