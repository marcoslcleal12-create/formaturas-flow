// ── Auth helpers ───────────────────────────────────────────
import { supabase } from './supabase.js';

/** Returns the current session or null */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Returns { user, roles, isStaff, isSuperAdmin, isAluno } */
export async function getAuthState() {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user ?? null;

  let roles = [];
  if (user) {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    roles = (data ?? []).map((r) => r.role);
  }

  const isStaff = roles.includes('super_admin') || roles.includes('funcionario');
  return {
    user,
    roles,
    loading: false,
    isStaff,
    isSuperAdmin: roles.includes('super_admin'),
    isAluno: roles.includes('aluno') && !isStaff,
  };
}

/** Caches the auth state for the current page load */
let _authCache = null;

export async function getCachedAuth(force = false) {
  if (_authCache && !force) return _authCache;
  _authCache = await getAuthState();
  return _authCache;
}

export function clearAuthCache() {
  _authCache = null;
}

/** Redirects to /auth.html if not logged in. Returns auth state if ok. */
export async function requireAuth() {
  const auth = await getCachedAuth();
  if (!auth.user) {
    window.location.href = '/auth.html';
    return null;
  }
  return auth;
}

/** Redirects to /painel.html if not staff. Returns auth state if ok. */
export async function requireStaff() {
  const auth = await requireAuth();
  if (!auth) return null;
  if (!auth.isStaff) {
    window.location.href = '/painel.html';
    return null;
  }
  return auth;
}

/** Signs out and navigates to /auth.html */
export async function signOut() {
  await supabase.auth.signOut();
  clearAuthCache();
  window.location.href = '/auth.html';
}

// Listen to auth state changes globally
supabase.auth.onAuthStateChange(() => {
  clearAuthCache();
});
