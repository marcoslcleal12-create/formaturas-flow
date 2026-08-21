import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as getClienteSession, n as clearClienteSession, o as saveClienteSession, r as cpfParaEmail, t as apenasDigitos } from "./aluno-login-DxsnAriW.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { a as CardDescription, c as Input, h as loadDemandas, i as CardContent, o as CardHeader, r as Card, s as CardTitle } from "./router-Bk1JJVce.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as GraduationCap } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BwiAgwIO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("formando");
	const [cpf, setCpf] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [nome, setNome] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => {
			if (data.session) navigate({ to: "/painel" });
		});
		if (getClienteSession()?.cpf) navigate({ to: "/painel" });
	}, [navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "formando") {
				const rawDigits = apenasDigitos(cpf);
				if (rawDigits.length !== 11) throw new Error("Por favor, digite os 11 números do seu CPF (somente números).");
				try {
					const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
						email: cpfParaEmail(rawDigits),
						password: rawDigits
					});
					if (!authError && authData.session) {
						clearClienteSession();
						toast.success("Acesso liberado com sucesso!");
						navigate({ to: "/painel" });
						return;
					}
				} catch (e) {}
				try {
					const { data: alunoDb } = await supabase.from("alunos").select("id, nome_completo, cpf, turma_id").eq("cpf", rawDigits).maybeSingle();
					if (alunoDb) {
						saveClienteSession({
							cpf: rawDigits,
							nome: alunoDb.nome_completo,
							tipo: "aluno",
							email: cpfParaEmail(rawDigits),
							alunoId: alunoDb.id
						});
						toast.success(`Bem-vindo, ${alunoDb.nome_completo}! Acesso liberado.`);
						navigate({ to: "/painel" });
						return;
					}
				} catch (e) {}
				const clienteDemanda = loadDemandas().find((d) => apenasDigitos(d.cpf) === rawDigits);
				if (clienteDemanda) {
					saveClienteSession({
						cpf: rawDigits,
						nome: clienteDemanda.cliente,
						tipo: "demanda",
						email: cpfParaEmail(rawDigits),
						demandaId: clienteDemanda.id
					});
					toast.success(`Bem-vindo, ${clienteDemanda.cliente}! Acesso liberado.`);
					navigate({ to: "/painel" });
					return;
				}
				throw new Error(`CPF ${rawDigits} não encontrado no sistema. Verifique o número digitado ou contate a JM Formaturas.`);
			} else if (mode === "login") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				clearClienteSession();
				navigate({ to: "/painel" });
			} else {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: nome }
					}
				});
				if (error) throw error;
				clearClienteSession();
				toast.success("Conta criada!");
				navigate({ to: "/painel" });
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Não foi possível entrar");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-brand px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-col items-center text-primary-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-3 flex size-14 items-center justify-center rounded-2xl bg-gold text-accent-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: "JM Formaturas & Eventos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm opacity-75",
						children: "Gestão de formaturas, casamentos, aniversários e ensaios"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: mode === "formando" ? "Acesso do Formando / Cliente" : mode === "login" ? "Entrar (Equipe)" : "Criar conta" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: mode === "formando" ? "Use seu CPF como login e também como senha inicial." : mode === "login" ? "Use o e-mail e a senha cadastrados pela JM Formaturas." : "Cadastre um acesso de equipe." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: submit,
					className: "space-y-4",
					children: [
						mode === "formando" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "cpf",
									children: "CPF (Login e Senha)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "cpf",
									inputMode: "numeric",
									value: cpf,
									onChange: (e) => setCpf(e.target.value),
									placeholder: "000.000.000-00",
									required: true,
									maxLength: 20
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Digite seu CPF: ele é utilizado tanto como usuário quanto como senha."
								})
							]
						}) : null,
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "nome",
								children: "Nome completo"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "nome",
								value: nome,
								onChange: (e) => setNome(e.target.value),
								required: true,
								maxLength: 120
							})]
						}),
						mode !== "formando" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "E-mail"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								maxLength: 255
							})]
						}),
						mode !== "formando" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "senha",
								children: "Senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "senha",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								maxLength: 72
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Aguarde..." : mode === "signup" ? "Criar conta" : "Entrar"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-1 text-center text-sm text-muted-foreground",
					children: [
						mode !== "formando" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMode("formando"),
							className: "underline-offset-4 hover:underline",
							children: "Sou formando / cliente (login por CPF)"
						}),
						mode !== "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMode("login"),
							className: "underline-offset-4 hover:underline",
							children: "Sou da equipe (e-mail e senha)"
						}),
						mode !== "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMode("signup"),
							className: "underline-offset-4 hover:underline",
							children: "Criar conta de equipe"
						})
					]
				})] })]
			})]
		})
	});
}
//#endregion
export { AuthPage as component };
