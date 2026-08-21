import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserCheck, Search, Building2, UserX, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brl } from "@/components/app/AppShell";

export const Route = createFileRoute("/_authenticated/inativos")({
  head: () => ({
    meta: [
      { title: "Clientes Inativos | JM Formaturas" },
      { name: "description", content: "Lista de formandos com cadastro inativado e motivos de inativação." },
    ],
  }),
  component: InativosPage,
});

interface InativoItem {
  id: string;
  nome_completo: string;
  cpf: string | null;
  whatsapp: string | null;
  email: string | null;
  motivo_inativacao: string | null;
  status: string;
  updated_at: string;
  turmas: {
    id: string;
    nome: string;
    curso: string;
    faculdade: string;
  } | null;
}

function InativosPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: inativos = [], isLoading } = useQuery({
    queryKey: ["inativos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alunos")
        .select("*, turmas(id, nome, curso, faculdade)")
        .eq("status", "inativo")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as InativoItem[];
    },
  });

  const reativarAluno = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("alunos")
        .update({
          status: "ativo",
          motivo_inativacao: null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cadastro do formando reativado com sucesso!");
      void queryClient.invalidateQueries({ queryKey: ["inativos"] });
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) => toast.error(`Erro ao reativar cliente: ${(error as Error).message}`),
  });

  const filteredInativos = inativos.filter((item) => {
    const term = search.toLowerCase();
    return (
      item.nome_completo.toLowerCase().includes(term) ||
      (item.cpf && item.cpf.includes(term)) ||
      (item.turmas?.nome && item.turmas.nome.toLowerCase().includes(term))
    );
  });

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes Inativos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Lista de formandos com cadastros suspensos/inativados e seus respectivos motivos.
          </p>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou turma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center gap-2 text-muted-foreground">
          <RefreshCw className="size-5 animate-spin" />
          <span>Carregando inativos...</span>
        </div>
      ) : filteredInativos.length === 0 ? (
        <Card className="shadow-card border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UserX className="size-12 text-muted-foreground/60 mb-3" />
            <p className="font-semibold text-foreground">Nenhum cliente inativo encontrado</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {search
                ? "Não encontramos nenhum formando inativo que coincida com a sua busca."
                : "Todos os formandos cadastrados no sistema estão com cadastro ativo no momento."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredInativos.map((item) => (
            <Card key={item.id} className="shadow-card border-amber-500/20 bg-amber-500/[0.01]">
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between gap-2">
                <div>
                  <Link
                    to="/alunos/$alunoId"
                    params={{ alunoId: item.id }}
                    className="font-bold text-foreground hover:text-primary transition-colors text-base hover:underline"
                  >
                    {item.nome_completo}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    CPF: {item.cpf ? item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "Não informado"}
                  </p>
                </div>
                <Badge variant="destructive" className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
                  Inativo
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                {item.turmas && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="size-3.5 text-muted-foreground/80 shrink-0" />
                    <span>
                      Original: <strong className="text-foreground">{item.turmas.nome}</strong> ({item.turmas.curso} · {item.turmas.faculdade})
                    </span>
                  </div>
                )}

                <div className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-3 text-xs">
                  <div className="flex items-start gap-1.5">
                    <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-semibold text-amber-700 dark:text-amber-500">Motivo da Inativação</p>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.motivo_inativacao || "Nenhum motivo registrado."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/40 text-[11px] text-muted-foreground">
                  <span>Inativado em: {new Date(item.updated_at).toLocaleDateString("pt-BR")}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => reativarAluno.mutate(item.id)}
                    disabled={reativarAluno.isPending}
                    className="h-7 text-[11px] px-2.5 gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/30 dark:hover:bg-emerald-950/20"
                  >
                    <UserCheck className="size-3.5" /> Reativar Cadastro
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
