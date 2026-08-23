import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { A as TabsList, C as Input, F as loadDemandas, L as saveDemandas, N as brl, O as Tabs, P as formatarCpf, S as DialogTrigger, _ as DialogContent, b as DialogHeader, d as Card, f as CardContent, g as Dialog, h as CardTitle, j as TabsTrigger, k as TabsContent, l as AppShell, m as CardHeader, p as CardDescription, u as Badge, w as Label, x as DialogTitle, y as DialogFooter } from "./router-DisewPEU.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Plus, F as GraduationCap, P as Heart, T as PartyPopper, X as CircleCheck, Z as CircleAlert, at as Calendar, d as TrendingDown, g as Search, it as Camera, n as Wallet, q as Clock, u as TrendingUp, v as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/financeiro-Mh8DAB8Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var dataBR = (iso) => {
	if (!iso) return "—";
	return (/* @__PURE__ */ new Date(`${iso}T12:00:00`)).toLocaleDateString("pt-BR");
};
var MESES = [
	{
		value: "01",
		label: "01 - Janeiro"
	},
	{
		value: "02",
		label: "02 - Fevereiro"
	},
	{
		value: "03",
		label: "03 - Março"
	},
	{
		value: "04",
		label: "04 - Abril"
	},
	{
		value: "05",
		label: "05 - Maio"
	},
	{
		value: "06",
		label: "06 - Junho"
	},
	{
		value: "07",
		label: "07 - Julho"
	},
	{
		value: "08",
		label: "08 - Agosto"
	},
	{
		value: "09",
		label: "09 - Setembro"
	},
	{
		value: "10",
		label: "10 - Outubro"
	},
	{
		value: "11",
		label: "11 - Novembro"
	},
	{
		value: "12",
		label: "12 - Dezembro"
	}
];
function FinanceiroPage() {
	const queryClient = useQueryClient();
	const [openNovaDespesa, setOpenNovaDespesa] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filtroGrupo, setFiltroGrupo] = (0, import_react.useState)("todos");
	const [filtroMes, setFiltroMes] = (0, import_react.useState)("todos");
	const [filtroAno, setFiltroAno] = (0, import_react.useState)("todos");
	const [filtroStatus, setFiltroStatus] = (0, import_react.useState)("todos");
	const [demandas, setDemandas] = (0, import_react.useState)([]);
	const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	(0, import_react.useEffect)(() => {
		setDemandas(loadDemandas());
	}, []);
	const { data: parcelasData, isLoading } = useQuery({
		queryKey: ["financeiro-parcelas"],
		queryFn: async () => {
			const { data, error } = await supabase.from("parcelas").select("*, contratos(id, pacote, forma_pagamento, alunos(id, nome_completo, whatsapp, cpf, turmas(id, nome)))").order("vencimento");
			if (error) throw error;
			return data;
		}
	});
	const { data: despesasData } = useQuery({
		queryKey: ["despesas"],
		queryFn: async () => {
			const { data, error } = await supabase.from("despesas").select("*").order("vencimento");
			if (error) throw error;
			return data;
		}
	});
	const parcelasTurmas = parcelasData ?? [];
	const despesas = despesasData ?? [];
	const listaUnificada = (0, import_react.useMemo)(() => {
		const list = [];
		parcelasTurmas.forEach((p) => {
			const isPago = p.status === "pago";
			const isAtrasado = !isPago && p.vencimento < hoje;
			list.push({
				id: `turma-parc-${p.id}`,
				origem: "turma",
				clienteNome: p.contratos?.alunos?.nome_completo ?? "Formando",
				clienteContato: p.contratos?.alunos?.whatsapp ?? p.contratos?.alunos?.cpf ?? null,
				tituloEvento: p.contratos?.alunos?.turmas?.nome ?? "Turma",
				pacote: p.contratos?.pacote ?? "Pacote Formatura",
				numeroParcela: p.numero,
				valor: Number(p.valor),
				valorPago: Number(p.valor_pago),
				vencimento: p.vencimento,
				dataPagamento: p.data_pagamento ?? null,
				status: isPago ? "pago" : isAtrasado ? "atrasado" : "pendente",
				linkUrl: p.contratos?.alunos?.id ? `/alunos/${p.contratos.alunos.id}` : "/turmas"
			});
		});
		demandas.forEach((d) => {
			const linkMap = {
				casamento: "/demandas/casamento",
				"festa-aniversario": "/demandas/festa-aniversario",
				ensaio: "/demandas/ensaio"
			};
			if (d.valorEntrada > 0) list.push({
				id: `dem-ent-${d.id}`,
				origem: d.tipo,
				demandaId: d.id,
				clienteNome: d.cliente,
				clienteContato: d.whatsapp ?? formatarCpf(d.cpf),
				tituloEvento: `${d.tipo.toUpperCase()} · ${d.local}`,
				pacote: d.pacote,
				numeroParcela: 0,
				valor: d.valorEntrada,
				valorPago: d.valorEntrada,
				vencimento: d.dataEvento,
				dataPagamento: d.dataEvento,
				status: "pago",
				linkUrl: linkMap[d.tipo]
			});
			d.parcelas.forEach((p) => {
				const isPago = p.status === "pago";
				const isAtrasado = !isPago && p.vencimento < hoje;
				list.push({
					id: `dem-parc-${d.id}-${p.numero}`,
					origem: d.tipo,
					demandaId: d.id,
					clienteNome: d.cliente,
					clienteContato: d.whatsapp ?? formatarCpf(d.cpf),
					tituloEvento: `${d.tipo.toUpperCase()} · ${d.local}`,
					pacote: d.pacote,
					numeroParcela: p.numero,
					valor: p.valor,
					valorPago: isPago ? p.valor : 0,
					vencimento: p.vencimento,
					dataPagamento: p.dataPagamento ?? null,
					status: isPago ? "pago" : isAtrasado ? "atrasado" : "pendente",
					linkUrl: linkMap[d.tipo]
				});
			});
		});
		return list;
	}, [
		parcelasTurmas,
		demandas,
		hoje
	]);
	const anosDisponiveis = (0, import_react.useMemo)(() => {
		const anos = /* @__PURE__ */ new Set();
		listaUnificada.forEach((p) => {
			if (p.vencimento) {
				const ano = p.vencimento.slice(0, 4);
				if (ano) anos.add(ano);
			}
		});
		if (anos.size === 0) [
			"2025",
			"2026",
			"2027",
			"2028"
		].forEach((a) => anos.add(a));
		return Array.from(anos).sort();
	}, [listaUnificada]);
	const entradasPagas = listaUnificada.filter((p) => p.status === "pago");
	const totalEntradas = entradasPagas.reduce((s, p) => s + p.valorPago, 0);
	const totalFaltaReceber = listaUnificada.filter((p) => p.status !== "pago").reduce((s, p) => s + (p.valor - p.valorPago), 0);
	const atrasadasTotal = listaUnificada.filter((p) => p.status === "atrasado");
	const totalInadimplencia = atrasadasTotal.reduce((s, p) => s + (p.valor - p.valorPago), 0);
	const totalSaidas = despesas.filter((d) => d.status === "pago").reduce((s, d) => s + Number(d.valor), 0);
	const saldoLiquido = totalEntradas - totalSaidas;
	const saidasAtrasadas = despesas.filter((d) => d.status !== "pago" && d.vencimento < hoje);
	const parcelasFiltradas = (0, import_react.useMemo)(() => {
		return listaUnificada.filter((p) => {
			const matchText = p.clienteNome.toLowerCase().includes(search.toLowerCase()) || p.pacote.toLowerCase().includes(search.toLowerCase()) || p.tituloEvento.toLowerCase().includes(search.toLowerCase());
			const matchGrupo = filtroGrupo === "todos" || p.origem === filtroGrupo;
			const [ano, mes] = p.vencimento ? p.vencimento.split("-") : ["", ""];
			const matchMes = filtroMes === "todos" || mes === filtroMes;
			const matchAno = filtroAno === "todos" || ano === filtroAno;
			const matchStatus = filtroStatus === "todos" || p.status === filtroStatus;
			return matchText && matchGrupo && matchMes && matchAno && matchStatus;
		});
	}, [
		listaUnificada,
		search,
		filtroGrupo,
		filtroMes,
		filtroAno,
		filtroStatus
	]);
	const temFiltroAtivo = search.trim() !== "" || filtroGrupo !== "todos" || filtroMes !== "todos" || filtroAno !== "todos" || filtroStatus !== "todos";
	const totalFiltradoValor = parcelasFiltradas.reduce((s, p) => s + p.valor, 0);
	const totalFiltradoRecebido = parcelasFiltradas.filter((p) => p.status === "pago").reduce((s, p) => s + p.valorPago, 0);
	const totalFiltradoPendente = totalFiltradoValor - totalFiltradoRecebido;
	const limparFiltros = () => {
		setSearch("");
		setFiltroGrupo("todos");
		setFiltroMes("todos");
		setFiltroAno("todos");
		setFiltroStatus("todos");
	};
	const criarDespesa = useMutation({
		mutationFn: async (form) => {
			const valor = Number(String(form.get("valor") ?? "0").replace(",", ".")) || 0;
			if (valor <= 0) throw new Error("Informe um valor válido.");
			const { error } = await supabase.from("despesas").insert({
				descricao: String(form.get("descricao") ?? "").trim(),
				categoria: String(form.get("categoria") ?? "geral").trim() || "geral",
				valor,
				vencimento: String(form.get("vencimento") ?? hoje),
				status: "pendente"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Despesa / Saída registrada com sucesso!");
			setOpenNovaDespesa(false);
			queryClient.invalidateQueries({ queryKey: ["despesas"] });
		},
		onError: (error) => toast.error(error.message)
	});
	const baixarDespesa = useMutation({
		mutationFn: async ({ id, pago }) => {
			const { error } = await supabase.from("despesas").update(pago ? {
				status: "pendente",
				data_pagamento: null
			} : {
				status: "pago",
				data_pagamento: hoje
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["despesas"] }),
		onError: (error) => toast.error(error.message)
	});
	const handleToggleParcelaStatus = async (item) => {
		if (item.origem === "turma") {
			const realId = item.id.replace("turma-parc-", "");
			const isPago = item.status === "pago";
			const { error } = await supabase.from("parcelas").update(isPago ? {
				status: "pendente",
				valor_pago: 0,
				data_pagamento: null
			} : {
				status: "pago",
				valor_pago: item.valor,
				data_pagamento: hoje
			}).eq("id", realId);
			if (error) {
				toast.error("Erro ao atualizar parcela: " + error.message);
				return;
			}
			toast.success("Status da parcela atualizado!");
			queryClient.invalidateQueries({ queryKey: ["financeiro-parcelas"] });
		} else if (item.demandaId) {
			const updated = loadDemandas().map((d) => {
				if (d.id !== item.demandaId) return d;
				const newParcelas = d.parcelas.map((p) => {
					if (p.numero !== item.numeroParcela) return p;
					const newSt = p.status === "pago" ? "pendente" : "pago";
					return {
						...p,
						status: newSt,
						dataPagamento: newSt === "pago" ? hoje : null
					};
				});
				return {
					...d,
					parcelas: newParcelas
				};
			});
			saveDemandas(updated);
			setDemandas(updated);
			toast.success("Status da parcela atualizado!");
		}
	};
	const getOrigemBadge = (origem) => {
		switch (origem) {
			case "turma": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "gap-1 bg-primary/10 text-primary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-3" }), " Turma"]
			});
			case "casamento": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "gap-1 bg-pink-100 text-pink-700 dark:bg-pink-950/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3" }), " Casamento"]
			});
			case "festa-aniversario": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "gap-1 bg-purple-100 text-purple-700 dark:bg-purple-950/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "size-3" }), " Aniversário"]
			});
			case "ensaio": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "gap-1 bg-blue-100 text-blue-700 dark:bg-blue-950/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3" }), " Ensaio"]
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Painel Financeiro Consolidado"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Gestão de entradas, saídas, parcelas futuras e inadimplência de Turmas e Demandas."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: openNovaDespesa,
					onOpenChange: setOpenNovaDespesa,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Registrar Saída / Despesa"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar Nova Saída" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							id: "form-despesa",
							className: "space-y-3",
							onSubmit: (e) => {
								e.preventDefault();
								criarDespesa.mutate(new FormData(e.currentTarget));
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "descricao",
										children: "Descrição da Despesa *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "descricao",
										name: "descricao",
										placeholder: "Ex: Impressão de Álbuns / Cenografia",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "valor",
											children: "Valor (R$) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "valor",
											name: "valor",
											type: "number",
											step: "0.01",
											placeholder: "1500.00",
											required: true
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "vencimento",
											children: "Data de Vencimento *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "vencimento",
											name: "vencimento",
											type: "date",
											defaultValue: hoje,
											required: true
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "categoria",
										children: "Categoria"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "categoria",
										name: "categoria",
										defaultValue: "laboratorio",
										className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "laboratorio",
												children: "Laboratório / Impressão"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "equipe",
												children: "Equipe / Fotógrafos / Freelancers"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "locacao",
												children: "Locação / Estúdio / Cenários"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "equipamento",
												children: "Equipamentos e Manutenção"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "marketing",
												children: "Marketing e Comercial"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "geral",
												children: "Despesas Administrativas Gerais"
											})
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setOpenNovaDespesa(false),
							children: "Cancelar"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							form: "form-despesa",
							disabled: criarDespesa.isPending,
							children: criarDespesa.isPending ? "Salvando..." : "Salvar Saída"
						})] })
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						titulo: "Total Entradas",
						subtitulo: "Já recebido",
						valor: brl(totalEntradas),
						icon: TrendingUp,
						color: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						titulo: "Total Saídas",
						subtitulo: "Despesas pagas",
						valor: brl(totalSaidas),
						icon: TrendingDown,
						color: "rose"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						titulo: "Saldo em Caixa",
						subtitulo: "Entradas - Saídas",
						valor: brl(saldoLiquido),
						icon: Wallet,
						color: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						titulo: "Falta Receber",
						subtitulo: "Saldo a faturar",
						valor: brl(totalFaltaReceber),
						icon: Clock,
						color: "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						titulo: "Em Atraso",
						subtitulo: "Inadimplência total",
						valor: brl(totalInadimplencia),
						icon: CircleAlert,
						color: "destructive",
						destaque: totalInadimplencia > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "todos",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid grid-cols-2 sm:flex w-full sm:w-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "todos",
									children: [
										"Todas as Parcelas (",
										listaUnificada.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "atrasados",
									className: "text-destructive font-semibold",
									children: [
										"Atrasados (",
										atrasadasTotal.length + saidasAtrasadas.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "entradas",
									children: [
										"Entradas Quitadas (",
										entradasPagas.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "saidas",
									children: [
										"Saídas & Despesas (",
										despesas.length,
										")"
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "todos",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-4 shadow-sm space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative lg:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Buscar por cliente, formando, pacote ou evento...",
											value: search,
											onChange: (e) => setSearch(e.target.value),
											className: "pl-9 h-10 text-xs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: filtroGrupo,
										onValueChange: setFiltroGrupo,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Grupo de Demanda" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "todos",
												children: "Todos os Grupos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "turma",
												children: "🎓 Turmas"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "casamento",
												children: "💍 Casamentos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "festa-aniversario",
												children: "🎉 Aniversários"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "ensaio",
												children: "📸 Ensaios"
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: filtroMes,
										onValueChange: setFiltroMes,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Mês de Vencimento" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "todos",
											children: "Todos os Meses"
										}), MESES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: m.value,
											children: m.label
										}, m.value))] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: filtroAno,
										onValueChange: setFiltroAno,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-10 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Ano de Vencimento" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "todos",
											children: "Todos os Anos"
										}), anosDisponiveis.map((ano) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: ano,
											children: ["Ano ", ano]
										}, ano))] })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3 pt-2 border-t text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-medium",
										children: "Status:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: filtroStatus === "todos" ? "secondary" : "ghost",
												size: "sm",
												onClick: () => setFiltroStatus("todos"),
												className: "h-7 text-xs px-2.5",
												children: "Todos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: filtroStatus === "pendente" ? "secondary" : "ghost",
												size: "sm",
												onClick: () => setFiltroStatus("pendente"),
												className: "h-7 text-xs px-2.5",
												children: "Pendentes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: filtroStatus === "pago" ? "secondary" : "ghost",
												size: "sm",
												onClick: () => setFiltroStatus("pago"),
												className: "h-7 text-xs px-2.5 text-emerald-600 dark:text-emerald-400",
												children: "Pagos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: filtroStatus === "atrasado" ? "secondary" : "ghost",
												size: "sm",
												onClick: () => setFiltroStatus("atrasado"),
												className: "h-7 text-xs px-2.5 text-destructive",
												children: "Atrasados"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"Exibindo ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: parcelasFiltradas.length }),
											" parcelas · Total: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: brl(totalFiltradoValor) })
										]
									}), temFiltroAtivo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: limparFiltros,
										className: "h-7 text-xs gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3" }), " Limpar Filtros"]
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "pb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Quadro Unificado de Cobranças e Parcelas (",
										parcelasFiltradas.length,
										")"
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 text-xs font-normal text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-600 font-medium",
											children: ["Pago: ", brl(totalFiltradoRecebido)]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-amber-600 font-medium",
											children: ["Pendente: ", brl(totalFiltradoPendente)]
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2",
								children: [parcelasFiltradas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "py-12 text-center text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mx-auto size-8 opacity-30 mb-2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-foreground",
											children: "Nenhuma parcela encontrada para os filtros aplicados"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs mt-1",
											children: "Tente ajustar o mês, ano, grupo ou termo de busca."
										})
									]
								}), parcelasFiltradas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 p-3 hover:bg-muted/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-start gap-3 min-w-[240px] flex-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-sm",
													children: p.clienteNome
												}), getOrigemBadge(p.origem)]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: [
													p.tituloEvento,
													" · ",
													p.pacote,
													" · ",
													p.numeroParcela === 0 ? "Entrada" : `Parcela ${p.numeroParcela}`
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													"Vencimento: ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: dataBR(p.vencimento) }),
													p.dataPagamento && ` · Pago em ${dataBR(p.dataPagamento)}`
												]
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-foreground",
												children: brl(p.valor)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: p.status === "pago" ? "default" : p.status === "atrasado" ? "destructive" : "secondary",
												className: p.status === "pago" ? "bg-emerald-600" : "",
												children: p.status === "pago" ? "Pago" : p.status === "atrasado" ? "Atrasado" : "Pendente"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: p.status === "pago" ? "outline" : "default",
											className: "h-8 text-xs",
											onClick: () => handleToggleParcelaStatus(p),
											children: p.status === "pago" ? "Desfazer" : "Baixar Pago"
										})]
									})]
								}, p.id))]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "atrasados",
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card border-destructive/30 bg-destructive/5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base flex items-center gap-2 text-destructive",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5" }),
										" Parcelas e Boletos em Atraso (",
										atrasadasTotal.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: ["Total acumulado em inadimplência: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: brl(totalInadimplencia) })] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2",
								children: [atrasadasTotal.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground py-6 text-center",
									children: "Nenhuma parcela em atraso no momento! 🎉"
								}), atrasadasTotal.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-background p-3.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-sm text-foreground",
												children: p.clienteNome
											}), getOrigemBadge(p.origem)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												p.tituloEvento,
												" · ",
												p.pacote,
												" · ",
												p.numeroParcela === 0 ? "Entrada" : `Parcela ${p.numeroParcela}`
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-destructive font-medium mt-1 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Venceu em: ", dataBR(p.vencimento)] }), p.clienteContato && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· Contato: ", p.clienteContato] })]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-base font-bold text-destructive",
											children: brl(p.valor)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white",
											onClick: () => handleToggleParcelaStatus(p),
											children: "Baixar Pagamento"
										})]
									})]
								}, p.id))]
							})]
						}), saidasAtrasadas.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card border-destructive/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base text-destructive",
									children: [
										"Saídas / Contas a Pagar em Atraso (",
										saidasAtrasadas.length,
										")"
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "space-y-2",
								children: saidasAtrasadas.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-xl border border-destructive/20 bg-background",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-sm",
										children: d.descricao
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											d.categoria,
											" · Venceu em ",
											dataBR(d.vencimento)
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-destructive text-sm",
											children: brl(Number(d.valor))
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => baixarDespesa.mutate({
												id: d.id,
												pago: false
											}),
											children: "Dar Baixa"
										})]
									})]
								}, d.id))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "entradas",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "pb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5" }),
										" Entradas e Pagamentos Confirmados (",
										entradasPagas.length,
										")"
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2",
								children: [entradasPagas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground py-8 text-center",
									children: "Nenhum pagamento registrado ainda."
								}), entradasPagas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 p-3 hover:bg-muted/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-sm",
												children: p.clienteNome
											}), getOrigemBadge(p.origem)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												p.tituloEvento,
												" · ",
												p.pacote,
												" · ",
												p.numeroParcela === 0 ? "Entrada" : `Parcela ${p.numeroParcela}`
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-emerald-600 font-medium",
											children: ["Pago em: ", p.dataPagamento ? dataBR(p.dataPagamento) : dataBR(p.vencimento)]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground text-sm",
											children: brl(p.valorPago)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-8 text-xs",
											onClick: () => handleToggleParcelaStatus(p),
											children: "Desfazer Pago"
										})]
									})]
								}, p.id))]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "saidas",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center justify-between pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base",
									children: [
										"Controle de Saídas e Despesas (",
										despesas.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => setOpenNovaDespesa(true),
									className: "gap-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Nova Saída"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2",
								children: [despesas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground py-8 text-center",
									children: "Nenhuma saída registrada."
								}), despesas.map((d) => {
									const pago = d.status === "pago";
									const atrasada = !pago && d.vencimento < hoje;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 p-3 hover:bg-muted/40 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-sm",
											children: d.descricao
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												"Categoria: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "uppercase font-mono",
													children: d.categoria
												}),
												" · Vencimento: ",
												dataBR(d.vencimento),
												d.data_pagamento && ` · Pago em ${dataBR(d.data_pagamento)}`
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-bold text-foreground",
													children: brl(Number(d.valor))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: pago ? "default" : atrasada ? "destructive" : "secondary",
													children: pago ? "pago" : atrasada ? "atrasada" : "pendente"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: pago ? "outline" : "default",
												className: "h-8 text-xs",
												onClick: () => baixarDespesa.mutate({
													id: d.id,
													pago
												}),
												children: pago ? "Desfazer" : "Dar Baixa"
											})]
										})]
									}, d.id);
								})]
							})]
						})
					})
				]
			})
		]
	}) });
}
function KpiCard({ titulo, subtitulo, valor, icon: Icon, color, destaque }) {
	const colorStyles = {
		emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
		primary: "bg-primary/10 text-primary",
		amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
		destructive: "bg-destructive/10 text-destructive"
	}[color];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: `shadow-sm border-border/80 ${destaque ? "border-destructive/40 bg-destructive/5" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: titulo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex size-7 items-center justify-center rounded-lg ${colorStyles}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `mt-2 text-xl font-bold ${destaque ? "text-destructive" : "text-foreground"}`,
					children: valor
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] text-muted-foreground mt-0.5",
					children: subtitulo
				})
			]
		})
	});
}
//#endregion
export { FinanceiroPage as component };
