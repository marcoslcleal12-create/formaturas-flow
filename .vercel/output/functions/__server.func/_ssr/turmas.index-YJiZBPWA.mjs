import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as object, o as string, s as ZodError } from "../_libs/zod.mjs";
import { c as Input, i as CardContent, n as Badge, r as Card, t as AppShell } from "./router-Bk1JJVce.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as GraduationCap, N as EllipsisVertical, Y as Building2, b as MapPin, c as Trash2, h as Plus, l as SquarePen } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-g_nJl_ho.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BkskzzYW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/turmas.index-YJiZBPWA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var turmaSchema = object({
	nome: string().trim().min(2, "Informe o nome da turma").max(120),
	curso: string().trim().min(2, "Informe o curso").max(120),
	faculdade: string().trim().min(2, "Informe a faculdade").max(120),
	cidade: string().trim().max(120).optional(),
	semestre: string().trim().max(20).optional(),
	previsao_formatura: string().trim().max(10).optional(),
	status: string().optional()
});
function TurmasPage() {
	const queryClient = useQueryClient();
	const [openCreate, setOpenCreate] = (0, import_react.useState)(false);
	const [editingTurma, setEditingTurma] = (0, import_react.useState)(null);
	const [deletingTurma, setDeletingTurma] = (0, import_react.useState)(null);
	const { data: turmas = [], isLoading } = useQuery({
		queryKey: ["turmas"],
		queryFn: async () => {
			const { data, error } = await supabase.from("turmas").select("*, alunos(count)").order("created_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const createTurma = useMutation({
		mutationFn: async (form) => {
			const parsed = turmaSchema.parse({
				nome: form.get("nome"),
				curso: form.get("curso"),
				faculdade: form.get("faculdade"),
				cidade: form.get("cidade") || void 0,
				semestre: form.get("semestre") || void 0,
				previsao_formatura: form.get("previsao_formatura") || void 0
			});
			const { error } = await supabase.from("turmas").insert({
				nome: parsed.nome,
				curso: parsed.curso,
				faculdade: parsed.faculdade,
				cidade: parsed.cidade ?? null,
				semestre: parsed.semestre ?? null,
				previsao_formatura: parsed.previsao_formatura || null,
				status: "ativa"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Turma criada com sucesso!");
			setOpenCreate(false);
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const updateTurma = useMutation({
		mutationFn: async (form) => {
			if (!editingTurma) return;
			const parsed = turmaSchema.parse({
				nome: form.get("nome"),
				curso: form.get("curso"),
				faculdade: form.get("faculdade"),
				cidade: form.get("cidade") || void 0,
				semestre: form.get("semestre") || void 0,
				previsao_formatura: form.get("previsao_formatura") || void 0,
				status: form.get("status") || "ativa"
			});
			const { error } = await supabase.from("turmas").update({
				nome: parsed.nome,
				curso: parsed.curso,
				faculdade: parsed.faculdade,
				cidade: parsed.cidade ?? null,
				semestre: parsed.semestre ?? null,
				previsao_formatura: parsed.previsao_formatura || null,
				status: parsed.status ?? "ativa"
			}).eq("id", editingTurma.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Turma atualizada com sucesso!");
			setEditingTurma(null);
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const deleteTurma = useMutation({
		mutationFn: async (turmaId) => {
			const { error } = await supabase.from("turmas").delete().eq("id", turmaId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Turma excluída com sucesso.");
			setDeletingTurma(null);
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
		},
		onError: (error) => toast.error(`Erro ao excluir turma: ${error.message}`)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Turmas de Formatura"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Cadastre, edite e acompanhe os formandos por curso e faculdade."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: openCreate,
				onOpenChange: setOpenCreate,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Nova turma"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Cadastrar Nova Turma" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "form-turma",
						className: "space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							createTurma.mutate(new FormData(e.currentTarget));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "nome",
							label: "Nome da turma *",
							placeholder: "Ex: Enfermagem – Faculdade X – 2026/2",
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "curso",
									label: "Curso *",
									placeholder: "Ex: Enfermagem",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "faculdade",
									label: "Faculdade *",
									placeholder: "Ex: UNESP",
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "cidade",
									label: "Cidade",
									placeholder: "Ex: São Paulo - SP"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "semestre",
									label: "Semestre",
									placeholder: "Ex: 2026/2"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setOpenCreate(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						form: "form-turma",
						disabled: createTurma.isPending,
						children: createTurma.isPending ? "Salvando..." : "Salvar turma"
					})] })
				] })]
			})]
		}),
		isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Carregando turmas…"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: turmas.map((turma) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "relative group hover:shadow-elevated transition-all border-border/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/turmas/$turmaId",
							params: { turmaId: turma.id },
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display font-semibold text-lg hover:text-primary transition-colors",
								children: turma.nome
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: turma.status === "ativa" ? "default" : "secondary",
								children: turma.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "size-8 text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setEditingTurma(turma),
									className: "gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Turma"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setDeletingTurma(turma),
									className: "gap-2 cursor-pointer text-destructive focus:text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Turma"]
								})]
							})] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/turmas/$turmaId",
						params: { turmaId: turma.id },
						className: "block mt-2 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 text-primary" }),
								" ",
								turma.curso,
								" · ",
								turma.faculdade
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted-foreground pt-3 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-3.5 text-gold" }),
									" ",
									turma.alunos?.[0]?.count ?? 0,
									" formandos"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-muted-foreground" }),
									" ",
									turma.cidade ?? "Sem local definido"
								]
							})]
						})]
					})]
				})
			}, turma.id))
		}),
		!isLoading && turmas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed p-12 text-center text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "mx-auto size-12 opacity-30 mb-3" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-foreground text-base",
					children: "Nenhuma turma cadastrada ainda"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm mt-1",
					children: "Cadastre a primeira turma clicando no botão acima."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editingTurma,
			onOpenChange: (v) => !v && setEditingTurma(null),
			children: editingTurma && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Turma" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					id: "form-edit-turma",
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						updateTurma.mutate(new FormData(e.currentTarget));
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "nome",
							label: "Nome da turma *",
							defaultValue: editingTurma.nome,
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "curso",
									label: "Curso *",
									defaultValue: editingTurma.curso,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "faculdade",
									label: "Faculdade *",
									defaultValue: editingTurma.faculdade,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "cidade",
									label: "Cidade",
									defaultValue: editingTurma.cidade || ""
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									name: "semestre",
									label: "Semestre",
									defaultValue: editingTurma.semestre || ""
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							name: "previsao_formatura",
							label: "Previsão de formatura",
							type: "date",
							defaultValue: editingTurma.previsao_formatura || ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "status",
								children: "Status da Turma"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "status",
								name: "status",
								defaultValue: editingTurma.status,
								className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ativa",
										children: "Ativa"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "concluida",
										children: "Concluída"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cancelada",
										children: "Cancelada"
									})
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => setEditingTurma(null),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					form: "form-edit-turma",
					disabled: updateTurma.isPending,
					children: updateTurma.isPending ? "Salvando..." : "Salvar alterações"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!deletingTurma,
			onOpenChange: (v) => !v && setDeletingTurma(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-destructive",
				children: "Excluir Turma"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Tem certeza que deseja excluir a turma ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingTurma?.nome }),
				"? Esta ação não pode ser desfeita e removerá os formandos e contratos vinculados."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deletingTurma && deleteTurma.mutate(deletingTurma.id),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Turma"
			})] })] })
		})
	] });
}
function Field({ name, label, type = "text", placeholder, defaultValue, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: name,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: name,
			name,
			type,
			placeholder,
			defaultValue,
			required,
			maxLength: 120
		})]
	});
}
//#endregion
export { TurmasPage as component };
