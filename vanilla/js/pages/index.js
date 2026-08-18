// ── Landing Page ──────────────────────────────────────────
import { getSession } from '../auth.js';
import { icons } from '../ui.js';

async function init() {
  // If already logged in, redirect to painel
  const session = await getSession();
  if (session) {
    window.location.href = '/painel.html';
    return;
  }

  document.getElementById('app').innerHTML = `
    <div class="min-h-screen bg-brand" style="color: var(--primary-foreground);">
      <div class="mx-auto max-w-5xl px-4 py-20" style="display:flex;flex-direction:column;align-items:center;text-align:center;">
        <span style="
          display:flex;align-items:center;justify-content:center;
          width:4rem;height:4rem;border-radius:var(--radius-xl);
          background-image:var(--gradient-gold);color:var(--accent-foreground);
          margin-bottom:1.5rem;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </span>

        <h1 class="font-display text-4xl font-semibold" style="margin-bottom:1rem;">JM Formaturas</h1>
        <p style="max-width:36rem;opacity:0.8;font-size:1rem;margin-bottom:2rem;">
          Gestão completa de turmas, formandos, contratos e pagamentos de formatura — com área exclusiva para cada formando.
        </p>

        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:0.75rem;">
          <a href="auth.html" class="btn btn-secondary btn-lg">Acessar minha conta</a>
        </div>

        <div class="grid" style="margin-top:4rem;gap:1rem;width:100%;" id="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h2 class="font-display font-semibold" style="font-size:1rem;margin-bottom:0.25rem;">Turmas e formandos</h2>
            <p style="font-size:0.875rem;opacity:0.75;">Cadastro por curso, faculdade e semestre, com todos os dados do formando.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
              </svg>
            </div>
            <h2 class="font-display font-semibold" style="font-size:1rem;margin-bottom:0.25rem;">Financeiro</h2>
            <p style="font-size:0.875rem;opacity:0.75;">Contratos, parcelas, pagamentos e inadimplência sob controle.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <h2 class="font-display font-semibold" style="font-size:1rem;margin-bottom:0.25rem;">Acesso seguro</h2>
            <p style="font-size:0.875rem;opacity:0.75;">Cada formando enxerga apenas os próprios dados e documentos.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Responsive grid: 3 cols on sm+
  const grid = document.getElementById('features-grid');
  if (window.innerWidth >= 640) {
    grid.style.gridTemplateColumns = 'repeat(3, minmax(0,1fr))';
    grid.style.textAlign = 'left';
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 640) {
      grid.style.gridTemplateColumns = 'repeat(3, minmax(0,1fr))';
      grid.style.textAlign = 'left';
    } else {
      grid.style.gridTemplateColumns = '1fr';
      grid.style.textAlign = 'center';
    }
  });
}

init();
