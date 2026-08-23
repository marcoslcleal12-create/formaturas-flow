import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { C as Input, d as Card, f as CardContent, l as AppShell, m as CardHeader, u as Badge } from "./router-DisewPEU.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { Z as CircleAlert, a as UserX, c as UserCheck, ct as Building2, g as Search, y as RefreshCw } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inativos-CzpoLBUk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InativosPage() {
	const queryClient = useQueryClient();
	const [search, setSearch] = (0, import_react.useState)("");
	const { data: inativos = [], isLoading } = useQuery({
		queryKey: ["inativos"],
		queryFn: async () => {
			const { data, error } = await supabase.from("alunos").select("*, turmas(id, nome, curso, faculdade)").eq("status", "inativo").order("updated_at", { ascending: false });
			if (error) throw error;
			return data;
		}
	});
	const reativarAluno = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("alunos").update({
				status: "ativo",
				motivo_inativacao: null
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Cadastro do formando reativado com sucesso!");
			queryClient.invalidateQueries({ queryKey: ["inativos"] });
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
		},
		onError: (error) => toast.error(`Erro ao reativar cliente: ${error.message}`)
	});
	const filteredInativos = inativos.filter((item) => {
		const term = search.toLowerCase();
		return item.nome_completo.toLowerCase().includes(term) || item.cpf && item.cpf.includes(term) || item.turmas?.nome && item.turmas.nome.toLowerCase().includes(term);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold",
				children: "Clientes Inativos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Lista de formandos com cadastros suspensos/inativados e seus respectivos motivos."
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex items-center gap-2 max-w-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Buscar por nome, CPF ou turma...",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-9 h-10"
				})]
			})
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-48 items-center justify-center gap-2 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Carregando inativos..." })]
		}) : filteredInativos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-card border-dashed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col items-center justify-center py-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "size-12 text-muted-foreground/60 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "Nenhum cliente inativo encontrado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 max-w-sm",
						children: search ? "Não encontramos nenhum formando inativo que coincida com a sua busca." : "Todos os formandos cadastrados no sistema estão com cadastro ativo no momento."
					})
				]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: filteredInativos.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-card border-amber-500/20 bg-amber-500/[0.01]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-4 pb-2 flex flex-row items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/alunos/$alunoId",
						params: { alunoId: item.id },
						className: "font-bold text-foreground hover:text-primary transition-colors text-base hover:underline",
						children: item.nome_completo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: ["CPF: ", item.cpf ? item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "Não informado"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "destructive",
						className: "bg-amber-600 hover:bg-amber-700 text-white shrink-0",
						children: "Inativo"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 pt-0 space-y-3",
					children: [
						item.turmas && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5 text-muted-foreground/80 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Original: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: item.turmas.nome
								}),
								" (",
								item.turmas.curso,
								" · ",
								item.turmas.faculdade,
								")"
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-amber-500/10 bg-amber-500/5 p-3 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-amber-700 dark:text-amber-500",
										children: "Motivo da Inativação"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: item.motivo_inativacao || "Nenhum motivo registrado."
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 flex items-center justify-between border-t border-border/40 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Inativado em: ", new Date(item.updated_at).toLocaleDateString("pt-BR")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => reativarAluno.mutate(item.id),
								disabled: reativarAluno.isPending,
								className: "h-7 text-[11px] px-2.5 gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-900/30 dark:hover:bg-emerald-950/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3.5" }), " Reativar Cadastro"]
							})]
						})
					]
				})]
			}, item.id))
		})
	] });
}
//#endregion
export { InativosPage as component };
