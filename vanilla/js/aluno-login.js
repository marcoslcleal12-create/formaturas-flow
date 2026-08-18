// ── Aluno Login Utilities ─────────────────────────────────
// Ported from aluno-login.ts

export const DOMINIO_FORMANDO = 'formando.jmformaturas.app';

/** Returns only digits from a string */
export function apenasDigitos(valor) {
  return valor.replace(/\D/g, '');
}

/** Converts a CPF to the formando's login email */
export function cpfParaEmail(cpf) {
  return `${apenasDigitos(cpf)}@${DOMINIO_FORMANDO}`;
}

/** Normalizes a full name for use as login */
export function normalizarLogin(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
}

export function loginParaEmail(nome) {
  return `${normalizarLogin(nome)}@${DOMINIO_FORMANDO}`;
}
