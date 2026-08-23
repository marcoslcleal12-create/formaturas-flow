import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { A as TabsList, C as Input, M as Textarea, N as brl, O as Tabs, _ as DialogContent, a as AlertDialogDescription, b as DialogHeader, c as AlertDialogTitle, d as Card, f as CardContent, g as Dialog, h as CardTitle, i as AlertDialogContent, j as TabsTrigger, k as TabsContent, l as AppShell, m as CardHeader, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog, u as Badge, w as Label, x as DialogTitle, y as DialogFooter } from "./router-DisewPEU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { $ as ChevronRight, C as Plus, M as Layers, S as Printer, W as DollarSign, at as Calendar, b as Receipt, c as UserCheck, dt as ArrowUpRight, f as Trash2, g as Search, ht as ArrowDownLeft, l as TriangleAlert, lt as Briefcase, n as Wallet, p as SquarePen, r as Users, s as UserPlus, st as CalendarDays, w as Phone, x as QrCode } from "../_libs/lucide-react.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/colaboradores-CAy8Z9Df.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY_COLABORADORES = "jm_colaboradores_v1";
var STORAGE_KEY_LANCAMENTOS = "jm_colaboradores_lancamentos_v1";
var COLABORADORES_INICIAIS = [
	{
		id: "colab-1",
		nome: "Carlos Eduardo Mendes",
		funcao: "Fotógrafo Principal",
		salarioBase: 3800,
		telefone: "(11) 98765-4321",
		chavePix: "carlos.mendes@email.com",
		status: "ativo",
		dataAdmissao: "2023-02-15",
		email: "carlos.mendes@email.com",
		observacoes: "Responsável pelas coberturas de eventos e ensaios externos.",
		createdAt: (/* @__PURE__ */ new Date("2023-02-15")).toISOString()
	},
	{
		id: "colab-2",
		nome: "Mariana Silva Souza",
		funcao: "Editora de Vídeo & Designer",
		salarioBase: 3200,
		telefone: "(11) 97654-3210",
		chavePix: "123.456.789-00",
		status: "ativo",
		dataAdmissao: "2023-05-10",
		email: "mariana.design@email.com",
		observacoes: "Edição de reels, vídeos de formatura e tratamento de álbuns.",
		createdAt: (/* @__PURE__ */ new Date("2023-05-10")).toISOString()
	},
	{
		id: "colab-3",
		nome: "Rafael Costa Albuquerque",
		funcao: "Cerimonialista & Produção",
		salarioBase: 2900,
		telefone: "(11) 96543-2109",
		chavePix: "rafael.cerimonial@pix.com",
		status: "ativo",
		dataAdmissao: "2023-08-01",
		email: "rafael.producao@email.com",
		observacoes: "Coordenação no dia dos bailes e eventos solenes.",
		createdAt: (/* @__PURE__ */ new Date("2023-08-01")).toISOString()
	},
	{
		id: "colab-4",
		nome: "Beatriz Lima Rocha",
		funcao: "Atendimento & Comercial",
		salarioBase: 2600,
		telefone: "(11) 95432-1098",
		chavePix: "beatriz.comercial@email.com",
		status: "ativo",
		dataAdmissao: "2024-01-10",
		email: "beatriz.lima@email.com",
		observacoes: "Suporte às comissões de formatura e contratos.",
		createdAt: (/* @__PURE__ */ new Date("2024-01-10")).toISOString()
	}
];
var hojeISO = (/* @__PURE__ */ new Date()).toISOString().split("T")[0] ?? "2026-08-21";
var mesAtual = hojeISO.substring(0, 7);
var LANCAMENTOS_INICIAIS = [
	{
		id: "lanc-1",
		colaboradorId: "colab-1",
		tipo: "entrada",
		categoria: "Freelancer",
		descricao: "Cobertura Baile Medicina Turma XXII (Freelance extra)",
		valor: 450,
		data: hojeISO,
		referenciaMesAno: mesAtual,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "lanc-2",
		colaboradorId: "colab-1",
		tipo: "entrada",
		categoria: "Horas Extras",
		descricao: "6 horas extras tratamento de fotos fim de semana",
		valor: 180,
		data: hojeISO,
		referenciaMesAno: mesAtual,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "lanc-3",
		colaboradorId: "colab-1",
		tipo: "saida",
		categoria: "Vale / Adiantamento",
		descricao: "Adiantamento de transporte e alimentação para viagem",
		valor: 200,
		data: hojeISO,
		referenciaMesAno: mesAtual,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "lanc-4",
		colaboradorId: "colab-2",
		tipo: "entrada",
		categoria: "Horas Extras",
		descricao: "Edição expressa de vídeo retrospectiva",
		valor: 250,
		data: hojeISO,
		referenciaMesAno: mesAtual,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "lanc-5",
		colaboradorId: "colab-2",
		tipo: "saida",
		categoria: "Vale / Adiantamento",
		descricao: "Vale adiantado quinzenal",
		valor: 300,
		data: hojeISO,
		referenciaMesAno: mesAtual,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "lanc-6",
		colaboradorId: "colab-3",
		tipo: "entrada",
		categoria: "Freelancer",
		descricao: "Apoio em evento de Aniversário externo",
		valor: 350,
		data: hojeISO,
		referenciaMesAno: mesAtual,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}
];
function getColaboradores() {
	if (typeof window === "undefined") return COLABORADORES_INICIAIS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY_COLABORADORES);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY_COLABORADORES, JSON.stringify(COLABORADORES_INICIAIS));
			return COLABORADORES_INICIAIS;
		}
		return JSON.parse(raw);
	} catch (err) {
		console.error("Erro ao ler colaboradores:", err);
		return COLABORADORES_INICIAIS;
	}
}
function saveColaboradores(colaboradores) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY_COLABORADORES, JSON.stringify(colaboradores));
	} catch (err) {
		console.error("Erro ao salvar colaboradores:", err);
	}
}
function getLancamentos() {
	if (typeof window === "undefined") return LANCAMENTOS_INICIAIS;
	try {
		const raw = localStorage.getItem(STORAGE_KEY_LANCAMENTOS);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY_LANCAMENTOS, JSON.stringify(LANCAMENTOS_INICIAIS));
			return LANCAMENTOS_INICIAIS;
		}
		return JSON.parse(raw);
	} catch (err) {
		console.error("Erro ao ler lançamentos:", err);
		return LANCAMENTOS_INICIAIS;
	}
}
function saveLancamentos(lancamentos) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY_LANCAMENTOS, JSON.stringify(lancamentos));
	} catch (err) {
		console.error("Erro ao salvar lançamentos:", err);
	}
}
function addColaborador(dados) {
	const list = getColaboradores();
	const novo = {
		...dados,
		id: "colab-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	list.unshift(novo);
	saveColaboradores(list);
	return novo;
}
function updateColaborador(id, atualizacao) {
	const list = getColaboradores();
	const index = list.findIndex((c) => c.id === id);
	if (index === -1) return null;
	const atual = list[index];
	if (!atual) return null;
	const atualizado = {
		id: atual.id,
		nome: atualizacao.nome ?? atual.nome,
		funcao: atualizacao.funcao ?? atual.funcao,
		salarioBase: atualizacao.salarioBase ?? atual.salarioBase,
		telefone: atualizacao.telefone !== void 0 ? atualizacao.telefone : atual.telefone,
		chavePix: atualizacao.chavePix !== void 0 ? atualizacao.chavePix : atual.chavePix,
		status: atualizacao.status ?? atual.status,
		dataAdmissao: atualizacao.dataAdmissao !== void 0 ? atualizacao.dataAdmissao : atual.dataAdmissao,
		email: atualizacao.email !== void 0 ? atualizacao.email : atual.email,
		observacoes: atualizacao.observacoes !== void 0 ? atualizacao.observacoes : atual.observacoes,
		createdAt: atual.createdAt
	};
	list[index] = atualizado;
	saveColaboradores(list);
	return atualizado;
}
function deleteColaborador(id) {
	saveColaboradores(getColaboradores().filter((c) => c.id !== id));
	saveLancamentos(getLancamentos().filter((l) => l.colaboradorId !== id));
}
function addLancamento(dados) {
	const list = getLancamentos();
	const refMes = dados.data ? dados.data.substring(0, 7) : (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
	const novo = {
		...dados,
		id: "lanc-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
		referenciaMesAno: refMes,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	list.unshift(novo);
	saveLancamentos(list);
	return novo;
}
function deleteLancamento(id) {
	saveLancamentos(getLancamentos().filter((l) => l.id !== id));
}
function calcularTotaisColaborador(colaborador, lancamentos, filtroMesAno) {
	const lancamentosFiltrados = lancamentos.filter((l) => {
		if (l.colaboradorId !== colaborador.id) return false;
		if (filtroMesAno && filtroMesAno !== "todos") return (l.referenciaMesAno || l.data.substring(0, 7)) === filtroMesAno;
		return true;
	});
	const totalEntradas = lancamentosFiltrados.filter((l) => l.tipo === "entrada").reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
	const totalSaidas = lancamentosFiltrados.filter((l) => l.tipo === "saida").reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
	const salarioBase = Number(colaborador.salarioBase) || 0;
	return {
		salarioBase,
		totalEntradas,
		totalSaidas,
		valorFinal: Math.max(0, salarioBase + totalEntradas - totalSaidas),
		lancamentos: lancamentosFiltrados
	};
}
var CATEGORIAS_ENTRADA = [
	"Freelancer",
	"Horas Extras",
	"Comissão",
	"Bônus / Premiação",
	"Diária Externa",
	"Reembolso",
	"Outros Acréscimos"
];
var CATEGORIAS_SAIDA = [
	"Vale / Adiantamento",
	"Desconto de Falta",
	"Adiantamento Salarial",
	"Atrasos / Deduções",
	"Empréstimo",
	"Outros Descontos"
];
var FUNCOES_SUGERIDAS = [
	"Fotógrafo Principal",
	"Fotógrafo Assistente",
	"Editor de Vídeo & Reels",
	"Designer & Tratamento de Álbuns",
	"Cerimonialista & Produção",
	"Coordenador de Eventos",
	"Atendimento & Comercial",
	"Assistente de Iluminação / Produção",
	"Financeiro & Administrativo"
];
function ColaboradoresPage() {
	const [colaboradores, setColaboradores] = (0, import_react.useState)([]);
	const [lancamentos, setLancamentos] = (0, import_react.useState)([]);
	const [activeTab, setActiveTab] = (0, import_react.useState)("colaboradores");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [filtroStatus, setFiltroStatus] = (0, import_react.useState)("todos");
	const [filtroMes, setFiltroMes] = (0, import_react.useState)("mes_atual");
	const [filtroTipoLancamento, setFiltroTipoLancamento] = (0, import_react.useState)("todos");
	const [filtroColaboradorLancamento, setFiltroColaboradorLancamento] = (0, import_react.useState)("todos");
	const [isColabDialogOpen, setIsColabDialogOpen] = (0, import_react.useState)(false);
	const [editingColab, setEditingColab] = (0, import_react.useState)(null);
	const [colabFormData, setColabFormData] = (0, import_react.useState)({
		nome: "",
		funcao: "",
		salarioBase: "",
		telefone: "",
		chavePix: "",
		email: "",
		dataAdmissao: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		observacoes: "",
		status: "ativo"
	});
	const [isLancamentoDialogOpen, setIsLancamentoDialogOpen] = (0, import_react.useState)(false);
	const [selectedColabForLancamento, setSelectedColabForLancamento] = (0, import_react.useState)("");
	const [lancamentoFormData, setLancamentoFormData] = (0, import_react.useState)({
		colaboradorId: "",
		tipo: "entrada",
		categoria: "Freelancer",
		descricao: "",
		valor: "",
		data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
	});
	const [selectedColabForDetails, setSelectedColabForDetails] = (0, import_react.useState)(null);
	const [isDetailsOpen, setIsDetailsOpen] = (0, import_react.useState)(false);
	const [colabToDelete, setColabToDelete] = (0, import_react.useState)(null);
	const [lancamentoToDelete, setLancamentoToDelete] = (0, import_react.useState)(null);
	const recarregarDados = () => {
		setColaboradores(getColaboradores());
		setLancamentos(getLancamentos());
	};
	(0, import_react.useEffect)(() => {
		recarregarDados();
	}, []);
	const mesAtualStr = (/* @__PURE__ */ new Date()).toISOString().substring(0, 7);
	const mesesOpcoes = (0, import_react.useMemo)(() => {
		const mesesSet = /* @__PURE__ */ new Set();
		mesesSet.add(mesAtualStr);
		lancamentos.forEach((l) => {
			if (l.referenciaMesAno) mesesSet.add(l.referenciaMesAno);
			else if (l.data) mesesSet.add(l.data.substring(0, 7));
		});
		return Array.from(mesesSet).sort().reverse();
	}, [lancamentos, mesAtualStr]);
	const mesFiltroAtivo = (0, import_react.useMemo)(() => {
		if (filtroMes === "mes_atual") return mesAtualStr;
		if (filtroMes === "todos") return "todos";
		return filtroMes;
	}, [filtroMes, mesAtualStr]);
	const formatarMesNome = (anoMes) => {
		if (anoMes === "todos") return "Todos os Períodos";
		const partes = anoMes.split("-");
		const ano = parseInt(partes[0] ?? "2026", 10);
		const mes = parseInt(partes[1] ?? "1", 10);
		return new Date(ano, mes - 1, 1).toLocaleDateString("pt-BR", {
			month: "long",
			year: "numeric"
		});
	};
	const totaisGerais = (0, import_react.useMemo)(() => {
		const colabsAtivos = colaboradores.filter((c) => c.status === "ativo");
		const totalSalarioBase = colabsAtivos.reduce((acc, c) => acc + (Number(c.salarioBase) || 0), 0);
		const lancamentosFiltrados = lancamentos.filter((l) => {
			if (mesFiltroAtivo !== "todos") {
				if ((l.referenciaMesAno || l.data.substring(0, 7)) !== mesFiltroAtivo) return false;
			}
			return true;
		});
		const totalEntradas = lancamentosFiltrados.filter((l) => l.tipo === "entrada").reduce((acc, l) => acc + (Number(l.valor) || 0), 0);
		const totalSaidas = lancamentosFiltrados.filter((l) => l.tipo === "saida").reduce((acc, l) => acc + (Number(l.valor) || 0), 0);
		const totalLiquidoFinal = Math.max(0, totalSalarioBase + totalEntradas - totalSaidas);
		return {
			qtdAtivos: colabsAtivos.length,
			qtdInativos: colaboradores.length - colabsAtivos.length,
			totalSalarioBase,
			totalEntradas,
			totalSaidas,
			totalLiquidoFinal,
			qtdLancamentos: lancamentosFiltrados.length
		};
	}, [
		colaboradores,
		lancamentos,
		mesFiltroAtivo
	]);
	const colaboradoresFiltrados = (0, import_react.useMemo)(() => {
		return colaboradores.filter((colab) => {
			if (filtroStatus !== "todos" && colab.status !== filtroStatus) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchNome = colab.nome.toLowerCase().includes(q);
				const matchFuncao = colab.funcao.toLowerCase().includes(q);
				const matchPix = (colab.chavePix || "").toLowerCase().includes(q);
				if (!matchNome && !matchFuncao && !matchPix) return false;
			}
			return true;
		});
	}, [
		colaboradores,
		filtroStatus,
		searchQuery
	]);
	const lancamentosFiltradosLista = (0, import_react.useMemo)(() => {
		return lancamentos.filter((l) => {
			if (filtroTipoLancamento !== "todos" && l.tipo !== filtroTipoLancamento) return false;
			if (filtroColaboradorLancamento !== "todos" && l.colaboradorId !== filtroColaboradorLancamento) return false;
			if (mesFiltroAtivo !== "todos") {
				if ((l.referenciaMesAno || l.data.substring(0, 7)) !== mesFiltroAtivo) return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchColab = colaboradores.find((c) => c.id === l.colaboradorId)?.nome.toLowerCase().includes(q);
				const matchDesc = l.descricao.toLowerCase().includes(q);
				const matchCat = l.categoria.toLowerCase().includes(q);
				if (!matchColab && !matchDesc && !matchCat) return false;
			}
			return true;
		});
	}, [
		lancamentos,
		filtroTipoLancamento,
		filtroColaboradorLancamento,
		mesFiltroAtivo,
		searchQuery,
		colaboradores
	]);
	const handleOpenNewColab = () => {
		setEditingColab(null);
		setColabFormData({
			nome: "",
			funcao: "",
			salarioBase: "",
			telefone: "",
			chavePix: "",
			email: "",
			dataAdmissao: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			observacoes: "",
			status: "ativo"
		});
		setIsColabDialogOpen(true);
	};
	const handleOpenEditColab = (c) => {
		setEditingColab(c);
		setColabFormData({
			nome: c.nome,
			funcao: c.funcao,
			salarioBase: String(c.salarioBase),
			telefone: c.telefone || "",
			chavePix: c.chavePix || "",
			email: c.email || "",
			dataAdmissao: c.dataAdmissao || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			observacoes: c.observacoes || "",
			status: c.status
		});
		setIsColabDialogOpen(true);
	};
	const handleSaveColaborador = (e) => {
		e.preventDefault();
		if (!colabFormData.nome.trim()) {
			toast.error("Nome do colaborador é obrigatório");
			return;
		}
		if (!colabFormData.funcao.trim()) {
			toast.error("Função / Cargo é obrigatório");
			return;
		}
		const salarioNum = parseFloat(colabFormData.salarioBase.replace(",", ".")) || 0;
		if (editingColab) {
			updateColaborador(editingColab.id, {
				nome: colabFormData.nome.trim(),
				funcao: colabFormData.funcao.trim(),
				salarioBase: salarioNum,
				telefone: colabFormData.telefone.trim() || void 0,
				chavePix: colabFormData.chavePix.trim() || void 0,
				email: colabFormData.email.trim() || void 0,
				dataAdmissao: colabFormData.dataAdmissao || void 0,
				observacoes: colabFormData.observacoes.trim() || void 0,
				status: colabFormData.status
			});
			toast.success(`Colaborador "${colabFormData.nome}" atualizado com sucesso!`);
		} else {
			addColaborador({
				nome: colabFormData.nome.trim(),
				funcao: colabFormData.funcao.trim(),
				salarioBase: salarioNum,
				telefone: colabFormData.telefone.trim() || void 0,
				chavePix: colabFormData.chavePix.trim() || void 0,
				email: colabFormData.email.trim() || void 0,
				dataAdmissao: colabFormData.dataAdmissao || void 0,
				observacoes: colabFormData.observacoes.trim() || void 0,
				status: colabFormData.status
			});
			toast.success(`Colaborador "${colabFormData.nome}" cadastrado com sucesso!`);
		}
		recarregarDados();
		setIsColabDialogOpen(false);
	};
	const handleConfirmDeleteColaborador = () => {
		if (!colabToDelete) return;
		deleteColaborador(colabToDelete.id);
		toast.success(`Colaborador "${colabToDelete.nome}" removido.`);
		setColabToDelete(null);
		if (selectedColabForDetails?.id === colabToDelete.id) setIsDetailsOpen(false);
		recarregarDados();
	};
	const handleOpenNewLancamento = (colaboradorId, tipoPadrao = "entrada") => {
		const colabId = colaboradorId || (colaboradores[0]?.id ?? "");
		setSelectedColabForLancamento(colabId);
		setLancamentoFormData({
			colaboradorId: colabId,
			tipo: tipoPadrao,
			categoria: tipoPadrao === "entrada" ? "Freelancer" : "Vale / Adiantamento",
			descricao: "",
			valor: "",
			data: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		});
		setIsLancamentoDialogOpen(true);
	};
	const handleSaveLancamento = (e) => {
		e.preventDefault();
		if (!lancamentoFormData.colaboradorId) {
			toast.error("Selecione um colaborador");
			return;
		}
		const valorNum = parseFloat(lancamentoFormData.valor.replace(",", ".")) || 0;
		if (valorNum <= 0) {
			toast.error("O valor deve ser maior que zero");
			return;
		}
		if (!lancamentoFormData.descricao.trim()) {
			toast.error("Informe uma descrição / justificativa");
			return;
		}
		addLancamento({
			colaboradorId: lancamentoFormData.colaboradorId,
			tipo: lancamentoFormData.tipo,
			categoria: lancamentoFormData.categoria,
			descricao: lancamentoFormData.descricao.trim(),
			valor: valorNum,
			data: lancamentoFormData.data || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "2026-08-21"
		});
		const colab = colaboradores.find((c) => c.id === lancamentoFormData.colaboradorId);
		const tipoTxt = lancamentoFormData.tipo === "entrada" ? "Acréscimo (+)" : "Vale/Desconto (-)";
		toast.success(`Lançamento de ${tipoTxt} registrado para ${colab?.nome || "colaborador"}!`);
		recarregarDados();
		setIsLancamentoDialogOpen(false);
	};
	const handleConfirmDeleteLancamento = () => {
		if (!lancamentoToDelete) return;
		deleteLancamento(lancamentoToDelete.id);
		toast.success("Lançamento removido com sucesso!");
		setLancamentoToDelete(null);
		recarregarDados();
	};
	const handleOpenExtrato = (colab) => {
		setSelectedColabForDetails(colab);
		setIsDetailsOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-gold/20 text-brand dark:text-gold border border-brand/20 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
						children: "Colaboradores & Folha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Gestão da equipe, salários base, adicionais (freelancer e horas extras) e vales com cálculo líquido final."
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filtroMes,
							onValueChange: setFiltroMes,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger, {
								className: "w-[180px] bg-background",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 size-4 text-brand dark:text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o mês" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "mes_atual",
									children: [
										"Mês Atual (",
										formatarMesNome(mesAtualStr),
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "todos",
									children: "Todos os Períodos"
								}),
								mesesOpcoes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: m,
									children: formatarMesNome(m)
								}, m))
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => handleOpenNewLancamento(void 0, "entrada"),
							className: "gap-2 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "+ Lançamento" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleOpenNewColab,
							className: "gap-2 bg-brand hover:bg-brand/90 text-white shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Novo Colaborador" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Colaboradores"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-bold text-foreground",
							children: [
								totaisGerais.qtdAtivos,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-normal text-muted-foreground",
									children: "ativos"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: totaisGerais.qtdInativos > 0 ? `${totaisGerais.qtdInativos} inativo(s)` : "100% da equipe ativa"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/60 bg-gradient-to-br from-card to-card/50 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Salários Base"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-foreground",
							children: brl(totaisGerais.totalSalarioBase)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Folha base de colaboradores ativos"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-emerald-500/20 bg-emerald-500/5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400",
								children: "(+) Entradas / Extras"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-bold text-emerald-600 dark:text-emerald-400",
							children: ["+", brl(totaisGerais.totalEntradas)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80",
							children: "Freelancers, horas extras e comissões"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-rose-500/20 bg-rose-500/5 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400",
								children: "(-) Vales & Descontos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-bold text-rose-600 dark:text-rose-400",
							children: ["-", brl(totaisGerais.totalSaidas)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-rose-700/80 dark:text-rose-300/80",
							children: "Vales adiantados e descontos"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-brand/30 bg-gradient-to-br from-brand/10 via-brand/5 to-gold/10 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "flex flex-row items-center justify-between pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-xs font-semibold uppercase tracking-wider text-brand dark:text-gold",
								children: "(=) Total Líquido"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-8 items-center justify-center rounded-lg bg-brand/20 text-brand dark:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "size-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold text-foreground",
							children: brl(totaisGerais.totalLiquidoFinal)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-medium text-brand dark:text-gold",
							children: "Salário + Extras - Vales"
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: (v) => setActiveTab(v),
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-muted/80 p-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "colaboradores",
									className: "gap-2 text-xs sm:text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Colaboradores & Folha (",
										colaboradoresFiltrados.length,
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "lancamentos",
									className: "gap-2 text-xs sm:text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Histórico de Lançamentos (",
										lancamentosFiltradosLista.length,
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "holerite",
									className: "gap-2 text-xs sm:text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Extratos & Relatórios" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-[220px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										placeholder: "Buscar colaborador ou função...",
										value: searchQuery,
										onChange: (e) => setSearchQuery(e.target.value),
										className: "pl-8 text-xs sm:text-sm h-9"
									})]
								}),
								activeTab === "colaboradores" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filtroStatus,
									onValueChange: (v) => setFiltroStatus(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[130px] h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "todos",
											children: "Todos Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ativo",
											children: "Apenas Ativos"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "inativo",
											children: "Apenas Inativos"
										})
									] })]
								}),
								activeTab === "lancamentos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filtroTipoLancamento,
									onValueChange: (v) => setFiltroTipoLancamento(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[140px] h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Tipo Lançamento" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "todos",
											children: "Todos os Tipos"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "entrada",
											children: "Acréscimos (+)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "saida",
											children: "Vales / Saídas (-)"
										})
									] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filtroColaboradorLancamento,
									onValueChange: setFiltroColaboradorLancamento,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-[160px] h-9 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Colaborador" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "todos",
										children: "Todos Colaboradores"
									}), colaboradores.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c.id,
										children: c.nome
									}, c.id))] })]
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "colaboradores",
						className: "mt-4 space-y-4",
						children: colaboradoresFiltrados.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-8 text-center border-dashed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto flex size-12 items-center justify-center rounded-full bg-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-6 text-muted-foreground" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 text-base font-semibold",
									children: "Nenhum colaborador encontrado"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: "Cadastre um novo membro da equipe ou ajuste os filtros de busca."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: handleOpenNewColab,
									className: "mt-4 gap-2",
									variant: "outline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cadastrar Colaborador" })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
							children: colaboradoresFiltrados.map((colab) => {
								const totais = calcularTotaisColaborador(colab, lancamentos, mesFiltroAtivo);
								const isAtivo = colab.status === "ativo";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									className: `overflow-hidden border transition-all duration-200 hover:shadow-md ${!isAtivo ? "opacity-70 bg-muted/30" : "bg-card"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-gold/20 font-bold text-brand dark:text-gold border border-brand/20 text-base shadow-sm",
														children: colab.nome.substring(0, 2).toUpperCase()
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "text-base font-bold text-foreground leading-tight",
															children: colab.nome
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: isAtivo ? "default" : "secondary",
															className: isAtivo ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px]" : "bg-muted text-muted-foreground text-[11px]",
															children: isAtivo ? "Ativo" : "Inativo"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-3 text-gold" }), colab.funcao]
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "size-8 text-muted-foreground hover:text-foreground",
														title: "Editar Colaborador",
														onClick: () => handleOpenEditColab(colab),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "size-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10",
														title: "Excluir Colaborador",
														onClick: () => setColabToDelete(colab),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted-foreground border-y py-2 border-border/50",
												children: [
													colab.telefone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3 text-brand" }), colab.telefone]
													}),
													colab.chavePix && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "size-3 text-gold" }),
															"Pix: ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																className: "font-mono text-foreground",
																children: colab.chavePix
															})
														]
													}),
													colab.dataAdmissao && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-3" }),
															"Início: ",
															(/* @__PURE__ */ new Date(colab.dataAdmissao + "T12:00:00")).toLocaleDateString("pt-BR")
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-lg bg-muted/40 p-3 border border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"Demonstrativo (",
														formatarMesNome(mesFiltroAtivo),
														")"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-normal lowercase",
														children: [totais.lancamentos.length, " lançamento(s)"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-md bg-background/80 p-2 border border-border/30",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-muted-foreground font-medium",
																children: "Salário Base"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-xs sm:text-sm font-bold text-foreground",
																children: brl(totais.salarioBase)
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-md bg-emerald-500/10 p-2 border border-emerald-500/20",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-emerald-700 dark:text-emerald-400 font-medium",
																children: "(+) Freelas / Extras"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400",
																children: ["+", brl(totais.totalEntradas)]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-md bg-rose-500/10 p-2 border border-rose-500/20",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-rose-700 dark:text-rose-400 font-medium",
																children: "(-) Vales / Descontos"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400",
																children: ["-", brl(totais.totalSaidas)]
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "rounded-md bg-brand/10 p-2 border border-brand/30",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-[10px] text-brand dark:text-gold font-bold",
																children: "(=) A Pagar Líquido"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "text-xs sm:text-sm font-extrabold text-brand dark:text-gold",
																children: brl(totais.valorFinal)
															})]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 flex flex-wrap items-center justify-between gap-2 pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														onClick: () => handleOpenNewLancamento(colab.id, "entrada"),
														className: "h-8 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 mr-1" }), "+ Extra / Freela"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "outline",
														onClick: () => handleOpenNewLancamento(colab.id, "saida"),
														className: "h-8 text-xs border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3 mr-1" }), "- Vale"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "default",
													onClick: () => handleOpenExtrato(colab),
													className: "h-8 text-xs gap-1.5 bg-brand text-white hover:bg-brand/90",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "size-3.5" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Extrato & Histórico" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" })
													]
												})]
											})
										]
									})
								}, colab.id);
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "lancamentos",
						className: "mt-4 space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-border/60 shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-4",
												children: "Data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-4",
												children: "Colaborador"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-4",
												children: "Tipo & Categoria"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-4",
												children: "Descrição / Justificativa"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-4 text-right",
												children: "Valor"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "py-3 px-4 text-center",
												children: "Ações"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/40",
										children: lancamentosFiltradosLista.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 6,
											className: "py-8 text-center text-muted-foreground",
											children: "Nenhum lançamento encontrado para os filtros selecionados."
										}) }) : lancamentosFiltradosLista.map((lanc) => {
											const colab = colaboradores.find((c) => c.id === lanc.colaboradorId);
											const isEntrada = lanc.tipo === "entrada";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-muted/20 transition-colors",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-4 font-mono text-xs text-muted-foreground whitespace-nowrap",
														children: (/* @__PURE__ */ new Date(lanc.data + "T12:00:00")).toLocaleDateString("pt-BR")
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-4 font-medium text-foreground whitespace-nowrap",
														children: colab ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold",
															children: colab.nome
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "block text-xs text-muted-foreground",
															children: colab.funcao
														})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground italic",
															children: "Colaborador removido"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-4 whitespace-nowrap",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "outline",
															className: isEntrada ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-medium" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs font-medium",
															children: [isEntrada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3 mr-1 inline" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "size-3 mr-1 inline" }), lanc.categoria]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-4 text-xs text-foreground/90 max-w-[320px]",
														children: lanc.descricao
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-4 text-right font-bold text-sm whitespace-nowrap",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: isEntrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
															children: [isEntrada ? "+" : "-", brl(lanc.valor)]
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "py-3 px-4 text-center whitespace-nowrap",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															variant: "ghost",
															size: "icon",
															className: "size-7 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10",
															title: "Excluir lançamento",
															onClick: () => setLancamentoToDelete(lanc),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
														})
													})
												]
											}, lanc.id);
										})
									})]
								})
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "holerite",
						className: "mt-4 space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6 border-border/60 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-bold text-foreground",
									children: ["Folha Consolidada - ", formatarMesNome(mesFiltroAtivo)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Relatório geral para conferência financeira e fechamento da equipe."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => window.print(),
									className: "gap-2 border-border/60 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Imprimir Relatório" })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs sm:text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground border-b text-[11px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3",
													children: "Colaborador"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3",
													children: "Função"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3",
													children: "Pix / Contato"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3 text-right",
													children: "Salário Base"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3 text-right text-emerald-600 dark:text-emerald-400",
													children: "(+) Extras"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3 text-right text-rose-600 dark:text-rose-400",
													children: "(-) Vales"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3 text-right font-bold text-foreground",
													children: "(=) Total Líquido"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "py-3 px-3 text-center",
													children: "Ações"
												})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-border/40",
											children: colaboradores.map((colab) => {
												const totais = calcularTotaisColaborador(colab, lancamentos, mesFiltroAtivo);
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-muted/10",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-3 px-3 font-semibold text-foreground",
															children: colab.nome
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-3 px-3 text-muted-foreground",
															children: colab.funcao
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-3 px-3 font-mono text-[11px] text-muted-foreground",
															children: colab.chavePix || colab.telefone || "—"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-3 px-3 text-right font-medium",
															children: brl(totais.salarioBase)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium",
															children: ["+", brl(totais.totalEntradas)]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "py-3 px-3 text-right text-rose-600 dark:text-rose-400 font-medium",
															children: ["-", brl(totais.totalSaidas)]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-3 px-3 text-right font-bold text-brand dark:text-gold",
															children: brl(totais.valorFinal)
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "py-3 px-3 text-center",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "sm",
																variant: "ghost",
																className: "h-7 px-2 text-xs",
																onClick: () => handleOpenExtrato(colab),
																children: "Ver Extrato"
															})
														})
													]
												}, colab.id);
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
											className: "bg-muted/40 font-bold border-t border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 3,
													className: "py-3 px-3 text-foreground uppercase tracking-wider text-xs",
													children: "Total Geral Folha"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 px-3 text-right text-foreground",
													children: brl(totaisGerais.totalSalarioBase)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3 px-3 text-right text-emerald-600 dark:text-emerald-400",
													children: ["+", brl(totaisGerais.totalEntradas)]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-3 px-3 text-right text-rose-600 dark:text-rose-400",
													children: ["-", brl(totaisGerais.totalSaidas)]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 px-3 text-right text-base text-brand dark:text-gold",
													children: brl(totaisGerais.totalLiquidoFinal)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {})
											] })
										})
									]
								})
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isColabDialogOpen,
				onOpenChange: setIsColabDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-5 text-brand dark:text-gold" }), editingColab ? "Editar Colaborador" : "Novo Colaborador"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveColaborador,
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "colab-nome",
									children: "Nome Completo *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "colab-nome",
									placeholder: "Ex: Carlos Eduardo Mendes",
									value: colabFormData.nome,
									onChange: (e) => setColabFormData({
										...colabFormData,
										nome: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "colab-funcao",
											children: "Função / Cargo *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "colab-funcao",
											placeholder: "Ex: Fotógrafo, Editor...",
											value: colabFormData.funcao,
											onChange: (e) => setColabFormData({
												...colabFormData,
												funcao: e.target.value
											}),
											required: true,
											list: "funcoes-list"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
											id: "funcoes-list",
											children: FUNCOES_SUGERIDAS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: f }, f))
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "colab-salario",
										children: "Salário Base (R$) *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "colab-salario",
										type: "number",
										step: "0.01",
										placeholder: "0.00",
										value: colabFormData.salarioBase,
										onChange: (e) => setColabFormData({
											...colabFormData,
											salarioBase: e.target.value
										}),
										required: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "colab-pix",
										children: "Chave Pix"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "colab-pix",
										placeholder: "CPF, E-mail ou Telefone",
										value: colabFormData.chavePix,
										onChange: (e) => setColabFormData({
											...colabFormData,
											chavePix: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "colab-tel",
										children: "WhatsApp / Telefone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "colab-tel",
										placeholder: "(00) 00000-0000",
										value: colabFormData.telefone,
										onChange: (e) => setColabFormData({
											...colabFormData,
											telefone: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "colab-data",
										children: "Data de Admissão / Início"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "colab-data",
										type: "date",
										value: colabFormData.dataAdmissao,
										onChange: (e) => setColabFormData({
											...colabFormData,
											dataAdmissao: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "colab-status",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: colabFormData.status,
										onValueChange: (v) => setColabFormData({
											...colabFormData,
											status: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "colab-status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ativo",
											children: "Ativo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "inativo",
											children: "Inativo"
										})] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "colab-obs",
									children: "Observações / Detalhes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "colab-obs",
									rows: 2,
									placeholder: "Informações adicionais, disponibilidade de eventos...",
									value: colabFormData.observacoes,
									onChange: (e) => setColabFormData({
										...colabFormData,
										observacoes: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsColabDialogOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-brand text-white hover:bg-brand/90",
									children: editingColab ? "Salvar Alterações" : "Cadastrar Colaborador"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isLancamentoDialogOpen,
				onOpenChange: setIsLancamentoDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "size-5 text-brand dark:text-gold" }), "Novo Lançamento Financeiro"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveLancamento,
						className: "space-y-4 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "lanc-colab",
									children: "Colaborador *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: lancamentoFormData.colaboradorId,
									onValueChange: (v) => setLancamentoFormData({
										...lancamentoFormData,
										colaboradorId: v
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "lanc-colab",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o colaborador" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: colaboradores.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: c.id,
										children: [
											c.nome,
											" (",
											c.funcao,
											")"
										]
									}, c.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo de Lançamento *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: lancamentoFormData.tipo === "entrada" ? "default" : "outline",
										className: lancamentoFormData.tipo === "entrada" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
										onClick: () => setLancamentoFormData({
											...lancamentoFormData,
											tipo: "entrada",
											categoria: "Freelancer"
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4 mr-1.5" }), "(+) Entrada / Extra"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: lancamentoFormData.tipo === "saida" ? "default" : "outline",
										className: lancamentoFormData.tipo === "saida" ? "bg-rose-600 hover:bg-rose-700 text-white" : "border-rose-500/30 text-rose-600 dark:text-rose-400",
										onClick: () => setLancamentoFormData({
											...lancamentoFormData,
											tipo: "saida",
											categoria: "Vale / Adiantamento"
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "size-4 mr-1.5" }), "(-) Saída / Vale"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "lanc-cat",
										children: "Categoria"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: lancamentoFormData.categoria,
										onValueChange: (v) => setLancamentoFormData({
											...lancamentoFormData,
											categoria: v
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "lanc-cat",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: lancamentoFormData.tipo === "entrada" ? CATEGORIAS_ENTRADA.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: cat,
											children: cat
										}, cat)) : CATEGORIAS_SAIDA.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: cat,
											children: cat
										}, cat)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "lanc-valor",
										children: "Valor (R$) *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "lanc-valor",
										type: "number",
										step: "0.01",
										placeholder: "0.00",
										value: lancamentoFormData.valor,
										onChange: (e) => setLancamentoFormData({
											...lancamentoFormData,
											valor: e.target.value
										}),
										required: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "lanc-data",
									children: "Data do Lançamento *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "lanc-data",
									type: "date",
									value: lancamentoFormData.data,
									onChange: (e) => setLancamentoFormData({
										...lancamentoFormData,
										data: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "lanc-desc",
									children: "Descrição / Justificativa *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "lanc-desc",
									rows: 2,
									placeholder: "Ex: Cobertura Baile Turma Medicina, Vale adiantado quinzenal...",
									value: lancamentoFormData.descricao,
									onChange: (e) => setLancamentoFormData({
										...lancamentoFormData,
										descricao: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsLancamentoDialogOpen(false),
									children: "Cancelar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "bg-brand text-white hover:bg-brand/90",
									children: "Confirmar Lançamento"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDetailsOpen,
				onOpenChange: setIsDetailsOpen,
				children: selectedColabForDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2 text-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "size-5 text-brand dark:text-gold" }), "Extrato Individual & Histórico"]
							})
						}) }),
						(() => {
							const totais = calcularTotaisColaborador(selectedColabForDetails, lancamentos, mesFiltroAtivo);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5 pt-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-muted/40 border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-lg font-bold text-foreground",
											children: selectedColabForDetails.nome
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "size-3.5 text-gold" }), selectedColabForDetails.funcao]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right text-xs space-y-0.5",
											children: [selectedColabForDetails.chavePix && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-mono text-muted-foreground",
												children: ["Pix: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground",
													children: selectedColabForDetails.chavePix
												})]
											}), selectedColabForDetails.telefone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-muted-foreground",
												children: ["Tel: ", selectedColabForDetails.telefone]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-lg bg-card border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-muted-foreground",
													children: "Salário Base"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-sm font-bold text-foreground",
													children: brl(totais.salarioBase)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-emerald-700 dark:text-emerald-400",
													children: "(+) Extras/Freelas"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-bold text-emerald-600 dark:text-emerald-400",
													children: ["+", brl(totais.totalEntradas)]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-rose-700 dark:text-rose-400",
													children: "(-) Vales/Descontos"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-sm font-bold text-rose-600 dark:text-rose-400",
													children: ["-", brl(totais.totalSaidas)]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 rounded-lg bg-brand/10 border border-brand/30",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-[11px] text-brand dark:text-gold font-bold",
													children: "(=) Líquido Final"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-base font-extrabold text-brand dark:text-gold",
													children: brl(totais.valorFinal)
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: [
												"Lançamentos (",
												formatarMesNome(mesFiltroAtivo),
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-7 text-[11px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
												onClick: () => handleOpenNewLancamento(selectedColabForDetails.id, "entrada"),
												children: "+ Extra"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-7 text-[11px] border-rose-500/30 text-rose-600 dark:text-rose-400",
												onClick: () => handleOpenNewLancamento(selectedColabForDetails.id, "saida"),
												children: "- Vale"
											})]
										})]
									}), totais.lancamentos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-center py-6 border rounded-lg bg-muted/20 text-xs text-muted-foreground",
										children: "Nenhum lançamento de extra ou vale registrado para este período."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 max-h-60 overflow-y-auto",
										children: totais.lancamentos.map((l) => {
											const isEntrada = l.tipo === "entrada";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between p-2.5 rounded-lg border bg-card/60 hover:bg-muted/20 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `flex size-7 items-center justify-center rounded-md ${isEntrada ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"}`,
														children: isEntrada ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownLeft, { className: "size-3.5" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-foreground",
														children: l.categoria
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground text-[11px]",
														children: l.descricao
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: `font-bold ${isEntrada ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
															children: [isEntrada ? "+" : "-", brl(l.valor)]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "text-[10px] text-muted-foreground",
															children: (/* @__PURE__ */ new Date(l.data + "T12:00:00")).toLocaleDateString("pt-BR")
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "size-6 text-muted-foreground hover:text-rose-600",
														onClick: () => setLancamentoToDelete(l),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
													})]
												})]
											}, l.id);
										})
									})] })
								]
							});
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-3 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								className: "gap-1.5 text-xs",
								onClick: () => window.print(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), "Imprimir Extrato"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => setIsDetailsOpen(false),
								children: "Fechar"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!colabToDelete,
				onOpenChange: (open) => !open && setColabToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5" }), "Excluir Colaborador"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Tem certeza que deseja excluir o colaborador",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
						"\"",
						colabToDelete?.nome,
						"\""
					] }),
					"? Todos os lançamentos e o histórico financeiro associados também serão apagados."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: handleConfirmDeleteColaborador,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: "Sim, Excluir"
				})] })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: !!lancamentoToDelete,
				onOpenChange: (open) => !open && setLancamentoToDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
					className: "flex items-center gap-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5" }), "Excluir Lançamento"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
					"Tem certeza que deseja excluir este lançamento de",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lancamentoToDelete ? brl(lancamentoToDelete.valor) : "" }),
					" (",
					lancamentoToDelete?.categoria,
					")? Os cálculos do colaborador serão recalculados."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: handleConfirmDeleteLancamento,
					className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
					children: "Sim, Excluir"
				})] })] })
			})
		]
	}) });
}
//#endregion
export { ColaboradoresPage as component };
