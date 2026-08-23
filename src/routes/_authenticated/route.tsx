import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getClienteSession } from "@/lib/aluno-login";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // 1. Verifica sessão ativa no Supabase Auth (Admin/Equipe)
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      return { user: data.session.user };
    }

    // 2. Verifica sessão do cliente logado via CPF (Formando ou Demanda)
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

    // Se nenhuma sessão for encontrada, redireciona para login
    throw redirect({ to: "/auth" });
  },
  component: () => <Outlet />,
});
