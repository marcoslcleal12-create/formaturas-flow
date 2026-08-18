// ── Supabase Client (Vanilla JS) ──────────────────────────
// Uses the Supabase JS CDN export
// Credentials are the publishable (safe for browser) keys from .env

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://iokmouhupmnfbxbkcbqy.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_7cUkATaMgZ8399zxwlwYpQ_xh4f_tMv';

function createSupabaseFetch(key) {
  return (input, init) => {
    const headers = new Headers(
      input instanceof Request ? input.headers : undefined
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    }
    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (
      (key.startsWith('sb_publishable_') || key.startsWith('sb_secret_')) &&
      headers.get('Authorization') === `Bearer ${key}`
    ) {
      headers.delete('Authorization');
    }
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  };
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: { fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY) },
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
