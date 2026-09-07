import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Edit, Trash2, MoreVertical, GraduationCap, Building2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  listTurmas,
  createTurma as apiCreateTurma,
  updateTurma as apiUpdateTurma,
  deleteTurma as apiDeleteTurma,
  type TurmaListItem,
  type StatusTurma,
} from "@/lib/api/turmas";
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
  status: z.enum(["Ativa", "Inativa", "Concluida"]).optional(),
});

function TurmasPage() {
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [editingTurma, setEditingTurma] = useState<TurmaListItem | null>(null);
  const [deletingTurma, setDeletingTurma] = useState<TurmaListItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: turmas = [], isLoading } = useQuery({
    queryKey: ["turmas"],
    queryFn: ({ signal }) => listTurmas({ signal }),
  });

  const createTurma = useMutation({
    mutationFn: async (form: FormData) => {
      const parsed = turmaSchema.parse({
        nome: form.get("nome"),
        curso: form.get("curso"),
        faculdade: form.get("faculdade"),
        cidade: form.get("cidade") || undefined,
        semestre: form.get("semestre") || undefined,
      });
      await apiCreateTurma({
        nome: parsed.nome,
        curso: parsed.curso,
        faculdade: parsed.faculdade,
        instituicao: parsed.faculdade,
        cidade: parsed.cidade ?? null,
        semestre: parsed.semestre ?? null,
        status: "Ativa",
        tipoEvento: "Formatura",
      });
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
        status: (form.get("status") as StatusTurma) || "Ativa",
      });
      await apiUpdateTurma(editingTurma.id, {
        nome: parsed.nome,
        curso: parsed.curso,
        faculdade: parsed.faculdade,
        instituicao: parsed.faculdade,
        cidade: parsed.cidade ?? null,
        semestre: parsed.semestre ?? null,
        status: parsed.status ?? "Ativa",
      });
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
    mutationFn: (turmaId: string) => apiDeleteTurma(turmaId),
    onSuccess: () => {
      toast.success("Turma excluída com sucesso.");
      setDeletingTurma(null);
      void queryClient.invalidateQueries({ queryKey: ["turmas"] });
    },
    onError: (error) => toast.error(`Erro ao excluir turma: ${(error as Error).message}`),
  });

  const isDemanda = (t: TurmaListItem) => {
    const c = (t.curso || "").toLowerCase();
    return (
      c.includes("ensaio") ||
      c.includes("casamento") ||
      c.includes("festa") ||
      c.includes("aniversario") ||
      c.includes("aniversário")
    );
  };

  const filteredTurmas = turmas.filter(
    (t) =>
      !isDemanda(t) &&
      (t.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.curso ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.faculdade ?? t.instituicao ?? "").toLowerCase().includes(searchQuery.toLowerCase())),
  );

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

      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4 text-muted-foreground" />
        </div>
        <Input
          type="search"
          placeholder="Pesquisar por nome da turma, curso ou faculdade..."
          className="max-w-md bg-background pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Carregando turmas…</p>}

      {filteredTurmas.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">Nenhuma turma encontrada.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredTurmas.map((turma) => (
          <Card key={turma.id} className="group relative border-border/80 transition-all hover:shadow-elevated">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-2">
                <Link to="/turmas/$turmaId" params={{ turmaId: turma.id }} className="flex-1">
                  <p className="font-display text-lg font-semibold transition-colors hover:text-primary">
                    {turma.nome}
                  </p>
                </Link>

                <div className="flex items-center gap-2">
                  <Badge variant={turma.status === "Ativa" ? "default" : "secondary"}>{turma.status}</Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTurma(turma)} className="cursor-pointer gap-2">
                        <Edit className="size-4" /> Editar Turma
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingTurma(turma)}
                        className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" /> Excluir Turma
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Link to="/turmas/$turmaId" params={{ turmaId: turma.id }} className="mt-2 block space-y-2">
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Building2 className="size-3.5 text-primary" /> {turma.curso ?? "—"} · {turma.faculdade ?? turma.instituicao ?? "—"}
                </p>
                <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3.5 text-gold" /> {turma.totalAlunos} formandos
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
          <GraduationCap className="mx-auto mb-3 size-12 opacity-30" />
          <p className="text-base font-semibold text-foreground">Nenhuma turma cadastrada ainda</p>
          <p className="mt-1 text-sm">Cadastre a primeira turma clicando no botão acima.</p>
        </div>
      )}

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
              <Field name="nome" label="Nome da turma *" defaultValue={editingTurma.nome} required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field name="curso" label="Curso *" defaultValue={editingTurma.curso ?? ""} required />
                <Field
                  name="faculdade"
                  label="Faculdade *"
                  defaultValue={editingTurma.faculdade ?? editingTurma.instituicao ?? ""}
                  required
                />
                <Field name="cidade" label="Cidade" defaultValue={editingTurma.cidade ?? ""} />
                <Field name="semestre" label="Semestre" defaultValue={editingTurma.semestre ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Status da Turma</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={editingTurma.status}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Concluida">Concluída</option>
                  <option value="Inativa">Inativa</option>
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

      <AlertDialog open={!!deletingTurma} onOpenChange={(v) => !v && setDeletingTurma(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">Excluir Turma</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a turma <strong>{deletingTurma?.nome}</strong>? Esta ação não pode ser
              desfeita e removerá os formandos e contratos vinculados.
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
