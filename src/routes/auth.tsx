import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { login as apiLogin, register as apiRegister } from "@/lib/api/auth";
import { ApiError, getAuthToken } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLottie } from "@/components/AuthLottie";
import {
  apenasDigitos,
  cpfParaEmail,
  saveClienteSession,
  clearClienteSession,
  getClienteSession,
} from "@/lib/aluno-login";
import { loadDemandas } from "@/lib/demandas-store";

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
    if (getAuthToken()) {
      void navigate({ to: "/dashboard" });
      return;
    }
    const clientSession = getClienteSession();
    if (clientSession?.cpf) {
      void navigate({ to: "/painel" });
    }
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "formando") {
        const rawDigits = apenasDigitos(cpf);
        if (rawDigits.length !== 11) {
          throw new Error("Por favor, digite os 11 números do seu CPF (somente números).");
        }

        try {
          await apiLogin(cpfParaEmail(rawDigits), rawDigits);
          clearClienteSession();
          toast.success("Acesso liberado com sucesso!");
          void navigate({ to: "/painel" });
          return;
        } catch (err) {
          if (!(err instanceof ApiError) || err.status !== 401) throw err;
        }

        const demandas = loadDemandas();
        const clienteDemanda = demandas.find((d) => apenasDigitos(d.cpf) === rawDigits);
        if (clienteDemanda) {
          saveClienteSession({
            cpf: rawDigits,
            nome: clienteDemanda.cliente,
            tipo: "demanda",
            email: cpfParaEmail(rawDigits),
            demandaId: clienteDemanda.id,
          });
          toast.success(`Bem-vindo, ${clienteDemanda.cliente}! Acesso liberado.`);
          void navigate({ to: "/painel" });
          return;
        }

        throw new Error(
          `CPF ${rawDigits} não encontrado. Verifique o número digitado ou contate a JM Formaturas.`,
        );
      } else if (mode === "login") {
        await apiLogin(email, password);
        clearClienteSession();
        void navigate({ to: "/dashboard" });
      } else {
        await apiRegister(email, password, nome);
        clearClienteSession();
        toast.success("Conta criada!");
        void navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.status === 401
            ? "E-mail ou senha inválidos."
            : `Erro ${err.status}: ${err.message}`
          : err instanceof Error
          ? err.message
          : "Não foi possível entrar";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-primary-foreground">
          <div className="mb-3 flex aspect-[6/5] w-40 items-center justify-center overflow-hidden sm:w-48">
            <AuthLottie />
          </div>
          <h1 className="font-display text-2xl font-semibold">JM Formaturas & Eventos</h1>
          <p className="text-sm opacity-75">Gestão de formaturas, casamentos, aniversários e ensaios</p>
        </div>
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>
              {mode === "formando" ? "Acesso do Formando / Cliente" : mode === "login" ? "Entrar (Equipe)" : "Criar conta"}
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
                  <Label htmlFor="cpf">CPF (Login e Senha)</Label>
                  <Input
                    id="cpf"
                    inputMode="numeric"
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
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required maxLength={120} />
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
                    minLength={8}
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
                <button type="button" onClick={() => setMode("formando")} className="underline-offset-4 hover:underline">
                  Sou formando / cliente (login por CPF)
                </button>
              )}
              {mode !== "login" && (
                <button type="button" onClick={() => setMode("login")} className="underline-offset-4 hover:underline">
                  Sou da equipe (e-mail e senha)
                </button>
              )}
              {mode !== "signup" && (
                <button type="button" onClick={() => setMode("signup")} className="underline-offset-4 hover:underline">
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
