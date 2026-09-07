import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { readStoredUser, tryRefreshAccessToken } from "@/lib/api/auth";
import { getAuthToken } from "@/lib/api/client";
import { getClienteSession } from "@/lib/aluno-login";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const token = getAuthToken();
    let stored = readStoredUser();

    if (token && stored) {
      return {
        user: {
          id: stored.id,
          email: stored.email,
          user_metadata: { full_name: stored.nomeCompleto },
          roles: stored.roles,
        },
      };
    }

    if (!token) {
      const refreshed = await tryRefreshAccessToken();
      if (refreshed) {
        stored = readStoredUser();
        if (stored) {
          return {
            user: {
              id: stored.id,
              email: stored.email,
              user_metadata: { full_name: stored.nomeCompleto },
              roles: stored.roles,
            },
          };
        }
      }
    }

    const clientSession = getClienteSession();
    if (clientSession?.cpf) {
      return {
        user: {
          id: clientSession.cpf,
          email: clientSession.email,
          user_metadata: { full_name: clientSession.nome },
        } as any,
      };
    }

    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
