import { t as createMiddleware } from "./createMiddleware-B_4t7rW1.mjs";
import { i as getRequest } from "./server-D2jkvuIq.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aluno-login-Bxk3uUlL.js
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
var requireSupabaseAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
	const SUPABASE_URL = "https://ozexujmqfniaecwwdmet.supabase.co";
	const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_T8e-A2_8Dfk52BH4FpGRbw_ajmsNgND";
	const request = getRequest();
	if (!request?.headers) throw new Error("Unauthorized: No request headers available");
	const authHeader = request.headers.get("authorization");
	if (!authHeader) throw new Error("Unauthorized: No authorization header provided");
	if (!authHeader.startsWith("Bearer ")) throw new Error("Unauthorized: Only Bearer tokens are supported");
	const token = authHeader.replace("Bearer ", "");
	if (!token) throw new Error("Unauthorized: No token provided");
	if (token.split(".").length !== 3) throw new Error("Unauthorized: Invalid token");
	const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
		global: {
			fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
			headers: { Authorization: `Bearer ${token}` }
		},
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
	const { data, error } = await supabase.auth.getClaims(token);
	if (error || !data?.claims) throw new Error("Unauthorized: Invalid token");
	if (!data.claims.sub) throw new Error("Unauthorized: No user ID found in token");
	return next({ context: {
		supabase,
		userId: data.claims.sub,
		claims: data.claims
	} });
});
var DOMINIO_FORMANDO = "formando.jmformaturas.app";
function apenasDigitos(valor) {
	return valor.replace(/\D/g, "");
}
/** Login e senha do formando/cliente são o próprio CPF (somente dígitos). */
function cpfParaEmail(cpf) {
	return `${apenasDigitos(cpf)}@${DOMINIO_FORMANDO}`;
}
var CLIENTE_SESSION_KEY = "jm_formaturas_cliente_session_v1";
function saveClienteSession(session) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(CLIENTE_SESSION_KEY, JSON.stringify(session));
	} catch (e) {
		console.error("Erro ao salvar sessão do cliente:", e);
	}
}
function getClienteSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(CLIENTE_SESSION_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch (e) {
		return null;
	}
}
function clearClienteSession() {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(CLIENTE_SESSION_KEY);
	} catch (e) {
		console.error("Erro ao limpar sessão do cliente:", e);
	}
}
//#endregion
export { requireSupabaseAuth as a, getClienteSession as i, clearClienteSession as n, saveClienteSession as o, cpfParaEmail as r, apenasDigitos as t };
