// ── Dashboard Page (Staff) ─────────────────────────────────
import { supabase } from '../supabase.js';
import { requireStaff, signOut } from '../auth.js';
import { renderAppShell, card, badge, brl, icons } from '../ui.js';

async function init() {
  const auth = await requireStaff();
  if (!auth) return;

  const app = document.getElementById('app');
  app.innerHTML = renderAppShell({
    auth,
    currentPath: '/dashboard.html',
    content: `
      <div class="loader" id="loading-msg">Carregando informações...</div>
      <div id="dashboard-content" style="display:none;"></div>
    `,
  });

  document.getElementById('btn-signout')?.addEventListener('click', signOut);

  try {
    const [turmasRes, alunosRes] = await Promise.all([
      supabase.from('turmas').select('*').order('created_at', { ascending: false }),
      supabase.from('alunos').select('id, turma_id, status'),
    ]);

    if (turmasRes.error) throw turmasRes.error;
    if (alunosRes.error) throw alunosRes.error;

    const turmas = turmasRes.data ?? [];
    const alunos = alunosRes.data ?? [];
    const turmasAtivas = turmas.filter((t) => t.status === 'ativa').length;

    const contentEl = document.getElementById('dashboard-content');
    const loaderEl = document.getElementById('loading-msg');
    if (loaderEl) loaderEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      contentEl.innerHTML = `
        <h1 class="mb-1 text-2xl font-semibold">Visão geral</h1>
        <p class="mb-6 text-sm text-muted">
          Fundação do sistema: turmas, formandos e acessos.
        </p>

        <div class="grid gap-4 sm:grid-cols-3">
          <div class="stat-card">
            <span class="stat-icon">${icons.graduationCap}</span>
            <p class="stat-value">${turmas.length}</p>
            <p class="stat-label">Turmas cadastradas</p>
          </div>
          <div class="stat-card">
            <span class="stat-icon">${icons.calendarDays}</span>
            <p class="stat-value">${turmasAtivas}</p>
            <p class="stat-label">Turmas ativas</p>
          </div>
          <div class="stat-card">
            <span class="stat-icon">${icons.users}</span>
            <p class="stat-value">${alunos.length}</p>
            <p class="stat-label">Formandos</p>
          </div>
        </div>

        <div class="card mt-6">
          <div class="card-header">
            <h2 class="card-title">Turmas recentes</h2>
          </div>
          <div class="card-content space-y-2">
            ${turmas.length === 0 ? `
              <p class="text-sm text-muted">
                Nenhuma turma ainda. <a href="turmas.html" class="text-primary underline underline-offset-4">Criar a primeira turma</a>.
              </p>
            ` : ''}
            ${turmas.slice(0, 6).map((turma) => {
        const countAlunos = alunos.filter((a) => a.turma_id === turma.id).length;
        return `
                <a href="turma.html?id=${turma.id}" class="list-row">
                  <div>
                    <p class="list-row-title">${turma.nome}</p>
                    <p class="list-row-sub">${turma.faculdade} · ${turma.semestre ?? '—'}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-muted">${countAlunos} formandos</span>
                    ${badge(turma.status, turma.status === 'ativa' ? 'default' : 'secondary')}
                  </div>
                </a>
              `;
      }).join('')}
          </div>
        </div>
      `;
    }
  } catch (err) {
    const loaderEl = document.getElementById('loading-msg');
    if (loaderEl) loaderEl.innerHTML = `<p class="text-destructive">Erro ao carregar dados: ${err.message}</p>`;
  }
}

init();
