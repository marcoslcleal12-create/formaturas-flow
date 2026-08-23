import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getClienteSession } from "@/lib/aluno-login";

export type AppRole = "super_admin" | "funcionario" | "aluno";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRoles = async (uid: string | undefined) => {
      if (!uid) {
        if (active) setRoles([]);
        return;
      }
      try {
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        if (active) setRoles((data ?? []).map((r) => r.role as AppRole));
      } catch (e) {
        if (active) setRoles([]);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session?.user) {
        setSession(data.session);
        setUser(data.session.user);
        void loadRoles(data.session.user.id).finally(() => {
          if (active) setLoading(false);
        });
      } else {
        // Verifica sessão de cliente por CPF
        const clientSession = getClienteSession();
        if (clientSession?.cpf) {
          const fakeUser = {
            id: clientSession.cpf,
            email: clientSession.email,
            user_metadata: { full_name: clientSession.nome },
            app_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User;
          setUser(fakeUser);
          setRoles(["aluno"]);
        } else {
          setUser(null);
          setRoles([]);
        }
        if (active) setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        setUser(s.user);
        void loadRoles(s.user.id);
      } else {
        const clientSession = getClienteSession();
        if (clientSession?.cpf) {
          const fakeUser = {
            id: clientSession.cpf,
            email: clientSession.email,
            user_metadata: { full_name: clientSession.nome },
            app_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
          } as User;
          setUser(fakeUser);
          setRoles(["aluno"]);
        } else {
          setUser(null);
          setRoles([]);
        }
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Se o usuário possui sessão no Supabase Auth (equipe/admin), considera isStaff se roles não for restrita a apenas aluno
  const isStaff = session?.user
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
  };
}
