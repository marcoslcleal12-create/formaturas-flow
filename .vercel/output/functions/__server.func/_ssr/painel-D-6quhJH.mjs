import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as apenasDigitos } from "./aluno-login-Bxk3uUlL.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { F as loadDemandas, N as brl, P as formatarCpf, R as useAuth, S as DialogTrigger, _ as DialogContent, b as DialogHeader, d as Card, f as CardContent, g as Dialog, h as CardTitle, l as AppShell, m as CardHeader, u as Badge, v as DialogDescription, x as DialogTitle } from "./router-DisewPEU.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as Eye, D as Package, K as Copy, R as FileText, U as Download, V as ExternalLink, X as CircleCheck, i as User, it as Camera, tt as Check, ut as Barcode, z as FileDown } from "../_libs/lucide-react.mjs";
import { a as gerarContratoPdf, i as gerarBoletoPdf, n as EMPRESA, t as CLAUSULAS_PADRAO } from "./contrato-modelo-DarhVMh5.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel-D-6quhJH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PagamentoDialog({ parcelaId, numero, valor, vencimento = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), clienteNome = "Cliente", clienteCpf, pacote = "Serviços Fotográficos" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [copiadoBoleto, setCopiadoBoleto] = (0, import_react.useState)(false);
	const linhaDigitavel = `34191.79001 01043.510047 91020.150008 1 ${Math.abs(Math.sin((numero + 1) * 1e3 + valor)).toString().slice(2, 10)}0000${Math.round(valor * 100)}`;
	const copiarLinhaDigitavel = () => {
		navigator.clipboard.writeText(linhaDigitavel);
		setCopiadoBoleto(true);
		toast.success("Linha digitável copiada com sucesso!");
		setTimeout(() => setCopiadoBoleto(false), 2500);
	};
	const handleBaixarBoleto = () => {
		try {
			gerarBoletoPdf({
				clienteNome,
				clienteCpf,
				numeroParcela: numero,
				valor,
				vencimento,
				pacote
			});
			toast.success("Boleto bancário gerado em PDF com sucesso!");
		} catch (e) {
			toast.error("Erro ao gerar boleto em PDF: " + e.message);
		}
	};
	const dataFormatada = (/* @__PURE__ */ new Date(`${vencimento}T12:00:00`)).toLocaleDateString("pt-BR");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				className: "h-8 gap-1.5 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "size-3.5" }), " Pagar"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "text-base flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					numero === 0 ? "Entrada" : `Parcela ${numero}`,
					" · ",
					brl(valor)
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-normal text-muted-foreground",
					children: ["Vencimento: ", dataFormatada]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Boleto bancário de cobrança referente ao contrato." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-muted/40 p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Barcode, { className: "size-4 text-primary" }), " Linha Digitável"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Banco Santander / JM" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg bg-background p-3 font-mono text-xs break-all select-all border shadow-inner",
								children: linhaDigitavel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: copiarLinhaDigitavel,
									className: "text-xs gap-1.5 h-9",
									children: [copiadoBoleto ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copiadoBoleto ? "Copiado!" : "Copiar Linha"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: handleBaixarBoleto,
									className: "text-xs gap-1.5 h-9 bg-primary text-primary-foreground font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Baixar Boleto PDF"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border bg-card p-3 text-xs space-y-1.5 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Beneficiário:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: EMPRESA.nome
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CNPJ:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: EMPRESA.cnpj
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pagador:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: clienteNome
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Valor:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: brl(valor)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[11px] text-muted-foreground space-y-1 bg-muted/20 p-2.5 rounded-lg border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "• Pagável em qualquer agência bancária, internet banking ou casas lotéricas até o vencimento." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "• Após o vencimento, incidirá multa e juros contratuais." })]
					})
				]
			})]
		})]
	});
}
var SELPICS_URL = "https://jm-studio-fotografico.youfocus.com.br/";
function PainelAluno() {
	const { user, isStaff, loading } = useAuth();
	const userDigits = apenasDigitos(user?.email?.split("@")[0] ?? user?.id ?? "");
	const [showDados, setShowDados] = (0, import_react.useState)(false);
	const [showPacote, setShowPacote] = (0, import_react.useState)(false);
	const [showContrato, setShowContrato] = (0, import_react.useState)(false);
	const [showOverdueAlert, setShowOverdueAlert] = (0, import_react.useState)(false);
	const [selectedAlunoId, setSelectedAlunoId] = (0, import_react.useState)(null);
	const { data: alunos } = useQuery({
		queryKey: [
			"meu-cadastro",
			user?.id,
			userDigits
		],
		enabled: !!user,
		queryFn: async () => {
			if (user?.id && user.id.includes("-")) {
				const { data } = await supabase.from("alunos").select("*, turmas(nome, curso, faculdade, semestre)").eq("user_id", user.id);
				if (data && data.length > 0) return data;
			}
			if (userDigits && userDigits.length === 11) {
				const { data } = await supabase.from("alunos").select("*, turmas(nome, curso, faculdade, semestre)").eq("cpf", userDigits);
				if (data && data.length > 0) return data;
			}
			return [];
		}
	});
	const aluno = alunos?.find((a) => a.id === selectedAlunoId) || alunos?.[0];
	(0, import_react.useEffect)(() => {
		if (alunos && alunos.length > 0 && !selectedAlunoId) setSelectedAlunoId(alunos[0].id);
	}, [alunos, selectedAlunoId]);
	const { data: contrato } = useQuery({
		queryKey: ["meu-contrato", aluno?.id],
		enabled: !!aluno?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("contratos").select("*, parcelas(*)").eq("aluno_id", aluno.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const demandaCliente = (() => {
		if (!userDigits) return void 0;
		return loadDemandas().find((d) => apenasDigitos(d.cpf) === userDigits);
	})();
	const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const parcelas = [...contrato?.parcelas ?? []].sort((a, b) => a.numero - b.numero);
	const pago = parcelas.reduce((s, p) => s + Number(p.valor_pago), 0) + Number(contrato?.valor_entrada ?? 0);
	const emAberto = parcelas.filter((p) => p.status !== "pago").reduce((s, p) => s + Number(p.valor), 0);
	const demandaParcelas = demandaCliente?.parcelas ?? [];
	const demandaPago = (demandaCliente?.valorEntrada ?? 0) + demandaParcelas.filter((p) => p.status === "pago").reduce((s, p) => s + p.valor, 0);
	const demandaEmAberto = Math.max(0, (demandaCliente?.valorTotal ?? 0) - (demandaCliente?.desconto ?? 0) - demandaPago);
	const primeiroNome = (aluno?.nome_completo ?? demandaCliente?.cliente ?? user?.email ?? "").split(" ")[0];
	const temBoletosAtrasados = !!(aluno && contrato && parcelas.some((p) => p.status !== "pago" && p.vencimento < hoje) || demandaCliente && demandaParcelas.some((p) => p.status !== "pago" && p.vencimento < hoje));
	(0, import_react.useEffect)(() => {
		if (temBoletosAtrasados) {
			setShowOverdueAlert(true);
			const interval = setInterval(() => {
				setShowOverdueAlert(true);
			}, 12e4);
			return () => clearInterval(interval);
		}
	}, [temBoletosAtrasados]);
	const handleBaixarPdf = () => {
		if (aluno && contrato) {
			gerarContratoPdf({
				aluno: {
					nome_completo: aluno.nome_completo,
					cpf: aluno.cpf,
					endereco: aluno.endereco ?? null,
					cidade: aluno.cidade ?? null,
					telefone: aluno.whatsapp ?? null,
					email: aluno.email ?? null,
					turma_nome: aluno.turmas?.nome ?? null
				},
				contrato: {
					pacote: contrato.pacote,
					valor_total: Number(contrato.valor_total),
					desconto: Number(contrato.desconto ?? 0),
					valor_entrada: Number(contrato.valor_entrada ?? 0),
					dia_vencimento: contrato.dia_vencimento ?? 10,
					data_contrato: contrato.data_contrato ?? hoje,
					forma_pagamento: contrato.forma_pagamento ?? "boleto",
					autoriza_imagem: contrato.autoriza_imagem !== false
				},
				parcelas: parcelas.map((p) => ({
					numero: p.numero,
					valor: Number(p.valor),
					vencimento: p.vencimento,
					status: p.status,
					data_pagamento: p.data_pagamento,
					forma_pagamento: p.forma_pagamento
				})),
				texto: contrato.texto_contrato ?? CLAUSULAS_PADRAO
			});
			toast.success("Download do contrato em PDF iniciado!");
		} else if (demandaCliente) {
			gerarContratoPdf({
				aluno: {
					nome_completo: demandaCliente.cliente,
					cpf: formatarCpf(demandaCliente.cpf),
					endereco: demandaCliente.local,
					cidade: demandaCliente.local.split("-")[1]?.trim() || "São Paulo, SP",
					telefone: demandaCliente.whatsapp || "—",
					email: demandaCliente.email || user?.email || "—"
				},
				contrato: {
					pacote: demandaCliente.pacote,
					valor_total: demandaCliente.valorTotal,
					desconto: demandaCliente.desconto,
					valor_entrada: demandaCliente.valorEntrada,
					dia_vencimento: demandaCliente.diaVencimento,
					data_contrato: demandaCliente.dataEvento,
					forma_pagamento: demandaCliente.formaPagamento,
					autoriza_imagem: true
				},
				parcelas: demandaCliente.parcelas.map((p) => ({
					numero: p.numero,
					vencimento: p.vencimento,
					valor: p.valor,
					status: p.status,
					data_pagamento: p.dataPagamento ?? null,
					forma_pagamento: demandaCliente.formaPagamento ?? null
				})),
				texto: CLAUSULAS_PADRAO
			});
			toast.success("Download do contrato em PDF iniciado!");
		} else toast.error("Contrato não encontrado para download.");
	};
	const tipoDemandaLabel = {
		casamento: "Casamento",
		"festa-aniversario": "Festa de Aniversário",
		ensaio: "Ensaio Fotográfico"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: [
				"Olá, ",
				primeiroNome,
				" 👋"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-muted-foreground",
			children: "Bem-vindo à sua área exclusiva na JM Formaturas & Eventos."
		}),
		isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-4 shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "pt-6 text-sm",
				children: [
					"Você tem acesso de equipe administrativa.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "text-primary underline underline-offset-4",
						children: "Ir para a visão geral"
					})
				]
			})
		}),
		demandaCliente && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-primary" }), " Seleção de fotos"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: SELPICS_URL,
								target: "_blank",
								rel: "noopener noreferrer",
								children: ["Selecionar minhas fotos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "text-sm text-muted-foreground",
						children: "Acesse a plataforma YouFocus para escolher as fotos do seu evento com o mesmo CPF do seu acesso."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Meus Dados"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Nome / Contratante",
								value: demandaCliente.cliente
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "CPF",
								value: formatarCpf(demandaCliente.cpf)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "WhatsApp",
								value: demandaCliente.whatsapp ?? null
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "E-mail",
								value: demandaCliente.email ?? null
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Dados do Evento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: tipoDemandaLabel[demandaCliente.tipo] || "Evento" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Tipo de Evento",
								value: tipoDemandaLabel[demandaCliente.tipo]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Data do Evento",
								value: (/* @__PURE__ */ new Date(demandaCliente.dataEvento + "T00:00:00")).toLocaleDateString("pt-BR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Local",
								value: demandaCliente.local
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
								label: "Status",
								value: demandaCliente.status.toUpperCase()
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Acompanhamento Financeiro & Parcelas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: demandaCliente.pacote
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Valor total",
									value: brl(demandaCliente.valorTotal)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Já pago",
									value: brl(demandaPago)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Em aberto",
									value: brl(demandaEmAberto)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 mt-4",
							children: demandaParcelas.map((p) => {
								const quitada = p.status === "pago";
								const atrasada = !quitada && p.vencimento < hoje;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium",
										children: [
											"Parcela ",
											p.numero,
											"/",
											demandaParcelas.length
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Vencimento: ", (/* @__PURE__ */ new Date(`${p.vencimento}T12:00:00`)).toLocaleDateString("pt-BR")]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-sm",
												children: brl(p.valor)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: quitada ? "default" : atrasada ? "destructive" : "secondary",
												className: quitada ? "bg-emerald-600" : "",
												children: quitada ? "pago" : atrasada ? "atrasada" : "pendente"
											}),
											!quitada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagamentoDialog, {
												parcelaId: `dem-${demandaCliente.id}-${p.numero}`,
												numero: p.numero,
												valor: p.valor,
												vencimento: p.vencimento,
												clienteNome: demandaCliente.cliente,
												clienteCpf: demandaCliente.cpf,
												pacote: demandaCliente.pacote
											})
										]
									})]
								}, p.numero);
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card sm:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "flex flex-row flex-wrap items-center justify-between gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 text-primary" }), " Contrato"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: ["Documento contratual referente a ", demandaCliente.pacote]
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-wrap gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								children: "Visualizar Contrato"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "max-w-2xl max-h-[85vh] flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Contrato" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
										children: "Termos e Cláusulas Contratuais"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text text-foreground/90 shadow-inner",
										children: CLAUSULAS_PADRAO
									})]
								})
							})]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleBaixarPdf,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 mr-1.5" }), " Baixar em PDF"]
						})]
					})]
				})
			]
		}),
		aluno && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				alunos && alunos.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-sm border-primary/20 bg-primary/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm",
							children: "Você possui múltiplos vínculos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Selecione a turma que deseja visualizar no painel:"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedAlunoId || "",
							onValueChange: (val) => setSelectedAlunoId(val),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-full sm:w-[300px] h-9 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione a turma" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: alunos.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: a.id,
								className: "text-xs",
								children: [
									a.turmas?.nome,
									" (",
									a.turmas?.curso,
									")"
								]
							}, a.id)) })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card h-full flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center gap-2 p-4 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-primary shrink-0" }), "SELEÇÃO DE FOTOS"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "secondary",
									size: "sm",
									className: "h-7 text-xs px-2.5 rounded-md ml-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: SELPICS_URL,
										target: "_blank",
										rel: "noopener noreferrer",
										children: ["Selecionar minhas fotos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5 ml-1" })]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-4 pt-0 text-xs text-muted-foreground border-t border-border/40 mt-1 pt-2.5 flex-1",
								children: "Escolha as fotos da sua formatura na plataforma YouFocus usando o mesmo CPF do seu acesso."
							})]
						}),
						aluno.fotos_liberadas && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card h-full flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "p-4 pb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-primary shrink-0" }), "MINHAS FOTOS SELECIONADAS"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-4 pt-0 border-t border-border/40 mt-1 pt-2.5 flex-1 flex flex-col justify-center",
								children: (() => {
									if (aluno.vencimento_fotos_selecionadas && /* @__PURE__ */ new Date() > /* @__PURE__ */ new Date(aluno.vencimento_fotos_selecionadas + "T23:59:59")) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-destructive text-justify leading-relaxed",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-2 font-medium",
												children: "Verificamos que o link de acesso às suas fotos já expirou, pois ultrapassou o prazo de armazenamento estabelecido pela empresa."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mb-2",
												children: "Durante esse período, as fotos permaneceram armazenadas em nosso sistema, o que gerou custos de manutenção e backup dos arquivos. Como o prazo estipulado já foi ultrapassado, o acesso às fotos não está mais disponível pelo link anterior."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Caso queira recuperar o acesso às suas fotos, pedimos que entre em contato conosco para verificarmos a disponibilidade dos arquivos e realizarmos uma nova negociação referente ao período adicional de armazenamento e recuperação." })
										]
									});
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										className: "w-full h-8 text-xs",
										disabled: !aluno.link_fotos_selecionadas,
										children: aluno.link_fotos_selecionadas ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: aluno.link_fotos_selecionadas,
											target: "_blank",
											rel: "noopener noreferrer",
											children: ["Acessar Fotos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5 ml-1.5" })]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pointer-events-none opacity-50",
											children: "Acessar Fotos"
										})
									});
								})()
							})]
						}),
						aluno.album_liberado && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card h-full flex flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "p-4 pb-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-primary shrink-0" }), "APROVAÇÃO DE ÁLBUM"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-4 pt-0 border-t border-border/40 mt-1 pt-2.5 flex-1 flex flex-col justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									className: "w-full h-8 text-xs",
									disabled: !aluno.link_aprovacao_album,
									children: aluno.link_aprovacao_album ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: aluno.link_aprovacao_album,
										target: "_blank",
										rel: "noopener noreferrer",
										children: ["Acessar Álbum ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3.5 ml-1.5" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "pointer-events-none opacity-50",
										children: "Acessar Álbum"
									})
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 grid-cols-1 sm:grid-cols-3 items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center gap-2 p-4 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-gold shrink-0" }), "Meus Dados Cadastrais"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: !showDados ? "default" : "secondary",
									size: "sm",
									className: "h-7 text-xs px-2.5 rounded-md",
									onClick: () => setShowDados(!showDados),
									children: showDados ? "Ocultar" : "Visualizar"
								})]
							}), showDados && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-0 space-y-1.5 text-xs border-t border-border/40 mt-1 pt-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Nome Completo",
										value: aluno.nome_completo
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "CPF (Login)",
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
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center gap-2 p-4 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4 text-gold shrink-0" }), "Pacote Escolhido"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: !showPacote ? "default" : "secondary",
									size: "sm",
									className: "h-7 text-xs px-2.5 rounded-md",
									onClick: () => setShowPacote(!showPacote),
									children: showPacote ? "Ocultar" : "Visualizar"
								})]
							}), showPacote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-4 pt-0 space-y-1.5 text-xs border-t border-border/40 mt-1 pt-2.5",
								children: contrato ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Pacote",
										value: contrato.pacote
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Valor Total",
										value: brl(Number(contrato.valor_total))
									}),
									Number(contrato.desconto) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Desconto",
										value: brl(Number(contrato.desconto))
									}),
									Number(contrato.valor_entrada) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Entrada",
										value: brl(Number(contrato.valor_entrada))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Condição",
										value: `${contrato.num_parcelas}x no ${contrato.forma_pagamento || "boleto"}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Vencimento dos Boletos",
										value: `Todo dia ${contrato.dia_vencimento || 10}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Uso de Imagem",
										value: contrato.autoriza_imagem !== false ? "Sim, autorizado para divulgação" : "Não autorizado"
									}),
									aluno?.turmas?.semestre && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
										label: "Semestre",
										value: aluno.turmas.semestre
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-xs py-2",
									children: "Seu pacote ainda está sendo definido pela administração."
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "flex flex-row items-center gap-2 p-4 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-sm font-semibold flex items-center gap-1.5 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-gold shrink-0" }), "Contrato"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: !showContrato ? "default" : "secondary",
									size: "sm",
									className: "h-7 text-xs px-2.5 rounded-md",
									onClick: () => setShowContrato(!showContrato),
									children: showContrato ? "Ocultar" : "Visualizar"
								})]
							}), showContrato && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-4 pt-0 space-y-2 text-xs border-t border-border/40 mt-1 pt-2.5",
								children: contrato ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground text-xs",
									children: ["Documento oficial referente a ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: contrato.pacote
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "h-7 text-xs px-2.5 gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), " Visualizar Contrato"]
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
										className: "max-w-2xl max-h-[85vh] flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Contrato" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 overflow-y-auto space-y-4 pr-1 text-sm mt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-border bg-muted/40 p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-medium text-muted-foreground",
														children: "PACOTE CONTRATADO"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-semibold mt-0.5",
														children: contrato.pacote
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-muted-foreground mt-1",
														children: [
															"Total: ",
															brl(Number(contrato.valor_total)),
															Number(contrato.desconto) > 0 && ` (Desconto: ${brl(Number(contrato.desconto))})`
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
													children: "Termos e Cláusulas Contratuais"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl border border-border bg-card p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text text-foreground/90 shadow-inner",
													children: contrato.texto_contrato || CLAUSULAS_PADRAO
												})]
											})]
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-7 text-xs px-2.5 gap-1",
										onClick: handleBaixarPdf,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-3.5" }), " Baixar em PDF"]
									})]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground text-xs py-2",
									children: "O modelo do seu contrato ainda está sendo preparado pela equipe da JM Formaturas."
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Acompanhamento Financeiro (Boletos)"
						}), contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: contrato.pacote
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 text-sm",
						children: [!contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Seu contrato ainda não foi lançado pela equipe da JM Formaturas."
						}), contrato && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Valor total",
									value: brl(Number(contrato.valor_total))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Já pago",
									value: brl(pago)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
									label: "Em aberto",
									value: brl(emAberto)
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: parcelas.map((p) => {
								const quitada = p.status === "pago";
								const atrasada = !quitada && p.vencimento < hoje;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium",
										children: [
											"Parcela ",
											p.numero,
											"/",
											parcelas.length
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Vencimento: ", (/* @__PURE__ */ new Date(`${p.vencimento}T12:00:00`)).toLocaleDateString("pt-BR")]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-sm",
												children: brl(Number(p.valor))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: quitada ? "default" : atrasada ? "destructive" : "secondary",
												className: quitada ? "bg-emerald-600" : "",
												children: quitada ? "pago" : atrasada ? "atrasada" : "pendente"
											}),
											!quitada && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PagamentoDialog, {
												parcelaId: p.id,
												numero: p.numero,
												valor: Number(p.valor) - Number(p.valor_pago),
												vencimento: p.vencimento,
												clienteNome: aluno.nome_completo,
												clienteCpf: aluno.cpf,
												pacote: contrato.pacote
											})
										]
									})]
								}, p.id);
							})
						})] })]
					})]
				})
			]
		}),
		!loading && !aluno && !demandaCliente && !isStaff && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "pt-6 text-sm text-muted-foreground",
				children: "Seu login ainda não está vinculado a um cadastro de formando ou cliente. Entre em contato com a equipe da JM Formaturas para liberar o acesso."
			})
		}),
		showOverdueAlert && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-destructive/30 bg-destructive/95 text-destructive-foreground p-4 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-5 duration-300",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-semibold text-sm flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚠️" }), " Atenção: Parcelas Atrasadas"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs opacity-90 leading-normal",
						children: "Identificamos que você possui parcelas com o boleto vencido. Regularize seu pagamento para evitar suspensão dos serviços."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowOverdueAlert(false),
					className: "text-destructive-foreground/70 hover:text-destructive-foreground hover:bg-white/10 rounded p-1 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "size-4",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 2,
							d: "M6 18L18 6M6 6l12 12"
						})
					})
				})]
			})
		})
	] });
}
function Info({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "flex justify-between gap-4 border-b border-border/60 py-1.5 last:border-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-right font-medium",
			children: value || "—"
		})]
	});
}
//#endregion
export { PainelAluno as component };
