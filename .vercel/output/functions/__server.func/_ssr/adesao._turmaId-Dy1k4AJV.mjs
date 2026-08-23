import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useRouter, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useServerFn } from "./useServerFn-CrZF2pjq.mjs";
import { o as saveClienteSession, t as apenasDigitos } from "./aluno-login-Bxk3uUlL.mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { a as object, o as string, s as ZodError } from "../_libs/zod.mjs";
import { C as Input, D as Route$6, N as brl, V as realizarAdesaoPublica, d as Card, f as CardContent, h as CardTitle, m as CardHeader, p as CardDescription, u as Badge, w as Label, z as buscarTurmaPublica } from "./router-DisewPEU.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Package, F as GraduationCap, G as CreditCard, J as Circle, R as FileText, X as CircleCheck, ct as Building2, ft as ArrowRight, h as ShieldCheck, i as User, it as Camera, m as Sparkles, pt as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as EMPRESA, t as CLAUSULAS_PADRAO } from "./contrato-modelo-DarhVMh5.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { i as extrairPacotesTurma, r as calcularParcelas, t as DIAS_VENCIMENTO } from "./turma-pacotes-B66fxwtb.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/radix-ui__react-radio-group.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/adesao._turmaId-Dy1k4AJV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var formDadosPessoaisSchema = object({
	nome_completo: string().trim().min(3, "Nome completo é obrigatório").max(120),
	cpf: string().trim().min(11, "CPF inválido").max(14, "CPF inválido"),
	rg: string().trim().max(20).optional(),
	telefone: string().trim().max(20).optional(),
	whatsapp: string().trim().min(8, "WhatsApp é obrigatório").max(20),
	email: string().trim().email("E-mail inválido").max(255),
	endereco: string().trim().min(3, "Endereço é obrigatório").max(255),
	cidade: string().trim().min(2, "Cidade é obrigatória").max(120),
	cep: string().trim().max(10).optional()
});
function AdesaoTurmaPage() {
	const loaderData = Route$6.useLoaderData();
	const { turmaId } = Route$6.useParams();
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();
	const realizarAdesao = useServerFn(realizarAdesaoPublica);
	const [etapa, setEtapa] = (0, import_react.useState)(1);
	const [dadosPessoais, setDadosPessoais] = (0, import_react.useState)({
		nome_completo: "",
		cpf: "",
		rg: "",
		telefone: "",
		whatsapp: "",
		email: "",
		endereco: "",
		cidade: "",
		cep: ""
	});
	const [pacoteId, setPacoteId] = (0, import_react.useState)("");
	const [numParcelas, setNumParcelas] = (0, import_react.useState)(1);
	const [diaVencimento, setDiaVencimento] = (0, import_react.useState)(10);
	const [autorizaImagem, setAutorizaImagem] = (0, import_react.useState)("");
	const [aceitouContrato, setAceitouContrato] = (0, import_react.useState)(false);
	const buscarTurma = useServerFn(buscarTurmaPublica);
	const { data: turma, isLoading, error } = useQuery({
		queryKey: ["turma-adesao", turmaId],
		queryFn: async () => {
			const data = await buscarTurma({ data: turmaId });
			if (!data) throw new Error("Turma não encontrada");
			return data;
		},
		initialData: loaderData?.turma || void 0
	});
	const cursoLower = (turma?.curso || "").toLowerCase();
	const obsLower = (turma?.observacoes || "").toLowerCase();
	const isCasamento = cursoLower.includes("casamento") || obsLower.includes("casamento");
	const isAniversario = cursoLower.includes("aniversario") || cursoLower.includes("aniversário") || cursoLower.includes("festa") || obsLower.includes("festa") || obsLower.includes("aniversario");
	const isEnsaio = cursoLower.includes("ensaio") || obsLower.includes("ensaio");
	const tipoEventoNome = isCasamento ? "Casamento" : isAniversario ? "Festa de Aniversário / 15 Anos" : isEnsaio ? "Ensaio Fotográfico" : "Formatura";
	const tipoEventoBadge = isCasamento ? "Adesão de Casamento" : isAniversario ? "Adesão - Festa de Aniversário" : isEnsaio ? "Adesão de Ensaio Fotográfico" : "Adesão de Formatura";
	const contratanteLabel = isCasamento ? "Contratante / Noivos" : isAniversario ? "Contratante / Aniversariante" : isEnsaio ? "Contratante / Modelo" : "Formando";
	const pacotesAtivos = extrairPacotesTurma(turma?.observacoes, turma?.curso).filter((p) => p.ativo !== false);
	const pacoteSelecionado = pacotesAtivos.find((p) => p.id === pacoteId) || pacotesAtivos[0];
	const parcelasCalculadas = pacoteSelecionado ? calcularParcelas(pacoteSelecionado.investimento, numParcelas, diaVencimento) : [];
	const finalizarAdesao = useMutation({
		mutationFn: async () => {
			if (!turma) throw new Error("Evento/Turma não encontrado");
			if (!pacoteSelecionado) throw new Error("Selecione um pacote");
			if (!autorizaImagem) throw new Error("Responda à autorização de uso de imagem");
			if (!aceitouContrato) throw new Error("Você precisa aceitar os termos do contrato");
			const cpfLimpo = apenasDigitos(dadosPessoais.cpf);
			if (cpfLimpo.length !== 11) throw new Error("CPF deve ter 11 dígitos");
			const resumoParcelas = parcelasCalculadas.map((p) => `${p.numero}ª Parcela - Vencimento: ${p.vencimento} - ${brl(p.valor)}`).join("\n");
			const textoContratoCompleto = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS E CINEMATOGRÁFICOS — ${tipoEventoNome.toUpperCase()}

CONTRATADA: ${EMPRESA.nome}, CNPJ: ${EMPRESA.cnpj}, Contato: ${EMPRESA.contato}.
CONTRATANTE: ${dadosPessoais.nome_completo}, CPF: ${dadosPessoais.cpf}, RG: ${dadosPessoais.rg || "Não informado"}, 
Endereço: ${dadosPessoais.endereco} - ${dadosPessoais.cidade} - CEP: ${dadosPessoais.cep || "Não informado"}, 
Telefone/WhatsApp: ${dadosPessoais.whatsapp}, E-mail: ${dadosPessoais.email}.

EVENTO: ${turma.nome} (${turma.curso} - ${turma.faculdade})

PACOTE SELECIONADO:
${pacoteSelecionado.nome}
Material: ${pacoteSelecionado.material}
Investimento Total: ${brl(pacoteSelecionado.investimento)}
Forma de Pagamento: Boleto Bancário / PIX (${numParcelas}x de ${brl(pacoteSelecionado.investimento / numParcelas)})
Dia de Vencimento Escolhido: Dia ${diaVencimento}

CRONOGRAMA DE VENCIMENTOS:
${resumoParcelas}

AUTORIZAÇÃO DE USO DE IMAGEM:
${autorizaImagem === "sim" ? "AUTORIZADO pelo CONTRATANTE" : "NÃO AUTORIZADO pelo CONTRATANTE"}

CLÁUSULAS GERAIS:
${CLAUSULAS_PADRAO}

Contrato aceito eletronicamente em ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} às ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}.`;
			const res = await realizarAdesao({ data: {
				turmaId: turma.id,
				dadosPessoais: {
					...dadosPessoais,
					cpf: cpfLimpo
				},
				pacote: pacoteSelecionado.nome,
				valorTotal: pacoteSelecionado.investimento,
				numParcelas,
				diaVencimento,
				autorizaImagem: autorizaImagem === "sim",
				textoContratoCompleto,
				parcelas: parcelasCalculadas.map((p) => ({
					numero: p.numero,
					valor: p.valor,
					vencimento: p.vencimento
				}))
			} });
			saveClienteSession({
				cpf: res.cpf,
				nome: res.nome,
				tipo: "aluno",
				email: res.email,
				alunoId: res.alunoId
			});
			return res;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["meu-cadastro"] });
			queryClient.invalidateQueries({ queryKey: ["meu-contrato"] });
			router.invalidate();
			toast.success("Adesão realizada com sucesso! Bem-vindo à sua área exclusiva.");
			navigate({ to: "/painel" });
		},
		onError: (err) => {
			toast.error(err.message || "Erro ao concluir adesão.");
		}
	});
	const avancarEtapa1 = () => {
		try {
			formDadosPessoaisSchema.parse(dadosPessoais);
			setEtapa(2);
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
		} catch (e) {
			if (e instanceof ZodError) toast.error(e.issues[0]?.message || "Preencha todos os campos obrigatórios.");
		}
	};
	const avancarEtapa2 = () => {
		if (!pacoteSelecionado) {
			toast.error("Por favor, selecione um pacote para continuar.");
			return;
		}
		setEtapa(3);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const avancarEtapa3 = () => {
		if (!autorizaImagem) {
			toast.error("Por favor, responda se autoriza o uso de imagem.");
			return;
		}
		setEtapa(4);
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-spin size-8 border-4 border-primary border-t-transparent rounded-full mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando informações da turma..."
			})]
		})
	});
	if (error || !turma) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "max-w-md w-full text-center p-6 space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold text-destructive",
				children: "Turma não encontrada"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "O link acessado é inválido ou a turma não está mais ativa. Verifique com a comissão de formatura."
			})]
		})
	});
	const steps = [
		{
			num: 1,
			title: "Dados Pessoais",
			icon: User
		},
		{
			num: 2,
			title: "Pacote e Parcelas",
			icon: Package
		},
		{
			num: 3,
			title: "Uso de Imagem",
			icon: Camera
		},
		{
			num: 4,
			title: "Contrato e Aceite",
			icon: FileText
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl mx-auto space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
								" ",
								tipoEventoBadge
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
							children: turma.nome
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4" }),
										" ",
										turma.curso
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }),
										" ",
										turma.faculdade
									]
								}),
								turma.cidade && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: turma.cidade })] })
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: steps.map((s) => {
						const Icon = s.icon;
						const isDone = etapa > s.num;
						const isCurrent = etapa === s.num;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex flex-col items-center text-center p-2 rounded-xl transition-all ${isCurrent ? "bg-primary text-primary-foreground shadow-md" : isDone ? "bg-primary/15 text-primary" : "bg-background text-muted-foreground border border-border"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-center size-7 rounded-full bg-white/20 mb-1",
									children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium hidden sm:inline",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-medium sm:hidden",
									children: ["Etapa ", s.num]
								})
							]
						}, s.num);
					})
				}),
				etapa === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-lg border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xl",
							children: ["Área 1: Dados Pessoais do ", contratanteLabel]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "mt-1",
							children: "Preencha com atenção. Estes dados constarão no seu contrato de prestação de serviços."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: "Etapa 1 de 4"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "nome",
										children: "Nome Completo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-destructive/80",
										children: "* Obrigatório"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "nome",
									placeholder: "Seu nome completo",
									value: dadosPessoais.nome_completo,
									onChange: (e) => setDadosPessoais({
										...dadosPessoais,
										nome_completo: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "cpf",
												children: "CPF"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-medium text-destructive/80",
												children: "* Obrigatório"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "cpf",
											placeholder: "000.000.000-00",
											value: dadosPessoais.cpf,
											onChange: (e) => setDadosPessoais({
												...dadosPessoais,
												cpf: e.target.value
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Seu CPF será utilizado como login na sua área exclusiva."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "rg",
											children: "RG"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-normal text-muted-foreground",
											children: "Opcional"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "rg",
										placeholder: "Número do seu RG",
										value: dadosPessoais.rg,
										onChange: (e) => setDadosPessoais({
											...dadosPessoais,
											rg: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "telefone",
											children: "Telefone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-normal text-muted-foreground",
											children: "Opcional"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "telefone",
										placeholder: "(00) 00000-0000",
										value: dadosPessoais.telefone,
										onChange: (e) => setDadosPessoais({
											...dadosPessoais,
											telefone: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "whatsapp",
											children: "WhatsApp"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-medium text-destructive/80",
											children: "* Obrigatório"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "whatsapp",
										placeholder: "(00) 90000-0000",
										value: dadosPessoais.whatsapp,
										onChange: (e) => setDadosPessoais({
											...dadosPessoais,
											whatsapp: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "E-mail"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-destructive/80",
										children: "* Obrigatório"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									type: "email",
									placeholder: "seuemail@exemplo.com",
									value: dadosPessoais.email,
									onChange: (e) => setDadosPessoais({
										...dadosPessoais,
										email: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "endereco",
										children: "Endereço Residencial Completo"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-medium text-destructive/80",
										children: "* Obrigatório"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "endereco",
									placeholder: "Rua, número, complemento, bairro",
									value: dadosPessoais.endereco,
									onChange: (e) => setDadosPessoais({
										...dadosPessoais,
										endereco: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "cidade",
											children: "Cidade / UF"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-medium text-destructive/80",
											children: "* Obrigatório"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "cidade",
										placeholder: "Ex: Araguaína - TO",
										value: dadosPessoais.cidade,
										onChange: (e) => setDadosPessoais({
											...dadosPessoais,
											cidade: e.target.value
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "cep",
											children: "CEP"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] font-normal text-muted-foreground",
											children: "Opcional"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "cep",
										placeholder: "00000-000",
										value: dadosPessoais.cep,
										onChange: (e) => setDadosPessoais({
											...dadosPessoais,
											cep: e.target.value
										})
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: avancarEtapa1,
									className: "gap-2 px-6",
									children: ["Avançar para Pacotes ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							})
						]
					})]
				}),
				etapa === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-lg border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xl",
							children: "Área 2: Escolha do Pacote e Forma de Pagamento"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "mt-1",
							children: "Selecione o pacote desejado e defina a quantidade de parcelas (1x a 12x) e o dia de vencimento."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: "Etapa 2 de 4"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-sm font-semibold",
									children: "Escolha o seu pacote de formatura:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-3",
									children: pacotesAtivos.map((p) => {
										const isSelected = pacoteSelecionado?.id === p.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											onClick: () => setPacoteId(p.id),
											className: `p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 bg-card"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `size-4 rounded-full border flex items-center justify-center ${isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground"}`,
															children: isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 bg-white rounded-full" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "font-bold text-base text-foreground",
															children: p.nome
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground pl-6",
														children: p.material
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-right whitespace-nowrap",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground block uppercase font-medium",
														children: "Investimento"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-lg font-extrabold text-primary",
														children: brl(p.investimento)
													})]
												})]
											})
										}, p.id);
									})
								})]
							}),
							pacoteSelecionado && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-muted/50 border border-border space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-semibold text-sm flex items-center gap-2 text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4 text-primary" }), " Condições de Pagamento (Boleto Bancário)"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "numParcelas",
												children: "Quantidade de Parcelas (1x a 12x)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(numParcelas),
												onValueChange: (val) => setNumParcelas(Number(val)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "numParcelas",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Selecione o parcelamento" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
													const valor = Math.round(pacoteSelecionado.investimento / n * 100) / 100;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
														value: String(n),
														children: [
															n,
															"x de ",
															brl(valor),
															" ",
															n === 1 ? "(À vista)" : "sem juros"
														]
													}, n);
												}) })]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "diaVencimento",
												children: "Melhor Dia de Vencimento do Boleto"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(diaVencimento),
												onValueChange: (val) => setDiaVencimento(Number(val)),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "diaVencimento",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Dia de vencimento" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DIAS_VENCIMENTO.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: String(d),
													children: ["Todo dia ", String(d).padStart(2, "0")]
												}, d)) })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Simulação dos Boletos (",
												parcelasCalculadas.length,
												" parcelas)"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Total: ", brl(pacoteSelecionado.investimento)] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "max-h-48 overflow-y-auto rounded-lg border border-border bg-background divide-y divide-border text-xs",
											children: parcelasCalculadas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2.5 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium",
													children: [
														p.numero,
														"º Boleto – ",
														p.mesAno
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground",
														children: ["Venc: ", p.vencimento.split("-").reverse().join("/")]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-bold text-foreground",
														children: brl(p.valor)
													})]
												})]
											}, p.numero))
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => setEtapa(1),
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Voltar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: avancarEtapa2,
									className: "gap-2 px-6",
									children: ["Avançar para Uso de Imagem ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})]
							})
						]
					})]
				}),
				etapa === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-lg border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xl",
							children: "Área 3: Termo de Autorização de Uso de Imagem"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "mt-1",
							children: "Defina sua preferência quanto à divulgação dos registros fotográficos nos canais oficiais da empresa."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: "Etapa 3 de 4"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-muted/40 border border-border text-sm leading-relaxed text-muted-foreground space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-foreground",
										children: "Termo de Consentimento para Uso de Imagem e Voz:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										"Autorizo a empresa ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: EMPRESA.nome }),
										" a utilizar minha imagem, obtida durante a cobertura dos eventos, sessões de estúdio e colação de grau desta turma, para fins exclusivos de divulgação profissional de seu portfólio em redes sociais, website institucional, mostruários e materiais promocionais, sem qualquer ônus financeiro."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-destructive font-medium",
										children: "* A resposta a esta pergunta é obrigatória para prosseguir."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-base font-semibold",
									children: "Você autoriza o uso da sua imagem para divulgação?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
									value: autorizaImagem,
									onValueChange: (val) => setAutorizaImagem(val),
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: "opt-sim",
										className: `flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${autorizaImagem === "sim" ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border hover:border-primary/40 bg-card text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "sim",
											id: "opt-sim"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-base",
											children: "Sim, eu autorizo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground font-normal",
											children: "Permitir publicação em redes e portfólio oficial."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: "opt-nao",
										className: `flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${autorizaImagem === "nao" ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border hover:border-primary/40 bg-card text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
											value: "nao",
											id: "opt-nao"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-base",
											children: "Não autorizo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground font-normal",
											children: "Minhas fotos serão de uso estritamente privado."
										})] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => setEtapa(2),
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Voltar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: avancarEtapa3,
									className: "gap-2 px-6",
									children: ["Avançar para o Contrato ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})]
							})
						]
					})]
				}),
				etapa === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-lg border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xl",
							children: "Área 4: Contrato de Prestação de Serviços"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "mt-1",
							children: "Leia o contrato gerado com suas opções. Para finalizar, confirme o aceite eletrônico."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-xs",
							children: "Etapa 4 de 4"
						})]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 sm:p-8 rounded-xl border-2 border-primary/20 bg-card max-h-[60vh] overflow-y-auto text-sm leading-relaxed space-y-5 shadow-inner",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center pb-4 border-b-2 border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-extrabold text-lg uppercase text-primary",
												children: EMPRESA.nome
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted-foreground text-xs font-medium",
												children: [
													EMPRESA.cnpj,
													" • ",
													EMPRESA.cidade
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-foreground mt-3 text-base",
												children: "CONTRATO DE ADESÃO INDIVIDUAL DE FORMATURA"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider",
											children: "1. Identificação das Partes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-muted/30 p-3 rounded-lg space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "CONTRATADA:"
													}),
													" ",
													EMPRESA.nome,
													", CNPJ: ",
													EMPRESA.cnpj,
													", Contato: ",
													EMPRESA.contato,
													"."
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "CONTRATANTE:"
													}),
													" ",
													dadosPessoais.nome_completo,
													", CPF: ",
													dadosPessoais.cpf,
													", RG: ",
													dadosPessoais.rg || "Não informado",
													", Endereço: ",
													dadosPessoais.endereco,
													", Cidade: ",
													dadosPessoais.cidade,
													", WhatsApp: ",
													dadosPessoais.whatsapp,
													", E-mail: ",
													dadosPessoais.email,
													"."
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "TURMA:"
													}),
													" ",
													turma.nome,
													" (",
													turma.curso,
													" – ",
													turma.faculdade,
													")."
												] })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider",
											children: "2. Pacote Contratado e Valores"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-muted/30 p-3 rounded-lg space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "PACOTE:"
													}),
													" ",
													pacoteSelecionado?.nome
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "DESCRIÇÃO DO MATERIAL:"
													}),
													" ",
													pacoteSelecionado?.material
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "VALOR TOTAL:"
													}),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-primary font-bold",
														children: brl(pacoteSelecionado?.investimento || 0)
													})
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground",
														children: "CONDIÇÃO:"
													}),
													" Boleto bancário em ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-bold",
														children: [
															numParcelas,
															"x de ",
															brl((pacoteSelecionado?.investimento || 0) / numParcelas)
														]
													}),
													" com vencimento todo dia ",
													diaVencimento,
													"."
												] })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider",
											children: "3. Cronograma de Vencimento"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-muted/30 p-3 rounded-lg space-y-1",
											children: parcelasCalculadas.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between border-b border-border/50 pb-1 last:border-0 last:pb-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													p.numero,
													"º Boleto: ",
													p.mesAno,
													" (Venc. ",
													p.vencimento.split("-").reverse().join("/"),
													")"
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: brl(p.valor)
												})]
											}, p.numero))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider",
											children: "4. Autorização de Uso de Imagem"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-muted/30 p-3 rounded-lg",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"O CONTRATANTE declara que ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground uppercase",
													children: autorizaImagem === "sim" ? "AUTORIZA" : "NÃO AUTORIZA"
												}),
												" o uso de sua imagem para divulgação institucional."
											] })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-primary border-b border-primary/10 pb-1 uppercase text-sm tracking-wider",
											children: "5. Cláusulas Gerais"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "bg-muted/10 p-4 rounded-lg border border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "whitespace-pre-line text-foreground/80 text-sm",
												children: CLAUSULAS_PADRAO
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-start gap-3 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "aceite-contrato",
										checked: aceitouContrato,
										onChange: (e) => setAceitouContrato(e.target.checked),
										className: "size-5 rounded border-primary text-primary focus:ring-primary mt-0.5"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-foreground block",
											children: "Li e aceito todos os termos e condições deste contrato"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground block",
											children: "Ao clicar no botão abaixo, sua adesão será confirmada e seu login será liberado utilizando seu CPF."
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => setEtapa(3),
									className: "gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Voltar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => finalizarAdesao.mutate(),
									disabled: !aceitouContrato || finalizarAdesao.isPending,
									className: "gap-2 px-6 bg-primary text-primary-foreground font-bold shadow-md hover:bg-primary/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), finalizarAdesao.isPending ? "Criando seu acesso..." : "Aceitar Contrato e Acessar Minha Área"]
								})]
							})
						]
					})]
				})
			]
		})
	});
}
//#endregion
export { AdesaoTurmaPage as component };
