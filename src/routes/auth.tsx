import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { auth, lerSessao, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apenasDigitos, cpfParaEmail } from "@/lib/aluno-login";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar | JM Formaturas & Eventos" },
      {
        name: "description",
        content:
          "Acesse o painel da JM Formaturas para acompanhar seu contrato, parcelas e pagamentos de formatura e eventos.",
      },
      { property: "og:title", content: "Entrar | JM Formaturas & Eventos" },
      {
        property: "og:description",
        content: "Área de acesso de formandos, clientes e equipe da JM Formaturas.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"formando" | "login" | "signup">("formando");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (lerSessao()) void navigate({ to: "/painel" });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "formando") {
        const digitos = apenasDigitos(cpf);
        if (digitos.length !== 11)
          throw new Error("Por favor, digite os 11 números do seu CPF (somente números).");

        /*  Formando entra com o CPF nos dois campos: a API cria o acesso
            na adesão com e-mail derivado do CPF e o próprio CPF como senha
            inicial.  */
        const s = await auth.login(cpfParaEmail(digitos), digitos);
        toast.success(`Bem-vindo, ${s.nomeCompleto}!`);
        void navigate({ to: "/painel" });
      } else if (mode === "login") {
        await auth.login(email, password);
        void navigate({ to: "/painel" });
      } else {
        await auth.registrar(email, password, nome);
        toast.success("Conta criada!");
        void navigate({ to: "/painel" });
      }
    } catch (err) {
      /*  401 no fluxo do formando quase sempre significa CPF não cadastrado,
          e não senha errada — dizer "credenciais inválidas" mandaria ele
          conferir uma senha que ele nem escolheu.  */
      const msg =
        err instanceof ApiError && err.status === 401
          ? mode === "formando"
            ? "CPF não encontrado. Confira o número ou fale com a JM Formaturas."
            : "E-mail ou senha incorretos."
          : err instanceof Error
            ? err.message
            : "Não foi possível entrar";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ink-field flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-7 flex flex-col items-center">
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-gold text-accent-foreground">
            <GraduationCap className="size-7" />
          </span>
          <h1 className="font-display text-2xl font-semibold">JM Formaturas & Eventos</h1>
          {/*  opacity-75 -> valor explícito e medido (8.70:1 sobre a tinta).  */}
          <p className="on-ink-muted mt-1 text-sm">
            Gestão de formaturas, casamentos, aniversários e ensaios
          </p>
        </div>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>
              {mode === "formando"
                ? "Acesso do Formando / Cliente"
                : mode === "login"
                  ? "Entrar (Equipe)"
                  : "Criar conta"}
            </CardTitle>
            <CardDescription>
              {mode === "formando"
                ? "Use seu CPF como login e também como senha inicial."
                : mode === "login"
                  ? "Use o e-mail e a senha cadastrados pela JM Formaturas."
                  : "Cadastre um acesso de equipe."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {mode === "formando" ? (
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  {/*  CPF é dado numérico: Plex Mono tabular alinha os grupos
                      de dígitos e casa com o placeholder mascarado.  */}
                  <Input
                    id="cpf"
                    inputMode="numeric"
                    className="figure tracking-normal"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    required
                    maxLength={20}
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite seu CPF: ele é utilizado tanto como usuário quanto como senha.
                  </p>
                </div>
              ) : null}
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    maxLength={120}
                  />
                </div>
              )}
              {mode !== "formando" && (
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
              )}
              {mode !== "formando" && (
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={72}
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"}
              </Button>
            </form>
            <div className="mt-4 flex flex-col gap-1 text-center text-sm text-muted-foreground">
              {mode !== "formando" && (
                <button
                  type="button"
                  onClick={() => setMode("formando")}
                  className="cursor-pointer rounded-sm py-0.5 text-gold-ink underline-offset-4 transition-colors duration-(--dur-2) ease-(--ease-doc) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Sou formando / cliente (login por CPF)
                </button>
              )}
              {mode !== "login" && (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="cursor-pointer rounded-sm py-0.5 text-gold-ink underline-offset-4 transition-colors duration-(--dur-2) ease-(--ease-doc) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Sou da equipe (e-mail e senha)
                </button>
              )}
              {mode !== "signup" && (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="cursor-pointer rounded-sm py-0.5 text-gold-ink underline-offset-4 transition-colors duration-(--dur-2) ease-(--ease-doc) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Criar conta de equipe
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
