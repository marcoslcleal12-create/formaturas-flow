import { apiFetch } from "./client";

export type AgendaEvento = {
  id: string;
  titulo: string;
  descricao?: string | null;
  empresaTipo: "jm" | "outra";
  empresaNome: string;
  localEvento?: string | null;
  cidade?: string | null;
  fotografo?: string | null;
  dataEvento: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type AgendaEventoInput = {
  titulo: string;
  descricao?: string | null | undefined;
  empresaTipo: "jm" | "outra";
  empresaNome: string;
  localEvento?: string | null | undefined;
  cidade?: string | null | undefined;
  fotografo?: string | null | undefined;
  dataEvento: string;
};

export async function listAgendaEventos(opts?: { signal?: AbortSignal }): Promise<AgendaEvento[]> {
  return apiFetch<AgendaEvento[]>({ method: "GET", path: "/api/v1/agenda", ...(opts?.signal ? { signal: opts.signal } : {}) });
}

export async function createAgendaEvento(input: AgendaEventoInput): Promise<AgendaEvento> {
  return apiFetch<AgendaEvento>({ method: "POST", path: "/api/v1/agenda", body: input });
}

export async function updateAgendaEvento(id: string, input: AgendaEventoInput): Promise<AgendaEvento> {
  return apiFetch<AgendaEvento>({ method: "PUT", path: `/api/v1/agenda/${id}`, body: input });
}

export async function deleteAgendaEvento(id: string): Promise<void> {
  await apiFetch({ method: "DELETE", path: `/api/v1/agenda/${id}` });
}
