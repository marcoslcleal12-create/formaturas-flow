/**
 * Cliente HTTP tipado da API FormaturasFlow (nossa API .NET na VPS).
 *
 * Base URL vem de VITE_API_URL (padrão: https://api-191-101-78-252.nip.io).
 *
 * Autenticação: JWT enviado como `Authorization: Bearer <token>`.
 * O token é resolvido pelo `getAuthToken` — no cliente, lê do localStorage;
 * no server (TanStack Start server function), lê do env FORMATURAS_API_TOKEN
 * (service account permanente pra chamadas server-side).
 */

const RUNS_IN_BROWSER = typeof window !== "undefined";

function readEnv(name: string): string | undefined {
  const viteEnv = (import.meta as { env?: Record<string, string | undefined> }).env;
  return viteEnv?.[name] ?? (typeof process !== "undefined" ? process.env[name] : undefined);
}

export function getApiBaseUrl(): string {
  return (
    readEnv("VITE_API_URL") ??
    readEnv("FORMATURAS_API_URL") ??
    "https://api-191-101-78-252.nip.io"
  );
}

const TOKEN_STORAGE_KEY = "formaturas.jwt";

export function saveAuthToken(token: string) {
  if (!RUNS_IN_BROWSER) return;
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* localStorage indisponível (modo privado, iframe restrito) */
  }
}

export function clearAuthToken() {
  if (!RUNS_IN_BROWSER) return;
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignora */
  }
}

export function getAuthToken(override?: string): string | undefined {
  if (override) return override;
  if (RUNS_IN_BROWSER) {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) ?? undefined;
    } catch {
      return undefined;
    }
  }
  return readEnv("FORMATURAS_API_TOKEN");
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiRequest = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: unknown;
  token?: string;
  signal?: AbortSignal;
};

export async function apiFetch<T = unknown>(req: ApiRequest): Promise<T> {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const url = `${base}${req.path.startsWith("/") ? "" : "/"}${req.path}`;
  const token = getAuthToken(req.token);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (req.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const resp = await fetch(url, {
    method: req.method ?? "GET",
    headers,
    body: req.body === undefined ? undefined : JSON.stringify(req.body),
    signal: req.signal,
  });

  const text = await resp.text();
  const parsed = text ? safeJsonParse(text) : undefined;

  if (!resp.ok) {
    throw new ApiError(
      resp.status,
      parsed,
      `${req.method ?? "GET"} ${req.path} → HTTP ${resp.status}`,
    );
  }
  return parsed as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
