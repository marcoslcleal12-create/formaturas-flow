import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apenasDigitos, cpfParaEmail, saveClienteSession, clearClienteSession, getClienteSession } from "@/lib/aluno-login";
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
    // Verifica se já existe sessão ativa
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/painel" });
    });
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

        // 1. Tenta autenticação no Supabase Auth primeiro
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: cpfParaEmail(rawDigits),
            password: rawDigits,
          });

          if (!authError && authData.session) {
            clearClienteSession();
            toast.success("Acesso liberado com sucesso!");
            void navigate({ to: "/painel" });
            return;
          }
        } catch (e) {
          // Continua para verificação local de alunos e demandas
        }

        // 2. Verifica se o CPF está cadastrado na tabela de Formandos (Alunos)
        try {
          const { data: alunoDb } = await supabase
            .from("alunos")
            .select("id, nome_completo, cpf, turma_id")
            .eq("cpf", rawDigits)
            .limit(1)
            .maybeSingle();

          if (alunoDb) {
            saveClienteSession({
              cpf: rawDigits,
              nome: alunoDb.nome_completo,
              tipo: "aluno",
              email: cpfParaEmail(rawDigits),
              alunoId: alunoDb.id,
            });
            toast.success(`Bem-vindo, ${alunoDb.nome_completo}! Acesso liberado.`);
            void navigate({ to: "/painel" });
            return;
          }
        } catch (e) {
          // Continua
        }

        // 3. Verifica se o CPF pertence a uma Demanda (Casamento, Aniversário, Ensaio)
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
          `CPF ${rawDigits} não encontrado no sistema. Verifique o número digitado ou contate a JM Formaturas.`
        );
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        clearClienteSession();
        void navigate({ to: "/painel" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: nome },
          },
        });
        if (error) throw error;
        clearClienteSession();
        toast.success("Conta criada!");
        void navigate({ to: "/painel" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-primary-foreground">
          <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gold text-accent-foreground">
            <GraduationCap className="size-7" />
          </span>
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
