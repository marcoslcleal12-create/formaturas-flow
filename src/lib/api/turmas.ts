import { apiFetch } from "./client";

export type TipoEvento = "Formatura" | "Casamento" | "Outro";
export type StatusTurma = "Ativa" | "Inativa" | "Concluida";

export type TurmaListItem = {
  id: string;
  nome: string;
  faculdade?: string | null;
  instituicao?: string | null;
  curso?: string | null;
  cidade?: string | null;
  semestre?: string | null;
  anoFormatura?: number | null;
  previsaoFormatura?: string | null;
  tipoEvento: TipoEvento;
  dataEvento?: string | null;
  status: StatusTurma;
  totalAlunos: number;
};

export type Turma = {
  id: string;
  nome: string;
  faculdade?: string | null;
  instituicao?: string | null;
  curso?: string | null;
  cidade?: string | null;
  semestre?: string | null;
  anoFormatura?: number | null;
  previsaoFormatura?: string | null;
  tipoEvento: TipoEvento;
  dataEvento?: string | null;
  status: StatusTurma;
  observacoes?: string | null;
  criadaEm: string;
  atualizadaEm: string;
  alunos?: unknown[];
};

export type TurmaInput = {
  nome: string;
  faculdade?: string | null | undefined;
  instituicao?: string | null | undefined;
  curso?: string | null | undefined;
  cidade?: string | null | undefined;
  semestre?: string | null | undefined;
  anoFormatura?: number | null | undefined;
  previsaoFormatura?: string | null | undefined;
  tipoEvento?: TipoEvento | undefined;
  dataEvento?: string | null | undefined;
  status?: StatusTurma | undefined;
  observacoes?: string | null | undefined;
};

export async function listTurmas(opts?: { signal?: AbortSignal }): Promise<TurmaListItem[]> {
  return apiFetch<TurmaListItem[]>({ method: "GET", path: "/api/v1/turmas", ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function getTurma(id: string, opts?: { signal?: AbortSignal }): Promise<Turma> {
  return apiFetch<Turma>({ method: "GET", path: `/api/v1/turmas/${id}`, ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createTurma(input: TurmaInput): Promise<Turma> {
  return apiFetch<Turma>({ method: "POST", path: "/api/v1/turmas", body: input });
}

export async function updateTurma(id: string, input: TurmaInput): Promise<Turma> {
  return apiFetch<Turma>({ method: "PUT", path: `/api/v1/turmas/${id}`, body: input });
}

export async function deleteTurma(id: string): Promise<void> {
  await apiFetch({ method: "DELETE", path: `/api/v1/turmas/${id}` });
}
