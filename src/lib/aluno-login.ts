export const DOMINIO_FORMANDO = "formando.jmformaturas.app";

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

/** Login e senha do formando/cliente são o próprio CPF (somente dígitos). */
export function cpfParaEmail(cpf: string): string {
  return `${apenasDigitos(cpf)}@${DOMINIO_FORMANDO}`;
}

/** Normaliza o nome completo (mantido para exibição/uso legado). */
export function normalizarLogin(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

export function loginParaEmail(nome: string): string {
  return `${normalizarLogin(nome)}@${DOMINIO_FORMANDO}`;
}

export interface ClienteSession {
  cpf: string;
  nome: string;
  tipo: "aluno" | "demanda";
  email: string;
  demandaId?: string | null;
  alunoId?: string | null;
}

const CLIENTE_SESSION_KEY = "jm_formaturas_cliente_session_v1";

export function saveClienteSession(session: ClienteSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLIENTE_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error("Erro ao salvar sessão do cliente:", e);
  }
}

export function getClienteSession(): ClienteSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CLIENTE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearClienteSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CLIENTE_SESSION_KEY);
  } catch (e) {
    console.error("Erro ao limpar sessão do cliente:", e);
  }
}
