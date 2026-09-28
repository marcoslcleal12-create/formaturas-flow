/*  Cliente único da API FormaturasFlow.

    Todo acesso a dado passa por aqui.  Antes o front falava direto com o
    Supabase, o que significava regra de negócio espalhada no navegador e
    tabela exposta ao cliente; agora a autoridade é a API .NET.  */

const BASE = (import.meta.env['VITE_API_URL'] ?? "https://api-191-101-78-252.nip.io").replace(/\/+$/, "")

const CHAVE_SESSAO = "formaturas.sessao"

export type AppRole = "super_admin" | "funcionario" | "aluno"

export type Sessao = {
  accessToken: string
  expiresAt: string
  refreshToken?: string | null
  refreshTokenExpiresAt?: string | null
  email: string
  nomeCompleto: string
  roles: AppRole[]
}

/*  Erro com o código estável que a API devolve em `codigo`.  A tela decide
    o que mostrar a partir dele, nunca a partir da mensagem em português,
    que é texto sujeito a mudança.  */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string | null,
    mensagem: string,
    readonly detalhes?: Record<string, unknown>,
  ) {
    super(mensagem)
    this.name = "ApiError"
  }
}

export function lerSessao(): Sessao | null {
  if (typeof localStorage === "undefined") return null
  try {
    const bruto = localStorage.getItem(CHAVE_SESSAO)
    return bruto ? (JSON.parse(bruto) as Sessao) : null
  }
  catch {
    return null
  }
}

export function salvarSessao(s: Sessao | null) {
  if (typeof localStorage === "undefined") return
  try {
    if (s) localStorage.setItem(CHAVE_SESSAO, JSON.stringify(s))
    else localStorage.removeItem(CHAVE_SESSAO)
  }
  catch {
    /*  Navegador com armazenamento bloqueado: a sessão vive só em memória
        até o reload, o que é melhor do que derrubar a aplicação.  */
  }
  ouvintes.forEach((fn) => fn(s))
}

const ouvintes = new Set<(s: Sessao | null) => void>()

export function observarSessao(fn: (s: Sessao | null) => void) {
  ouvintes.add(fn)
  return () => ouvintes.delete(fn)
}

/*  Renovação: uma só por vez.

    Sem esta trava, um painel que dispara seis consultas em paralelo com o
    token vencido faria seis refresh simultâneos — e, como cada um invalida
    o anterior, cinco delas voltariam com 401 e derrubariam o usuário para
    a tela de login sem motivo.  */
let renovacaoEmCurso: Promise<Sessao | null> | null = null

async function renovar(): Promise<Sessao | null> {
  const atual = lerSessao()
  if (!atual?.refreshToken) return null

  renovacaoEmCurso ??= (async () => {
    try {
      const resp = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: atual.refreshToken }),
      })

      if (!resp.ok) {
        salvarSessao(null)
        return null
      }

      const nova = (await resp.json()) as Sessao
      salvarSessao(nova)
      return nova
    }
    catch {
      return null
    }
    finally {
      renovacaoEmCurso = null
    }
  })()

  return renovacaoEmCurso
}

type Opcoes = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  /*  Rota pública (adesão, turma pública): não manda token nem tenta
      renovar, para um 401 não desconectar quem nem estava logado.  */
  anonimo?: boolean
  signal?: AbortSignal
}

async function executar<T>(caminho: string, opts: Opcoes, jaRenovou: boolean): Promise<T> {
  const sessao = opts.anonimo ? null : lerSessao()

  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers["Content-Type"] = "application/json"
  if (sessao?.accessToken) headers['Authorization'] = `Bearer ${sessao.accessToken}`

  /*  Montado por partes: com `exactOptionalPropertyTypes`, passar
      `body: undefined` não é o mesmo que omitir a chave.  */
  const init: RequestInit = { method: opts.method ?? "GET", headers }
  if (opts.body !== undefined) init.body = JSON.stringify(opts.body)
  if (opts.signal) init.signal = opts.signal

  const resp = await fetch(`${BASE}${caminho}`, init)

  /*  Uma única tentativa de renovar.  Repetir indefinidamente transformaria
      um refresh token morto em laço infinito.  */
  if (resp.status === 401 && !opts.anonimo && !jaRenovou) {
    const nova = await renovar()
    if (nova) return executar<T>(caminho, opts, true)
  }

  if (resp.status === 204) return undefined as T

  const texto = await resp.text()
  const corpo = texto ? seguroJson(texto) : null

  if (!resp.ok) {
    if (resp.status === 401) salvarSessao(null)

    throw new ApiError(
      resp.status,
      (corpo?.['codigo'] as string) ?? null,
      (corpo?.['detail'] as string) ?? (corpo?.['erro'] as string) ?? (corpo?.['title'] as string) ?? `Erro ${resp.status}`,
      corpo ?? undefined,
    )
  }

  return (corpo ?? null) as T
}

function seguroJson(texto: string): Record<string, any> | null {
  try {
    return JSON.parse(texto)
  }
  catch {
    return null
  }
}

export const api = {
  get:    <T>(caminho: string, opts: Omit<Opcoes, "method" | "body"> = {}) => executar<T>(caminho, { ...opts }, false),
  post:   <T>(caminho: string, body?: unknown, opts: Omit<Opcoes, "method" | "body"> = {}) => executar<T>(caminho, { ...opts, method: "POST", body }, false),
  put:    <T>(caminho: string, body?: unknown, opts: Omit<Opcoes, "method" | "body"> = {}) => executar<T>(caminho, { ...opts, method: "PUT", body }, false),
  delete: <T>(caminho: string, opts: Omit<Opcoes, "method" | "body"> = {}) => executar<T>(caminho, { ...opts, method: "DELETE" }, false),
}

export const auth = {
  async login(email: string, password: string) {
    const s = await api.post<Sessao>("/auth/login", { email, password }, { anonimo: true })
    salvarSessao(s)
    return s
  },

  async registrar(email: string, password: string, nomeCompleto: string) {
    const s = await api.post<Sessao>("/auth/register", { email, password, nomeCompleto }, { anonimo: true })
    salvarSessao(s)
    return s
  },

  async eu() {
    return api.get<{ id: string, email: string, nomeCompleto: string, roles: AppRole[] }>("/auth/me")
  },

  sair() {
    /*  O logout do servidor invalida o refresh token; se a chamada falhar,
        a sessão local sai do mesmo jeito — ficar "logado" numa aba depois
        de clicar em sair seria pior.  */
    const s = lerSessao()
    salvarSessao(null)
    if (s?.refreshToken) void api.post("/auth/logout", { refreshToken: s.refreshToken }, { anonimo: true }).catch(() => {})
  },
}
