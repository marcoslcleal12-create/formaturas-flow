import { useEffect, useState } from "react"
import { lerSessao, observarSessao, type AppRole, type Sessao } from "@/lib/api"

export type { AppRole }

/*  Sessão vinda da API .NET.

    Antes havia dois mundos convivendo: a sessão do Supabase Auth para a
    equipe e uma "sessão de cliente" inventada no localStorage para o
    formando que logava por CPF.  Agora é um só — a API emite JWT para os
    dois, e o papel vem dentro do token.  */
export function useAuth() {
  const [sessao, setSessao] = useState<Sessao | null>(() => lerSessao())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /*  Primeira leitura só acontece aqui porque no SSR não existe
        localStorage; ler no useState inicial devolveria null no servidor e
        piscaria a tela de login no cliente.  */
    setSessao(lerSessao())
    setLoading(false)

    /*  `observarSessao` devolve o resultado de Set.delete (boolean); o
        cleanup do efeito precisa devolver void.  */
    const parar = observarSessao(setSessao)
    return () => { parar() }
  }, [])

  const roles = sessao?.roles ?? []
  const isStaff = roles.includes("super_admin") || roles.includes("funcionario")

  return {
    sessao,
    user: sessao
      ? { id: sessao.email, email: sessao.email, nomeCompleto: sessao.nomeCompleto }
      : null,
    roles,
    loading,
    isStaff,
    isSuperAdmin: roles.includes("super_admin"),
    isAluno: !!sessao && !isStaff,
  }
}
