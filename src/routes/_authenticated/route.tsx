import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { lerSessao } from "@/lib/api"

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    const sessao = lerSessao()

    /*  O guard só confere se HÁ sessão; se o token estiver vencido, quem
        descobre é a primeira chamada à API, que tenta renovar e, falhando,
        limpa a sessão.  Validar expiração aqui duplicaria essa regra em
        dois lugares que inevitavelmente divergiriam.  */
    if (!sessao) throw redirect({ to: "/auth" })

    return { sessao }
  },
  component: () => <Outlet />,
})
