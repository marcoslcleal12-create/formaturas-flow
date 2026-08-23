import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as object, o as string, r as literal, s as ZodError } from "../_libs/zod.mjs";
import { C as Input, N as brl, T as Route, _ as DialogContent, a as AlertDialogDescription, b as DialogHeader, c as AlertDialogTitle, d as Card, f as CardContent, g as Dialog, h as CardTitle, i as AlertDialogContent, l as AppShell, m as CardHeader, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as Badge, w as Label, x as DialogTitle, y as DialogFooter } from "./router-DisewPEU.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Link2, C as Plus, D as Package, H as EllipsisVertical, K as Copy, V as ExternalLink, Y as CirclePlus, f as Trash2, i as User, m as Sparkles, p as SquarePen, pt as ArrowLeft, tt as Check, w as Phone } from "../_libs/lucide-react.mjs";
import { i as extrairPacotesTurma, n as PACOTES_PADRAO, o as serializarPacotesTurma } from "./turma-pacotes-B66fxwtb.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BkskzzYW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/turmas._turmaId-Eh8zGlSN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var alunoSchema = object({
	nome_completo: string().trim().min(3, "Informe o nome completo").max(120),
	cpf: string().trim().max(20).optional(),
	whatsapp: string().trim().max(20).optional(),
	email: string().trim().email("E-mail inválido").max(255).optional().or(literal("")),
	data_nascimento: string().trim().max(10).optional()
});
var turmaEditSchema = object({
	nome: string().trim().min(2, "Informe o nome da turma").max(120),
	curso: string().trim().min(2, "Informe o curso").max(120),
	faculdade: string().trim().min(2, "Informe a faculdade").max(120),
	cidade: string().trim().max(120).optional(),
	semestre: string().trim().max(20).optional(),
	status: string().optional()
});
function TurmaDetalhe() {
	const { turmaId } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [openEditTurma, setOpenEditTurma] = (0, import_react.useState)(false);
	const [openDeleteTurma, setOpenDeleteTurma] = (0, import_react.useState)(false);
	const [openLinkAdesao, setOpenLinkAdesao] = (0, import_react.useState)(false);
	const [openGerenciarPacotes, setOpenGerenciarPacotes] = (0, import_react.useState)(false);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	const [editingAluno, setEditingAluno] = (0, import_react.useState)(null);
	const [deletingAluno, setDeletingAluno] = (0, import_react.useState)(null);
	const [pacotes, setPacotes] = (0, import_react.useState)(PACOTES_PADRAO);
	const [novoNome, setNovoNome] = (0, import_react.useState)("");
	const [novoMaterial, setNovoMaterial] = (0, import_react.useState)("");
	const [novoInvestimento, setNovoInvestimento] = (0, import_react.useState)("");
	const { data } = useQuery({
		queryKey: ["turma", turmaId],
		queryFn: async () => {
			const [turma, alunos, contratos] = await Promise.all([
				supabase.from("turmas").select("*").eq("id", turmaId).maybeSingle(),
				supabase.from("alunos").select("*").eq("turma_id", turmaId).neq("status", "inativo").order("nome_completo"),
				supabase.from("contratos").select("*, parcelas(*)").eq("turma_id", turmaId)
			]);
			if (turma.error) throw turma.error;
			if (alunos.error) throw alunos.error;
			if (contratos.error) throw contratos.error;
			return {
				turma: turma.data,
				alunos: alunos.data,
				contratos: contratos.data
			};
		}
	});
	const turma = data?.turma;
	const alunos = data?.alunos ?? [];
	const contratos = data?.contratos ?? [];
	(0, import_react.useEffect)(() => {
		if (turma?.observacoes) setPacotes(extrairPacotesTurma(turma.observacoes));
	}, [turma?.observacoes]);
	const pacotesAtivos = pacotes.filter((p) => p.ativo !== false);
	const linkAdesao = typeof window !== "undefined" ? `${window.location.origin}/adesao/${turmaId}` : `/adesao/${turmaId}`;
	const copiarLink = () => {
		if (typeof navigator !== "undefined") {
			navigator.clipboard.writeText(linkAdesao);
			setCopiedLink(true);
			toast.success("Link de adesão copiado para a área de transferência!");
			setTimeout(() => setCopiedLink(false), 2500);
		}
	};
	const salvarPacotes = useMutation({
		mutationFn: async (novosPacotes) => {
			const serialized = serializarPacotesTurma(turma?.observacoes, novosPacotes);
			const { error } = await supabase.from("turmas").update({ observacoes: serialized }).eq("id", turmaId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Pacotes da turma atualizados com sucesso!");
			setOpenGerenciarPacotes(false);
			queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
		},
		onError: (error) => toast.error(`Erro ao salvar pacotes: ${error.message}`)
	});
	const togglePacote = (id) => {
		const atualizados = pacotes.map((p) => p.id === id ? {
			...p,
			ativo: !p.ativo
		} : p);
		setPacotes(atualizados);
	};
	const adicionarNovoPacote = () => {
		if (!novoNome.trim() || !novoInvestimento) {
			toast.error("Informe o nome e o valor de investimento do pacote.");
			return;
		}
		const val = parseFloat(novoInvestimento.replace(/\./g, "").replace(",", "."));
		if (isNaN(val) || val <= 0) {
			toast.error("Informe um valor válido.");
			return;
		}
		const novo = {
			id: `custom-${Date.now()}`,
			nome: novoNome.trim(),
			material: novoMaterial.trim() || "Material conforme descrição.",
			investimento: val,
			ativo: true
		};
		setPacotes([...pacotes, novo]);
		setNovoNome("");
		setNovoMaterial("");
		setNovoInvestimento("");
		toast.success("Novo pacote adicionado à lista. Clique em Salvar para confirmar.");
	};
	const removerPacote = (id) => {
		setPacotes(pacotes.filter((p) => p.id !== id));
	};
	const updateTurma = useMutation({
		mutationFn: async (form) => {
			const parsed = turmaEditSchema.parse({
				nome: form.get("nome"),
				curso: form.get("curso"),
				faculdade: form.get("faculdade"),
				cidade: form.get("cidade") || void 0,
				semestre: form.get("semestre") || void 0,
				status: form.get("status") || "ativa"
			});
			const { error } = await supabase.from("turmas").update({
				nome: parsed.nome,
				curso: parsed.curso,
				faculdade: parsed.faculdade,
				cidade: parsed.cidade ?? null,
				semestre: parsed.semestre ?? null,
				status: parsed.status ?? "ativa"
			}).eq("id", turmaId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Turma atualizada com sucesso!");
			setOpenEditTurma(false);
			queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const deleteTurma = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("turmas").delete().eq("id", turmaId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Turma excluída com sucesso.");
			queryClient.invalidateQueries({ queryKey: ["turmas"] });
			navigate({ to: "/turmas" });
		},
		onError: (error) => toast.error(`Erro ao excluir turma: ${error.message}`)
	});
	const updateAluno = useMutation({
		mutationFn: async (form) => {
			if (!editingAluno) return;
			const parsed = alunoSchema.parse({
				nome_completo: form.get("nome_completo"),
				cpf: form.get("cpf") || void 0,
				whatsapp: form.get("whatsapp") || void 0,
				email: form.get("email") || void 0,
				data_nascimento: form.get("data_nascimento") || void 0
			});
			const { error } = await supabase.from("alunos").update({
				nome_completo: parsed.nome_completo,
				cpf: parsed.cpf ? parsed.cpf.replace(/\D/g, "") : null,
				whatsapp: parsed.whatsapp ?? null,
				email: parsed.email || null,
				data_nascimento: parsed.data_nascimento || null
			}).eq("id", editingAluno.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Dados do formando atualizados!");
			setEditingAluno(null);
			queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
			queryClient.invalidateQueries({ queryKey: ["aluno"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const deleteAluno = useMutation({
		mutationFn: async (alunoId) => {
			const { error } = await supabase.from("alunos").delete().eq("id", alunoId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Formando excluído com sucesso.");
			setDeletingAluno(null);
			queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
		},
		onError: (error) => toast.error(`Erro ao excluir formando: ${error.message}`)
	});
	const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const todasParcelas = contratos.flatMap((c) => c.parcelas ?? []);
	const contratado = contratos.reduce((s, c) => s + Number(c.valor_total) - Number(c.desconto), 0);
	const recebido = contratos.reduce((s, c) => s + Number(c.valor_entrada), 0) + todasParcelas.reduce((s, p) => s + Number(p.valor_pago), 0);
	const aReceber = Math.max(contratado - recebido, 0);
	const atrasado = todasParcelas.filter((p) => p.status !== "pago" && p.vencimento < hoje).reduce((s, p) => s + (Number(p.valor) - Number(p.valor_pago)), 0);
	const percentual = contratado > 0 ? Math.round(recebido / contratado * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/turmas",
			className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Voltar para Turmas"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: turma?.nome ?? "Turma"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: turma?.status === "ativa" ? "default" : "secondary",
						children: turma?.status ?? "ativa"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "gap-1.5 border-primary/40 text-primary font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-3.5" }),
							pacotesAtivos.length,
							" ",
							pacotesAtivos.length === 1 ? "pacote ativo" : "pacotes ativos"
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: [
					turma?.curso,
					" · ",
					turma?.faculdade,
					" · ",
					turma?.semestre ?? "Sem semestre",
					" · ",
					turma?.cidade ?? "Sem cidade"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: openLinkAdesao,
						onOpenChange: setOpenLinkAdesao,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setOpenLinkAdesao(true),
							className: "gap-1.5 bg-primary text-primary-foreground font-semibold shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), " Link de Adesão"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "max-w-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
									className: "flex items-center gap-2 text-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-primary" }), " Link de Adesão dos Formandos"]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm text-muted-foreground",
											children: [
												"Compartilhe este link com os formandos da turma ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: turma?.nome }),
												". Ao acessar, eles preencherão o formulário de 4 etapas e criarão automaticamente o login com CPF."
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 p-2 rounded-xl bg-muted border border-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												readOnly: true,
												value: linkAdesao,
												className: "font-mono text-xs bg-background border-none shadow-none focus-visible:ring-0"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												onClick: copiarLink,
												className: "gap-1.5 shrink-0",
												children: [copiedLink ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copiedLink ? "Copiado!" : "Copiar"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap gap-2 pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "gap-2 flex-1",
												onClick: () => {
													const msg = encodeURIComponent(`Olá formandos da turma ${turma?.nome}! Acessem o link para realizar a adesão e escolher o pacote de formatura: ${linkAdesao}`);
													window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-green-600" }), " Compartilhar no WhatsApp"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "gap-2 flex-1",
												onClick: () => window.open(linkAdesao, "_blank"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), " Abrir Formulário"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setOpenLinkAdesao(false),
									children: "Fechar"
								}) })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
						open: openGerenciarPacotes,
						onOpenChange: setOpenGerenciarPacotes,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setOpenGerenciarPacotes(true),
							className: "gap-1.5 border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-primary" }), " Gerenciar Pacotes"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "max-w-2xl max-h-[85vh] overflow-y-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-5 text-primary" }), " Pacotes de Formatura da Turma"]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-6 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Ative ou desative os pacotes disponíveis para adesão desta turma, ou cadastre novos pacotes personalizados."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs uppercase font-bold text-muted-foreground",
												children: "Pacotes Cadastrados"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-2.5",
												children: pacotes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: `p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-all ${p.ativo !== false ? "bg-card border-border" : "bg-muted/40 border-border/50 opacity-60"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1 flex-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2 flex-wrap",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-bold text-sm text-foreground",
																	children: p.nome
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: p.ativo !== false ? "default" : "secondary",
																	className: "text-[10px]",
																	children: p.ativo !== false ? "Ativo na adesão" : "Desativado"
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground",
																children: p.material
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-sm font-extrabold text-primary pt-1",
																children: brl(p.investimento)
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 shrink-0 pt-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: `switch-${p.id}`,
																className: "text-xs font-normal cursor-pointer hidden sm:inline",
																children: p.ativo !== false ? "Ativo" : "Inativo"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
																id: `switch-${p.id}`,
																checked: p.ativo !== false,
																onCheckedChange: () => togglePacote(p.id)
															})]
														}), p.id.startsWith("custom-") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "icon",
															className: "size-8 text-destructive hover:bg-destructive/10",
															onClick: () => removerPacote(p.id),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
														})]
													})]
												}, p.id))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl border border-dashed border-border bg-muted/20 space-y-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												className: "text-sm font-semibold flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "size-4 text-primary" }), " Cadastrar Novo Pacote Personalizado"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Nome do pacote (ex: 5º PACOTE - ÁLBUM VIP + QUADRO)",
														value: novoNome,
														onChange: (e) => setNovoNome(e.target.value)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Material/Descrição (ex: Álbum 30x30, 80 fotos, quadro 50x70)",
														value: novoMaterial,
														onChange: (e) => setNovoMaterial(e.target.value)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															placeholder: "Valor de investimento (ex: 2.800,00)",
															value: novoInvestimento,
															onChange: (e) => setNovoInvestimento(e.target.value)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															type: "button",
															variant: "secondary",
															onClick: adicionarNovoPacote,
															className: "shrink-0 gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Adicionar"]
														})]
													})
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setOpenGerenciarPacotes(false),
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => salvarPacotes.mutate(pacotes),
										disabled: salvarPacotes.isPending,
										className: "gap-2",
										children: salvarPacotes.isPending ? "Salvando..." : "Salvar Configurações de Pacotes"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setOpenEditTurma(true),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Turma"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setOpenDeleteTurma(true),
						className: "gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Turma"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Formandos (",
					alunos.length,
					")"
				] })
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2",
				children: [alunos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-8 text-center text-muted-foreground text-sm",
					children: "Nenhum formando cadastrado nesta turma ainda."
				}), alunos.map((aluno) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 hover:bg-muted/40 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/alunos/$alunoId",
						params: { alunoId: aluno.id },
						className: "flex-1 min-w-[200px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-primary" }),
								" ",
								aluno.nome_completo
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-3",
							children: [
								aluno.cpf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CPF: ", aluno.cpf] }),
								aluno.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["WhatsApp: ", aluno.whatsapp] }),
								aluno.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: aluno.email })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: aluno.user_id ? "default" : "secondary",
								children: aluno.user_id ? "acesso ativo" : "sem acesso"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								size: "sm",
								className: "h-8 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/alunos/$alunoId",
									params: { alunoId: aluno.id },
									children: "Contrato & Detalhes"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
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
									onClick: () => setEditingAluno(aluno),
									className: "gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Formando"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => setDeletingAluno(aluno),
									className: "gap-2 cursor-pointer text-destructive focus:text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Formando"]
								})]
							})] })
						]
					})]
				}, aluno.id))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6 shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-base",
				children: [
					"Estatísticas financeiras da turma (",
					contratos.length,
					" contrato",
					contratos.length === 1 ? "" : "s",
					")"
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estat, {
							titulo: "Valor contratado",
							valor: brl(contratado)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estat, {
							titulo: "Já recebido",
							valor: brl(recebido)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estat, {
							titulo: "Falta receber",
							valor: brl(aReceber)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Estat, {
							titulo: "Em atraso",
							valor: brl(atrasado),
							destaque: atrasado > 0
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 w-full overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary",
						style: { width: `${Math.min(percentual, 100)}%` }
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						percentual,
						"% do valor contratado já foi recebido · ",
						todasParcelas.filter((p) => p.status === "pago").length,
						"/",
						todasParcelas.length,
						" parcelas quitadas"
					]
				})] })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openEditTurma,
			onOpenChange: setOpenEditTurma,
			children: turma && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Dados da Turma" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					id: "form-edit-turma-page",
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						updateTurma.mutate(new FormData(e.currentTarget));
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nome",
								children: "Nome da turma *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nome",
								name: "nome",
								defaultValue: turma.nome,
								required: true,
								maxLength: 120
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "curso",
										children: "Curso *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "curso",
										name: "curso",
										defaultValue: turma.curso,
										required: true,
										maxLength: 120
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "faculdade",
										children: "Faculdade *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "faculdade",
										name: "faculdade",
										defaultValue: turma.faculdade,
										required: true,
										maxLength: 120
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "cidade",
										children: "Cidade"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "cidade",
										name: "cidade",
										defaultValue: turma.cidade || "",
										maxLength: 120
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "semestre",
										children: "Semestre"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "semestre",
										name: "semestre",
										defaultValue: turma.semestre || "",
										maxLength: 20
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "status",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "status",
								name: "status",
								defaultValue: turma.status,
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
					onClick: () => setOpenEditTurma(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					form: "form-edit-turma-page",
					disabled: updateTurma.isPending,
					children: updateTurma.isPending ? "Salvando..." : "Salvar alterações"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: openDeleteTurma,
			onOpenChange: setOpenDeleteTurma,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-destructive",
				children: "Excluir Turma"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Tem certeza que deseja excluir a turma ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: turma?.nome }),
				"? Esta ação removerá todos os formandos e contratos vinculados a esta turma."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deleteTurma.mutate(),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Turma"
			})] })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editingAluno,
			onOpenChange: (v) => !v && setEditingAluno(null),
			children: editingAluno && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Formando" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					id: "form-edit-aluno",
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						updateAluno.mutate(new FormData(e.currentTarget));
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "edit_nome_completo",
							children: "Nome completo *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "edit_nome_completo",
							name: "nome_completo",
							defaultValue: editingAluno.nome_completo,
							required: true,
							maxLength: 120
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit_cpf",
									children: "CPF"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit_cpf",
									name: "cpf",
									defaultValue: editingAluno.cpf || "",
									placeholder: "000.000.000-00",
									maxLength: 20
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit_whatsapp",
									children: "WhatsApp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit_whatsapp",
									name: "whatsapp",
									defaultValue: editingAluno.whatsapp || "",
									placeholder: "(11) 99999-9999",
									maxLength: 20
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit_email",
									children: "E-mail"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit_email",
									name: "email",
									type: "email",
									defaultValue: editingAluno.email || "",
									placeholder: "aluno@email.com",
									maxLength: 255
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit_data_nascimento",
									children: "Data de Nascimento"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit_data_nascimento",
									name: "data_nascimento",
									type: "date",
									defaultValue: editingAluno.data_nascimento || ""
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => setEditingAluno(null),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					form: "form-edit-aluno",
					disabled: updateAluno.isPending,
					children: updateAluno.isPending ? "Salvando..." : "Salvar alterações"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!deletingAluno,
			onOpenChange: (v) => !v && setDeletingAluno(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-destructive",
				children: "Excluir Formando"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Tem certeza que deseja excluir o formando ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingAluno?.nome_completo }),
				"? Esta ação removerá o contrato, parcelas e login associados."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deletingAluno && deleteAluno.mutate(deletingAluno.id),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Formando"
			})] })] })
		})
	] });
}
function Estat({ titulo, valor, destaque }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-wide text-muted-foreground",
			children: titulo
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 text-lg font-semibold ${destaque ? "text-destructive" : ""}`,
			children: valor
		})]
	});
}
//#endregion
export { TurmaDetalhe as component };
