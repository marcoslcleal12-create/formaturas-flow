import { api } from "@/lib/api"
import type {
  Aluno,
  Assinatura,
  Contrato,
  Despesa,
  Parcela,
  Turma,
} from "@/lib/entidades"

/*  Um módulo por recurso da API.  A tela chama estes; nenhuma tela monta
    caminho de URL na mão, para trocar rota não virar caça ao string.  */

const qs = (params: Record<string, string | number | boolean | null | undefined>) => {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(params))
    if (v !== null && v !== undefined && v !== "") p.set(k, String(v))
  const s = p.toString()
  return s ? `?${s}` : ""
}

export const turmas = {
  listar:   () => api.get<Turma[]>("/api/v1/turmas"),
  obter:    (id: string) => api.get<Turma>(`/api/v1/turmas/${id}`),
  criar:    (dados: Partial<Turma>) => api.post<Turma>("/api/v1/turmas", dados),
  atualizar: (id: string, dados: Partial<Turma>) => api.put<Turma>(`/api/v1/turmas/${id}`, dados),
  remover:  (id: string) => api.delete<void>(`/api/v1/turmas/${id}`),
}

export const alunos = {
  listar:   (filtros: { turmaId?: string } = {}) => api.get<Aluno[]>(`/api/v1/alunos${qs(filtros)}`),
  obter:    (id: string) => api.get<Aluno>(`/api/v1/alunos/${id}`),
  eu:       () => api.get<Aluno>("/api/v1/alunos/me"),
  criar:    (dados: Partial<Aluno>) => api.post<Aluno>("/api/v1/alunos", dados),
  atualizar: (id: string, dados: Partial<Aluno>) => api.put<Aluno>(`/api/v1/alunos/${id}`, dados),
  remover:  (id: string) => api.delete<void>(`/api/v1/alunos/${id}`),
  inativar: (id: string, motivo?: string) => api.post<Aluno>(`/api/v1/alunos/${id}/inativar`, { motivo }),
  reativar: (id: string) => api.post<Aluno>(`/api/v1/alunos/${id}/reativar`),
  links:    (id: string, dados: Record<string, unknown>) => api.put<Aluno>(`/api/v1/alunos/${id}/links`, dados),

  /*  Vincula (ou cria) o acesso do formando à conta Identity.  */
  vincularAcesso: (id: string, email: string) =>
    api.post<Aluno>(`/api/v1/alunos/${id}/vincular-user`, { email }),
}

export const contratos = {
  listar:   (filtros: { alunoId?: string, turmaId?: string } = {}) => api.get<Contrato[]>(`/api/v1/contratos${qs(filtros)}`),
  obter:    (id: string) => api.get<Contrato>(`/api/v1/contratos/${id}`),
  criar:    (dados: Record<string, unknown>) => api.post<Contrato>("/api/v1/contratos", dados),
  atualizar: (id: string, dados: Record<string, unknown>) => api.put<Contrato>(`/api/v1/contratos/${id}`, dados),
  remover:  (id: string) => api.delete<void>(`/api/v1/contratos/${id}`),

  assinar:  (id: string, dados: { imagem: string, nome?: string, cpf?: string }) =>
    api.post<Assinatura>(`/api/v1/contratos/${id}/assinar`, dados),

  assinatura: (id: string) => api.get<Assinatura>(`/api/v1/contratos/${id}/assinatura`),
}

export const parcelas = {
  listar:   (filtros: { contratoId?: string, alunoId?: string, turmaId?: string, status?: string } = {}) =>
    api.get<Parcela[]>(`/api/v1/parcelas${qs(filtros)}`),
  obter:    (id: string) => api.get<Parcela>(`/api/v1/parcelas/${id}`),
  baixar:   (id: string, dados: { valorPago?: number, dataPagamento?: string, formaPagamento?: string }) =>
    api.post<Parcela>(`/api/v1/parcelas/${id}/baixar`, dados),
  desfazer: (id: string) => api.post<Parcela>(`/api/v1/parcelas/${id}/desfazer`),
  cobranca: (id: string, dados: { metodo: string }) => api.post<Parcela>(`/api/v1/parcelas/${id}/cobranca`, dados),
}

export const despesas = {
  listar:   (filtros: { turmaId?: string, status?: string } = {}) => api.get<Despesa[]>(`/api/v1/despesas${qs(filtros)}`),
  criar:    (dados: Partial<Despesa>) => api.post<Despesa>("/api/v1/despesas", dados),
  atualizar: (id: string, dados: Partial<Despesa>) => api.put<Despesa>(`/api/v1/despesas/${id}`, dados),
  remover:  (id: string) => api.delete<void>(`/api/v1/despesas/${id}`),
  baixar:   (id: string, dados: { dataPagamento?: string, formaPagamento?: string }) =>
    api.post<Despesa>(`/api/v1/despesas/${id}/baixar`, dados),
  desfazer: (id: string) => api.post<Despesa>(`/api/v1/despesas/${id}/desfazer`),
}

/*  Rotas públicas: usadas pelo formando antes de existir login.  */
export type AdesaoResposta = {
  alunoId: string
  nome: string
  cpf: string
  loginUsuario: string
  contratoId: string
  assinado: boolean
}

export const publico = {
  turma: (id: string) => api.get<Turma>(`/api/v1/public/turmas/${id}`, { anonimo: true }),

  adesao: (dados: Record<string, unknown>) =>
    api.post<AdesaoResposta>("/api/v1/public/adesao", dados, { anonimo: true }),
}
