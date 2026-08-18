// ── Turmas List Page (Staff) ───────────────────────────────
import { supabase } from '../supabase.js';
import { requireStaff, signOut } from '../auth.js';
import { renderAppShell, badge, icons, field } from '../ui.js';
import { openModal } from '../modal.js';
import { toast } from '../toast.js';

let authState = null;

async function init() {
  authState = await requireStaff();
  if (!authState) return;

  renderLayout();
  await loadTurmas();
}

function renderLayout() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell({
    auth: authState,
    currentPath: '/turmas.html',
    content: `
      <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold">Turmas</h1>
          <p class="text-sm text-muted">Organize os formandos por curso e faculdade.</p>
        </div>
        <button class="btn btn-primary" id="btn-nova-turma">
          ${icons.plus} Nova turma
        </button>
      </div>

      <div class="loader" id="turmas-loading">Carregando turmas...</div>
      <div class="grid gap-3 sm:grid-cols-2" id="turmas-grid"></div>
    `,
  });

  document.getElementById('btn-signout')?.addEventListener('click', signOut);
  document.getElementById('btn-nova-turma')?.addEventListener('click', openNovaTurmaModal);
}

async function loadTurmas() {
  const loadingEl = document.getElementById('turmas-loading');
  const gridEl = document.getElementById('turmas-grid');

  try {
    const { data: turmas, error } = await supabase
      .from('turmas')
      .select('*, alunos(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (loadingEl) loadingEl.style.display = 'none';

    if (!turmas || turmas.length === 0) {
      gridEl.innerHTML = `<p class="text-sm text-muted">Nenhuma turma cadastrada ainda.</p>`;
      return;
    }

    gridEl.innerHTML = turmas.map((turma) => {
      const count = turma.alunos?.[0]?.count ?? 0;
      return `
        <a href="turma.html?id=${turma.id}" style="color:inherit;text-decoration:none;">
          <div class="card" style="height:100%;transition:box-shadow 0.2s;cursor:pointer;">
            <div class="card-content pt-6">
              <div class="flex items-start justify-between gap-2">
                <p class="font-display font-semibold">${turma.nome}</p>
                ${badge(turma.status, turma.status === 'ativa' ? 'default' : 'secondary')}
              </div>
              <p class="mt-1 text-sm text-muted">
                ${turma.curso} · ${turma.faculdade}
              </p>
              <p class="mt-3 text-xs text-muted">
                ${count} formandos · ${turma.cidade ?? '—'}
              </p>
            </div>
          </div>
        </a>
      `;
    }).join('');
  } catch (err) {
    if (loadingEl) loadingEl.innerHTML = `<p class="text-destructive">Erro: ${err.message}</p>`;
  }
}

function openNovaTurmaModal() {
  const modal = openModal({
    title: 'Nova turma',
    body: `
      <form id="form-turma" class="space-y-3">
        ${field({ name: 'nome', label: 'Nome da turma', placeholder: 'Enfermagem – Faculdade X – 2026/2', required: true })}
        <div class="grid gap-3 sm:grid-cols-2">
          ${field({ name: 'curso', label: 'Curso', required: true })}
          ${field({ name: 'faculdade', label: 'Faculdade', required: true })}
          ${field({ name: 'cidade', label: 'Cidade' })}
          ${field({ name: 'semestre', label: 'Semestre', placeholder: '2026/2' })}
        </div>
        ${field({ name: 'previsao_formatura', label: 'Previsão de formatura', type: 'date' })}
      </form>
    `,
    footer: `
      <button type="button" class="btn btn-outline" id="btn-cancel-turma">Cancelar</button>
      <button type="submit" form="form-turma" class="btn btn-primary" id="btn-save-turma">Salvar turma</button>
    `,
    onOpen: (backdrop) => {
      backdrop.querySelector('#btn-cancel-turma')?.addEventListener('click', () => modal.close());

      backdrop.querySelector('#form-turma')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = backdrop.querySelector('#btn-save-turma');
        btn.disabled = true;
        btn.textContent = 'Salvando...';

        const form = e.target;
        const nome = form.nome.value.trim();
        const curso = form.curso.value.trim();
        const faculdade = form.faculdade.value.trim();
        const cidade = form.cidade.value.trim() || null;
        const semestre = form.semestre.value.trim() || null;
        const previsao = form.previsao_formatura.value || null;

        if (!nome || !curso || !faculdade) {
          toast.error('Preencha os campos obrigatórios.');
          btn.disabled = false;
          btn.textContent = 'Salvar turma';
          return;
        }

        try {
          const { error } = await supabase.from('turmas').insert({
            nome,
            curso,
            faculdade,
            cidade,
            semestre,
            previsao_formatura: previsao,
          });

          if (error) throw error;

          toast.success('Turma criada com sucesso!');
          modal.close();
          await loadTurmas();
        } catch (err) {
          toast.error(err.message || 'Erro ao criar turma');
          btn.disabled = false;
          btn.textContent = 'Salvar turma';
        }
      });
    },
  });
}

init();
