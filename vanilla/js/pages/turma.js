// ── Turma Detail Page (Staff) ──────────────────────────────
import { supabase } from '../supabase.js';
import { requireStaff, signOut } from '../auth.js';
import { renderAppShell, badge, icons, brl, field } from '../ui.js';
import { openModal } from '../modal.js';
import { toast } from '../toast.js';

let authState = null;
let turmaId = null;

async function init() {
  authState = await requireStaff();
  if (!authState) return;

  const urlParams = new URLSearchParams(window.location.search);
  turmaId = urlParams.get('id');

  if (!turmaId) {
    window.location.href = '/turmas.html';
    return;
  }

  renderShell();
  await loadTurmaData();
}

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell({
    auth: authState,
    currentPath: '/turmas.html',
    content: `
      <a href="turmas.html" class="mb-4 inline-flex items-center gap-1 text-sm text-muted underline">
        ${icons.arrowLeft} Voltar para Turmas
      </a>

      <div class="loader" id="turma-loading">Carregando turma...</div>
      <div id="turma-content" style="display:none;"></div>
    `,
  });

  document.getElementById('btn-signout')?.addEventListener('click', signOut);
}

async function loadTurmaData() {
  const loadingEl = document.getElementById('turma-loading');
  const contentEl = document.getElementById('turma-content');

  try {
    const [turmaRes, alunosRes, contratosRes] = await Promise.all([
      supabase.from('turmas').select('*').eq('id', turmaId).maybeSingle(),
      supabase.from('alunos').select('*').eq('turma_id', turmaId).order('nome_completo'),
      supabase.from('contratos').select('*, parcelas(*)').eq('turma_id', turmaId),
    ]);

    if (turmaRes.error) throw turmaRes.error;
    if (alunosRes.error) throw alunosRes.error;
    if (contratosRes.error) throw contratosRes.error;

    const turma = turmaRes.data;
    if (!turma) {
      loadingEl.innerHTML = `<p class="text-destructive">Turma não encontrada.</p>`;
      return;
    }

    const alunos = alunosRes.data ?? [];
    const contratos = contratosRes.data ?? [];

    const hoje = new Date().toISOString().slice(0, 10);
    const todasParcelas = contratos.flatMap((c) => c.parcelas ?? []);
    const contratado = contratos.reduce(
      (s, c) => s + Number(c.valor_total) - Number(c.desconto),
      0
    );
    const entradas = contratos.reduce((s, c) => s + Number(c.valor_entrada), 0);
    const recebidoParcelas = todasParcelas.reduce((s, p) => s + Number(p.valor_pago), 0);
    const recebido = entradas + recebidoParcelas;
    const aReceber = Math.max(contratado - recebido, 0);
    const atrasado = todasParcelas
      .filter((p) => p.status !== 'pago' && p.vencimento < hoje)
      .reduce((s, p) => s + (Number(p.valor) - Number(p.valor_pago)), 0);
    const percentual = contratado > 0 ? Math.round((recebido / contratado) * 100) : 0;
    const parcelasQuitadas = todasParcelas.filter((p) => p.status === 'pago').length;

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      contentEl.innerHTML = `
        <div class="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-semibold">${turma.nome}</h1>
            <p class="text-sm text-muted">
              ${turma.curso} · ${turma.faculdade} · ${turma.semestre ?? '—'}
            </p>
          </div>
          <button class="btn btn-primary" id="btn-add-aluno">
            ${icons.plus} Adicionar formando
          </button>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Formandos da Turma (${alunos.length})</h2>
          </div>
          <div class="card-content space-y-2">
            ${alunos.length === 0 ? `
              <p class="text-sm text-muted">Nenhum formando cadastrado nesta turma.</p>
            ` : ''}
            ${alunos.map((aluno) => {
              const contratoAluno = contratos.find((c) => c.aluno_id === aluno.id);
              return `
                <a href="aluno.html?id=${aluno.id}" class="list-row">
                  <div>
                    <p class="list-row-title">${aluno.nome_completo}</p>
                    <p class="list-row-sub">
                      CPF: ${aluno.cpf ?? '—'} · ${aluno.whatsapp ?? aluno.email ?? 'sem contato'}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 flex-wrap">
                    ${contratoAluno 
                      ? badge(`Contrato: ${contratoAluno.pacote}`, 'default')
                      : badge('Sem contrato', 'secondary')}
                    ${badge(aluno.user_id ? 'acesso ativo' : 'sem acesso', aluno.user_id ? 'default' : 'secondary')}
                  </div>
                </a>
              `;
            }).join('')}
          </div>
        </div>

        <div class="card mt-6">
          <div class="card-header">
            <h2 class="card-title">
              Estatísticas financeiras da turma (${contratos.length} contrato${contratos.length === 1 ? '' : 's'})
            </h2>
          </div>
          <div class="card-content space-y-4">
            <div class="grid gap-3 sm:grid-cols-4">
              <div class="estat">
                <p class="estat-titulo">Valor contratado</p>
                <p class="estat-valor">${brl(contratado)}</p>
              </div>
              <div class="estat">
                <p class="estat-titulo">Já recebido</p>
                <p class="estat-valor">${brl(recebido)}</p>
              </div>
              <div class="estat">
                <p class="estat-titulo">Falta receber</p>
                <p class="estat-valor">${brl(aReceber)}</p>
              </div>
              <div class="estat">
                <p class="estat-titulo">Em atraso</p>
                <p class="estat-valor ${atrasado > 0 ? 'destaque' : ''}">${brl(atrasado)}</p>
              </div>
            </div>

            <div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${Math.min(percentual, 100)}%;"></div>
              </div>
              <p class="mt-1 text-xs text-muted">
                ${percentual}% do valor contratado já foi recebido · ${parcelasQuitadas}/${todasParcelas.length} parcelas quitadas
              </p>
            </div>
          </div>
        </div>
      `;

      document.getElementById('btn-add-aluno')?.addEventListener('click', openAddAlunoModal);
    }
  } catch (err) {
    if (loadingEl) loadingEl.innerHTML = `<p class="text-destructive">Erro: ${err.message}</p>`;
  }
}

function openAddAlunoModal() {
  const modal = openModal({
    title: 'Novo formando',
    body: `
      <form id="form-aluno" class="space-y-3">
        ${field({ name: 'nome_completo', label: 'Nome completo', required: true })}
        <div class="grid gap-3 sm:grid-cols-2">
          ${field({ name: 'cpf', label: 'CPF', maxLength: 20 })}
          ${field({ name: 'whatsapp', label: 'WhatsApp', maxLength: 20 })}
          ${field({ name: 'email', label: 'E-mail', type: 'email', maxLength: 255 })}
          ${field({ name: 'data_nascimento', label: 'Nascimento', type: 'date' })}
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn btn-outline" id="btn-cancel-aluno">Cancelar</button>
      <button type="submit" form="form-aluno" class="btn btn-primary" id="btn-save-aluno">Salvar formando</button>
    `,
    onOpen: (backdrop) => {
      backdrop.querySelector('#btn-cancel-aluno')?.addEventListener('click', () => modal.close());

      backdrop.querySelector('#form-aluno')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = backdrop.querySelector('#btn-save-aluno');
        btn.disabled = true;
        btn.textContent = 'Salvando...';

        const form = e.target;
        const nome_completo = form.nome_completo.value.trim();
        const cpf = form.cpf.value.trim() || null;
        const whatsapp = form.whatsapp.value.trim() || null;
        const email = form.email.value.trim() || null;
        const data_nascimento = form.data_nascimento.value || null;

        if (!nome_completo || nome_completo.length < 3) {
          toast.error('Informe o nome completo do formando.');
          btn.disabled = false;
          btn.textContent = 'Salvar formando';
          return;
        }

        try {
          const { error } = await supabase.from('alunos').insert({
            turma_id: turmaId,
            nome_completo,
            cpf,
            whatsapp,
            email,
            data_nascimento,
          });

          if (error) throw error;

          toast.success('Formando adicionado!');
          modal.close();
          await loadTurmaData();
        } catch (err) {
          toast.error(err.message || 'Erro ao adicionar formando');
          btn.disabled = false;
          btn.textContent = 'Salvar formando';
        }
      });
    },
  });
}

init();
