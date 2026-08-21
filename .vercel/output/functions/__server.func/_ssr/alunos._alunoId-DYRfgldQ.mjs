import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as object, i as number, o as string, r as literal, s as ZodError } from "../_libs/zod.mjs";
import { b as criarAcessoFormando, c as Input, f as brl, i as CardContent, n as Badge, o as CardHeader, r as Card, s as CardTitle, t as AppShell, u as Route$5 } from "./router-Bk1JJVce.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as ArrowLeft, A as FileDown, H as CircleAlert, I as CreditCard, T as KeyRound, c as Trash2, h as Plus, j as Eye, k as FileText, l as SquarePen, p as Save } from "../_libs/lucide-react.mjs";
import { a as gerarContratoPdf, r as FORMAS_PAGAMENTO, t as CLAUSULAS_PADRAO } from "./contrato-modelo-DarhVMh5.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-g_nJl_ho.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alunos._alunoId-DYRfgldQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContratoDocumento({ aluno, contrato, parcelas, alunoId }) {
	const queryClient = useQueryClient();
	const [texto, setTexto] = (0, import_react.useState)(contrato.texto_contrato ?? CLAUSULAS_PADRAO);
	const [forma, setForma] = (0, import_react.useState)(contrato.forma_pagamento ?? "boleto");
	const [autoriza, setAutoriza] = (0, import_react.useState)(contrato.autoriza_imagem ?? true);
	const salvar = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("contratos").update({
				texto_contrato: texto,
				forma_pagamento: forma,
				autoriza_imagem: autoriza
			}).eq("id", contrato.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Contrato salvo");
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
		},
		onError: (error) => toast.error(error.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "text-base flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 text-primary" }), " Contrato de Prestação de Serviços"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted-foreground mt-0.5",
			children: ["Documento contratual referente a ", contrato.pacote]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-wrap gap-3 pt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), " Visualizar Contrato"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl max-h-[85vh] flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Contrato de Prestação de Serviços" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "texto-contrato",
								className: "font-semibold",
								children: "Cláusulas (editáveis)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-xs text-muted-foreground underline hover:text-foreground",
								onClick: () => setTexto(CLAUSULAS_PADRAO),
								children: "restaurar modelo padrão"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "texto-contrato",
							value: texto,
							onChange: (e) => setTexto(e.target.value),
							className: "min-h-[360px] font-mono text-xs leading-relaxed"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						disabled: salvar.isPending,
						onClick: () => salvar.mutate(),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Salvar Alterações"]
					}) })
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => gerarContratoPdf({
					aluno: {
						nome_completo: aluno.nome_completo,
						cpf: aluno.cpf,
						endereco: aluno.endereco,
						cidade: aluno.cidade,
						telefone: aluno.telefone,
						email: aluno.email,
						turma_nome: aluno.turmas?.nome || null
					},
					contrato: {
						pacote: contrato.pacote,
						valor_total: Number(contrato.valor_total),
						desconto: Number(contrato.desconto),
						valor_entrada: Number(contrato.valor_entrada),
						dia_vencimento: contrato.dia_vencimento,
						data_contrato: contrato.data_contrato,
						forma_pagamento: forma,
						autoriza_imagem: autoriza
					},
					parcelas,
					texto
				}),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " Baixar em PDF"]
			})]
		})]
	});
}
var contratoSchema = object({
	pacote: string().trim().min(2, "Informe o pacote").max(120),
	valor_total: number().positive("Valor total inválido"),
	desconto: number().min(0),
	valor_entrada: number().min(0),
	num_parcelas: number().int().min(1).max(60),
	dia_vencimento: number().int().min(1).max(28),
	primeiro_vencimento: string().min(10, "Informe o primeiro vencimento"),
	forma_pagamento: string().min(2)
});
var alunoEditSchema = object({
	nome_completo: string().trim().min(3, "Informe o nome completo").max(120),
	cpf: string().trim().max(20).optional(),
	whatsapp: string().trim().max(20).optional(),
	email: string().trim().email("E-mail inválido").max(255).optional().or(literal("")),
	data_nascimento: string().trim().max(10).optional(),
	cidade: string().trim().max(120).optional(),
	endereco: string().trim().max(200).optional()
});
function num(form, key) {
	return Number(String(form.get(key) ?? "0").replace(",", ".")) || 0;
}
function AlunoDetalhe() {
	const { alunoId } = Route$5.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [openCreateContrato, setOpenCreateContrato] = (0, import_react.useState)(false);
	const [openEditContrato, setOpenEditContrato] = (0, import_react.useState)(false);
	const [openDeleteContrato, setOpenDeleteContrato] = (0, import_react.useState)(false);
	const [openEditAluno, setOpenEditAluno] = (0, import_react.useState)(false);
	const [openDeleteAluno, setOpenDeleteAluno] = (0, import_react.useState)(false);
	const [showDados, setShowDados] = (0, import_react.useState)(false);
	const [showTurma, setShowTurma] = (0, import_react.useState)(false);
	const criarAcesso = useServerFn(criarAcessoFormando);
	const { data } = useQuery({
		queryKey: ["aluno", alunoId],
		queryFn: async () => {
			const aluno = await supabase.from("alunos").select("*, turmas(id, nome, curso, faculdade)").eq("id", alunoId).maybeSingle();
			if (aluno.error) throw aluno.error;
			const contrato = await supabase.from("contratos").select("*, parcelas(*)").eq("aluno_id", alunoId).maybeSingle();
			if (contrato.error) throw contrato.error;
			return {
				aluno: aluno.data,
				contrato: contrato.data
			};
		}
	});
	const aluno = data?.aluno;
	const contrato = data?.contrato;
	const parcelas = [...contrato?.parcelas ?? []].sort((a, b) => a.numero - b.numero);
	const updateAluno = useMutation({
		mutationFn: async (form) => {
			const parsed = alunoEditSchema.parse({
				nome_completo: form.get("nome_completo"),
				cpf: form.get("cpf") || void 0,
				whatsapp: form.get("whatsapp") || void 0,
				email: form.get("email") || void 0,
				data_nascimento: form.get("data_nascimento") || void 0,
				cidade: form.get("cidade") || void 0,
				endereco: form.get("endereco") || void 0
			});
			const { error } = await supabase.from("alunos").update({
				nome_completo: parsed.nome_completo,
				cpf: parsed.cpf ? parsed.cpf.replace(/\D/g, "") : null,
				whatsapp: parsed.whatsapp ?? null,
				email: parsed.email || null,
				data_nascimento: parsed.data_nascimento || null,
				cidade: parsed.cidade ?? null,
				endereco: parsed.endereco ?? null
			}).eq("id", alunoId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Dados do formando atualizados com sucesso!");
			setOpenEditAluno(false);
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
			queryClient.invalidateQueries({ queryKey: ["turma"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const deleteAluno = useMutation({
		mutationFn: async () => {
			const turmaId = aluno?.turma_id;
			const { error } = await supabase.from("alunos").delete().eq("id", alunoId);
			if (error) throw error;
			return turmaId;
		},
		onSuccess: (turmaId) => {
			toast.success("Formando excluído com sucesso.");
			queryClient.invalidateQueries({ queryKey: ["turma", turmaId] });
			if (turmaId) navigate({
				to: "/turmas/$turmaId",
				params: { turmaId }
			});
			else navigate({ to: "/turmas" });
		},
		onError: (error) => toast.error(`Erro ao excluir formando: ${error.message}`)
	});
	const gerarAcesso = useMutation({
		mutationFn: () => criarAcesso({ data: { alunoId } }),
		onSuccess: (res) => {
			toast.success(`Acesso criado — login e senha: CPF ${res.login}`, { duration: 12e3 });
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
		},
		onError: (error) => toast.error(error.message)
	});
	const criarContrato = useMutation({
		mutationFn: async (form) => {
			const parsed = contratoSchema.parse({
				pacote: form.get("pacote"),
				valor_total: num(form, "valor_total"),
				desconto: num(form, "desconto"),
				valor_entrada: num(form, "valor_entrada"),
				num_parcelas: num(form, "num_parcelas"),
				dia_vencimento: num(form, "dia_vencimento"),
				primeiro_vencimento: String(form.get("primeiro_vencimento") ?? ""),
				forma_pagamento: String(form.get("forma_pagamento") ?? "boleto")
			});
			const financiado = parsed.valor_total - parsed.desconto - parsed.valor_entrada;
			if (financiado <= 0) throw new Error("O valor a parcelar precisa ser maior que zero.");
			const { data: novo, error } = await supabase.from("contratos").insert({
				aluno_id: alunoId,
				turma_id: aluno?.turma_id ?? null,
				pacote: parsed.pacote,
				valor_total: parsed.valor_total,
				desconto: parsed.desconto,
				valor_entrada: parsed.valor_entrada,
				num_parcelas: parsed.num_parcelas,
				dia_vencimento: parsed.dia_vencimento,
				forma_pagamento: parsed.forma_pagamento
			}).select("id").single();
			if (error) throw error;
			const base = Math.floor(financiado / parsed.num_parcelas * 100) / 100;
			const resto = Math.round((financiado - base * parsed.num_parcelas) * 100) / 100;
			const inicio = /* @__PURE__ */ new Date(`${parsed.primeiro_vencimento}T12:00:00`);
			const linhas = Array.from({ length: parsed.num_parcelas }, (_, i) => {
				const venc = new Date(inicio);
				venc.setMonth(venc.getMonth() + i);
				return {
					contrato_id: novo.id,
					numero: i + 1,
					valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base,
					vencimento: venc.toISOString().slice(0, 10)
				};
			});
			const hojeIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const comEntrada = parsed.valor_entrada > 0 ? [{
				contrato_id: novo.id,
				numero: 0,
				valor: parsed.valor_entrada,
				vencimento: hojeIso
			}, ...linhas] : linhas;
			const { error: parcelasError } = await supabase.from("parcelas").insert(comEntrada);
			if (parcelasError) throw parcelasError;
		},
		onSuccess: () => {
			toast.success("Contrato e parcelas gerados com sucesso!");
			setOpenCreateContrato(false);
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
			queryClient.invalidateQueries({ queryKey: ["turma"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const updateContrato = useMutation({
		mutationFn: async (form) => {
			if (!contrato) return;
			const parsed = contratoSchema.parse({
				pacote: form.get("pacote"),
				valor_total: num(form, "valor_total"),
				desconto: num(form, "desconto"),
				valor_entrada: num(form, "valor_entrada"),
				num_parcelas: num(form, "num_parcelas"),
				dia_vencimento: num(form, "dia_vencimento"),
				primeiro_vencimento: String(form.get("primeiro_vencimento") ?? ""),
				forma_pagamento: String(form.get("forma_pagamento") ?? "boleto")
			});
			const { error: updateError } = await supabase.from("contratos").update({
				pacote: parsed.pacote,
				valor_total: parsed.valor_total,
				desconto: parsed.desconto,
				valor_entrada: parsed.valor_entrada,
				num_parcelas: parsed.num_parcelas,
				dia_vencimento: parsed.dia_vencimento,
				forma_pagamento: parsed.forma_pagamento
			}).eq("id", contrato.id);
			if (updateError) throw updateError;
			if (form.get("recalcular_parcelas") === "sim") {
				const financiado = parsed.valor_total - parsed.desconto - parsed.valor_entrada;
				if (financiado <= 0) throw new Error("O valor a parcelar precisa ser maior que zero.");
				await supabase.from("parcelas").delete().eq("contrato_id", contrato.id);
				const base = Math.floor(financiado / parsed.num_parcelas * 100) / 100;
				const resto = Math.round((financiado - base * parsed.num_parcelas) * 100) / 100;
				const inicio = /* @__PURE__ */ new Date(`${parsed.primeiro_vencimento}T12:00:00`);
				const linhas = Array.from({ length: parsed.num_parcelas }, (_, i) => {
					const venc = new Date(inicio);
					venc.setMonth(venc.getMonth() + i);
					return {
						contrato_id: contrato.id,
						numero: i + 1,
						valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base,
						vencimento: venc.toISOString().slice(0, 10)
					};
				});
				const hojeIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
				const comEntrada = parsed.valor_entrada > 0 ? [{
					contrato_id: contrato.id,
					numero: 0,
					valor: parsed.valor_entrada,
					vencimento: hojeIso
				}, ...linhas] : linhas;
				const { error: parcelasError } = await supabase.from("parcelas").insert(comEntrada);
				if (parcelasError) throw parcelasError;
			}
		},
		onSuccess: () => {
			toast.success("Contrato e pacote atualizados com sucesso!");
			setOpenEditContrato(false);
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
			queryClient.invalidateQueries({ queryKey: ["turma"] });
		},
		onError: (error) => toast.error(error instanceof ZodError ? error.issues[0].message : error.message)
	});
	const deleteContrato = useMutation({
		mutationFn: async () => {
			if (!contrato) return;
			await supabase.from("parcelas").delete().eq("contrato_id", contrato.id);
			const { error } = await supabase.from("contratos").delete().eq("id", contrato.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Contrato excluído com sucesso. Agora você pode criar um novo.");
			setOpenDeleteContrato(false);
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
			queryClient.invalidateQueries({ queryKey: ["turma"] });
		},
		onError: (error) => toast.error(`Erro ao excluir contrato: ${error.message}`)
	});
	useMutation({
		mutationFn: async ({ id, valor, pago }) => {
			const { error } = await supabase.from("parcelas").update(pago ? {
				status: "pendente",
				valor_pago: 0,
				data_pagamento: null
			} : {
				status: "pago",
				valor_pago: valor,
				data_pagamento: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Status da parcela atualizado!");
			queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
			queryClient.invalidateQueries({ queryKey: ["turma"] });
		},
		onError: (error) => toast.error(error.message)
	});
	const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const totalPago = parcelas.reduce((s, p) => s + Number(p.valor_pago), 0);
	const totalParcelas = parcelas.reduce((s, p) => s + Number(p.valor), 0);
	const atrasadas = parcelas.filter((p) => p.status !== "pago" && p.vencimento < hoje);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/turmas/$turmaId",
			params: { turmaId: aluno?.turma_id ?? "" },
			className: "mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Voltar para a turma"]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-start justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold",
					children: aluno?.nome_completo ?? "Formando"
				}), aluno?.user_id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "bg-emerald-600",
					children: [
						"Acesso Ativo (CPF: ",
						aluno.login_usuario,
						")"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: "Sem acesso gerado"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: [
					aluno?.turmas?.nome ?? "Sem turma",
					" · CPF: ",
					aluno?.cpf ?? "Não informado",
					" · Tel: ",
					aluno?.whatsapp ?? "—"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setOpenEditAluno(true),
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Formando"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setOpenDeleteAluno(true),
						className: "gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Formando"]
					}),
					!aluno?.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => gerarAcesso.mutate(),
						disabled: gerarAcesso.isPending,
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" }), " Liberar Acesso (Login CPF)"]
					})
				]
			})]
		}),
		!aluno?.user_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6 shadow-card border-gold/40 bg-gold/5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-6 text-sm text-foreground flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-5 text-gold shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Acesso do Formando:" }),
					" O acesso é liberado usando o ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "CPF como login" }),
					" e o ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "CPF como senha inicial" }),
					"."
				] })]
			})
		}),
		aluno && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Meus Dados Cadastrais"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: !showDados ? "default" : "ghost",
						size: "sm",
						onClick: () => setShowDados(!showDados),
						children: showDados ? "Ocultar" : "Visualizar"
					})]
				}), showDados && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Nome Completo",
							value: aluno.nome_completo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "CPF",
							value: aluno.cpf
						}),
						aluno.rg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "RG",
							value: aluno.rg
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Telefone",
							value: aluno.telefone || aluno.whatsapp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "WhatsApp",
							value: aluno.whatsapp
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "E-mail",
							value: aluno.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Endereço",
							value: aluno.endereco
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Cidade",
							value: aluno.cidade
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Minha Turma & Opções"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: aluno.status ?? "Ativo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: !showTurma ? "default" : "ghost",
							size: "sm",
							onClick: () => setShowTurma(!showTurma),
							children: showTurma ? "Ocultar" : "Visualizar"
						})]
					})]
				}), showTurma && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Turma",
							value: aluno.turmas?.nome
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Curso",
							value: aluno.turmas?.curso
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
							label: "Faculdade",
							value: aluno.turmas?.faculdade
						}),
						contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Pacote",
								value: contrato.pacote
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Valor Total",
								value: brl(Number(contrato.valor_total))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Condição",
								value: `${contrato.num_parcelas}x no boleto`
							})
						] })
					]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "text-lg font-semibold flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-5 text-gold" }), " Contrato, Pacote & Parcelamento"]
			}), !contrato ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: openCreateContrato,
				onOpenChange: setOpenCreateContrato,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Criar contrato & pacote"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Novo Contrato de Formatura" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							id: "form-contrato",
							className: "space-y-3",
							onSubmit: (e) => {
								e.preventDefault();
								criarContrato.mutate(new FormData(e.currentTarget));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
								name: "pacote",
								label: "Pacote Contratado *",
								defaultValue: "Pacote Completo (Foto + Álbum)",
								required: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
										name: "valor_total",
										label: "Valor total (R$) *",
										type: "number",
										step: "0.01",
										defaultValue: "4500",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
										name: "desconto",
										label: "Desconto (R$)",
										type: "number",
										step: "0.01",
										defaultValue: "0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
										name: "valor_entrada",
										label: "Entrada (R$)",
										type: "number",
										step: "0.01",
										defaultValue: "500"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
										name: "num_parcelas",
										label: "Nº de parcelas *",
										type: "number",
										defaultValue: "10",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
										name: "dia_vencimento",
										label: "Dia de vencimento *",
										type: "number",
										defaultValue: "10",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
										name: "primeiro_vencimento",
										label: "1º vencimento *",
										type: "date",
										defaultValue: hoje,
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "forma_pagamento",
											children: "Forma de pagamento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											id: "forma_pagamento",
											name: "forma_pagamento",
											defaultValue: "boleto",
											className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
											children: FORMAS_PAGAMENTO.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: f.id,
												children: f.label
											}, f.id))
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setOpenCreateContrato(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							form: "form-contrato",
							disabled: criarContrato.isPending,
							children: criarContrato.isPending ? "Gerando..." : "Gerar contrato e parcelas"
						})] })
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setOpenEditContrato(true),
					className: "gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Pacote / Contrato"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setOpenDeleteContrato(true),
					className: "gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Contrato"]
				})]
			})]
		}),
		!contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-card border-dashed p-10 text-center text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto size-10 opacity-30 mb-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-foreground",
					children: "Nenhum contrato cadastrado para este formando"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs mt-1",
					children: "Cadastre o pacote e gere o parcelamento clicando no botão acima."
				})
			]
		}),
		contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resumo, {
							titulo: "Valor do contrato",
							valor: brl(Number(contrato.valor_total))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resumo, {
							titulo: "Total parcelado",
							valor: brl(totalParcelas)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resumo, {
							titulo: "Recebido",
							valor: brl(totalPago)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Resumo, {
							titulo: "Em atraso",
							valor: String(atrasadas.length),
							destaque: atrasadas.length > 0
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Parcelas · ",
							contrato.pacote,
							" (",
							parcelas.length,
							")"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground font-normal",
							children: "Clique para marcar como Pago ou Pendente"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-2",
						children: parcelas.map((p) => {
							const pago = p.status === "pago";
							const atrasada = !pago && p.vencimento < hoje;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors ${atrasada ? "border-destructive/60 bg-destructive/10 text-destructive font-medium" : "border-border hover:bg-muted/40"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `font-medium ${atrasada ? "text-destructive font-bold" : ""}`,
									children: [
										p.numero === 0 ? "Entrada" : `Parcela ${p.numero}`,
										" · ",
										brl(Number(p.valor))
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `text-xs ${atrasada ? "text-destructive/80 font-medium" : "text-muted-foreground"}`,
									children: [
										"Vencimento: ",
										(/* @__PURE__ */ new Date(`${p.vencimento}T12:00:00`)).toLocaleDateString("pt-BR"),
										p.data_pagamento && ` · Pago em: ${(/* @__PURE__ */ new Date(`${p.data_pagamento}T12:00:00`)).toLocaleDateString("pt-BR")}`
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: pago ? "default" : atrasada ? "destructive" : "secondary",
										className: pago ? "bg-emerald-600 hover:bg-emerald-700" : atrasada ? "bg-destructive text-destructive-foreground font-bold" : "",
										children: pago ? "pago" : atrasada ? "atrasada" : "pendente"
									})
								})]
							}, p.id);
						})
					})]
				}),
				aluno && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContratoDocumento, {
					alunoId,
					aluno,
					contrato,
					parcelas: parcelas.map((p) => ({
						numero: p.numero,
						valor: Number(p.valor),
						vencimento: p.vencimento,
						status: p.status,
						data_pagamento: p.data_pagamento,
						forma_pagamento: p.forma_pagamento
					}))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openEditAluno,
			onOpenChange: setOpenEditAluno,
			children: aluno && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Dados do Formando" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					id: "form-edit-aluno-page",
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						updateAluno.mutate(new FormData(e.currentTarget));
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "nome_completo",
							children: "Nome completo *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "nome_completo",
							name: "nome_completo",
							defaultValue: aluno.nome_completo,
							required: true,
							maxLength: 120
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "cpf",
									children: "CPF"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "cpf",
									name: "cpf",
									defaultValue: aluno.cpf || "",
									placeholder: "000.000.000-00",
									maxLength: 20
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "whatsapp",
									children: "WhatsApp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "whatsapp",
									name: "whatsapp",
									defaultValue: aluno.whatsapp || "",
									placeholder: "(11) 99999-9999",
									maxLength: 20
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "E-mail"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									name: "email",
									type: "email",
									defaultValue: aluno.email || "",
									placeholder: "aluno@email.com",
									maxLength: 255
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "data_nascimento",
									children: "Data de Nascimento"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "data_nascimento",
									name: "data_nascimento",
									type: "date",
									defaultValue: aluno.data_nascimento || ""
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
									defaultValue: aluno.cidade || "",
									maxLength: 120
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "endereco",
									children: "Endereço Completo"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "endereco",
									name: "endereco",
									defaultValue: aluno.endereco || "",
									maxLength: 200
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => setOpenEditAluno(false),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					form: "form-edit-aluno-page",
					disabled: updateAluno.isPending,
					children: updateAluno.isPending ? "Salvando..." : "Salvar alterações"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: openDeleteAluno,
			onOpenChange: setOpenDeleteAluno,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "text-destructive flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5" }), " Excluir Formando"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Tem certeza que deseja excluir o formando ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: aluno?.nome_completo }),
				"? Esta ação removerá o contrato, histórico de parcelas e login de acesso associados."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deleteAluno.mutate(),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Formando"
			})] })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openEditContrato,
			onOpenChange: setOpenEditContrato,
			children: contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Pacote e Contrato" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "form-edit-contrato",
						className: "space-y-3",
						onSubmit: (e) => {
							e.preventDefault();
							updateContrato.mutate(new FormData(e.currentTarget));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
							name: "pacote",
							label: "Pacote Contratado *",
							defaultValue: contrato.pacote,
							required: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									name: "valor_total",
									label: "Valor total (R$) *",
									type: "number",
									step: "0.01",
									defaultValue: String(contrato.valor_total),
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									name: "desconto",
									label: "Desconto (R$)",
									type: "number",
									step: "0.01",
									defaultValue: String(contrato.desconto ?? 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									name: "valor_entrada",
									label: "Entrada (R$)",
									type: "number",
									step: "0.01",
									defaultValue: String(contrato.valor_entrada ?? 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									name: "num_parcelas",
									label: "Nº de parcelas *",
									type: "number",
									defaultValue: String(contrato.num_parcelas),
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									name: "dia_vencimento",
									label: "Dia de vencimento *",
									type: "number",
									defaultValue: String(contrato.dia_vencimento ?? 10),
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Campo, {
									name: "primeiro_vencimento",
									label: "1º vencimento *",
									type: "date",
									defaultValue: contrato.data_contrato || hoje,
									required: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "forma_pagamento",
										children: "Forma de pagamento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "forma_pagamento",
										name: "forma_pagamento",
										defaultValue: contrato.forma_pagamento,
										className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
										children: FORMAS_PAGAMENTO.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: f.id,
											children: f.label
										}, f.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5 sm:col-span-2 p-3 rounded-lg bg-muted/60 border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "flex items-center gap-2 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											name: "recalcular_parcelas",
											value: "sim",
											defaultChecked: true,
											className: "rounded border-input"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recalcular e recriar quadro de parcelas automaticamente com os novos valores" })]
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setOpenEditContrato(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						form: "form-edit-contrato",
						disabled: updateContrato.isPending,
						children: updateContrato.isPending ? "Salvando..." : "Salvar alterações"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: openDeleteContrato,
			onOpenChange: setOpenDeleteContrato,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "text-destructive flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5" }), " Excluir Contrato & Parcelas"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Tem certeza que deseja excluir o contrato e todas as parcelas deste formando? Esta ação permite que você cadastre um novo pacote do zero." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deleteContrato.mutate(),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Contrato"
			})] })] })
		})
	] });
}
function Resumo({ titulo, valor, destaque }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-muted-foreground",
				children: titulo
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `mt-1 text-lg font-semibold ${destaque ? "text-destructive" : ""}`,
				children: valor
			})]
		})
	});
}
function Info({ label, value }) {
	if (!value) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between py-1 border-b border-border/40 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-muted-foreground",
			children: [label, ":"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-foreground",
			children: value
		})]
	});
}
function Campo({ name, label, type = "text", step, defaultValue, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: name,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: name,
			name,
			type,
			step,
			defaultValue,
			required
		})]
	});
}
//#endregion
export { AlunoDetalhe as component };
