import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getClienteSession } from "@/lib/aluno-login";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // 1. Verifica sessão do Supabase (Equipe, Admin ou Formando registrado no Supabase Auth)
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
      return { user: data.user };
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
