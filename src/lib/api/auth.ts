import { apiFetch, saveAuthToken, clearAuthToken, getAuthToken, ApiError } from "./client";

const REFRESH_KEY = "formaturas.refresh";
const USER_KEY = "formaturas.user";
const RUNS_IN_BROWSER = typeof window !== "undefined";

export type AppRole = "super_admin" | "funcionario" | "aluno";

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  email: string;
  nomeCompleto: string;
  roles: AppRole[];
};

export type MeResponse = {
  id: string;
  email: string;
  nomeCompleto: string;
  roles: AppRole[];
};

export type StoredUser = {
  id: string;
  email: string;
  nomeCompleto: string;
  roles: AppRole[];
};

function saveRefreshToken(refresh: string, expiresAt: string) {
  if (!RUNS_IN_BROWSER) return;
  try {
    localStorage.setItem(REFRESH_KEY, JSON.stringify({ token: refresh, expiresAt }));
  } catch {}
}
function readRefreshToken(): { token: string; expiresAt: string } | null {
  if (!RUNS_IN_BROWSER) return null;
  try {
    const raw = localStorage.getItem(REFRESH_KEY);
    return raw ? (JSON.parse(raw) as { token: string; expiresAt: string }) : null;
  } catch {
    return null;
  }
}
function clearRefreshToken() {
  if (!RUNS_IN_BROWSER) return;
  try {
    localStorage.removeItem(REFRESH_KEY);
  } catch {}
}

function saveStoredUser(u: StoredUser) {
  if (!RUNS_IN_BROWSER) return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  } catch {}
}
export function readStoredUser(): StoredUser | null {
  if (!RUNS_IN_BROWSER) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}
function clearStoredUser() {
  if (!RUNS_IN_BROWSER) return;
  try {
    localStorage.removeItem(USER_KEY);
  } catch {}
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken() && readStoredUser());
}

export async function login(email: string, password: string): Promise<StoredUser> {
  const resp = await apiFetch<LoginResponse>({
    method: "POST",
    path: "/auth/login",
    body: { email, password },
  });
  saveAuthToken(resp.accessToken);
  saveRefreshToken(resp.refreshToken, resp.refreshTokenExpiresAt);
  const me = await fetchMe();
  saveStoredUser(me);
  return me;
}

export async function register(email: string, password: string, nomeCompleto: string): Promise<StoredUser> {
  const resp = await apiFetch<LoginResponse>({
    method: "POST",
    path: "/auth/register",
    body: { email, password, nomeCompleto },
  });
  saveAuthToken(resp.accessToken);
  saveRefreshToken(resp.refreshToken, resp.refreshTokenExpiresAt);
  const me = await fetchMe();
  saveStoredUser(me);
  return me;
}

export async function logout(): Promise<void> {
  const refresh = readRefreshToken();
  if (refresh) {
    try {
      await apiFetch({ method: "POST", path: "/auth/logout", body: { refreshToken: refresh.token } });
    } catch {}
  }
  clearAuthToken();
  clearRefreshToken();
  clearStoredUser();
}

export async function fetchMe(): Promise<StoredUser> {
  const me = await apiFetch<MeResponse>({ method: "GET", path: "/auth/me" });
  return { id: me.id, email: me.email, nomeCompleto: me.nomeCompleto, roles: me.roles };
}

let refreshInFlight: Promise<boolean> | null = null;

export function tryRefreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  const refresh = readRefreshToken();
  if (!refresh) return Promise.resolve(false);

  refreshInFlight = (async () => {
    try {
      const resp = await apiFetch<LoginResponse>({
        method: "POST",
        path: "/auth/refresh",
        body: { refreshToken: refresh.token },
      });
      saveAuthToken(resp.accessToken);
      saveRefreshToken(resp.refreshToken, resp.refreshTokenExpiresAt);
      return true;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuthToken();
        clearRefreshToken();
        clearStoredUser();
      }
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function apiFetchWithAutoRefresh<T>(...args: Parameters<typeof apiFetch>): Promise<T> {
  try {
    return await apiFetch<T>(...args);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      const ok = await tryRefreshAccessToken();
      if (ok) return await apiFetch<T>(...args);
    }
    throw err;
  }
}
