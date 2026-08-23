import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cpfParaEmail, t as apenasDigitos } from "./aluno-login-Bxk3uUlL.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { C as Input, F as loadDemandas, L as saveDemandas, N as brl, P as formatarCpf, _ as DialogContent, a as AlertDialogDescription, b as DialogHeader, c as AlertDialogTitle, d as Card, f as CardContent, g as Dialog, h as CardTitle, i as AlertDialogContent, l as AppShell, m as CardHeader, n as AlertDialogAction, o as AlertDialogFooter, p as CardDescription, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as Badge, v as DialogDescription, w as Label, x as DialogTitle, y as DialogFooter } from "./router-DisewPEU.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as Link2, B as Eye, C as Plus, D as Package, H as EllipsisVertical, K as Copy, N as KeyRound, O as MapPin, R as FileText, V as ExternalLink, X as CircleCheck, Y as CirclePlus, at as Calendar, f as Trash2, g as Search, i as User, m as Sparkles, p as SquarePen, pt as ArrowLeft, tt as Check, w as Phone, z as FileDown } from "../_libs/lucide-react.mjs";
import { a as gerarContratoPdf } from "./contrato-modelo-DarhVMh5.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { a as obterPacotesPadraoPorTipo, i as extrairPacotesTurma, o as serializarPacotesTurma, r as calcularParcelas } from "./turma-pacotes-B66fxwtb.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { i as DropdownMenuTrigger, n as DropdownMenuContent, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-BkskzzYW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DemandaEventManager-ZrI-Lx2v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DemandaEventManager({ tipo, titulo, subtitulo, icon: IconComponent, themeColor }) {
	const queryClient = useQueryClient();
	const [selectedEventoId, setSelectedEventoId] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("todos");
	const [openCreateEvento, setOpenCreateEvento] = (0, import_react.useState)(false);
	const [editingEvento, setEditingEvento] = (0, import_react.useState)(null);
	const [deletingEvento, setDeletingEvento] = (0, import_react.useState)(null);
	const [openLinkAdesao, setOpenLinkAdesao] = (0, import_react.useState)(false);
	const [openGerenciarPacotes, setOpenGerenciarPacotes] = (0, import_react.useState)(false);
	const [openAddContratante, setOpenAddContratante] = (0, import_react.useState)(false);
	const [editingContratante, setEditingContratante] = (0, import_react.useState)(null);
	const [deletingContratante, setDeletingContratante] = (0, import_react.useState)(null);
	const [viewingContratoItem, setViewingContratoItem] = (0, import_react.useState)(null);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(false);
	const [formNome, setFormNome] = (0, import_react.useState)("");
	const [formCpf, setFormCpf] = (0, import_react.useState)("");
	const [formWhatsapp, setFormWhatsapp] = (0, import_react.useState)("");
	const [formEmail, setFormEmail] = (0, import_react.useState)("");
	const [formPacoteId, setFormPacoteId] = (0, import_react.useState)("");
	const [formValorTotal, setFormValorTotal] = (0, import_react.useState)("");
	const [formValorEntrada, setFormValorEntrada] = (0, import_react.useState)("0");
	const [formDesconto, setFormDesconto] = (0, import_react.useState)("0");
	const [formNumParcelas, setFormNumParcelas] = (0, import_react.useState)("6");
	const [formDiaVencimento, setFormDiaVencimento] = (0, import_react.useState)("10");
	const [pacotes, setPacotes] = (0, import_react.useState)(() => obterPacotesPadraoPorTipo(tipo));
	const [novoNomePacote, setNovoNomePacote] = (0, import_react.useState)("");
	const [novoMaterialPacote, setNovoMaterialPacote] = (0, import_react.useState)("");
	const [novoInvestimentoPacote, setNovoInvestimentoPacote] = (0, import_react.useState)("");
	const themeClasses = {
		pink: {
			bgIcon: "bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400",
			badge: "bg-pink-600 hover:bg-pink-700 text-white",
			accentText: "text-pink-600 dark:text-pink-400",
			borderAccent: "border-pink-500/40",
			buttonBg: "bg-pink-600 hover:bg-pink-700 text-white"
		},
		purple: {
			bgIcon: "bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
			badge: "bg-purple-600 hover:bg-purple-700 text-white",
			accentText: "text-purple-600 dark:text-purple-400",
			borderAccent: "border-purple-500/40",
			buttonBg: "bg-purple-600 hover:bg-purple-700 text-white"
		},
		blue: {
			bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
			badge: "bg-blue-600 hover:bg-blue-700 text-white",
			accentText: "text-blue-600 dark:text-blue-400",
			borderAccent: "border-blue-500/40",
			buttonBg: "bg-blue-600 hover:bg-blue-700 text-white"
		}
	}[themeColor];
	const { data: eventos = [], isLoading: isLoadingEventos } = useQuery({
		queryKey: ["eventos-demanda", tipo],
		queryFn: async () => {
			const { data, error } = await supabase.from("turmas").select("*, alunos(count)").order("created_at", { ascending: false });
			if (error) throw error;
			const matchType = (t) => {
				const c = (t.curso || "").toLowerCase();
				const obs = (t.observacoes || "").toLowerCase();
				if (tipo === "casamento") return c.includes("casamento") || obs.includes("casamento");
				if (tipo === "festa-aniversario") return c.includes("aniversario") || c.includes("aniversário") || c.includes("festa") || obs.includes("festa") || obs.includes("aniversario");
				if (tipo === "ensaio") return c.includes("ensaio") || obs.includes("ensaio");
				return false;
			};
			return data.filter(matchType);
		}
	});
	const { data: eventoDetalhe, isLoading: isLoadingDetalhe } = useQuery({
		queryKey: ["evento-detalhe", selectedEventoId],
		enabled: !!selectedEventoId,
		queryFn: async () => {
			if (!selectedEventoId) return null;
			const [eventoRes, contratantesRes, contratosRes] = await Promise.all([
				supabase.from("turmas").select("*").eq("id", selectedEventoId).maybeSingle(),
				supabase.from("alunos").select("*").eq("turma_id", selectedEventoId).neq("status", "inativo").order("nome_completo"),
				supabase.from("contratos").select("*, parcelas(*)").eq("turma_id", selectedEventoId)
			]);
			if (eventoRes.error) throw eventoRes.error;
			if (contratantesRes.error) throw contratantesRes.error;
			if (contratosRes.error) throw contratosRes.error;
			return {
				evento: eventoRes.data,
				contratantes: contratantesRes.data,
				contratos: contratosRes.data || []
			};
		}
	});
	(0, import_react.useEffect)(() => {
		if (eventoDetalhe?.evento) setPacotes(extrairPacotesTurma(eventoDetalhe.evento.observacoes, tipo));
	}, [eventoDetalhe?.evento, tipo]);
	const createEvento = useMutation({
		mutationFn: async (formData) => {
			const nome = String(formData.get("nome") || "").trim();
			const local = String(formData.get("faculdade") || "").trim();
			const cidade = String(formData.get("cidade") || "").trim();
			const dataEvento = String(formData.get("semestre") || "").trim();
			if (!nome || !local) throw new Error("Preencha o nome do evento e o local.");
			const observacoesObj = {
				tipo,
				pacotes: obterPacotesPadraoPorTipo(tipo),
				local,
				dataEvento
			};
			const { data, error } = await supabase.from("turmas").insert({
				nome,
				curso: tipo === "casamento" ? "Casamento" : tipo === "festa-aniversario" ? "Festa de Aniversário" : "Ensaio Fotográfico",
				faculdade: local,
				cidade: cidade || null,
				semestre: dataEvento || null,
				status: "ativa",
				observacoes: JSON.stringify(observacoesObj)
			}).select().single();
			if (error) throw error;
			return data;
		},
		onSuccess: (data) => {
			toast.success(`Evento "${data.nome}" cadastrado com sucesso!`);
			setOpenCreateEvento(false);
			queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
			if (data?.id) setSelectedEventoId(data.id);
		},
		onError: (err) => toast.error(err.message || "Erro ao criar evento.")
	});
	const updateEvento = useMutation({
		mutationFn: async (formData) => {
			if (!editingEvento) return;
			const nome = String(formData.get("nome") || "").trim();
			const local = String(formData.get("faculdade") || "").trim();
			const cidade = String(formData.get("cidade") || "").trim();
			const dataEvento = String(formData.get("semestre") || "").trim();
			const status = String(formData.get("status") || "ativa");
			const { error } = await supabase.from("turmas").update({
				nome,
				faculdade: local,
				cidade: cidade || null,
				semestre: dataEvento || null,
				status
			}).eq("id", editingEvento.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Dados do evento atualizados!");
			setEditingEvento(null);
			queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
			queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
		},
		onError: (err) => toast.error(err.message || "Erro ao atualizar evento.")
	});
	const deleteEvento = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("turmas").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Evento excluído com sucesso.");
			setDeletingEvento(null);
			if (selectedEventoId === deletingEvento?.id) setSelectedEventoId(null);
			queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
		},
		onError: (err) => toast.error(err.message || "Erro ao excluir evento.")
	});
	const salvarPacotes = useMutation({
		mutationFn: async (novosPacotes) => {
			if (!selectedEventoId) return;
			const serialized = serializarPacotesTurma(eventoDetalhe?.evento?.observacoes, novosPacotes);
			const { error } = await supabase.from("turmas").update({ observacoes: serialized }).eq("id", selectedEventoId);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Pacotes do evento atualizados!");
			setOpenGerenciarPacotes(false);
			queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
		},
		onError: (err) => toast.error(err.message || "Erro ao salvar pacotes.")
	});
	const adicionarContratanteManual = useMutation({
		mutationFn: async () => {
			if (!selectedEventoId) throw new Error("Evento não selecionado.");
			const digitsCpf = apenasDigitos(formCpf);
			if (!formNome.trim() || digitsCpf.length !== 11) throw new Error("Informe o nome completo e um CPF válido (11 dígitos).");
			const pctSelecionado = pacotes.find((p) => p.id === formPacoteId) || pacotes[0];
			const valTotal = parseFloat(formValorTotal) || pctSelecionado?.investimento || 0;
			const valEntrada = parseFloat(formValorEntrada) || 0;
			const valDesc = parseFloat(formDesconto) || 0;
			const qtdParcelas = parseInt(formNumParcelas) || 1;
			const diaVenc = parseInt(formDiaVencimento) || 10;
			const { data: novoAluno, error: errAluno } = await supabase.from("alunos").insert({
				turma_id: selectedEventoId,
				nome_completo: formNome.trim(),
				cpf: digitsCpf,
				whatsapp: formWhatsapp.trim() || null,
				email: formEmail.trim() || cpfParaEmail(digitsCpf),
				status: "ativo"
			}).select().single();
			if (errAluno) throw errAluno;
			const parcelasCalculadas = calcularParcelas(Math.max(0, valTotal - valDesc - valEntrada), qtdParcelas, diaVenc);
			const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const { data: novoContrato, error: errContrato } = await supabase.from("contratos").insert({
				turma_id: selectedEventoId,
				aluno_id: novoAluno.id,
				pacote: pctSelecionado?.nome || "Pacote Personalizado",
				valor_total: valTotal,
				valor_entrada: valEntrada,
				desconto: valDesc,
				num_parcelas: qtdParcelas,
				dia_vencimento: diaVenc,
				forma_pagamento: "pix",
				autoriza_imagem: true,
				status: "ativo",
				data_contrato: hoje
			}).select().single();
			if (errContrato) throw errContrato;
			if (parcelasCalculadas.length > 0) {
				const parcelasInsert = parcelasCalculadas.map((p) => ({
					contrato_id: novoContrato.id,
					numero: p.numero,
					valor: p.valor,
					valor_pago: 0,
					vencimento: p.vencimento,
					status: "pendente",
					forma_pagamento: "pix"
				}));
				await supabase.from("parcelas").insert(parcelasInsert);
			}
			const allLocal = loadDemandas();
			const novaDemandaStore = {
				id: novoAluno.id,
				tipo,
				cliente: formNome.trim(),
				cpf: digitsCpf,
				email: formEmail.trim() || cpfParaEmail(digitsCpf),
				whatsapp: formWhatsapp.trim(),
				dataEvento: eventoDetalhe?.evento?.semestre || hoje,
				local: eventoDetalhe?.evento?.faculdade || "Local a definir",
				status: "confirmada",
				pacote: pctSelecionado?.nome || "Pacote",
				valorTotal: valTotal,
				valorEntrada: valEntrada,
				desconto: valDesc,
				numParcelas: qtdParcelas,
				diaVencimento: diaVenc,
				primeiroVencimento: parcelasCalculadas[0]?.vencimento || hoje,
				formaPagamento: "pix",
				loginAtivo: true,
				parcelas: parcelasCalculadas.map((p) => ({
					numero: p.numero,
					vencimento: p.vencimento,
					valor: p.valor,
					status: "pendente"
				})),
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			saveDemandas([novaDemandaStore, ...allLocal]);
			return novoAluno;
		},
		onSuccess: (aluno) => {
			toast.success(`Contratante cadastrado com sucesso! Login liberado com CPF: ${formatarCpf(aluno.cpf || "")}`);
			setOpenAddContratante(false);
			setFormNome("");
			setFormCpf("");
			setFormWhatsapp("");
			setFormEmail("");
			queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
			queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
		},
		onError: (err) => toast.error(err.message || "Erro ao cadastrar contratante.")
	});
	const toggleParcelaStatus = useMutation({
		mutationFn: async ({ parcelaId, statusAtual }) => {
			const novoStatus = statusAtual === "pago" ? "pendente" : "pago";
			const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
			const updateData = {
				status: novoStatus,
				data_pagamento: novoStatus === "pago" ? hoje : null
			};
			if (novoStatus !== "pago") updateData.valor_pago = 0;
			const { error } = await supabase.from("parcelas").update(updateData).eq("id", parcelaId);
			if (error) throw error;
			return novoStatus;
		},
		onSuccess: (novoStatus) => {
			toast.success(`Parcela marcada como ${novoStatus === "pago" ? "PAGA" : "PENDENTE"}!`);
			queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
		},
		onError: (err) => toast.error(err.message || "Erro ao atualizar parcela.")
	});
	const deleteContratante = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("alunos").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Contratante excluído.");
			setDeletingContratante(null);
			queryClient.invalidateQueries({ queryKey: ["evento-detalhe", selectedEventoId] });
			queryClient.invalidateQueries({ queryKey: ["eventos-demanda", tipo] });
		},
		onError: (err) => toast.error(err.message || "Erro ao excluir contratante.")
	});
	const togglePacote = (id) => {
		setPacotes(pacotes.map((p) => p.id === id ? {
			...p,
			ativo: !p.ativo
		} : p));
	};
	const adicionarNovoPacote = () => {
		if (!novoNomePacote.trim() || !novoInvestimentoPacote) {
			toast.error("Informe o nome e o valor de investimento do pacote.");
			return;
		}
		const val = parseFloat(novoInvestimentoPacote.replace(/\./g, "").replace(",", "."));
		if (isNaN(val) || val <= 0) {
			toast.error("Informe um valor válido.");
			return;
		}
		const novo = {
			id: `custom-${Date.now()}`,
			nome: novoNomePacote.trim(),
			material: novoMaterialPacote.trim() || "Material conforme descrição.",
			investimento: val,
			ativo: true
		};
		setPacotes([...pacotes, novo]);
		setNovoNomePacote("");
		setNovoMaterialPacote("");
		setNovoInvestimentoPacote("");
		toast.success("Pacote adicionado. Clique em 'Salvar Configurações' para confirmar.");
	};
	const removerPacote = (id) => {
		setPacotes(pacotes.filter((p) => p.id !== id));
	};
	const linkAdesao = typeof window !== "undefined" ? `${window.location.origin}/adesao/${selectedEventoId}` : `/adesao/${selectedEventoId}`;
	const copiarLinkAdesao = () => {
		if (typeof navigator !== "undefined") {
			navigator.clipboard.writeText(linkAdesao);
			setCopiedLink(true);
			toast.success("Link de adesão copiado para a área de transferência!");
			setTimeout(() => setCopiedLink(false), 2500);
		}
	};
	const filteredEventos = eventos.filter((e) => {
		const matchQuery = e.nome.toLowerCase().includes(searchQuery.toLowerCase()) || (e.faculdade || "").toLowerCase().includes(searchQuery.toLowerCase()) || (e.cidade || "").toLowerCase().includes(searchQuery.toLowerCase());
		const matchStatus = statusFilter === "todos" || e.status === statusFilter;
		return matchQuery && matchStatus;
	});
	const contratosEvento = eventoDetalhe?.contratos || [];
	const todasParcelas = contratosEvento.flatMap((c) => c.parcelas || []);
	const hojeIso = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const valorContratado = contratosEvento.reduce((s, c) => s + Number(c.valor_total || 0) - Number(c.desconto || 0), 0);
	const totalRecebido = contratosEvento.reduce((s, c) => s + Number(c.valor_entrada || 0), 0) + todasParcelas.filter((p) => p.status === "pago").reduce((s, p) => s + Number(p.valor || p.valor_pago || 0), 0);
	const saldoAReceber = Math.max(0, valorContratado - totalRecebido);
	const totalEmAtraso = todasParcelas.filter((p) => p.status !== "pago" && p.vencimento < hojeIso).reduce((s, p) => s + Number(p.valor || 0), 0);
	const percentualQuitado = valorContratado > 0 ? Math.round(totalRecebido / valorContratado * 100) : 0;
	const pacotesAtivosCount = pacotes.filter((p) => p.ativo !== false).length;
	const imprimirContrato = (contratante, contrato) => {
		gerarContratoPdf({
			aluno: {
				nome_completo: contratante.nome_completo,
				cpf: formatarCpf(contratante.cpf || ""),
				endereco: eventoDetalhe?.evento?.faculdade || "—",
				cidade: eventoDetalhe?.evento?.cidade || "São Paulo, SP",
				telefone: contratante.whatsapp || "—",
				email: contratante.email || cpfParaEmail(contratante.cpf || "")
			},
			contrato: {
				pacote: contrato?.pacote || "Pacote de Cobertura",
				valor_total: Number(contrato?.valor_total || 0),
				desconto: Number(contrato?.desconto || 0),
				valor_entrada: Number(contrato?.valor_entrada || 0),
				dia_vencimento: contrato?.dia_vencimento || 10,
				data_contrato: contrato?.data_contrato || hojeIso,
				forma_pagamento: contrato?.forma_pagamento || "pix",
				autoriza_imagem: true
			},
			parcelas: (contrato?.parcelas || []).map((p) => ({
				numero: p.numero,
				vencimento: p.vencimento,
				valor: p.valor,
				status: p.status,
				data_pagamento: p.data_pagamento || null,
				forma_pagamento: contrato?.forma_pagamento || "pix"
			})),
			texto: contrato?.texto_contrato || `${titulo.toUpperCase()} — CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E CINEMATOGRÁFICOS

CONTRATANTE: ${contratante.nome_completo.toUpperCase()}, CPF nº ${formatarCpf(contratante.cpf || "")}.
EVENTO: ${eventoDetalhe?.evento?.nome || titulo} — Local: ${eventoDetalhe?.evento?.faculdade || "Local do evento"} — Data: ${eventoDetalhe?.evento?.semestre || "Data agendada"}.

CLÁUSULA 1ª — DO OBJETO:
O presente contrato tem por objeto a prestação de serviços fotográficos e cinematográficos: "${contrato?.pacote}".

CLÁUSULA 2ª — DO INVESTIMENTO E PARCELAMENTO:
O valor total ajustado é de ${brl(Number(contrato?.valor_total || 0))}, com entrada de ${brl(Number(contrato?.valor_entrada || 0))} e saldo em ${contrato?.num_parcelas || 1} parcelas com vencimento mensal todo dia ${contrato?.dia_vencimento || 10}.

CLÁUSULA 3ª — DO ACESSO EXCLUSIVO:
O contratante possui acesso liberado ao sistema JM Formaturas & Eventos com login e senha inicial por CPF (${formatarCpf(contratante.cpf || "")}).`
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		!selectedEventoId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						onClick: () => setOpenCreateEvento(true),
						className: `gap-2 shadow-sm ${themeClasses.buttonBg}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
							" Novo Evento (",
							titulo,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: `Pesquisar evento de ${titulo.toLowerCase()}, local ou cidade...`,
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "pl-9 bg-background"
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
								value: "ativa",
								children: "Ativo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "concluida",
								children: "Concluído"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "cancelada",
								children: "Cancelado"
							})
						] })]
					})]
				}),
				isLoadingEventos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando eventos..."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: filteredEventos.map((evento) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "relative group hover:shadow-elevated transition-all border-border/80 cursor-pointer",
						onClick: () => setSelectedEventoId(evento.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: `size-4.5 ${themeClasses.accentText}` }), evento.nome]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									onClick: (e) => e.stopPropagation(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: evento.status === "ativa" ? "default" : "secondary",
										children: evento.status === "ativa" ? "Ativo" : evento.status
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
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => setSelectedEventoId(evento.id),
												className: "gap-2 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), " Gerenciar Evento"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => setEditingEvento(evento),
												className: "gap-2 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Evento"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => setDeletingEvento(evento),
												className: "gap-2 cursor-pointer text-destructive focus:text-destructive",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Evento"]
											})
										]
									})] })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: `size-3.5 ${themeClasses.accentText}` }),
										evento.faculdade || "Local a definir",
										" ",
										evento.cidade ? `· ${evento.cidade}` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs text-muted-foreground pt-3 border-t",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-3.5 text-primary" }),
											" ",
											evento.alunos?.[0]?.count ?? 0,
											" contratante(s)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-muted-foreground" }), evento.semestre || "Data a definir"]
									})]
								})]
							})]
						})
					}, evento.id))
				}),
				!isLoadingEventos && filteredEventos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed p-12 text-center text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "mx-auto size-12 opacity-30 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-semibold text-foreground text-base",
							children: [
								"Nenhum evento de ",
								titulo,
								" cadastrado ainda"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm mt-1",
							children: "Clique em \"Novo Evento\" acima para cadastrar e gerar links de adesão e contratos."
						})
					]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: () => setSelectedEventoId(null),
					className: "mb-2 -ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }),
						" Voltar para Lista de ",
						titulo
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 flex-wrap",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `flex size-10 items-center justify-center rounded-xl ${themeClasses.bgIcon} shadow-sm`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: "size-6" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold tracking-tight text-foreground",
									children: eventoDetalhe?.evento?.nome ?? "Evento"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: eventoDetalhe?.evento?.status === "ativa" ? "default" : "secondary",
									children: eventoDetalhe?.evento?.status === "ativa" ? "Ativo" : eventoDetalhe?.evento?.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "gap-1.5 border-primary/40 text-primary font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-3.5" }),
										pacotesAtivosCount,
										" ",
										pacotesAtivosCount === 1 ? "pacote ativo" : "pacotes ativos"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
										" ",
										eventoDetalhe?.evento?.faculdade || "Local não informado"
									]
								}),
								eventoDetalhe?.evento?.cidade && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["· ", eventoDetalhe?.evento?.cidade] }),
								eventoDetalhe?.evento?.semestre && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [
										"· ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }),
										" ",
										eventoDetalhe?.evento?.semestre
									]
								})
							]
						})] })]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
								open: openLinkAdesao,
								onOpenChange: setOpenLinkAdesao,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => setOpenLinkAdesao(true),
									className: `gap-1.5 font-semibold shadow-sm ${themeClasses.buttonBg}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "size-4" }), " Link de Adesão"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
									className: "max-w-lg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
											className: "flex items-center gap-2 text-lg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-primary" }), " Link de Adesão do Evento"]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-4 py-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-sm text-muted-foreground",
													children: [
														"Compartilhe este link com os clientes/noivos/aniversariantes de",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: eventoDetalhe?.evento?.nome }),
														". Ao acessar, eles escolherão o pacote, preencherão os dados, assinarão o contrato eletronicamente e terão login automático por CPF!"
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
														onClick: copiarLinkAdesao,
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
															const msg = encodeURIComponent(`Olá! Acesse o link oficial para realizar a sua adesão e escolher o pacote de ${titulo.toLowerCase()} (${eventoDetalhe?.evento?.nome}): ${linkAdesao}`);
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
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-5 text-primary" }),
												" Pacotes de ",
												titulo,
												" do Evento"
											]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-6 py-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Ative ou desative os pacotes disponíveis para adesão deste evento, ou cadastre novos pacotes personalizados."
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
																placeholder: "Nome do pacote (ex: PACOTE VIP - ÁLBUM + DRONE)",
																value: novoNomePacote,
																onChange: (e) => setNovoNomePacote(e.target.value)
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																placeholder: "Material/Descrição (ex: Cobertura 6h, 1 Álbum 30x30, Drone 4K)",
																value: novoMaterialPacote,
																onChange: (e) => setNovoMaterialPacote(e.target.value)
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																	placeholder: "Valor de investimento (ex: 5.500,00)",
																	value: novoInvestimentoPacote,
																	onChange: (e) => setNovoInvestimentoPacote(e.target.value)
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
								onClick: () => setOpenAddContratante(true),
								className: "gap-1.5 border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 text-emerald-600" }), " + Novo Contratante"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditingEvento(eventoDetalhe?.evento || null),
								className: "gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" }), " Editar Evento"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setDeletingEvento(eventoDetalhe?.evento || null),
								className: "gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Evento"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-primary" }),
								" Contratantes / Clientes do Evento (",
								eventoDetalhe?.contratantes?.length || 0,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs mt-1",
							children: "Clientes cadastrados via link de adesão online ou inseridos manualmente pela administração."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => setOpenAddContratante(true),
							className: "gap-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Adicionar Contratante"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [eventoDetalhe?.contratantes?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-12 text-center text-muted-foreground text-sm rounded-xl border border-dashed p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mx-auto size-10 opacity-30 mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground",
									children: "Nenhum contratante cadastrado neste evento ainda."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs mt-1",
									children: "Envie o link de adesão para os clientes ou clique em \"+ Novo Contratante\" acima para cadastrar."
								})
							]
						}), eventoDetalhe?.contratantes?.map((contratante) => {
							const contrato = eventoDetalhe.contratos.find((c) => c.aluno_id === contratante.id);
							const parcelas = contrato?.parcelas || [];
							const parcelasPagas = parcelas.filter((p) => p.status === "pago").length;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 hover:bg-muted/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-[220px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-semibold text-foreground flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-primary" }),
											" ",
											contratante.nome_completo
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-3 flex-wrap",
										children: [
											contratante.cpf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono",
												children: ["CPF: ", formatarCpf(contratante.cpf)]
											}),
											contratante.whatsapp && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["WhatsApp: ", contratante.whatsapp] }),
											contrato?.pacote && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-foreground/80",
												children: ["· ", contrato.pacote]
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right mr-2 hidden sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground",
												children: brl(Number(contrato?.valor_total || 0) - Number(contrato?.desconto || 0))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground",
												children: [
													parcelasPagas,
													"/",
													parcelas.length,
													" parcelas pagas"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[11px] text-emerald-600 border-emerald-300",
											children: "Login liberado (CPF)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => setViewingContratoItem({
												contratante,
												contrato
											}),
											className: "h-8 text-xs gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-3.5 text-primary" }), " Contrato & Parcelas"]
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
												onClick: () => imprimirContrato(contratante, contrato),
												className: "gap-2 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4 text-primary" }), " Gerar PDF do Contrato"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
												onClick: () => setDeletingContratante(contratante),
												className: "gap-2 cursor-pointer text-destructive focus:text-destructive",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Excluir Contratante"]
											})]
										})] })
									]
								})]
							}, contratante.id);
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base",
							children: [
								"Estatísticas Financeiras do Evento (",
								contratosEvento.length,
								" contrato",
								contratosEvento.length === 1 ? "" : "s",
								")"
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border px-4 py-3 bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Valor Contratado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-lg font-bold text-foreground",
										children: brl(valorContratado)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border px-4 py-3 bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Já Recebido"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400",
										children: brl(totalRecebido)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border px-4 py-3 bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Falta Receber"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-lg font-bold text-foreground",
										children: brl(saldoAReceber)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border px-4 py-3 bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-muted-foreground",
										children: "Em Atraso"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `mt-1 text-lg font-bold ${totalEmAtraso > 0 ? "text-destructive" : "text-muted-foreground"}`,
										children: brl(totalEmAtraso)
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary transition-all duration-500",
								style: { width: `${Math.min(percentualQuitado, 100)}%` }
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								percentualQuitado,
								"% do valor contratado arrecadado ·",
								" ",
								todasParcelas.filter((p) => p.status === "pago").length,
								"/",
								todasParcelas.length,
								" parcelas quitadas"
							]
						})] })]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openCreateEvento,
			onOpenChange: setOpenCreateEvento,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconComponent, { className: `size-5 ${themeClasses.accentText}` }),
							"Cadastrar Novo Evento (",
							titulo,
							")"
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "form-novo-evento",
						className: "space-y-3 py-2",
						onSubmit: (e) => {
							e.preventDefault();
							createEvento.mutate(new FormData(e.currentTarget));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nome",
								children: "Nome do Evento / Cliente *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nome",
								name: "nome",
								placeholder: tipo === "casamento" ? "Ex: Casamento Mariana & Rodrigo" : tipo === "festa-aniversario" ? "Ex: 15 Anos Sofia Martins" : "Ex: Ensaio Pré-Wedding Gabriela & Lucas",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "faculdade",
										children: "Local / Espaço do Evento *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "faculdade",
										name: "faculdade",
										placeholder: "Ex: Buffet Villa Regia",
										required: true
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
										placeholder: "Ex: São Paulo - SP"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "semestre",
										children: "Data do Evento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "semestre",
										name: "semestre",
										type: "date"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setOpenCreateEvento(false),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						form: "form-novo-evento",
						disabled: createEvento.isPending,
						className: themeClasses.buttonBg,
						children: createEvento.isPending ? "Salvando..." : "Salvar e Abrir Evento"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!editingEvento,
			onOpenChange: (v) => !v && setEditingEvento(null),
			children: editingEvento && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Editar Dados do Evento" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						id: "form-edit-evento",
						className: "space-y-3 py-2",
						onSubmit: (e) => {
							e.preventDefault();
							updateEvento.mutate(new FormData(e.currentTarget));
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "edit_nome",
								children: "Nome do Evento *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "edit_nome",
								name: "nome",
								defaultValue: editingEvento.nome,
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit_faculdade",
										children: "Local / Espaço *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit_faculdade",
										name: "faculdade",
										defaultValue: editingEvento.faculdade,
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit_cidade",
										children: "Cidade"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit_cidade",
										name: "cidade",
										defaultValue: editingEvento.cidade || ""
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit_semestre",
										children: "Data do Evento"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "edit_semestre",
										name: "semestre",
										type: "date",
										defaultValue: editingEvento.semestre || ""
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "edit_status",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "edit_status",
										name: "status",
										defaultValue: editingEvento.status,
										className: "h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ativa",
												children: "Ativo"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "concluida",
												children: "Concluído"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "cancelada",
												children: "Cancelado"
											})
										]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => setEditingEvento(null),
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						form: "form-edit-evento",
						disabled: updateEvento.isPending,
						children: updateEvento.isPending ? "Salvando..." : "Salvar alterações"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!deletingEvento,
			onOpenChange: (v) => !v && setDeletingEvento(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-destructive",
				children: "Excluir Evento"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Tem certeza que deseja excluir o evento ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingEvento?.nome }),
				"? Esta ação removerá todos os contratantes, contratos e parcelas associados."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deletingEvento && deleteEvento.mutate(deletingEvento.id),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Evento"
			})] })] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: openAddContratante,
			onOpenChange: setOpenAddContratante,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-2xl max-h-[90vh] overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5 text-primary" }), " Cadastrar Novo Contratante / Cliente"]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						adicionarContratanteManual.mutate();
					},
					className: "space-y-4 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs uppercase font-bold tracking-wider text-muted-foreground border-b pb-1",
								children: "1. Dados do Contratante & Login por CPF"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_nome",
											children: "Nome Completo do Contratante *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_nome",
											placeholder: "Ex: Mariana & Rodrigo",
											value: formNome,
											onChange: (e) => setFormNome(e.target.value),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_cpf",
											children: "CPF (Login e Senha de Acesso) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_cpf",
											placeholder: "000.000.000-00",
											value: formCpf,
											onChange: (e) => setFormCpf(e.target.value),
											maxLength: 14,
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_whats",
											children: "WhatsApp / Telefone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_whats",
											placeholder: "(11) 99999-9999",
											value: formWhatsapp,
											onChange: (e) => setFormWhatsapp(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_email",
											children: "E-mail"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_email",
											type: "email",
											placeholder: "cliente@email.com",
											value: formEmail,
											onChange: (e) => setFormEmail(e.target.value)
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs uppercase font-bold tracking-wider text-muted-foreground border-b pb-1",
								children: "2. Pacote Contratado & Parcelamento"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5 sm:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_pacote",
											children: "Pacote Selecionado"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formPacoteId || pacotes[0]?.id || "",
											onValueChange: (val) => {
												setFormPacoteId(val);
												const pct = pacotes.find((p) => p.id === val);
												if (pct) setFormValorTotal(pct.investimento.toString());
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "c_pacote",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione um pacote" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: pacotes.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: p.id,
												children: [
													p.nome,
													" — ",
													brl(p.investimento)
												]
											}, p.id)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_val",
											children: "Valor Total (R$) *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_val",
											type: "number",
											value: formValorTotal || pacotes[0]?.investimento?.toString() || "0",
											onChange: (e) => setFormValorTotal(e.target.value),
											required: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_entrada",
											children: "Valor de Entrada (R$)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_entrada",
											type: "number",
											value: formValorEntrada,
											onChange: (e) => setFormValorEntrada(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_desc",
											children: "Desconto (R$)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "c_desc",
											type: "number",
											value: formDesconto,
											onChange: (e) => setFormDesconto(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "c_parc",
											children: "Qtd. de Parcelas"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formNumParcelas,
											onValueChange: setFormNumParcelas,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "c_parc",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Array.from({ length: 12 }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
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
											htmlFor: "c_dia",
											children: "Dia de Vencimento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: formDiaVencimento,
											onValueChange: setFormDiaVencimento,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "c_dia",
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
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setOpenAddContratante(false),
								children: "Cancelar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: adicionarContratanteManual.isPending,
								className: "gap-2",
								children: adicionarContratanteManual.isPending ? "Salvando..." : "Cadastrar e Gerar Contrato"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!viewingContratoItem,
			onOpenChange: (v) => !v && setViewingContratoItem(null),
			children: viewingContratoItem && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-3xl max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-primary" }),
								"Contrato & Parcelas — ",
								viewingContratoItem.contratante.nome_completo
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs mt-1",
							children: "Acompanhe o contrato, controle a quitação de parcelas e gere o PDF do documento."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => imprimirContrato(viewingContratoItem.contratante, viewingContratoItem.contrato),
							className: "gap-1.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), " Gerar PDF"]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border p-4 bg-muted/30 grid gap-3 sm:grid-cols-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase font-bold",
									children: "Pacote Contratado"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground mt-0.5",
									children: viewingContratoItem.contrato?.pacote || "Pacote Padrão"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase font-bold",
									children: "Valor Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-primary mt-0.5",
									children: brl(Number(viewingContratoItem.contrato?.valor_total || 0) - Number(viewingContratoItem.contrato?.desconto || 0))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground uppercase font-bold",
									children: "Login do Cliente"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono font-medium text-foreground mt-0.5 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-3.5 text-gold" }), formatarCpf(viewingContratoItem.contratante.cpf || "")]
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase font-bold text-muted-foreground",
								children: "Parcelas do Contrato (Clique no botão para dar baixa)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: (viewingContratoItem.contrato?.parcelas || []).map((parcela) => {
									const isPaga = parcela.status === "pago";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex items-center justify-between p-3 rounded-xl border transition-all ${isPaga ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900" : "bg-card border-border"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: `flex size-7 items-center justify-center rounded-full text-xs font-bold ${isPaga ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`,
												children: [parcela.numero, "ª"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-sm text-foreground",
												children: brl(Number(parcela.valor || 0))
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													"Vencimento:",
													" ",
													(/* @__PURE__ */ new Date(parcela.vencimento + "T00:00:00")).toLocaleDateString("pt-BR"),
													parcela.data_pagamento && ` · Pago em: ${parcela.data_pagamento}`
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: isPaga ? "default" : "secondary",
												className: isPaga ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
												children: isPaga ? "PAGO" : "PENDENTE"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: isPaga ? "outline" : "default",
												onClick: () => toggleParcelaStatus.mutate({
													parcelaId: parcela.id,
													statusAtual: parcela.status
												}),
												disabled: toggleParcelaStatus.isPending,
												className: "h-8 text-xs gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), isPaga ? "Estornar" : "Dar Baixa"]
											})]
										})]
									}, parcela.id);
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setViewingContratoItem(null),
						children: "Fechar"
					}) })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!deletingContratante,
			onOpenChange: (v) => !v && setDeletingContratante(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-destructive",
				children: "Excluir Contratante"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
				"Tem certeza que deseja remover",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deletingContratante?.nome_completo }),
				" deste evento? Esta ação removerá o contrato e as parcelas associadas."
			] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => deletingContratante && deleteContratante.mutate(deletingContratante.id),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Sim, Excluir Contratante"
			})] })] })
		})
	] });
}
//#endregion
export { DemandaEventManager as t };
