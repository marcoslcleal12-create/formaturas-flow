// ── Financeiro Page (Staff) ────────────────────────────────
import { supabase } from '../supabase.js';
import { requireStaff, signOut } from '../auth.js';
import { renderAppShell, badge, icons, brl, dataBR, hoje, setupTabs, field } from '../ui.js';
import { openModal } from '../modal.js';
import { toast } from '../toast.js';

let authState = null;

async function init() {
  authState = await requireStaff();
  if (!authState) return;

  renderShell();
  await loadFinanceiroData();
}

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell({
    auth: authState,
    currentPath: '/financeiro.html',
    content: `
      <h1 class="mb-1 text-2xl font-semibold">Financeiro</h1>
      <p class="mb-6 text-sm text-muted">
        Entradas, saídas e boletos atrasados de todas as turmas.
      </p>

      <div class="loader" id="fin-loading">Carregando dados financeiros...</div>
      <div id="fin-content" style="display:none;"></div>
    `,
  });

  document.getElementById('btn-signout')?.addEventListener('click', signOut);
}

async function loadFinanceiroData() {
  const loadingEl = document.getElementById('fin-loading');
  const contentEl = document.getElementById('fin-content');

  try {
    const [parcelasRes, despesasRes] = await Promise.all([
      supabase
        .from('parcelas')
        .select('*, contratos(id, pacote, forma_pagamento, alunos(id, nome_completo, turmas(nome)))')
        .order('vencimento'),
      supabase.from('despesas').select('*').order('vencimento'),
    ]);

    if (parcelasRes.error) throw parcelasRes.error;
    if (despesasRes.error) throw despesasRes.error;

    const parcelas = parcelasRes.data ?? [];
    const despesas = despesasRes.data ?? [];
    const hojeIso = hoje();

    const entradas = parcelas.filter((p) => p.status === 'pago');
    const totalEntradas = entradas.reduce((s, p) => s + Number(p.valor_pago), 0);
    const aReceber = parcelas.filter((p) => p.status !== 'pago').reduce((s, p) => s + Number(p.valor), 0);
    const atrasadas = parcelas.filter((p) => p.status !== 'pago' && p.vencimento < hojeIso);
    const inadimplencia = atrasadas.reduce((s, p) => s + Number(p.valor), 0);

    const saidasPagas = despesas.filter((d) => d.status === 'pago');
    const totalSaidas = saidasPagas.reduce((s, d) => s + Number(d.valor), 0);
    const saidasAtrasadas = despesas.filter((d) => d.status !== 'pago' && d.vencimento < hojeIso);

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      contentEl.innerHTML = `
        <div class="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div class="stat-card">
            <p class="stat-label">Entradas</p>
            <p class="stat-value text-xl mt-1">${brl(totalEntradas)}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Saídas</p>
            <p class="stat-value text-xl mt-1">${brl(totalSaidas)}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Saldo</p>
            <p class="stat-value text-xl mt-1">${brl(totalEntradas - totalSaidas)}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">A receber</p>
            <p class="stat-value text-xl mt-1">${brl(aReceber)}</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Em atraso</p>
            <p class="stat-value text-xl mt-1 ${inadimplencia > 0 ? 'text-destructive' : ''}">${brl(inadimplencia)}</p>
          </div>
        </div>

        <div class="tabs" id="fin-tabs">
          <div class="tabs-list">
            <button type="button" class="tab-trigger active" data-tab="atrasados">
              Atrasados (${atrasadas.length + saidasAtrasadas.length})
            </button>
            <button type="button" class="tab-trigger" data-tab="entradas">
              Entradas (${entradas.length})
            </button>
            <button type="button" class="tab-trigger" data-tab="saidas">
              Saídas (${despesas.length})
            </button>
          </div>

          <!-- TAB 1: ATRASADOS -->
          <div class="tab-panel active space-y-4" data-tab="atrasados">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Boletos e parcelas em atraso (${atrasadas.length})</h2>
              </div>
              <div class="card-content space-y-2">
                ${atrasadas.length === 0 ? `
                  <p class="text-sm text-muted">Nenhuma parcela em atraso. 🎉</p>
                ` : ''}
                ${atrasadas.map((p) => `
                  <a href="aluno.html?id=${p.contratos?.alunos?.id ?? ''}" class="list-row">
                    <div>
                      <p class="list-row-title">${p.contratos?.alunos?.nome_completo ?? '—'}</p>
                      <p class="list-row-sub">
                        ${p.contratos?.alunos?.turmas?.nome ?? '—'} ·
                        ${p.numero === 0 ? 'entrada' : `parcela ${p.numero}`} ·
                        ${p.contratos?.forma_pagamento ?? 'boleto'} · venceu em ${dataBR(p.vencimento)}
                      </p>
                    </div>
                    ${badge(brl(Number(p.valor)), 'destructive')}
                  </a>
                `).join('')}
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Saídas em atraso (${saidasAtrasadas.length})</h2>
              </div>
              <div class="card-content space-y-2">
                ${saidasAtrasadas.length === 0 ? `
                  <p class="text-sm text-muted">Nenhuma saída em atraso.</p>
                ` : ''}
                ${saidasAtrasadas.map((d) => `
                  <div class="list-row">
                    <div>
                      <p class="list-row-title">${d.descricao}</p>
                      <p class="list-row-sub">${d.categoria} · venceu em ${dataBR(d.vencimento)}</p>
                    </div>
                    ${badge(brl(Number(d.valor)), 'destructive')}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- TAB 2: ENTRADAS -->
          <div class="tab-panel space-y-4" data-tab="entradas">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Entradas recebidas (${entradas.length})</h2>
              </div>
              <div class="card-content space-y-2">
                ${entradas.length === 0 ? `
                  <p class="text-sm text-muted">Nenhum recebimento registrado ainda.</p>
                ` : ''}
                ${entradas.map((p) => `
                  <a href="aluno.html?id=${p.contratos?.alunos?.id ?? ''}" class="list-row">
                    <div>
                      <p class="list-row-title">${p.contratos?.alunos?.nome_completo ?? '—'}</p>
                      <p class="list-row-sub">
                        ${p.numero === 0 ? 'entrada do contrato' : `parcela ${p.numero}`} ·
                        ${p.forma_pagamento ?? p.contratos?.forma_pagamento ?? '—'} · pago em ${p.data_pagamento ? dataBR(p.data_pagamento) : '—'}
                      </p>
                    </div>
                    ${badge(brl(Number(p.valor_pago)), 'default')}
                  </a>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- TAB 3: SAIDAS -->
          <div class="tab-panel space-y-4" data-tab="saidas">
            <div class="card">
              <div class="card-header row justify-between">
                <h2 class="card-title">Saídas (${despesas.length})</h2>
                <button class="btn btn-secondary btn-sm" id="btn-nova-saida">
                  ${icons.plus} Nova saída
                </button>
              </div>
              <div class="card-content space-y-2">
                ${despesas.length === 0 ? `
                  <p class="text-sm text-muted">Nenhuma saída registrada.</p>
                ` : ''}
                ${despesas.map((d) => {
                  const pago = d.status === 'pago';
                  const atrasada = !pago && d.vencimento < hojeIso;
                  return `
                    <div class="list-row">
                      <div>
                        <p class="list-row-title">${d.descricao} · ${brl(Number(d.valor))}</p>
                        <p class="list-row-sub">
                          ${d.categoria} · vence em ${dataBR(d.vencimento)}
                          ${d.data_pagamento ? ` · pago em ${dataBR(d.data_pagamento)}` : ''}
                        </p>
                      </div>
                      <div class="flex items-center gap-2">
                        ${badge(pago ? 'pago' : atrasada ? 'atrasada' : 'pendente', pago ? 'default' : atrasada ? 'destructive' : 'secondary')}
                        <button class="btn btn-outline btn-sm btn-baixar-despesa" data-id="${d.id}" data-pago="${pago}">
                          ${pago ? 'Estornar' : 'Dar baixa'}
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>
        </div>
      `;

      setupTabs(document.getElementById('fin-tabs'));

      document.getElementById('btn-nova-saida')?.addEventListener('click', openNovaSaidaModal);
      document.querySelectorAll('.btn-baixar-despesa').forEach((b) => {
        b.addEventListener('click', () => handleBaixarDespesa(b.dataset.id, b.dataset.pago === 'true'));
      });
    }
  } catch (err) {
    if (loadingEl) loadingEl.innerHTML = `<p class="text-destructive">Erro: ${err.message}</p>`;
  }
}

function openNovaSaidaModal() {
  const modal = openModal({
    title: 'Registrar saída',
    body: `
      <form id="form-despesa" class="space-y-3">
        ${field({ name: 'descricao', label: 'Descrição', required: true })}
        <div class="grid gap-3 sm:grid-cols-3">
          ${field({ name: 'categoria', label: 'Categoria', value: 'geral' })}
          ${field({ name: 'valor', label: 'Valor (R$)', type: 'number', step: '0.01', required: true })}
          ${field({ name: 'vencimento', label: 'Vencimento', type: 'date', value: hoje(), required: true })}
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn btn-outline" id="btn-cancel-despesa">Cancelar</button>
      <button type="submit" form="form-despesa" class="btn btn-primary" id="btn-save-despesa">Salvar saída</button>
    `,
    onOpen: (backdrop) => {
      backdrop.querySelector('#btn-cancel-despesa')?.addEventListener('click', () => modal.close());

      backdrop.querySelector('#form-despesa')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = backdrop.querySelector('#btn-save-despesa');
        btn.disabled = true;
        btn.textContent = 'Salvando...';

        const form = e.target;
        const descricao = form.descricao.value.trim();
        const categoria = form.categoria.value.trim() || 'geral';
        const valor = Number(form.valor.value) || 0;
        const vencimento = form.vencimento.value || hoje();

        if (valor <= 0) {
          toast.error('Informe um valor válido.');
          btn.disabled = false;
          btn.textContent = 'Salvar saída';
          return;
        }

        try {
          const { error } = await supabase.from('despesas').insert({
            descricao,
            categoria,
            valor,
            vencimento,
          });

          if (error) throw error;
          toast.success('Saída registrada');
          modal.close();
          await loadFinanceiroData();
        } catch (err) {
          toast.error(err.message || 'Erro ao registrar saída');
          btn.disabled = false;
          btn.textContent = 'Salvar saída';
        }
      });
    },
  });
}

async function handleBaixarDespesa(id, pago) {
  try {
    const { error } = await supabase
      .from('despesas')
      .update(
        pago
          ? { status: 'pendente', data_pagamento: null }
          : { status: 'pago', data_pagamento: hoje() }
      )
      .eq('id', id);

    if (error) throw error;
    toast.success(pago ? 'Despesa estornada' : 'Baixa registrada');
    await loadFinanceiroData();
  } catch (err) {
    toast.error(err.message || 'Erro ao atualizar despesa');
  }
}

init();
