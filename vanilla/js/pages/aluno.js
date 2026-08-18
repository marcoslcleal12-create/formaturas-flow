// ── Aluno Detail Page (Staff) ──────────────────────────────
import { supabase } from '../supabase.js';
import { requireStaff, signOut } from '../auth.js';
import { renderAppShell, badge, icons, brl, dataBR, hoje, field } from '../ui.js';
import { openModal } from '../modal.js';
import { toast } from '../toast.js';
import {
  CLAUSULAS_PADRAO,
  FORMAS_PAGAMENTO,
  formaPagamentoLabel,
  gerarContratoPdf,
} from '../contrato-pdf.js';

let authState = null;
let alunoId = null;
let currentAluno = null;
let currentContrato = null;
let currentParcelas = [];

async function init() {
  authState = await requireStaff();
  if (!authState) return;

  const urlParams = new URLSearchParams(window.location.search);
  alunoId = urlParams.get('id');

  if (!alunoId) {
    window.location.href = '/turmas.html';
    return;
  }

  renderShell();
  await loadAlunoData();
}

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell({
    auth: authState,
    currentPath: '/turmas.html',
    content: `
      <div id="aluno-back-link"></div>
      <div class="loader" id="aluno-loading">Carregando formando...</div>
      <div id="aluno-content" style="display:none;"></div>
    `,
  });

  document.getElementById('btn-signout')?.addEventListener('click', signOut);
}

async function loadAlunoData() {
  const loadingEl = document.getElementById('aluno-loading');
  const contentEl = document.getElementById('aluno-content');
  const backLinkEl = document.getElementById('aluno-back-link');

  try {
    const [alunoRes, contratoRes] = await Promise.all([
      supabase.from('alunos').select('*, turmas(id, nome, curso, faculdade)').eq('id', alunoId).maybeSingle(),
      supabase.from('contratos').select('*, parcelas(*)').eq('aluno_id', alunoId).maybeSingle(),
    ]);

    if (alunoRes.error) throw alunoRes.error;
    if (contratoRes.error) throw contratoRes.error;

    currentAluno = alunoRes.data;
    if (!currentAluno) {
      loadingEl.innerHTML = `<p class="text-destructive">Formando não encontrado.</p>`;
      return;
    }

    currentContrato = contratoRes.data;
    currentParcelas = [...(currentContrato?.parcelas ?? [])].sort((a, b) => a.numero - b.numero);

    if (backLinkEl) {
      backLinkEl.innerHTML = `
        <a href="turma.html?id=${currentAluno.turma_id ?? ''}" class="mb-4 inline-flex items-center gap-1 text-sm text-muted underline">
          ${icons.arrowLeft} Voltar para a turma
        </a>
      `;
    }

    const hojeIso = hoje();
    const totalPago = currentParcelas.reduce((s, p) => s + Number(p.valor_pago), 0);
    const totalParcelas = currentParcelas.reduce((s, p) => s + Number(p.valor), 0);
    const atrasadas = currentParcelas.filter((p) => p.status !== 'pago' && p.vencimento < hojeIso);

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      contentEl.innerHTML = `
        <div class="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-semibold">${currentAluno.nome_completo}</h1>
            <p class="text-sm text-muted">
              ${currentAluno.turmas?.nome ?? '—'} · CPF ${currentAluno.cpf ?? '—'}
            </p>
          </div>
          ${currentAluno.user_id ? `
            ${badge(`acesso ativo · login ${currentAluno.login_usuario ?? currentAluno.cpf ?? ''}`, 'default')}
          ` : `
            <button class="btn btn-primary" id="btn-criar-acesso">
              ${icons.keyRound} Criar acesso do formando
            </button>
          `}
        </div>

        ${!currentAluno.user_id ? `
          <div class="card mb-6">
            <div class="card-content pt-6 text-sm text-muted">
              O acesso é criado com o <strong>CPF como login</strong> e o <strong>CPF como senha</strong>. É necessário ter o CPF (11 dígitos) cadastrado.
            </div>
          </div>
        ` : ''}

        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-semibold">Contrato e financeiro</h2>
          ${!currentContrato ? `
            <button class="btn btn-secondary" id="btn-criar-contrato">
              ${icons.plus} Criar contrato
            </button>
          ` : ''}
        </div>

        ${!currentContrato ? `
          <p class="text-sm text-muted">Nenhum contrato cadastrado para este formando.</p>
        ` : `
          <div class="space-y-4">
            <div class="grid gap-3 sm:grid-cols-4">
              <div class="stat-card">
                <p class="stat-label">Valor do contrato</p>
                <p class="stat-value text-lg mt-1">${brl(Number(currentContrato.valor_total))}</p>
              </div>
              <div class="stat-card">
                <p class="stat-label">Total parcelado</p>
                <p class="stat-value text-lg mt-1">${brl(totalParcelas)}</p>
              </div>
              <div class="stat-card">
                <p class="stat-label">Recebido</p>
                <p class="stat-value text-lg mt-1">${brl(totalPago)}</p>
              </div>
              <div class="stat-card">
                <p class="stat-label">Em atraso</p>
                <p class="stat-value text-lg mt-1 ${atrasadas.length > 0 ? 'text-destructive' : ''}">${atrasadas.length}</p>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Parcelas · ${currentContrato.pacote} (${currentParcelas.length})</h3>
              </div>
              <div class="card-content space-y-2">
                ${currentParcelas.map((p) => {
                  const pago = p.status === 'pago';
                  const atrasada = !pago && p.vencimento < hojeIso;
                  return `
                    <div class="list-row">
                      <div>
                        <p class="list-row-title">
                          ${p.numero === 0 ? 'Entrada' : `Parcela ${p.numero}`} · ${brl(Number(p.valor))}
                        </p>
                        <p class="list-row-sub">Vence em ${dataBR(p.vencimento)}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        ${badge(pago ? 'pago' : atrasada ? 'atrasada' : 'pendente', pago ? 'default' : atrasada ? 'destructive' : 'secondary')}
                        <button class="btn btn-outline btn-sm btn-baixar-parcela" data-id="${p.id}" data-valor="${p.valor}" data-pago="${pago}">
                          ${pago ? 'Estornar' : 'Dar baixa'}
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Contrato Documento Editor -->
            <div class="card" id="contrato-doc-card">
              <div class="card-header row justify-between">
                <h3 class="card-title">Contrato do formando (modelo editável)</h3>
                <div class="flex gap-2">
                  <button class="btn btn-outline btn-sm" id="btn-salvar-contrato-doc">
                    ${icons.save} Salvar
                  </button>
                  <button class="btn btn-primary btn-sm" id="btn-gerar-pdf">
                    ${icons.fileDown} Gerar PDF
                  </button>
                </div>
              </div>
              <div class="card-content space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="field">
                    <label class="label" for="select-forma-pgto">Forma de pagamento do contrato</label>
                    <select class="select-native" id="select-forma-pgto">
                      ${FORMAS_PAGAMENTO.map((f) => `
                        <option value="${f.id}" ${f.id === (currentContrato.forma_pagamento ?? 'boleto') ? 'selected' : ''}>${f.label}</option>
                      `).join('')}
                    </select>
                    <p class="text-xs text-muted">
                      O contrato é gerado com a forma selecionada e com o quadro de parcelas cadastrado.
                    </p>
                  </div>
                  <div class="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p class="text-sm font-medium">Autoriza uso de imagem</p>
                      <p class="text-xs text-muted">Portfólio, redes sociais e publicidade.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" id="switch-autoriza-imagem" ${currentContrato.autoriza_imagem !== false ? 'checked' : ''}>
                      <span class="switch-slider"></span>
                    </label>
                  </div>
                </div>

                <div class="field">
                  <div class="flex items-center justify-between mb-1">
                    <label class="label" for="texto-contrato">Cláusulas (editáveis)</label>
                    <button type="button" class="text-xs text-muted underline" id="btn-restaurar-modelo" style="background:none;border:none;cursor:pointer;">
                      restaurar modelo padrão
                    </button>
                  </div>
                  <textarea class="textarea mono" id="texto-contrato">${currentContrato.texto_contrato ?? CLAUSULAS_PADRAO}</textarea>
                </div>
              </div>
            </div>
          </div>
        `}
      `;

      // Event Listeners
      document.getElementById('btn-criar-acesso')?.addEventListener('click', handleCriarAcesso);
      document.getElementById('btn-criar-contrato')?.addEventListener('click', openCriarContratoModal);
      document.querySelectorAll('.btn-baixar-parcela').forEach((b) => {
        b.addEventListener('click', () => handleBaixarParcela(b.dataset.id, Number(b.dataset.valor), b.dataset.pago === 'true'));
      });
      document.getElementById('btn-salvar-contrato-doc')?.addEventListener('click', handleSalvarContratoDoc);
      document.getElementById('btn-gerar-pdf')?.addEventListener('click', handleGerarPdf);
      document.getElementById('btn-restaurar-modelo')?.addEventListener('click', () => {
        const txt = document.getElementById('texto-contrato');
        if (txt) txt.value = CLAUSULAS_PADRAO;
      });
    }
  } catch (err) {
    if (loadingEl) loadingEl.innerHTML = `<p class="text-destructive">Erro: ${err.message}</p>`;
  }
}

async function handleCriarAcesso() {
  const cpfLimpo = (currentAluno.cpf || '').replace(/\D/g, '');
  if (cpfLimpo.length !== 11) {
    toast.error('Cadastre um CPF válido (11 dígitos) no formando antes de liberar o acesso.');
    return;
  }

  // Notice about backend server function requirement
  openModal({
    title: 'Criação de Acesso do Formando',
    body: `
      <div class="space-y-3 text-sm">
        <p>O login e senha padrão são definidos com o CPF do formando:</p>
        <div class="card p-3 bg-muted font-mono text-xs">
          <strong>Login / E-mail:</strong> ${cpfLimpo}@formando.jmformaturas.app<br>
          <strong>Senha:</strong> ${cpfLimpo}
        </div>
        <p class="text-xs text-muted">
          Deseja marcar este formando como ativo com o login CPF <strong>${cpfLimpo}</strong>?
        </p>
      </div>
    `,
    footer: `
      <button class="btn btn-outline" id="btn-modal-cancel">Cancelar</button>
      <button class="btn btn-primary" id="btn-modal-confirm">Confirmar Acesso</button>
    `,
    onOpen: (backdrop) => {
      backdrop.querySelector('#btn-modal-cancel')?.addEventListener('click', () => backdrop.remove());
      backdrop.querySelector('#btn-modal-confirm')?.addEventListener('click', async () => {
        try {
          const { error } = await supabase
            .from('alunos')
            .update({ login_usuario: cpfLimpo })
            .eq('id', currentAluno.id);
          if (error) throw error;
          toast.success(`Acesso do formando configurado para o CPF ${cpfLimpo}`);
          backdrop.remove();
          await loadAlunoData();
        } catch (e) {
          toast.error(e.message || 'Erro ao registrar acesso');
        }
      });
    }
  });
}

function openCriarContratoModal() {
  const modal = openModal({
    title: 'Novo contrato de formatura',
    body: `
      <form id="form-contrato" class="space-y-3">
        ${field({ name: 'pacote', label: 'Pacote', value: 'Pacote completo', required: true })}
        <div class="grid gap-3 sm:grid-cols-2">
          ${field({ name: 'valor_total', label: 'Valor total (R$)', type: 'number', step: '0.01', required: true })}
          ${field({ name: 'desconto', label: 'Desconto (R$)', type: 'number', step: '0.01', value: '0' })}
          ${field({ name: 'valor_entrada', label: 'Entrada (R$)', type: 'number', step: '0.01', value: '0' })}
          ${field({ name: 'num_parcelas', label: 'Nº de parcelas', type: 'number', value: '12', required: true })}
          ${field({ name: 'dia_vencimento', label: 'Dia de vencimento', type: 'number', value: '10', required: true })}
          ${field({ name: 'primeiro_vencimento', label: '1º vencimento', type: 'date', required: true })}
          <div class="field">
            <label class="label" for="forma_pagamento">Forma de pagamento</label>
            <select class="select-native" id="forma_pagamento" name="forma_pagamento">
              ${FORMAS_PAGAMENTO.map((f) => `<option value="${f.id}">${f.label}</option>`).join('')}
            </select>
          </div>
        </div>
      </form>
    `,
    footer: `
      <button type="button" class="btn btn-outline" id="btn-cancel-contrato">Cancelar</button>
      <button type="submit" form="form-contrato" class="btn btn-primary" id="btn-save-contrato">Gerar contrato e parcelas</button>
    `,
    onOpen: (backdrop) => {
      backdrop.querySelector('#btn-cancel-contrato')?.addEventListener('click', () => modal.close());

      backdrop.querySelector('#form-contrato')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = backdrop.querySelector('#btn-save-contrato');
        btn.disabled = true;
        btn.textContent = 'Gerando parcelas...';

        const form = e.target;
        const pacote = form.pacote.value.trim();
        const valor_total = Number(form.valor_total.value) || 0;
        const desconto = Number(form.desconto.value) || 0;
        const valor_entrada = Number(form.valor_entrada.value) || 0;
        const num_parcelas = parseInt(form.num_parcelas.value, 10) || 1;
        const dia_vencimento = parseInt(form.dia_vencimento.value, 10) || 10;
        const primeiro_vencimento = form.primeiro_vencimento.value;
        const forma_pagamento = form.forma_pagamento.value;

        const financiado = valor_total - desconto - valor_entrada;
        if (financiado <= 0) {
          toast.error('O valor a parcelar precisa ser maior que zero.');
          btn.disabled = false;
          btn.textContent = 'Gerar contrato e parcelas';
          return;
        }

        try {
          // 1. Inserir Contrato
          const { data: novoContrato, error: cErr } = await supabase
            .from('contratos')
            .insert({
              aluno_id: alunoId,
              turma_id: currentAluno.turma_id ?? null,
              pacote,
              valor_total,
              desconto,
              valor_entrada,
              num_parcelas,
              dia_vencimento,
              forma_pagamento,
            })
            .select('id')
            .single();

          if (cErr) throw cErr;

          // 2. Gerar Linhas de Parcelas
          const base = Math.floor((financiado / num_parcelas) * 100) / 100;
          const resto = Math.round((financiado - base * num_parcelas) * 100) / 100;
          const inicio = new Date(`${primeiro_vencimento}T12:00:00`);

          const linhas = Array.from({ length: num_parcelas }, (_, i) => {
            const venc = new Date(inicio);
            venc.setMonth(venc.getMonth() + i);
            return {
              contrato_id: novoContrato.id,
              numero: i + 1,
              valor: i === 0 ? Math.round((base + resto) * 100) / 100 : base,
              vencimento: venc.toISOString().slice(0, 10),
            };
          });

          const hojeIso = hoje();
          const comEntrada = valor_entrada > 0
            ? [{ contrato_id: novoContrato.id, numero: 0, valor: valor_entrada, vencimento: hojeIso }, ...linhas]
            : linhas;

          const { error: pErr } = await supabase.from('parcelas').insert(comEntrada);
          if (pErr) throw pErr;

          toast.success('Contrato e parcelas gerados com sucesso!');
          modal.close();
          await loadAlunoData();
        } catch (err) {
          toast.error(err.message || 'Erro ao gerar contrato');
          btn.disabled = false;
          btn.textContent = 'Gerar contrato e parcelas';
        }
      });
    },
  });
}

async function handleBaixarParcela(id, valor, pago) {
  try {
    const { error } = await supabase
      .from('parcelas')
      .update(
        pago
          ? { status: 'pendente', valor_pago: 0, data_pagamento: null }
          : { status: 'pago', valor_pago: valor, data_pagamento: hoje() }
      )
      .eq('id', id);

    if (error) throw error;
    toast.success(pago ? 'Parcela estornada' : 'Baixa registrada com sucesso');
    await loadAlunoData();
  } catch (err) {
    toast.error(err.message || 'Erro ao atualizar parcela');
  }
}

async function handleSalvarContratoDoc() {
  const btn = document.getElementById('btn-salvar-contrato-doc');
  btn.disabled = true;
  btn.textContent = 'Salvando...';

  const texto = document.getElementById('texto-contrato')?.value;
  const forma = document.getElementById('select-forma-pgto')?.value;
  const autoriza = document.getElementById('switch-autoriza-imagem')?.checked;

  try {
    const { error } = await supabase
      .from('contratos')
      .update({ texto_contrato: texto, forma_pagamento: forma, autoriza_imagem: autoriza })
      .eq('id', currentContrato.id);

    if (error) throw error;
    toast.success('Contrato salvo!');
    currentContrato.texto_contrato = texto;
    currentContrato.forma_pagamento = forma;
    currentContrato.autoriza_imagem = autoriza;
  } catch (err) {
    toast.error(err.message || 'Erro ao salvar contrato');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `${icons.save} Salvar`;
  }
}

function handleGerarPdf() {
  if (!currentAluno || !currentContrato) return;
  const texto = document.getElementById('texto-contrato')?.value || CLAUSULAS_PADRAO;
  const forma = document.getElementById('select-forma-pgto')?.value || 'boleto';
  const autoriza = document.getElementById('switch-autoriza-imagem')?.checked ?? true;

  gerarContratoPdf({
    aluno: {
      nome_completo: currentAluno.nome_completo,
      cpf: currentAluno.cpf,
      endereco: currentAluno.endereco,
      cidade: currentAluno.cidade,
      telefone: currentAluno.whatsapp,
      email: currentAluno.email,
    },
    contrato: {
      pacote: currentContrato.pacote,
      valor_total: Number(currentContrato.valor_total),
      desconto: Number(currentContrato.desconto),
      valor_entrada: Number(currentContrato.valor_entrada),
      dia_vencimento: currentContrato.dia_vencimento,
      data_contrato: currentContrato.data_contrato,
      forma_pagamento: forma,
      autoriza_imagem: autoriza,
    },
    parcelas: currentParcelas.map((p) => ({
      numero: p.numero,
      valor: Number(p.valor),
      vencimento: p.vencimento,
      status: p.status,
      data_pagamento: p.data_pagamento,
      forma_pagamento: p.forma_pagamento,
    })),
    texto,
  });
}

init();
