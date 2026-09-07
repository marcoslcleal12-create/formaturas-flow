import { useEffect, useState, useCallback } from "react";
import { readStoredUser, fetchMe, logout as apiLogout, type StoredUser, type AppRole } from "@/lib/api/auth";
import { getAuthToken } from "@/lib/api/client";
import { getClienteSession } from "@/lib/aluno-login";

export type { AppRole };

/**
 * Compatibilidade com telas antigas que ainda esperam `session.user.email`,
 * `user.user_metadata.full_name`, etc. Adaptamos o shape para nao quebrar consumidores,
 * mas todos os campos novos vao em `user.id`, `user.email`, `user.nomeCompleto`, `roles`.
 */
export type CompatUser = {
  id: string;
  email: string;
  nomeCompleto: string;
  user_metadata: { full_name: string };
  app_metadata: Record<string, unknown>;
  aud: string;
  created_at: string;
};

export type CompatSession = { user: CompatUser };

function toCompat(u: StoredUser): CompatUser {
  return {
    id: u.id,
    email: u.email,
    nomeCompleto: u.nomeCompleto,
    user_metadata: { full_name: u.nomeCompleto },
    app_metadata: { roles: u.roles },
    aud: "authenticated",
    created_at: new Date().toISOString(),
  };
}

export function useAuth() {
  const [session, setSession] = useState<CompatSession | null>(null);
  const [user, setUser] = useState<CompatUser | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const applyUser = useCallback((u: StoredUser | null) => {
    if (u) {
      const compat = toCompat(u);
      setUser(compat);
      setSession({ user: compat });
      setRoles(u.roles ?? []);
    } else {
      const cliente = getClienteSession();
      if (cliente?.cpf) {
        const fakeUser: CompatUser = {
          id: cliente.cpf,
          email: cliente.email ?? "",
          nomeCompleto: cliente.nome ?? "",
          user_metadata: { full_name: cliente.nome ?? "" },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        };
        setUser(fakeUser);
        setSession(null);
        setRoles(["aluno"]);
      } else {
        setUser(null);
        setSession(null);
        setRoles([]);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    const stored = readStoredUser();
    if (stored) applyUser(stored);

    const hasToken = Boolean(getAuthToken());
    if (hasToken) {
      fetchMe()
        .then((me) => {
          if (!active) return;
          applyUser(me);
        })
        .catch(() => {
          if (!active) return;
          applyUser(null);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      applyUser(null);
      setLoading(false);
    }

    const onStorage = (e: StorageEvent) => {
      if (!active) return;
      if (e.key === "formaturas.user" || e.key === "formaturas.jwt") {
        applyUser(readStoredUser());
      }
    };
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);

    return () => {
      active = false;
      if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  }, [applyUser]);

  const signOut = useCallback(async () => {
    await apiLogout();
    applyUser(null);
  }, [applyUser]);

  const isStaff = user
    ? roles.length === 0 || roles.includes("super_admin") || roles.includes("funcionario")
    : false;

  return {
    session,
    user,
    roles,
    loading,
    isStaff,
    isSuperAdmin: roles.includes("super_admin"),
    isAluno: !isStaff,
    signOut,
  };
}
