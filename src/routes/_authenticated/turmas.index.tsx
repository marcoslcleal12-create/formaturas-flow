import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Edit, Trash2, MoreVertical, GraduationCap, Building2, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/turmas/")({
  head: () => ({
    meta: [
      { title: "Turmas | JM Formaturas" },
      { name: "description", content: "Cadastre e acompanhe as turmas de formatura atendidas pela JM Formaturas." },
      { property: "og:title", content: "Turmas | JM Formaturas" },
      { property: "og:description", content: "Gestão de turmas de formatura por curso, faculdade e semestre." },
    ],
  }),
  component: TurmasPage,
});

const turmaSchema = z.object({
  nome: z.string().trim().min(2, "Informe o nome da turma").max(120),
  curso: z.string().trim().min(2, "Informe o curso").max(120),
  faculdade: z.string().trim().min(2, "Informe a faculdade").max(120),
  cidade: z.string().trim().max(120).optional(),
  semestre: z.string().trim().max(20).optional(),
  previsao_formatura: z.string().trim().max(10).optional(),
  status: z.string().optional(),
});

interface TurmaData {
  id: string;
  nome: string;
  curso: string;
  faculdade: string;
  cidade: string | null;
  semestre: string | null;
  previsao_formatura: string | null;
  status: string;
  alunos?: { count: number }[];
}

function TurmasPage() {
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [editingTurma, setEditingTurma] = useState<TurmaData | null>(null);
  const [deletingTurma, setDeletingTurma] = useState<TurmaData | null>(null);

  const { data: turmas = [], isLoading } = useQuery({
    queryKey: ["turmas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("turmas")
        .select("*, alunos(count)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TurmaData[];
    },
  });

  const createTurma = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = turmaSchema.parse({
        nome: form.get("nome"),
        curso: form.get("curso"),
        faculdade: form.get("faculdade"),
        cidade: form.get("cidade") || undefined,
        semestre: form.get("semestre") || undefined,
        previsao_formatura: form.get("previsao_formatura") || undefined,
      });
      const { error } = await supabase.from("turmas").insert({
        nome: parsed.nome,
        curso: parsed.curso,
        faculdade: parsed.faculdade,
        cidade: parsed.cidade ?? null,
        semestre: parsed.semestre ?? null,
        previsao_formatura: parsed.previsao_formatura || null,
        status: "ativa",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Turma criada com sucesso!");
      setOpenCreate(false);
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  const updateTurma = useMutation({
    mutationFn: async (form: FormData) => {
      if (!editingTurma) return;
      const parsed = turmaSchema.parse({
        nome: form.get("nome"),
        curso: form.get("curso"),
        faculdade: form.get("faculdade"),
        cidade: form.get("cidade") || undefined,
        semestre: form.get("semestre") || undefined,
        previsao_formatura: form.get("previsao_formatura") || undefined,
        status: form.get("status") || "ativa",
      });
      const { error } = await supabase
        .from("turmas")
        .update({
          nome: parsed.nome,
          curso: parsed.curso,
          faculdade: parsed.faculdade,
          cidade: parsed.cidade ?? null,
          semestre: parsed.semestre ?? null,
          previsao_formatura: parsed.previsao_formatura || null,
          status: parsed.status ?? "ativa",
        })
        .eq("id", editingTurma.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Turma atualizada com sucesso!");
      setEditingTurma(null);
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) =>
      toast.error(error instanceof z.ZodError ? error.issues[0]!.message : (error as Error).message),
  });

  const deleteTurma = useMutation({
    mutationFn: async (turmaId: string) => {
      const { error } = await supabase.from("turmas").delete().eq("id", turmaId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Turma excluída com sucesso.");
      setDeletingTurma(null);
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) => toast.error(`Erro ao excluir turma: ${(error as Error).message}`),
  });

  return (
    <AppShell>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Turmas de Formatura</h1>
          <p className="text-sm text-muted-foreground">Cadastre, edite e acompanhe os formandos por curso e faculdade.</p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" /> Nova turma
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Turma</DialogTitle>
            </DialogHeader>
            <form
              id="form-turma"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                createTurma.mutate(new FormData(e.currentTarget));
              }}
            >
              <Field name="nome" label="Nome da turma *" placeholder="Ex: Enfermagem – Faculdade X – 2026/2" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field name="curso" label="Curso *" placeholder="Ex: Enfermagem" required />
                <Field name="faculdade" label="Faculdade *" placeholder="Ex: UNESP" required />
                <Field name="cidade" label="Cidade" placeholder="Ex: São Paulo - SP" />
                <Field name="semestre" label="Semestre" placeholder="Ex: 2026/2" />
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenCreate(false)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-turma" disabled={createTurma.isPending}>
                {createTurma.isPending ? "Salvando..." : "Salvar turma"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando turmas…</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {turmas.map((turma) => (
          <Card key={turma.id} className="relative group hover:shadow-elevated transition-all border-border/80">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-2">
                <Link to="/turmas/$turmaId" params={{ turmaId: turma.id }} className="flex-1">
                  <p className="font-display font-semibold text-lg hover:text-primary transition-colors">
                    {turma.nome}
                  </p>
                </Link>

                <div className="flex items-center gap-2">
                  <Badge variant={turma.status === "ativa" ? "default" : "secondary"}>
                    {turma.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingTurma(turma)}
                        className="gap-2 cursor-pointer"
                      >
                        <Edit className="size-4" /> Editar Turma
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingTurma(turma)}
                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" /> Excluir Turma
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Link to="/turmas/$turmaId" params={{ turmaId: turma.id }} className="block mt-2 space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-primary" /> {turma.curso} · {turma.faculdade}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3.5 text-gold" /> {turma.alunos?.[0]?.count ?? 0} formandos
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-muted-foreground" /> {turma.cidade ?? "Sem local definido"}
                  </span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && turmas.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          <GraduationCap className="mx-auto size-12 opacity-30 mb-3" />
          <p className="font-semibold text-foreground text-base">Nenhuma turma cadastrada ainda</p>
          <p className="text-sm mt-1">Cadastre a primeira turma clicando no botão acima.</p>
        </div>
      )}

      {/* MODAL: EDITAR TURMA */}
      <Dialog open={!!editingTurma} onOpenChange={(v) => !v && setEditingTurma(null)}>
        {editingTurma && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Turma</DialogTitle>
            </DialogHeader>
            <form
              id="form-edit-turma"
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                updateTurma.mutate(new FormData(e.currentTarget));
              }}
            >
              <Field
                name="nome"
                label="Nome da turma *"
                defaultValue={editingTurma.nome}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  name="curso"
                  label="Curso *"
                  defaultValue={editingTurma.curso}
                  required
                />
                <Field
                  name="faculdade"
                  label="Faculdade *"
                  defaultValue={editingTurma.faculdade}
                  required
                />
                <Field
                  name="cidade"
                  label="Cidade"
                  defaultValue={editingTurma.cidade || ""}
                />
                <Field
                  name="semestre"
                  label="Semestre"
                  defaultValue={editingTurma.semestre || ""}
                />
              </div>
              <Field
                name="previsao_formatura"
                label="Previsão de formatura"
                type="date"
                defaultValue={editingTurma.previsao_formatura || ""}
              />
              <div className="space-y-1.5">
                <Label htmlFor="status">Status da Turma</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingTurma.status}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="ativa">Ativa</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </form>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingTurma(null)}>
                Cancelar
              </Button>
              <Button type="submit" form="form-edit-turma" disabled={updateTurma.isPending}>
                {updateTurma.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* ALERT DIALOG: EXCLUIR TURMA */}
      <AlertDialog open={!!deletingTurma} onOpenChange={(v) => !v && setDeletingTurma(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma <strong>{deletingTurma?.nome}</strong>?
              Esta ação não pode ser desfeita e removerá os formandos e contratos vinculados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingTurma && deleteTurma.mutate(deletingTurma.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sim, Excluir Turma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        maxLength={120}
      />
    </div>
  );
}
