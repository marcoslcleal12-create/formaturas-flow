import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cpfParaEmail, t as apenasDigitos } from "./aluno-login-DxsnAriW.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { _ as saveDemandas, c as Input, f as brl, h as loadDemandas, i as CardContent, m as formatarCpf, n as Badge, o as CardHeader, p as calcularParcelas, r as Card, s as CardTitle, t as AppShell } from "./router-Bk1JJVce.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as FileDown, F as DollarSign, H as CircleAlert, I as CreditCard, J as Calendar, T as KeyRound, V as CircleCheck, b as MapPin, c as Trash2, f as Search, h as Plus, i as User, k as FileText, l as SquarePen } from "../_libs/lucide-react.mjs";
import { a as gerarContratoPdf } from "./contrato-modelo-DarhVMh5.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-g_nJl_ho.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DemandaManager-DJOr9es_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DemandaManager({ tipo, titulo, subtitulo, icon: IconComponent, themeColor }) {
	const [demandas, setDemandas] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("todos");
	const [openCreateModal, setOpenCreateModal] = (0, import_react.useState)(false);
	const [editingDemanda, setEditingDemanda] = (0, import_react.useState)(null);
	const [deletingDemanda, setDeletingDemanda] = (0, import_react.useState)(null);
	const [viewingContratoDemanda, setViewingContratoDemanda] = (0, import_react.useState)(null);
	const [cliente, setCliente] = (0, import_react.useState)("");
	const [cpf, setCpf] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [dataEvento, setDataEvento] = (0, import_react.useState)("");
	const [local, setLocal] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("confirmada");
	const [pacote, setPacote] = (0, import_react.useState)("");
	const [valorTotal, setValorTotal] = (0, import_react.useState)("");
	const [valorEntrada, setValorEntrada] = (0, import_react.useState)("");
	const [desconto, setDesconto] = (0, import_react.useState)("");
	const [numParcelas, setNumParcelas] = (0, import_react.useState)("6");
	const [diaVencimento, setDiaVencimento] = (0, import_react.useState)("10");
	const [primeiroVencimento, setPrimeiroVencimento] = (0, import_react.useState)("");
	const [formaPagamento, setFormaPagamento] = (0, import_react.useState)("pix");
	const [observacoes, setObservacoes] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const all = loadDemandas();
		setDemandas(all.filter((d) => d.tipo === tipo));
	}, [tipo]);
	const persistDemandas = (updatedList) => {
		setDemandas(updatedList);
		const otherTypes = loadDemandas().filter((d) => d.tipo !== tipo);
		saveDemandas([...otherTypes, ...updatedList]);
	};
	const handleOpenCreate = () => {
		setCliente("");
		setCpf("");
		setEmail("");
		setWhatsapp("");
		setDataEvento("");
		setLocal("");
		setStatus("confirmada");
		setPacote(tipo === "casamento" ? "Cobertura Completa Casamento (Foto + Vídeo + Álbum Luxo)" : tipo === "festa-aniversario" ? "Cobertura Aniversário / 15 Anos (Foto + Vídeo + Cabine)" : "Ensaio Fotográfico Professional (2h de sessão + 40 fotos)");
		setValorTotal(tipo === "casamento" ? "12000" : tipo === "festa-aniversario" ? "6500" : "1500");
		setValorEntrada(tipo === "casamento" ? "2000" : tipo === "festa-aniversario" ? "1000" : "300");
		setDesconto("0");
		setNumParcelas("6");
		setDiaVencimento("10");
		setPrimeiroVencimento((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
		setFormaPagamento("pix");
		setObservacoes("");
		setOpenCreateModal(true);
	};
	const handleOpenEdit = (demanda) => {
		setEditingDemanda(demanda);
		setCliente(demanda.cliente);
		setCpf(demanda.cpf);
		setEmail(demanda.email || "");
		setWhatsapp(demanda.whatsapp || "");
		setDataEvento(demanda.dataEvento);
		setLocal(demanda.local);
		setStatus(demanda.status);
		setPacote(demanda.pacote);
		setValorTotal(demanda.valorTotal.toString());
		setValorEntrada(demanda.valorEntrada.toString());
		setDesconto(demanda.desconto.toString());
		setNumParcelas(demanda.numParcelas.toString());
		setDiaVencimento(demanda.diaVencimento.toString());
		setPrimeiroVencimento(demanda.primeiroVencimento || demanda.dataEvento);
		setFormaPagamento(demanda.formaPagamento || "pix");
		setObservacoes(demanda.observacoes || "");
	};
	const handleSaveDemanda = (e) => {
		e.preventDefault();
		const digitsCpf = apenasDigitos(cpf);
		if (!cliente.trim() || !dataEvento || !local.trim()) {
			toast.error("Preencha os campos obrigatórios (*)");
			return;
		}
		if (digitsCpf.length !== 11) {
			toast.error("Informe um CPF válido com 11 dígitos para gerar o acesso do cliente!");
			return;
		}
		const valTotal = parseFloat(valorTotal) || 0;
		const valEntrada = parseFloat(valorEntrada) || 0;
		const valDesc = parseFloat(desconto) || 0;
		const parcelasQtd = parseInt(numParcelas) || 1;
		const diaVenc = parseInt(diaVencimento) || 10;
		const primVenc = primeiroVencimento || dataEvento;
		const parcelas = calcularParcelas(valTotal, valEntrada, valDesc, parcelasQtd, diaVenc, primVenc);
		if (editingDemanda) {
			const updatedList = demandas.map((d) => d.id === editingDemanda.id ? {
				...d,
				cliente,
				cpf: digitsCpf,
				email,
				whatsapp,
				dataEvento,
				local,
				status,
				pacote,
				valorTotal: valTotal,
				valorEntrada: valEntrada,
				desconto: valDesc,
				numParcelas: parcelasQtd,
				diaVencimento: diaVenc,
				primeiroVencimento: primVenc,
				formaPagamento,
				observacoes,
				parcelas: d.numParcelas === parcelasQtd && d.valorTotal === valTotal ? d.parcelas : parcelas
			} : d);
			persistDemandas(updatedList);
			toast.success("Demanda e Contrato atualizados com sucesso!");
			setEditingDemanda(null);
		} else {
			const nova = {
				id: `dem-${tipo.slice(0, 3)}-${Date.now()}`,
				tipo,
				cliente,
				cpf: digitsCpf,
				email,
				whatsapp,
				dataEvento,
				local,
				status,
				pacote,
				valorTotal: valTotal,
				valorEntrada: valEntrada,
				desconto: valDesc,
				numParcelas: parcelasQtd,
				diaVencimento: diaVenc,
				primeiroVencimento: primVenc,
				formaPagamento,
				observacoes,
				loginAtivo: true,
				parcelas,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			persistDemandas([nova, ...demandas]);
			toast.success(`Demanda cadastrada! Login por CPF gerado: ${formatarCpf(digitsCpf)}`, { duration: 6e3 });
			setOpenCreateModal(false);
		}
	};
	const handleConfirmDelete = () => {
		if (!deletingDemanda) return;
		const updated = demandas.filter((d) => d.id !== deletingDemanda.id);
		persistDemandas(updated);
		toast.success("Demanda excluída com sucesso.");
		setDeletingDemanda(null);
	};
	const handleToggleParcelaStatus = (demandaId, numeroParcela) => {
		const updatedList = demandas.map((d) => {
			if (d.id !== demandaId) return d;
			const updatedParcelas = d.parcelas.map((p) => {
				if (p.numero !== numeroParcela) return p;
				const newStatus = p.status === "pago" ? "pendente" : "pago";
				return {
					...p,
					status: newStatus,
					dataPagamento: newStatus === "pago" ? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) : null
				};
			});
			return {
				...d,
				parcelas: updatedParcelas
			};
		});
		persistDemandas(updatedList);
		const itemAtualizado = updatedList.find((d) => d.id === demandaId);
		if (itemAtualizado && viewingContratoDemanda?.id === demandaId) setViewingContratoDemanda(itemAtualizado);
		toast.success(`Status da parcela ${numeroParcela} atualizado!`);
	};
	const handleGeneratePdf = (demanda) => {
		gerarContratoPdf({
			aluno: {
				nome_completo: demanda.cliente,
				cpf: formatarCpf(demanda.cpf),
				endereco: demanda.local,
				cidade: demanda.local.split("-")[1]?.trim() || "São Paulo, SP",
				telefone: demanda.whatsapp || "—",
				email: demanda.email || cpfParaEmail(demanda.cpf)
			},
			contrato: {
				pacote: demanda.pacote,
				valor_total: demanda.valorTotal,
				desconto: demanda.desconto,
				valor_entrada: demanda.valorEntrada,
				dia_vencimento: demanda.diaVencimento,
				data_contrato: demanda.dataEvento,
				forma_pagamento: demanda.formaPagamento,
				autoriza_imagem: true
			},
			parcelas: demanda.parcelas.map((p) => ({
				numero: p.numero,
				vencimento: p.vencimento,
				valor: p.valor,
				status: p.status,
				data_pagamento: p.dataPagamento ?? null,
				forma_pagamento: demanda.formaPagamento ?? null
			})),
			texto: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E EVENTOS

CONTRATANTE: ${demanda.cliente.toUpperCase()}, CPF nº ${formatarCpf(demanda.cpf)}.
EVENTO: ${titulo} — Local: ${demanda.local} — Data: ${demanda.dataEvento}.

CLÁUSULA 1ª — DO OBJETO:
O presente contrato tem por objeto a prestação de serviços de cobertura fotográfica e cinematográfica referente à demanda ${titulo}: "${demanda.pacote}".

CLÁUSULA 2ª — DO VALOR E PARCELAMENTO:
O valor total ajustado é de ${brl(demanda.valorTotal)}, com entrada de ${brl(demanda.valorEntrada)} e saldo parcelado em ${demanda.numParcelas}x com vencimento todo dia ${demanda.diaVencimento}.

CLÁUSULA 3ª — DO ACESSO DO CLIENTE:
O cliente terá acesso exclusivo à plataforma da JM Formaturas utilizando seu CPF (${formatarCpf(demanda.cpf)}) como login e senha de acesso inicial.`
		});
	};
	const filteredDemandas = demandas.filter((d) => {
		const matchText = d.cliente.toLowerCase().includes(search.toLowerCase()) || d.local.toLowerCase().includes(search.toLowerCase()) || d.cpf.includes(search);
		const matchStatus = statusFilter === "todos" || d.status === statusFilter;
		return matchText && matchStatus;
	});
	const valorTotalGeral = demandas.reduce((acc, curr) => acc + curr.valorTotal, 0);
	const totalRecebido = demandas.reduce((acc, curr) => {
		const entradas = curr.valorEntrada;
		const pagas = curr.parcelas.filter((p) => p.status === "pago").reduce((pAcc, pCurr) => pAcc + pCurr.valor, 0);
		return acc + entradas + pagas;
	}, 0);
	const aReceber = Math.max(0, valorTotalGeral - totalRecebido);
	const themeClasses = {
		pink: {
			bgIcon: "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
			badge: "bg-pink-600 hover:bg-pink-700",
			accentText: "text-pink-600 dark:text-pink-400"
		},
		purple: {
			bgIcon: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
			badge: "bg-purple-600 hover:bg-purple-700",
			accentText: "text-purple-600 dark:text-purple-400"
		},
		blue: {
			bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
			badge: "bg-blue-600 hover:bg-blue-700",
			accentText: "text-blue-600 dark:text-blue-400"
		}
	}[themeColor];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex size-10 items-center justify-center rounded-xl ${themeClasses.bgIcon} shadow-sm`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-6" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: ["DEMANDAS — ", titulo]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: subtitulo
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenCreate,
					className: "gap-2 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
						" Nova Demanda (",
						titulo,
						")"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-3 rounded-xl ${themeClasses.bgIcon}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold",
								children: demandas.length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Demandas de ", titulo]
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold",
								children: brl(totalRecebido)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Total Recebido (Entrada + Parcelas)"
							})] })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-3 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "size-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-bold",
								children: brl(aReceber)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Saldo A Receber"
							})] })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Buscar por cliente, CPF ou local do evento...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: statusFilter,
					onValueChange: setStatusFilter,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-[180px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filtrar por Status" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "todos",
							children: "Todos os Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "confirmada",
							children: "Confirmada"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "em_negociacao",
							children: "Em Negociação"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "concluida",
							children: "Concluída"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "cancelada",
							children: "Cancelada"
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [filteredDemandas.map((demanda) => {
					const pagas = demanda.parcelas.filter((p) => p.status === "pago").length;
					const contratadoLiquido = demanda.valorTotal - demanda.desconto;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "hover:shadow-md transition-all flex flex-col justify-between border-border/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "pb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-lg font-semibold flex items-center gap-2",
									children: demanda.cliente
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-1 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 font-mono",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3" }),
											" CPF: ",
											formatarCpf(demanda.cpf)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }), (/* @__PURE__ */ new Date(demanda.dataEvento + "T00:00:00")).toLocaleDateString("pt-BR")]
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: demanda.status === "confirmada" ? themeClasses.badge : demanda.status === "em_negociacao" ? "bg-amber-500 hover:bg-amber-600" : demanda.status === "concluida" ? "bg-slate-600" : "bg-destructive",
									children: demanda.status === "confirmada" ? "Confirmada" : demanda.status === "em_negociacao" ? "Em Negociação" : demanda.status === "concluida" ? "Concluída" : "Cancelada"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-3 text-sm flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-muted-foreground text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: `size-4 shrink-0 ${themeClasses.accentText}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: demanda.local
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-muted/60 p-3 space-y-1.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Pacote: ", demanda.pacote] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-foreground text-sm",
											children: brl(contratadoLiquido)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Entrada: ",
											brl(demanda.valorEntrada),
											" + ",
											demanda.numParcelas,
											"x de ",
											brl(demanda.parcelas[0]?.valor || 0)
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-emerald-600 dark:text-emerald-400",
											children: [
												pagas,
												"/",
												demanda.numParcelas,
												" parcelas pagas"
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-md border border-border/60 bg-background px-3 py-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3.5 text-gold" }),
											"Login CPF: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "font-mono text-foreground",
												children: formatarCpf(demanda.cpf)
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] text-emerald-600 border-emerald-300",
										children: "Login liberado"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2 pt-2 border-t",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => setViewingContratoDemanda(demanda),
											className: "gap-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5" }), " Ver Contrato & Parcelas"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => handleOpenEdit(demanda),
											className: "gap-1 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-3.5" }), " Editar"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => setDeletingDemanda(demanda),
											className: "gap-1 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), " Excluir"]
										})
									]
								})
							]
						})]
					}, demanda.id);
				}), filteredDemandas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-full py-16 text-center text-muted-foreground rounded-2xl border border-dashed p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "mx-auto size-10 opacity-30 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium text-foreground",
							children: [
								"Nenhuma demanda de ",
								titulo,
								" encontrada."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs mt-1",
							children: "Clique em \"Nova Demanda\" para cadastrar um novo evento com CPF e contrato."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: openCreateModal || !!editingDemanda,
				onOpenChange: (v) => {
					if (!v) {
						setOpenCreateModal(false);
						setEditingDemanda(null);
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveDemanda,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: `size-5 ${themeClasses.accentText}` }), editingDemanda ? `EDITAR DEMANDA (${titulo.toUpperCase()})` : `NOVA DEMANDA (${titulo.toUpperCase()})`]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 py-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-semibold border-b pb-1.5 flex items-center gap-2 text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-gold" }), " Dados do Cliente & Acesso (Login CPF)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "cliente",
													children: "Nome Completo do Cliente / Noivos *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "cliente",
													placeholder: "Ex: Mariana & Rodrigo",
													value: cliente,
													onChange: (e) => setCliente(e.target.value),
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "cpf",
														children: "CPF do Cliente (Login & Senha) *"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "cpf",
														placeholder: "000.000.000-00",
														value: cpf,
														onChange: (e) => setCpf(e.target.value),
														maxLength: 14,
														required: true
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground",
														children: "Usado como login e senha inicial de acesso do cliente."
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "whatsapp",
													children: "WhatsApp / Telefone"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "whatsapp",
													placeholder: "(11) 99999-9999",
													value: whatsapp,
													onChange: (e) => setWhatsapp(e.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "email",
													children: "E-mail"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "email",
													type: "email",
													placeholder: "cliente@email.com",
													value: email,
													onChange: (e) => setEmail(e.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "dataEvento",
													children: "Data do Evento *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "dataEvento",
													type: "date",
													value: dataEvento,
													onChange: (e) => setDataEvento(e.target.value),
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "status",
													children: "Status da Demanda"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: status,
													onValueChange: (v) => setStatus(v),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														id: "status",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "confirmada",
															children: "Confirmada"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "em_negociacao",
															children: "Em Negociação"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "concluida",
															children: "Concluída"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "cancelada",
															children: "Cancelada"
														})
													] })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "local",
													children: "Local do Evento *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "local",
													placeholder: "Ex: Buffet Villa Regia - São Paulo, SP",
													value: local,
													onChange: (e) => setLocal(e.target.value),
													required: true
												})]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-semibold border-b pb-1.5 flex items-center gap-2 text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4 text-gold" }), " Contrato & Parcelamento de Pagamentos"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "pacote",
													children: "Pacote / Serviços Contratados *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "pacote",
													placeholder: "Ex: Foto + Vídeo + Cabine de Fotos",
													value: pacote,
													onChange: (e) => setPacote(e.target.value),
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "valorTotal",
													children: "Valor Total do Contrato (R$) *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "valorTotal",
													type: "number",
													placeholder: "10000",
													value: valorTotal,
													onChange: (e) => setValorTotal(e.target.value),
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "valorEntrada",
													children: "Valor de Entrada (R$)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "valorEntrada",
													type: "number",
													placeholder: "2000",
													value: valorEntrada,
													onChange: (e) => setValorEntrada(e.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "desconto",
													children: "Desconto (R$)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "desconto",
													type: "number",
													placeholder: "0",
													value: desconto,
													onChange: (e) => setDesconto(e.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "numParcelas",
													children: "Qtd. de Parcelas *"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: numParcelas,
													onValueChange: setNumParcelas,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														id: "numParcelas",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Array.from({ length: 24 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: n.toString(),
														children: [
															n,
															"x ",
															n === 1 ? "(À vista)" : "parcelas"
														]
													}, n)) })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "diaVencimento",
													children: "Dia de Vencimento Mensal"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: diaVencimento,
													onValueChange: setDiaVencimento,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														id: "diaVencimento",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
														5,
														10,
														15,
														20,
														25,
														28
													].map((dia) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: dia.toString(),
														children: ["Todo dia ", dia]
													}, dia)) })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "primeiroVencimento",
													children: "1º Vencimento de Parcela"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "primeiroVencimento",
													type: "date",
													value: primeiroVencimento,
													onChange: (e) => setPrimeiroVencimento(e.target.value)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "formaPagamento",
													children: "Forma de Pagamento Principal"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: formaPagamento,
													onValueChange: setFormaPagamento,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														id: "formaPagamento",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "pix",
															children: "PIX (Chave / QR Code)"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "boleto",
															children: "Boleto Bancário"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "cartao",
															children: "Cartão de Crédito"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: "transferencia",
															children: "Transferência Bancária"
														})
													] })]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5 sm:col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "observacoes",
													children: "Observações do Contrato"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													id: "observacoes",
													placeholder: "Detalhes adicionais do contrato ou preferências do cliente...",
													value: observacoes,
													onChange: (e) => setObservacoes(e.target.value),
													rows: 2
												})]
											})
										]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									setOpenCreateModal(false);
									setEditingDemanda(null);
								},
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: editingDemanda ? "Salvar Alterações" : "Gerar Contrato & Salvar"
							})] })
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewingContratoDemanda,
				onOpenChange: (v) => {
					if (!v) setViewingContratoDemanda(null);
				},
				children: viewingContratoDemanda && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-gold" }),
									" Contrato & Parcelamento: ",
									viewingContratoDemanda.cliente
								]
							})
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 py-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2 bg-muted/40 p-4 rounded-xl border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Cliente / Noivos"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-base",
												children: viewingContratoDemanda.cliente
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: ["CPF: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "font-mono",
													children: formatarCpf(viewingContratoDemanda.cpf)
												})]
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Evento & Local"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: viewingContratoDemanda.local
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: ["Data: ", (/* @__PURE__ */ new Date(viewingContratoDemanda.dataEvento + "T00:00:00")).toLocaleDateString("pt-BR")]
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2 pt-2 border-t grid grid-cols-3 gap-2 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Valor Total"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-foreground",
													children: brl(viewingContratoDemanda.valorTotal)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Entrada"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-emerald-600",
													children: brl(viewingContratoDemanda.valorEntrada)
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Parcelas"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-bold text-foreground",
													children: [
														viewingContratoDemanda.numParcelas,
														"x de ",
														brl(viewingContratoDemanda.parcelas[0]?.valor || 0)
													]
												})] })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-card p-4 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
												className: "font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4 text-gold" }), " Credenciais de Acesso do Cliente"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-emerald-600",
												children: "Ativo por CPF"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid sm:grid-cols-2 gap-2 text-xs bg-muted/60 p-3 rounded-lg font-mono",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Login (CPF): ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: apenasDigitos(viewingContratoDemanda.cpf) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Senha Inicial: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: apenasDigitos(viewingContratoDemanda.cpf) })] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "O cliente pode entrar na área do formando utilizando seu CPF no login e senha."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-semibold text-sm",
											children: "Parcelamento de Pagamentos"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "Clique no status da parcela para alternar entre Pendente/Pago"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-xl border overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-xs text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
												className: "bg-muted text-muted-foreground border-b uppercase",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Nº"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Vencimento"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Valor"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2",
														children: "Status"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-3 py-2 text-right",
														children: "Ação"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
												className: "divide-y",
												children: viewingContratoDemanda.parcelas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-muted/40 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "px-3 py-2.5 font-medium",
															children: ["Parcela ", p.numero]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-3 py-2.5 font-mono",
															children: (/* @__PURE__ */ new Date(p.vencimento + "T00:00:00")).toLocaleDateString("pt-BR")
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-3 py-2.5 font-bold",
															children: brl(p.valor)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-3 py-2.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																variant: p.status === "pago" ? "default" : p.status === "atrasado" ? "destructive" : "secondary",
																className: p.status === "pago" ? "bg-emerald-600" : "",
																children: p.status === "pago" ? "Pago" : p.status === "atrasado" ? "Atrasado" : "Pendente"
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-3 py-2.5 text-right",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "sm",
																variant: p.status === "pago" ? "outline" : "default",
																onClick: () => handleToggleParcelaStatus(viewingContratoDemanda.id, p.numero),
																className: "h-7 text-[11px] px-2",
																children: p.status === "pago" ? "Desfazer Pago" : "Baixar Pagamento"
															})
														})
													]
												}, p.numero))
											})]
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex justify-between items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => handleGeneratePdf(viewingContratoDemanda),
								className: "gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " Baixar Contrato em PDF"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setViewingContratoDemanda(null),
								children: "Fechar"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!deletingDemanda,
				onOpenChange: (v) => {
					if (!v) setDeletingDemanda(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5" }), " Excluir Demanda"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Tem certeza que deseja excluir a demanda ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingDemanda?.cliente }),
					"? Esta ação não pode ser desfeita e removerá o contrato e parcelamentos."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: handleConfirmDelete,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: "Sim, Excluir"
				})] })] })
			})
		]
	}) });
}
//#endregion
export { DemandaManager as t };
