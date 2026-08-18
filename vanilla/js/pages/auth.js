// ── Auth Page ─────────────────────────────────────────────
import { supabase } from '../supabase.js';
import { getSession } from '../auth.js';
import { toast } from '../toast.js';
import { apenasDigitos, cpfParaEmail } from '../aluno-login.js';

// Modes: 'formando' | 'login' | 'signup'
let mode = 'formando';

async function init() {
  // Redirect if already logged in
  const session = await getSession();
  if (session) {
    window.location.href = '/painel.html';
    return;
  }
  render();
}

function render() {
  const isFormando = mode === 'formando';
  const isLogin    = mode === 'login';
  const isSignup   = mode === 'signup';

  const titles = {
    formando: 'Acesso do formando',
    login:    'Entrar (equipe)',
    signup:   'Criar conta',
  };
  const descs = {
    formando: 'Use seu CPF como login e também como senha.',
    login:    'Use o e-mail e a senha cadastrados pela JM Formaturas.',
    signup:   'Cadastre um acesso de equipe.',
  };

  document.getElementById('app').innerHTML = `
    <div class="auth-wrapper">
      <div class="auth-inner">
        <div class="auth-logo-wrap">
          <span class="auth-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </span>
          <h1 class="font-display font-semibold" style="font-size:1.5rem;">JM Formaturas</h1>
          <p style="font-size:0.875rem;opacity:0.75;">Gestão financeira de formaturas</p>
        </div>

        <div class="auth-card">
          <h2 class="auth-card-title">${titles[mode]}</h2>
          <p class="auth-card-desc">${descs[mode]}</p>

          <form id="auth-form" class="space-y-3" novalidate>
            ${isFormando ? `
              <div class="field">
                <label class="label" for="cpf">CPF (login e senha)</label>
                <input class="input" id="cpf" name="cpf" inputmode="numeric" placeholder="000.000.000-00" required maxlength="20">
                <p style="margin-top:0.25rem;font-size:0.75rem;color:var(--muted-foreground);">Digite seu CPF: ele é usado como usuário e como senha.</p>
              </div>
            ` : ''}
            ${isSignup ? `
              <div class="field">
                <label class="label" for="nome">Nome completo</label>
                <input class="input" id="nome" name="nome" required maxlength="120">
              </div>
            ` : ''}
            ${!isFormando ? `
              <div class="field">
                <label class="label" for="email">E-mail</label>
                <input class="input" id="email" name="email" type="email" required maxlength="255">
              </div>
              <div class="field">
                <label class="label" for="senha">Senha</label>
                <input class="input" id="senha" name="senha" type="password" required minlength="6" maxlength="72">
              </div>
            ` : ''}
            <button type="submit" class="btn btn-primary w-full" id="btn-submit" style="width:100%;margin-top:0.5rem;">
              ${isSignup ? 'Criar conta' : 'Entrar'}
            </button>
          </form>

          <div class="auth-links">
            ${!isFormando ? `<button type="button" data-mode="formando">Sou formando (nome + CPF)</button>` : ''}
            ${!isLogin    ? `<button type="button" data-mode="login">Sou da equipe (e-mail e senha)</button>` : ''}
            ${!isSignup   ? `<button type="button" data-mode="signup">Criar conta de equipe</button>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Mode switch buttons
  document.querySelectorAll('.auth-links [data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode;
      render();
    });
  });

  // Form submit
  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit');
    btn.disabled = true;
    btn.textContent = 'Aguarde...';

    try {
      if (mode === 'formando') {
        const cpf = document.getElementById('cpf').value;
        const { error } = await supabase.auth.signInWithPassword({
          email: cpfParaEmail(cpf),
          password: apenasDigitos(cpf),
        });
        if (error) throw new Error('CPF inválido ou acesso ainda não liberado. Confira com a equipe.');
        window.location.href = '/painel.html';
      } else if (mode === 'login') {
        const email    = document.getElementById('email').value;
        const password = document.getElementById('senha').value;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/painel.html';
      } else {
        const nome     = document.getElementById('nome').value;
        const email    = document.getElementById('email').value;
        const password = document.getElementById('senha').value;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: nome },
          },
        });
        if (error) throw error;
        toast.success('Conta criada!');
        window.location.href = '/painel.html';
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível entrar');
      btn.disabled = false;
      btn.textContent = mode === 'signup' ? 'Criar conta' : 'Entrar';
    }
  });
}

init();
