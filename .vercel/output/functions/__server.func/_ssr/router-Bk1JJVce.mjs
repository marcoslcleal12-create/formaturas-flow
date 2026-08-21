import { o as __toESM, r as __exportAll } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { R as redirect, _ as createRootRouteWithContext, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as require_jsx_runtime, d as DialogContent, f as DialogDescription, h as DialogTitle, j as Slot, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as getServerFnById, n as __exportAll$1, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-BBdIZPXp.mjs";
import { a as requireSupabaseAuth, i as getClienteSession, n as clearClienteSession, t as apenasDigitos } from "./aluno-login-DxsnAriW.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { a as object, i as number, n as boolean, o as string, t as array } from "../_libs/zod.mjs";
import { t as supabase } from "./client-O-0JSjxv.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { D as GraduationCap, E as Heart, G as ChevronDown, H as CircleAlert, J as Calendar, O as FolderKanban, R as Clock, V as CircleCheck, Z as ArrowUpRight, _ as PartyPopper, a as UserRound, n as Wallet, o as TrendingUp, q as Camera, r as Users, t as X, v as PanelLeft, w as LayoutDashboard, x as LogOut } from "../_libs/lucide-react.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as CollapsibleTrigger$1, r as Root$1, t as CollapsibleContent$1 } from "../_libs/radix-ui__react-collapsible.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alunos.functions-CVWQHPcG.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var schema = object({ alunoId: string().uuid() });
/** Cria o usuário de acesso do formando: login = CPF, senha = CPF. */
var criarAcessoFormando = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => schema.parse(input)).handler(createSsrRpc("cdb9900ab9d24c2d9251c687a9cff613946f76e3495db63ce8c936313f2fc506"));
var publicSchema = object({
	alunoId: string().uuid(),
	cpf: string().min(11)
});
createServerFn({ method: "POST" }).inputValidator((input) => publicSchema.parse(input)).handler(createSsrRpc("3e8dc7772233a14f8b0e5bb6fe383babac22c86af3a0657cf7baf54fa9ed1c70"));
var adesaoSchema = object({
	turmaId: string().uuid(),
	dadosPessoais: object({
		nome_completo: string(),
		cpf: string(),
		rg: string().optional(),
		telefone: string(),
		whatsapp: string(),
		email: string(),
		endereco: string(),
		cidade: string(),
		cep: string().optional()
	}),
	pacote: string(),
	valorTotal: number(),
	numParcelas: number(),
	diaVencimento: number(),
	autorizaImagem: boolean(),
	textoContratoCompleto: string(),
	parcelas: array(object({
		numero: number(),
		valor: number(),
		vencimento: string()
	}))
});
/** Realiza toda a adesão do aluno na retaguarda (bypassing RLS), inclusive gerando login automático. */
var realizarAdesaoPublica = createServerFn({ method: "POST" }).inputValidator((input) => adesaoSchema.parse(input)).handler(createSsrRpc("db6405e0134e8a8f26038eeb3c80db4b699cbd2470df97c25001196f758d48d4"));
var buscarTurmaPublica = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("9ce116639a964e50e38b6c4890b9f68879251b6b8a8ab255d8913d6411e3997d"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bk1JJVce.js
var router_Bk1JJVce_exports = /* @__PURE__ */ __exportAll({
	_: () => Input,
	a: () => calcularParcelas,
	c: () => saveDemandas,
	d: () => CardContent,
	f: () => CardDescription,
	g: () => brl,
	getRouter: () => getRouter,
	h: () => AppShell,
	i: () => Route$6,
	l: () => Badge,
	m: () => CardTitle,
	n: () => Route,
	o: () => formatarCpf,
	p: () => CardHeader,
	r: () => Route$5,
	s: () => loadDemandas,
	t: () => router_exports,
	u: () => Card,
	v: () => useAuth
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-CnMRIhvy.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "JM Formaturas | Gestão financeira de formaturas" },
			{
				name: "description",
				content: "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar."
			},
			{
				name: "author",
				content: "JM Formaturas"
			},
			{
				property: "og:title",
				content: "JM Formaturas | Gestão financeira de formaturas"
			},
			{
				property: "og:description",
				content: "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			},
			{
				name: "twitter:title",
				content: "JM Formaturas | Gestão financeira de formaturas"
			},
			{
				name: "twitter:description",
				content: "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9293382f2e49aecbd79ee4194ce8e009/id-preview-e1efcec8--28a57bfb-60ee-4e45-a8fd-fe494aaf5c6b.lovable.app-1786592562235.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9293382f2e49aecbd79ee4194ce8e009/id-preview-e1efcec8--28a57bfb-60ee-4e45-a8fd-fe494aaf5c6b.lovable.app-1786592562235.png"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Manrope:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-DhcqEeFp.mjs");
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "JM Formaturas | Gestão financeira de formaturas" },
		{
			name: "description",
			content: "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar."
		},
		{
			property: "og:title",
			content: "JM Formaturas | Gestão financeira de formaturas"
		},
		{
			property: "og:description",
			content: "Sistema da JM Formaturas para gerenciar turmas, formandos, contratos e pagamentos de formatura em um só lugar."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./route-Di7iQBCH.mjs");
var Route$11 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (data?.user) return { user: data.user };
		const clientSession = getClienteSession();
		if (clientSession?.cpf) return { user: {
			id: clientSession.cpf,
			email: clientSession.email,
			user_metadata: { full_name: clientSession.nome }
		} };
		throw redirect({ to: "/auth" });
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./auth-BwiAgwIO.mjs");
var Route$10 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Entrar | JM Formaturas & Eventos" },
		{
			name: "description",
			content: "Acesse o painel da JM Formaturas para acompanhar seu contrato, parcelas e pagamentos de formatura e eventos."
		},
		{
			property: "og:title",
			content: "Entrar | JM Formaturas & Eventos"
		},
		{
			property: "og:description",
			content: "Área de acesso de formandos, clientes e equipe da JM Formaturas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
function useAuth() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let active = true;
		const loadRoles = async (uid) => {
			if (!uid) {
				if (active) setRoles([]);
				return;
			}
			try {
				const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
				if (active) setRoles((data ?? []).map((r) => r.role));
			} catch (e) {
				if (active) setRoles([]);
			}
		};
		supabase.auth.getSession().then(({ data }) => {
			if (!active) return;
			if (data.session?.user) {
				setSession(data.session);
				setUser(data.session.user);
				loadRoles(data.session.user.id).finally(() => {
					if (active) setLoading(false);
				});
			} else {
				const clientSession = getClienteSession();
				if (clientSession?.cpf) {
					const fakeUser = {
						id: clientSession.cpf,
						email: clientSession.email,
						user_metadata: { full_name: clientSession.nome },
						app_metadata: {},
						aud: "authenticated",
						created_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					setUser(fakeUser);
					setRoles(["aluno"]);
				} else {
					setUser(null);
					setRoles([]);
				}
				if (active) setLoading(false);
			}
		});
		const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
			setSession(s);
			if (s?.user) {
				setUser(s.user);
				loadRoles(s.user.id);
			} else {
				const clientSession = getClienteSession();
				if (clientSession?.cpf) {
					const fakeUser = {
						id: clientSession.cpf,
						email: clientSession.email,
						user_metadata: { full_name: clientSession.nome },
						app_metadata: {},
						aud: "authenticated",
						created_at: (/* @__PURE__ */ new Date()).toISOString()
					};
					setUser(fakeUser);
					setRoles(["aluno"]);
				} else {
					setUser(null);
					setRoles([]);
				}
			}
		});
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	const isStaff = roles.includes("super_admin") || roles.includes("funcionario");
	return {
		session,
		user,
		roles,
		loading,
		isStaff,
		isSuperAdmin: roles.includes("super_admin"),
		isAluno: !isStaff
	};
}
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 604800;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = import_react.createContext(null);
function useSidebar() {
	const context = import_react.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = import_react.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = import_react.useState(false);
	const [_open, _setOpen] = import_react.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = import_react.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = import_react.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = import_react.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			})
		})
	});
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = import_react.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			})
		})]
	});
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = import_react.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = import_react.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	});
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	});
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	});
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = import_react.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = import_react.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	});
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = import_react.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = import_react.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		})]
	});
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = import_react.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
var Collapsible = Root$1;
var CollapsibleTrigger = CollapsibleTrigger$1;
var CollapsibleContent = CollapsibleContent$1;
function AppShell({ children }) {
	const { isStaff, user } = useAuth();
	const navigate = useNavigate();
	const currentPath = useRouterState().location.pathname;
	const signOut = async () => {
		clearClienteSession();
		await supabase.auth.signOut();
		navigate({ to: "/auth" });
	};
	const isDemandasActive = currentPath.startsWith("/turmas") || currentPath.startsWith("/demandas");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarProvider, {
		defaultOpen: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen w-full bg-background text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, {
				variant: "sidebar",
				collapsible: "icon",
				className: "border-r border-border/60",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
						className: "border-b border-border/40 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gold text-accent-foreground shadow-sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col leading-tight group-data-[collapsible=icon]:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-base font-semibold text-foreground",
									children: "JM Formaturas"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
									children: isStaff ? "Painel de Gestão" : "Área do formando"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, {
						className: "px-2 py-3",
						children: isStaff ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, {
							className: "px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80",
							children: "NAVEGAÇÃO"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
							asChild: true,
							isActive: currentPath === "/dashboard",
							tooltip: "VISÃO GERAL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard",
								className: "flex items-center gap-2.5 font-medium tracking-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "size-4 text-brand dark:text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VISÃO GERAL" })]
							})
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
							asChild: true,
							isActive: currentPath.startsWith("/financeiro"),
							tooltip: "FINANCEIRO",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/financeiro",
								className: "flex items-center gap-2.5 font-medium tracking-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4 text-brand dark:text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FINANCEIRO" })]
							})
						}) })] }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, {
							className: "mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, {
								className: "px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80",
								children: "DEMANDAS"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collapsible, {
								defaultOpen: isDemandasActive,
								className: "group/collapsible",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarMenuItem, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarMenuButton, {
										tooltip: "DEMANDAS",
										isActive: isDemandasActive,
										className: "w-full justify-between font-medium tracking-wide",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-4 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DEMANDAS" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90 group-data-[collapsible=icon]:hidden" })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarMenuSub, {
									className: "my-1 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubButton, {
											asChild: true,
											isActive: currentPath.startsWith("/turmas"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/turmas",
												className: "flex items-center gap-2 font-medium tracking-wide",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TURMAS" })]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubButton, {
											asChild: true,
											isActive: currentPath === "/demandas/casamento",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/demandas/casamento",
												className: "flex items-center gap-2 font-medium tracking-wide",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4 text-pink-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CASAMENTO" })]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubButton, {
											asChild: true,
											isActive: currentPath === "/demandas/festa-aniversario",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/demandas/festa-aniversario",
												className: "flex items-center gap-2 font-medium tracking-wide",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "size-4 text-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FESTA DE ANIVERSÁRIO" })]
											})
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuSubButton, {
											asChild: true,
											isActive: currentPath === "/demandas/ensaio",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/demandas/ensaio",
												className: "flex items-center gap-2 font-medium tracking-wide",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-4 text-blue-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ENSAIO" })]
											})
										}) })
									]
								}) })] })
							}) }) })]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, {
							className: "px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80",
							children: "FORMANDO"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
							asChild: true,
							isActive: currentPath === "/painel",
							tooltip: "MEU PAINEL",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/painel",
								className: "flex items-center gap-2.5 font-medium tracking-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-4 text-brand dark:text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MEU PAINEL" })]
							})
						}) }) }) })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarFooter, {
						className: "border-t border-border/40 p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-xs text-muted-foreground group-data-[collapsible=icon]:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-foreground truncate",
									children: user?.email
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: isStaff ? "Administrador" : "Aluno / Formando"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: signOut,
								title: "Sair da conta",
								"aria-label": "Sair",
								className: "size-8 shrink-0 hover:bg-destructive/10 hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
							})]
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarInset, {
				className: "flex min-w-0 flex-1 flex-col bg-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-4 backdrop-blur-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm font-medium text-muted-foreground",
								children: ["JM Formaturas — ", isStaff ? "Painel de Gestão" : "Área do Formando"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs text-muted-foreground sm:inline-block",
							children: user?.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: signOut,
							className: "gap-1.5 text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sair" })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-6 md:p-8",
					children
				})]
			})]
		})
	});
}
function brl(value) {
	return value.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var STORAGE_KEY = "jm_formaturas_demandas_v1";
function calcularParcelas(valorTotal, valorEntrada, desconto, numParcelas, diaVencimento, primeiroVencimento) {
	const liquido = Math.max(0, valorTotal - desconto - valorEntrada);
	if (numParcelas <= 0 || liquido <= 0) return [];
	const valorParcela = Math.round(liquido / numParcelas * 100) / 100;
	const dtInicial = primeiroVencimento ? /* @__PURE__ */ new Date(primeiroVencimento + "T00:00:00") : /* @__PURE__ */ new Date();
	const parcelas = [];
	const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	for (let i = 0; i < numParcelas; i++) {
		const ano = dtInicial.getFullYear();
		const mes = dtInicial.getMonth() + i;
		const iso = new Date(ano, mes, Math.min(diaVencimento || 10, 28)).toISOString().slice(0, 10);
		const status = iso < hoje ? "atrasado" : "pendente";
		parcelas.push({
			numero: i + 1,
			vencimento: iso,
			valor: i === numParcelas - 1 ? Math.round((liquido - valorParcela * (numParcelas - 1)) * 100) / 100 : valorParcela,
			status
		});
	}
	return parcelas;
}
var initialDemoDemandas = [
	{
		id: "dem-cas-1",
		tipo: "casamento",
		cliente: "Mariana & Rodrigo",
		cpf: "12345678901",
		email: "mariana.rodrigo@email.com",
		whatsapp: "(11) 98765-4321",
		dataEvento: "2026-11-20",
		local: "Espaço Villa Regia - São Paulo, SP",
		status: "confirmada",
		pacote: "Cobertura Completa (Foto + Filmo + Álbum Premium)",
		valorTotal: 14500,
		valorEntrada: 2500,
		desconto: 500,
		numParcelas: 6,
		diaVencimento: 10,
		primeiroVencimento: "2026-06-10",
		formaPagamento: "pix",
		observacoes: "Cerimônia ao ar livre às 17h.",
		loginAtivo: true,
		parcelas: calcularParcelas(14500, 2500, 500, 6, 10, "2026-06-10"),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "dem-ani-1",
		tipo: "festa-aniversario",
		cliente: "Sofia Martins",
		cpf: "98765432100",
		email: "sofia.martins@email.com",
		whatsapp: "(11) 97111-2233",
		dataEvento: "2026-10-15",
		local: "Buffet Mansão Cristal - São Paulo, SP",
		status: "confirmada",
		pacote: "Cobertura Debutante 15 Anos (Foto + Vídeo + Cabine)",
		valorTotal: 8500,
		valorEntrada: 1500,
		desconto: 0,
		numParcelas: 5,
		diaVencimento: 15,
		primeiroVencimento: "2026-06-15",
		formaPagamento: "boleto",
		observacoes: "Entrada triunfal com valsa às 22h.",
		loginAtivo: true,
		parcelas: calcularParcelas(8500, 1500, 0, 5, 15, "2026-06-15"),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	},
	{
		id: "dem-ens-1",
		tipo: "ensaio",
		cliente: "Camila Ribeiro",
		cpf: "45678912304",
		email: "camila.ribeiro@email.com",
		whatsapp: "(11) 96555-4433",
		dataEvento: "2026-09-18",
		local: "Parque do Ibirapuera - São Paulo, SP",
		status: "confirmada",
		pacote: "Ensaio Pré-Wedding (2h de sessão + 40 fotos)",
		valorTotal: 1800,
		valorEntrada: 300,
		desconto: 0,
		numParcelas: 3,
		diaVencimento: 5,
		primeiroVencimento: "2026-07-05",
		formaPagamento: "pix",
		observacoes: "Fotos ao pôr do sol.",
		loginAtivo: true,
		parcelas: calcularParcelas(1800, 300, 0, 3, 5, "2026-07-05"),
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	}
];
function loadDemandas() {
	if (typeof window === "undefined") return initialDemoDemandas;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDemoDemandas));
			return initialDemoDemandas;
		}
		return JSON.parse(raw);
	} catch (e) {
		console.error("Erro ao carregar demandas:", e);
		return initialDemoDemandas;
	}
}
function saveDemandas(items) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch (e) {
		console.error("Erro ao salvar demandas:", e);
	}
}
function formatarCpf(cpfRaw) {
	const digits = apenasDigitos(cpfRaw).slice(0, 11);
	if (digits.length <= 3) return digits;
	if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
	if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
	return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}
var Route$9 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [
		{ title: "Visão Geral Consolidada | JM Formaturas & Eventos" },
		{
			name: "description",
			content: "Painel de gestão com estatísticas consolidadas de turmas, casamentos, aniversários e ensaios."
		},
		{
			property: "og:title",
			content: "Visão Geral Consolidada | JM Formaturas & Eventos"
		},
		{
			property: "og:description",
			content: "Acompanhe entradas, saldo a receber, inadimplência e desempenho por grupo de demandas."
		}
	] }),
	component: DashboardPage
});
function DashboardPage() {
	const [demandas, setDemandas] = (0, import_react.useState)([]);
	const hoje = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	(0, import_react.useEffect)(() => {
		setDemandas(loadDemandas());
	}, []);
	const { data, isLoading } = useQuery({
		queryKey: ["dashboard-full-data"],
		queryFn: async () => {
			const [turmas, alunos, contratos] = await Promise.all([
				supabase.from("turmas").select("*, alunos(count)").order("created_at", { ascending: false }),
				supabase.from("alunos").select("id, turma_id, nome_completo, status"),
				supabase.from("contratos").select("*, parcelas(*), alunos(id, nome_completo, turmas(nome))")
			]);
			if (turmas.error) throw turmas.error;
			if (alunos.error) throw alunos.error;
			if (contratos.error) throw contratos.error;
			return {
				turmas: turmas.data,
				alunos: alunos.data,
				contratos: contratos.data
			};
		}
	});
	const turmas = data?.turmas ?? [];
	const alunos = data?.alunos ?? [];
	const contratos = data?.contratos ?? [];
	const todasParcelasTurmas = contratos.flatMap((c) => c.parcelas ?? []);
	const turmasContratado = contratos.reduce((s, c) => s + Number(c.valor_total) - Number(c.desconto), 0);
	const turmasRecebidoTotal = contratos.reduce((s, c) => s + Number(c.valor_entrada), 0) + todasParcelasTurmas.reduce((s, p) => s + Number(p.valor_pago), 0);
	const turmasFaltaReceber = Math.max(0, turmasContratado - turmasRecebidoTotal);
	const turmasAtrasadas = todasParcelasTurmas.filter((p) => p.status !== "pago" && p.vencimento < hoje).reduce((s, p) => s + (Number(p.valor) - Number(p.valor_pago)), 0);
	const casamentos = demandas.filter((d) => d.tipo === "casamento");
	const casamentosContratado = casamentos.reduce((s, d) => s + (d.valorTotal - d.desconto), 0);
	const casamentosRecebido = casamentos.reduce((s, d) => {
		const pagas = d.parcelas.filter((p) => p.status === "pago").reduce((pS, p) => pS + p.valor, 0);
		return s + d.valorEntrada + pagas;
	}, 0);
	const casamentosFalta = Math.max(0, casamentosContratado - casamentosRecebido);
	const casamentosAtrasadas = casamentos.reduce((s, d) => {
		return s + d.parcelas.filter((p) => p.status !== "pago" && p.vencimento < hoje).reduce((pS, p) => pS + p.valor, 0);
	}, 0);
	const festas = demandas.filter((d) => d.tipo === "festa-aniversario");
	const festasContratado = festas.reduce((s, d) => s + (d.valorTotal - d.desconto), 0);
	const festasRecebido = festas.reduce((s, d) => {
		const pagas = d.parcelas.filter((p) => p.status === "pago").reduce((pS, p) => pS + p.valor, 0);
		return s + d.valorEntrada + pagas;
	}, 0);
	const festasFalta = Math.max(0, festasContratado - festasRecebido);
	const festasAtrasadas = festas.reduce((s, d) => {
		return s + d.parcelas.filter((p) => p.status !== "pago" && p.vencimento < hoje).reduce((pS, p) => pS + p.valor, 0);
	}, 0);
	const ensaios = demandas.filter((d) => d.tipo === "ensaio");
	const ensaiosContratado = ensaios.reduce((s, d) => s + (d.valorTotal - d.desconto), 0);
	const ensaiosRecebido = ensaios.reduce((s, d) => {
		const pagas = d.parcelas.filter((p) => p.status === "pago").reduce((pS, p) => pS + p.valor, 0);
		return s + d.valorEntrada + pagas;
	}, 0);
	const ensaiosFalta = Math.max(0, ensaiosContratado - ensaiosRecebido);
	const ensaiosAtrasadas = ensaios.reduce((s, d) => {
		return s + d.parcelas.filter((p) => p.status !== "pago" && p.vencimento < hoje).reduce((pS, p) => pS + p.valor, 0);
	}, 0);
	const totalGeralContratado = turmasContratado + casamentosContratado + festasContratado + ensaiosContratado;
	const totalGeralRecebido = turmasRecebidoTotal + casamentosRecebido + festasRecebido + ensaiosRecebido;
	const totalGeralFaltaReceber = turmasFaltaReceber + casamentosFalta + festasFalta + ensaiosFalta;
	const totalGeralAtrasado = turmasAtrasadas + casamentosAtrasadas + festasAtrasadas + ensaiosAtrasadas;
	const percentualGeralRecebido = totalGeralContratado > 0 ? Math.round(totalGeralRecebido / totalGeralContratado * 100) : 0;
	const totalEventosCount = turmas.length + demandas.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Visão Geral Consolidada"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-0.5",
					children: "Acompanhamento financeiro e operacional unificado: Turmas, Casamentos, Aniversários e Ensaios."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/financeiro",
							children: "Ver Financeiro Completo"
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm border-border/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Total Contratado"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-2xl font-bold text-foreground",
									children: brl(totalGeralContratado)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-3" }),
										" ",
										totalEventosCount,
										" contratos & demandas ativas"
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm border-border/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400",
										children: "Total Recebido (Entradas)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400",
									children: brl(totalGeralRecebido)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-[11px] text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progresso de recebimento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [percentualGeralRecebido, "%"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-emerald-500 transition-all duration-500",
											style: { width: `${Math.min(percentualGeralRecebido, 100)}%` }
										})
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm border-border/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400",
										children: "Quanto Falta Receber"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400",
									children: brl(totalGeralFaltaReceber)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Saldo pendente a ser liquidado nos vencimentos futuros"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-sm border-border/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-destructive",
										children: "Total em Atraso"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-2xl font-bold text-destructive",
									children: brl(totalGeralAtrasado)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: totalGeralAtrasado > 0 ? "Requer cobrança e acompanhamento" : "Nenhuma parcela em atraso 🎉"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "text-lg font-bold tracking-tight flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "size-5 text-gold" }), " Desempenho Financeiro por Grupos de Demanda"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Dados em tempo real"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupStatCard, {
							title: "TURMAS DE FORMATURA",
							subtitle: `${turmas.length} turmas cadastradas · ${alunos.length} formandos`,
							icon: GraduationCap,
							colorClass: "border-l-4 border-l-primary",
							badgeBg: "bg-primary/10 text-primary",
							linkTo: "/turmas",
							contratado: turmasContratado,
							recebido: turmasRecebidoTotal,
							falta: turmasFaltaReceber,
							atrasado: turmasAtrasadas
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupStatCard, {
							title: "CASAMENTOS",
							subtitle: `${casamentos.length} casamentos registrados`,
							icon: Heart,
							colorClass: "border-l-4 border-l-pink-500",
							badgeBg: "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400",
							linkTo: "/demandas/casamento",
							contratado: casamentosContratado,
							recebido: casamentosRecebido,
							falta: casamentosFalta,
							atrasado: casamentosAtrasadas
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupStatCard, {
							title: "FESTAS DE ANIVERSÁRIO & 15 ANOS",
							subtitle: `${festas.length} eventos e aniversários cadastrados`,
							icon: PartyPopper,
							colorClass: "border-l-4 border-l-purple-500",
							badgeBg: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
							linkTo: "/demandas/festa-aniversario",
							contratado: festasContratado,
							recebido: festasRecebido,
							falta: festasFalta,
							atrasado: festasAtrasadas
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupStatCard, {
							title: "ENSAIOS FOTOGRÁFICOS",
							subtitle: `${ensaios.length} ensaios fotográficos cadastrados`,
							icon: Camera,
							colorClass: "border-l-4 border-l-blue-500",
							badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
							linkTo: "/demandas/ensaio",
							contratado: ensaiosContratado,
							recebido: ensaiosRecebido,
							falta: ensaiosFalta,
							atrasado: ensaiosAtrasadas
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-4 text-primary" }), " Turmas Recentes"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Últimas turmas cadastradas no sistema" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/turmas",
								className: "gap-1 text-xs",
								children: ["Ver todas ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" })]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Carregando turmas..."
							}),
							!isLoading && turmas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground py-4 text-center",
								children: "Nenhuma turma cadastrada."
							}),
							turmas.slice(0, 5).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/turmas/$turmaId",
								params: { turmaId: t.id },
								className: "flex items-center justify-between rounded-xl border border-border/70 p-3 hover:bg-muted/50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm",
									children: t.nome
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										t.curso,
										" · ",
										t.faculdade
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [t.alunos?.[0]?.count ?? 0, " alunos"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: t.status === "ativa" ? "default" : "secondary",
										className: "text-[10px]",
										children: t.status
									})]
								})]
							}, t.id))
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-4 text-pink-500" }), " Demandas Recentes"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Casamentos, festas e ensaios com contrato ativo" })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-2",
						children: [demandas.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground py-4 text-center",
							children: "Nenhuma demanda cadastrada ainda."
						}), demandas.slice(0, 5).map((d) => {
							const linkMap = {
								casamento: "/demandas/casamento",
								"festa-aniversario": "/demandas/festa-aniversario",
								ensaio: "/demandas/ensaio"
							};
							const tag = {
								casamento: {
									label: "Casamento",
									color: "bg-pink-100 text-pink-700 dark:bg-pink-950/50"
								},
								"festa-aniversario": {
									label: "Aniversário",
									color: "bg-purple-100 text-purple-700 dark:bg-purple-950/50"
								},
								ensaio: {
									label: "Ensaio",
									color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50"
								}
							}[d.tipo];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: linkMap[d.tipo],
								className: "flex items-center justify-between rounded-xl border border-border/70 p-3 hover:bg-muted/50 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold text-sm flex items-center gap-2",
									children: [d.cliente, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] px-2 py-0.5 rounded font-medium ${tag.color}`,
										children: tag.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground flex items-center gap-2 mt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }),
										(/* @__PURE__ */ new Date(d.dataEvento + "T00:00:00")).toLocaleDateString("pt-BR"),
										" · ",
										d.pacote
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-foreground",
										children: brl(d.valorTotal)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-emerald-600 font-medium",
										children: [
											d.parcelas.filter((p) => p.status === "pago").length,
											"/",
											d.numParcelas,
											" pagas"
										]
									})]
								})]
							}, d.id);
						})]
					})]
				})]
			})
		]
	}) });
}
function GroupStatCard({ title, subtitle, icon: Icon, colorClass, badgeBg, linkTo, contratado, recebido, falta, atrasado }) {
	const percentual = contratado > 0 ? Math.round(recebido / contratado * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `shadow-card ${colorClass} transition-all hover:shadow-md`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
			className: "pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `p-2 rounded-lg ${badgeBg}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base font-bold tracking-tight",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "text-xs",
						children: subtitle
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "h-8 text-xs gap-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: linkTo,
						children: ["Acessar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3" })]
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-4 pt-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Recebido vs Contratado"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground",
						children: [percentual, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 w-full overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-primary transition-all duration-500",
						style: { width: `${Math.min(percentual, 100)}%` }
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 rounded-lg bg-muted/50 border text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Contratado"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-foreground mt-0.5",
							children: brl(contratado)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400",
							children: "Entradas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5",
							children: brl(recebido)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-amber-700 dark:text-amber-400",
							children: "Falta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-bold text-amber-700 dark:text-amber-400 mt-0.5",
							children: brl(falta)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `p-2.5 rounded-lg border text-center ${atrasado > 0 ? "bg-destructive/10 border-destructive/30" : "bg-muted/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-[10px] uppercase tracking-wider ${atrasado > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}`,
							children: "Atrasados"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-xs font-bold mt-0.5 ${atrasado > 0 ? "text-destructive" : "text-foreground"}`,
							children: brl(atrasado)
						})]
					})
				]
			})]
		})]
	});
}
var $$splitComponentImporter$8 = () => import("./financeiro-P8EG0dxo.mjs");
var Route$8 = createFileRoute("/_authenticated/financeiro")({
	head: () => ({ meta: [
		{ title: "Financeiro Consolidado | JM Formaturas & Eventos" },
		{
			name: "description",
			content: "Fluxo de caixa, entradas, saídas, parcelas e inadimplência consolidadas de turmas e demandas."
		},
		{
			property: "og:title",
			content: "Financeiro Consolidado | JM Formaturas & Eventos"
		},
		{
			property: "og:description",
			content: "Controle financeiro de todas as turmas, casamentos, aniversários, ensaios e despesas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./painel-CJvkhGAb.mjs");
var Route$7 = createFileRoute("/_authenticated/painel")({
	head: () => ({ meta: [
		{ title: "Meu painel | JM Formaturas" },
		{
			name: "description",
			content: "Área exclusiva do cliente: seus dados, seu contrato e acompanhamento financeiro."
		},
		{
			property: "og:title",
			content: "Meu painel | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Acompanhe seu contrato e parcelas com a JM Formaturas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./adesao._turmaId-DDlqPlbZ.mjs");
var Route$6 = createFileRoute("/adesao/$turmaId")({
	head: () => ({ meta: [{ title: "Adesão de Formatura | JM Formaturas" }, {
		name: "description",
		content: "Formulário oficial de adesão e escolha de pacotes de formatura."
	}] }),
	loader: async ({ params }) => {
		try {
			return { turma: await buscarTurmaPublica({ data: params.turmaId }) };
		} catch {
			return { turma: null };
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./alunos._alunoId-DYRfgldQ.mjs");
var Route$5 = createFileRoute("/_authenticated/alunos/$alunoId")({
	head: () => ({ meta: [
		{ title: "Formando | JM Formaturas" },
		{
			name: "description",
			content: "Dados do formando, contrato de formatura, parcelas e pagamentos."
		},
		{
			property: "og:title",
			content: "Formando | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Contrato, parcelas e situação financeira do formando."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./demandas.casamento-VHbklIT0.mjs");
var Route$4 = createFileRoute("/_authenticated/demandas/casamento")({
	head: () => ({ meta: [
		{ title: "Demandas: Casamentos | JM Formaturas" },
		{
			name: "description",
			content: "Gestão de demandas de casamentos com contratos, parcelas e login por CPF."
		},
		{
			property: "og:title",
			content: "Demandas: Casamentos | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Gestão de ensaios, cerimônias e festas de casamentos contratadas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./demandas.ensaio-CX6UgaEm.mjs");
var Route$3 = createFileRoute("/_authenticated/demandas/ensaio")({
	head: () => ({ meta: [
		{ title: "Demandas: Ensaio Fotográfico | JM Formaturas" },
		{
			name: "description",
			content: "Gestão de ensaios fotográficos com contratos, parcelas e login por CPF."
		},
		{
			property: "og:title",
			content: "Demandas: Ensaio Fotográfico | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Gestão de ensaios individuais, corporativos, gestantes e pré-wedding."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./demandas.festa-aniversario-C7LDrIwB.mjs");
var Route$2 = createFileRoute("/_authenticated/demandas/festa-aniversario")({
	head: () => ({ meta: [
		{ title: "Demandas: Festa de Aniversário | JM Formaturas" },
		{
			name: "description",
			content: "Gestão de demandas de festas de aniversário e 15 anos com contratos, parcelas e login por CPF."
		},
		{
			property: "og:title",
			content: "Demandas: Festa de Aniversário | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Gestão de aniversários infantis, debutantes 15 anos e eventos comemorativos."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./turmas.index-YJiZBPWA.mjs");
var Route$1 = createFileRoute("/_authenticated/turmas/")({
	head: () => ({ meta: [
		{ title: "Turmas | JM Formaturas" },
		{
			name: "description",
			content: "Cadastre e acompanhe as turmas de formatura atendidas pela JM Formaturas."
		},
		{
			property: "og:title",
			content: "Turmas | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Gestão de turmas de formatura por curso, faculdade e semestre."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./turmas._turmaId-C6tXxbyF.mjs");
var Route = createFileRoute("/_authenticated/turmas/$turmaId")({
	head: () => ({ meta: [
		{ title: "Detalhes da turma | JM Formaturas" },
		{
			name: "description",
			content: "Formandos, dados de contato e situação da turma de formatura."
		},
		{
			property: "og:title",
			content: "Detalhes da turma | JM Formaturas"
		},
		{
			property: "og:description",
			content: "Lista de formandos e informações da turma na JM Formaturas."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AuthenticatedRouteRoute = Route$11.update({
	id: "/_authenticated",
	getParentRoute: () => Route$13
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$13
});
var AuthenticatedDashboardRoute = Route$9.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedFinanceiroRoute = Route$8.update({
	id: "/financeiro",
	path: "/financeiro",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPainelRoute = Route$7.update({
	id: "/painel",
	path: "/painel",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AdesaoTurmaIdRoute = Route$6.update({
	id: "/adesao/$turmaId",
	path: "/adesao/$turmaId",
	getParentRoute: () => Route$13
});
var AuthenticatedAlunosAlunoIdRoute = Route$5.update({
	id: "/alunos/$alunoId",
	path: "/alunos/$alunoId",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDemandasCasamentoRoute = Route$4.update({
	id: "/demandas/casamento",
	path: "/demandas/casamento",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDemandasEnsaioRoute = Route$3.update({
	id: "/demandas/ensaio",
	path: "/demandas/ensaio",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDemandasFestaAniversarioRoute = Route$2.update({
	id: "/demandas/festa-aniversario",
	path: "/demandas/festa-aniversario",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedTurmasIndexRoute = Route$1.update({
	id: "/turmas/",
	path: "/turmas/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedDashboardRoute,
	AuthenticatedFinanceiroRoute,
	AuthenticatedPainelRoute,
	AuthenticatedAlunosAlunoIdRoute,
	AuthenticatedDemandasCasamentoRoute,
	AuthenticatedDemandasEnsaioRoute,
	AuthenticatedDemandasFestaAniversarioRoute,
	AuthenticatedTurmasTurmaIdRoute: Route.update({
		id: "/turmas/$turmaId",
		path: "/turmas/$turmaId",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedTurmasIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	AdesaoTurmaIdRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll$1({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { saveDemandas as _, CardDescription as a, criarAcessoFormando as b, Input as c, Route$6 as d, brl as f, router_Bk1JJVce_exports as g, loadDemandas as h, CardContent as i, Route as l, formatarCpf as m, Badge as n, CardHeader as o, calcularParcelas as p, Card as r, CardTitle as s, AppShell as t, Route$5 as u, useAuth as v, realizarAdesaoPublica as x, buscarTurmaPublica as y };
