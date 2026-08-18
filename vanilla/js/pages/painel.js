// ── Painel do Formando ─────────────────────────────────────
import { supabase } from '../supabase.js';
import { requireAuth, signOut } from '../auth.js';
import { renderAppShell, badge, icons, brl, dataBR, hoje, infoRow } from '../ui.js';
import { openModal } from '../modal.js';
import { toast } from '../toast.js';
import {
  CLAUSULAS_PADRAO,
  formaPagamentoLabel,
  gerarContratoPdf,
} from '../contrato-pdf.js';

const SELPICS_URL = 'https://selpics.com/';

let authState = null;
let currentAluno = null;
let currentContrato = null;
let currentParcelas = [];

async function init() {
  authState = await requireAuth();
  if (!authState) return;

  renderShell();
  await loadPainelData();
}

function renderShell() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell({
    auth: authState,
    currentPath: '/painel.html',
    content: `
      <div class="loader" id="painel-loading">Carregando seus dados...</div>
      <div id="painel-content" style="display:none;"></div>
    `,
  });

  document.getElementById('btn-signout')?.addEventListener('click', signOut);
}

async function loadPainelData() {
  const loadingEl = document.getElementById('painel-loading');
  const contentEl = document.getElementById('painel-content');

  try {
    const user = authState.user;
    const userEmail = user?.email || '';
    const userCpfDigits = userEmail.includes('@formando.jmformaturas.app')
      ? userEmail.split('@')[0].replace(/\D/g, '')
      : '';

    // 1. Buscar dados do aluno: tentar por user_id, cpf ou email
    let alunoQuery = supabase
      .from('alunos')
      .select('*, turmas(nome, curso, faculdade, semestre, previsao_formatura)')
      .eq('user_id', user.id)
      .maybeSingle();

    let { data: aluno, error: alunoError } = await alunoQuery;

    // Se não encontrou por user_id, tentar por CPF ou login_usuario
    if (!aluno && userCpfDigits) {
      const { data: alunoByCpf } = await supabase
        .from('alunos')
        .select('*, turmas(nome, curso, faculdade, semestre, previsao_formatura)')
        .or(`cpf.eq.${userCpfDigits},login_usuario.eq.${userCpfDigits}`)
        .maybeSingle();

      if (alunoByCpf) {
        aluno = alunoByCpf;
        // Vincular user_id para os próximos acessos
        if (!aluno.user_id) {
          await supabase.from('alunos').update({ user_id: user.id }).eq('id', aluno.id);
        }
      }
    }

    // Se ainda não encontrou, tentar por email comum
    if (!aluno && userEmail) {
      const { data: alunoByEmail } = await supabase
        .from('alunos')
        .select('*, turmas(nome, curso, faculdade, semestre, previsao_formatura)')
        .eq('email', userEmail)
        .maybeSingle();

      if (alunoByEmail) {
        aluno = alunoByEmail;
        if (!aluno.user_id) {
          await supabase.from('alunos').update({ user_id: user.id }).eq('id', aluno.id);
        }
      }
    }

    currentAluno = aluno;

    // 2. Se encontrou o aluno, buscar o contrato dele
    if (currentAluno) {
      const { data: contrato, error: contratoError } = await supabase
        .from('contratos')
        .select('*, parcelas(*)')
        .eq('aluno_id', currentAluno.id)
        .maybeSingle();

      if (contratoError) throw contratoError;
      currentContrato = contrato;
      currentParcelas = [...(currentContrato?.parcelas ?? [])].sort((a, b) => a.numero - b.numero);
    }

    const hojeIso = hoje();
    const pago = currentParcelas.reduce((s, p) => s + Number(p.valor_pago), 0) + Number(currentContrato?.valor_entrada ?? 0);
    const emAberto = currentParcelas.filter((p) => p.status !== 'pago').reduce((s, p) => s + Number(p.valor), 0);
    const primeiroNome = (currentAluno?.nome_completo ?? user?.user_metadata?.full_name ?? user?.email ?? '').split(' ')[0];

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      contentEl.innerHTML = `
        <h1 class="text-2xl font-semibold">Olá, ${primeiroNome} 👋</h1>
        <p class="mb-6 text-sm text-muted">Bem-vindo à sua área na JM Formaturas.</p>

        ${authState.isStaff ? `
          <div class="card mb-4">
            <div class="card-content pt-6 text-sm">
              Você está logado com perfil de <strong>equipe/administrador</strong>.
              <a href="dashboard.html" class="text-primary underline underline-offset-4 font-semibold ml-1">Ir para o Painel da Equipe &rarr;</a>
            </div>
          </div>
        ` : ''}

        ${!currentAluno && !authState.isStaff ? `
          <div class="card mb-6">
            <div class="card-content pt-6 text-sm text-muted">
              Seu login (<strong>${user?.email}</strong>) ainda não está vinculado a um cadastro de formando.
              Entre em contato com a equipe da JM Formaturas informando seu CPF para liberação da sua turma e contrato.
            </div>
          </div>
        ` : ''}

        ${currentAluno ? `
          <div class="grid gap-4 sm:grid-cols-2">
            <!-- Selpics fotos -->
            <div class="card sm:col-span-2">
              <div class="card-header row justify-between">
                <h2 class="card-title">
                  <span class="text-primary">${icons.camera}</span> Seleção de fotos
                </h2>
                <a href="${SELPICS_URL}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
                  Selecionar minhas fotos ${icons.externalLink}
                </a>
              </div>
              <div class="card-content text-sm text-muted">
                Escolha as fotos da sua formatura na plataforma Selpics usando o mesmo CPF do seu acesso.
              </div>
            </div>

            <!-- Meus dados -->
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Meus dados</h2>
              </div>
              <div class="card-content space-y-1 text-sm">
                ${infoRow('Nome', currentAluno.nome_completo)}
                ${infoRow('CPF', currentAluno.cpf)}
                ${infoRow('WhatsApp', currentAluno.whatsapp)}
                ${infoRow('E-mail', currentAluno.email)}
              </div>
            </div>

            <!-- Minha turma -->
            <div class="card">
              <div class="card-header row justify-between">
                <h2 class="card-title">Minha turma</h2>
                ${badge(currentAluno.status ?? 'ativa', 'secondary')}
              </div>
              <div class="card-content space-y-1 text-sm">
                ${infoRow('Turma', currentAluno.turmas?.nome)}
                ${infoRow('Curso', currentAluno.turmas?.curso)}
                ${infoRow('Faculdade', currentAluno.turmas?.faculdade)}
                ${infoRow('Semestre', currentAluno.turmas?.semestre)}
              </div>
            </div>

            <!-- Parcelas e Financeiro do Aluno -->
            <div class="card sm:col-span-2">
              <div class="card-header row justify-between">
                <h2 class="card-title">Situação Financeira</h2>
                ${currentContrato ? badge(currentContrato.pacote, 'default') : badge('Aguardando lançamento', 'secondary')}
              </div>
              <div class="card-content space-y-3 text-sm">
                ${!currentContrato ? `
                  <p class="text-muted">
                    Seu contrato e plano de parcelas ainda não foram lançados pela equipe. Assim que cadastrado, você poderá acompanhar seus vencimentos e pagamentos aqui.
                  </p>
                ` : `
                  <div class="grid gap-2 sm:grid-cols-3">
                    ${infoRow('Valor total', brl(Number(currentContrato.valor_total)))}
                    ${infoRow('Já pago', brl(pago))}
                    ${infoRow('Em aberto', brl(emAberto))}
                  </div>

                  <div class="space-y-2 mt-4">
                    ${currentParcelas.map((p) => {
                      const quitada = p.status === 'pago';
                      const atrasada = !quitada && p.vencimento < hojeIso;
                      return `
                        <div class="list-row">
                          <span>
                            ${p.numero === 0 ? 'Entrada' : `Parcela ${p.numero}/${currentParcelas.filter(x => x.numero > 0).length}`} · ${dataBR(p.vencimento)}
                          </span>
                          <span class="flex items-center gap-2">
                            <span class="font-medium">${brl(Number(p.valor))}</span>
                            ${badge(quitada ? 'pago' : atrasada ? 'atrasada' : 'pendente', quitada ? 'default' : atrasada ? 'destructive' : 'secondary')}
                            ${!quitada ? `
                              <button class="btn btn-primary btn-sm btn-pagar-parcela" data-id="${p.id}" data-num="${p.numero}" data-valor="${Number(p.valor) - Number(p.valor_pago)}">
                                Pagar
                              </button>
                            ` : ''}
                          </span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                `}
              </div>
            </div>

            <!-- Contrato do Formando (Modelo Oficial Fechado, Apenas Leitura / Visualização / Impressão) -->
            <div class="card sm:col-span-2" id="contrato-formando-card">
              <div class="card-header row justify-between">
                <div>
                  <h2 class="card-title">
                    <span class="text-primary">${icons.fileDown}</span> Contrato de Prestação de Serviços
                  </h2>
                  <p class="text-xs text-muted mt-1">Documento contratual oficial gerado pela administração (somente leitura)</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <span class="badge badge-secondary gap-1" style="display:inline-flex;align-items:center;padding:4px 8px;font-size:0.75rem;">
                    ${icons.lock} Bloqueado para edição
                  </span>
                  <button class="btn btn-outline btn-sm" id="btn-imprimir-contrato">
                    ${icons.printer} Imprimir Contrato
                  </button>
                  <button class="btn btn-primary btn-sm" id="btn-baixar-pdf-aluno">
                    ${icons.fileDown} Baixar em PDF
                  </button>
                </div>
              </div>
              <div class="card-content space-y-4">
                ${currentContrato ? `
                  <div class="grid gap-3 sm:grid-cols-3">
                    <div class="rounded-xl border p-3 bg-muted">
                      <p class="text-xs text-muted font-medium">PACOTE CONTRATADO</p>
                      <p class="text-sm font-semibold mt-1">${currentContrato.pacote}</p>
                      <p class="text-xs text-muted mt-1">
                        Total: ${brl(Number(currentContrato.valor_total))}
                        ${Number(currentContrato.desconto) > 0 ? ` (Desconto: ${brl(Number(currentContrato.desconto))})` : ''}
                      </p>
                    </div>
                    <div class="rounded-xl border p-3 bg-muted">
                      <p class="text-xs text-muted font-medium">FORMA DE PAGAMENTO</p>
                      <p class="text-sm font-semibold mt-1">${formaPagamentoLabel(currentContrato.forma_pagamento)}</p>
                      <p class="text-xs text-muted mt-1">Vencimento todo dia ${String(currentContrato.dia_vencimento ?? 10).padStart(2, '0')}</p>
                    </div>
                    <div class="rounded-xl border p-3 bg-muted">
                      <p class="text-xs text-muted font-medium">USO DE IMAGEM</p>
                      <p class="text-sm font-semibold mt-1">
                        ${currentContrato.autoriza_imagem !== false ? 'Autorizado (Sim)' : 'Não autorizado'}
                      </p>
                      <p class="text-xs text-muted mt-1">Portfólio e mídias da empresa</p>
                    </div>
                  </div>
                ` : `
                  <div class="p-3 rounded-xl border bg-muted text-sm text-muted">
                    Pacote e condições financeiras pendentes de lançamento pela equipe. Abaixo estão os termos e cláusulas padrão do serviço.
                  </div>
                `}

                <div class="rounded-xl border p-4" style="background-color: var(--background);">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-xs font-semibold text-muted uppercase tracking-wider">Termos e Cláusulas Contratuais</h3>
                    <span class="text-xs text-muted" style="display:inline-flex;align-items:center;gap:4px;">
                      ${icons.lock} Modelo definido pelo administrador
                    </span>
                  </div>
                  <div class="font-mono text-xs leading-relaxed" style="white-space: pre-wrap; max-height: 280px; overflow-y: auto; color: var(--foreground); user-select: text;">
${currentContrato?.texto_contrato || CLAUSULAS_PADRAO}
                  </div>
                </div>
                <p class="text-xs text-muted text-center">
                  Este contrato é disponibilizado em formato somente leitura para sua conferência, impressão e salvamento em formato PDF.
                </p>
              </div>
            </div>
          </div>
        ` : ''}
      `;

      // Handlers
      document.querySelectorAll('.btn-pagar-parcela').forEach((b) => {
        b.addEventListener('click', () => {
          openPagamentoModal(b.dataset.id, b.dataset.num, Number(b.dataset.valor));
        });
      });

      document.getElementById('btn-baixar-pdf-aluno')?.addEventListener('click', handleDownloadPdfAluno);
      document.getElementById('btn-imprimir-contrato')?.addEventListener('click', handleImprimirContrato);
    }
  } catch (err) {
    if (loadingEl) loadingEl.innerHTML = `<p class="text-destructive">Erro ao carregar dados: ${err.message}</p>`;
  }
}

function openPagamentoModal(parcelaId, numero, valor) {
  openModal({
    title: `Pagar parcela ${numero} · ${brl(valor)}`,
    description: 'Escolha a forma de pagamento.',
    body: `
      <div class="grid gap-3 sm:grid-cols-3">
        <button type="button" class="btn-metodo-pgto flex flex-col items-center gap-1 rounded-xl border p-4 text-sm transition hover:border-primary" data-metodo="pix" style="background:var(--background);">
          <span class="text-primary font-semibold">Pix</span>
          <span class="text-xs text-muted text-center">QR Code e copia e cola</span>
        </button>
        <button type="button" class="btn-metodo-pgto flex flex-col items-center gap-1 rounded-xl border p-4 text-sm transition hover:border-primary" data-metodo="cartao" style="background:var(--background);">
          <span class="text-primary font-semibold">Cartão</span>
          <span class="text-xs text-muted text-center">Crédito ou débito</span>
        </button>
        <button type="button" class="btn-metodo-pgto flex flex-col items-center gap-1 rounded-xl border p-4 text-sm transition hover:border-primary" data-metodo="boleto" style="background:var(--background);">
          <span class="text-primary font-semibold">Boleto</span>
          <span class="text-xs text-muted text-center">Linha digitável</span>
        </button>
      </div>
      <div id="pgto-resultado" class="mt-4 rounded-lg bg-muted p-3 text-sm text-muted" style="display:none;"></div>
    `,
    footer: `
      <button class="btn btn-outline" id="btn-close-pgto">Fechar</button>
    `,
    onOpen: (backdrop) => {
      backdrop.querySelector('#btn-close-pgto')?.addEventListener('click', () => backdrop.remove());

      backdrop.querySelectorAll('.btn-metodo-pgto').forEach((b) => {
        b.addEventListener('click', () => {
          const resultado = backdrop.querySelector('#pgto-resultado');
          if (resultado) {
            resultado.style.display = 'block';
            resultado.innerHTML = `
              <strong>Cobrança preparada (${b.dataset.metodo.toUpperCase()}).</strong><br>
              Para efetuar o pagamento da Parcela ${numero}, solicite a chave Pix ou linha digitável diretamente à equipe da JM Formaturas via WhatsApp.
            `;
          }
        });
      });
    }
  });
}

function handleDownloadPdfAluno() {
  if (!currentAluno) {
    toast.error('Dados do formando não carregados.');
    return;
  }

  const contratoValores = currentContrato || {
    pacote: 'Pacote padrão de formatura',
    valor_total: 0,
    desconto: 0,
    valor_entrada: 0,
    dia_vencimento: 10,
    data_contrato: hoje(),
    forma_pagamento: 'boleto',
    autoriza_imagem: true,
  };

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
      pacote: contratoValores.pacote,
      valor_total: Number(contratoValores.valor_total),
      desconto: Number(contratoValores.desconto),
      valor_entrada: Number(contratoValores.valor_entrada),
      dia_vencimento: contratoValores.dia_vencimento,
      data_contrato: contratoValores.data_contrato || hoje(),
      forma_pagamento: contratoValores.forma_pagamento ?? 'boleto',
      autoriza_imagem: contratoValores.autoriza_imagem ?? true,
    },
    parcelas: currentParcelas.map((p) => ({
      numero: p.numero,
      valor: Number(p.valor),
      vencimento: p.vencimento,
      status: p.status,
      data_pagamento: p.data_pagamento,
      forma_pagamento: p.forma_pagamento,
    })),
    texto: currentContrato?.texto_contrato || CLAUSULAS_PADRAO,
  });

  toast.success('Download do PDF gerado com sucesso!');
}

function handleImprimirContrato() {
  if (!currentAluno) {
    toast.error('Dados do formando não carregados.');
    return;
  }

  const contratoValores = currentContrato || {
    pacote: 'Pacote padrão de formatura',
    valor_total: 0,
    desconto: 0,
    valor_entrada: 0,
    dia_vencimento: 10,
    data_contrato: hoje(),
    forma_pagamento: 'boleto',
    autoriza_imagem: true,
  };

  const textoClausulas = currentContrato?.texto_contrato || CLAUSULAS_PADRAO;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Permita pop-ups no seu navegador para imprimir o contrato.');
    return;
  }

  const parcelasHtml = currentParcelas.length > 0
    ? currentParcelas.map((p) => `
        <tr>
          <td style="padding:6px 8px;border-bottom:1px solid #ddd;">${p.numero === 0 ? 'Entrada' : `Parcela ${p.numero}`}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #ddd;">${dataBR(p.vencimento)}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #ddd;">${brl(Number(p.valor))}</td>
          <td style="padding:6px 8px;border-bottom:1px solid #ddd;">${p.status === 'pago' ? 'Pago' : 'Em aberto'}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="4" style="padding:10px;text-align:center;color:#666;">Aguardando definição do quadro de parcelas pela equipe.</td></tr>`;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Contrato - ${currentAluno.nome_completo}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #222; margin: 30px; }
        h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
        .sub { text-align: center; font-size: 11px; color: #555; margin-bottom: 20px; }
        .section-title { font-size: 13px; font-weight: bold; margin-top: 20px; margin-bottom: 6px; border-bottom: 1px solid #222; padding-bottom: 2px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
        th { text-align: left; background: #f0f0f0; padding: 6px 8px; border-bottom: 1px solid #999; }
        .clausulas { white-space: pre-wrap; font-size: 11px; line-height: 1.6; margin-top: 10px; }
        .assinaturas { margin-top: 50px; display: flex; justify-content: space-between; }
        .linha-assinatura { width: 45%; border-top: 1px solid #000; padding-top: 5px; text-align: center; font-size: 12px; }
        @media print {
          body { margin: 15mm; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom:20px;text-align:right;">
        <button onclick="window.print()" style="padding:8px 16px;font-size:14px;background:#24324f;color:#fff;border:none;border-radius:6px;cursor:pointer;">Imprimir Documento</button>
      </div>

      <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS</h1>
      <div class="sub">
        JM Stúdio Fotográfico — CNPJ: 45.124.637/0001-28<br>
        63 99206-0225 / @jm_studiofotografico / jmstudiofotograficoaraguaina@gmail.com
      </div>

      <div class="section-title">DADOS DO CONTRATANTE</div>
      <div><strong>Nome:</strong> ${currentAluno.nome_completo}</div>
      <div><strong>CPF:</strong> ${currentAluno.cpf ?? '—'} &nbsp;&nbsp;&nbsp; <strong>Contato:</strong> ${currentAluno.whatsapp ?? '—'}</div>
      <div><strong>Turma:</strong> ${currentAluno.turmas?.nome ?? '—'} (${currentAluno.turmas?.curso ?? '—'} - ${currentAluno.turmas?.faculdade ?? '—'})</div>

      <div class="section-title">DADOS DO PACOTE E INVESTIMENTO</div>
      <div><strong>Pacote:</strong> ${contratoValores.pacote}</div>
      <div><strong>Valor total:</strong> ${brl(Number(contratoValores.valor_total))} ${contratoValores.desconto > 0 ? `(Desconto: ${brl(Number(contratoValores.desconto))})` : ''}</div>
      <div><strong>Forma de pagamento:</strong> ${formaPagamentoLabel(contratoValores.forma_pagamento)} (Vencimento todo dia ${String(contratoValores.dia_vencimento).padStart(2, '0')})</div>
      <div><strong>Autorização de uso de imagem:</strong> ${contratoValores.autoriza_imagem !== false ? 'SIM (Autorizado)' : 'NÃO (Não autorizado)'}</div>

      <div class="section-title">QUADRO DE PARCELAS</div>
      <table>
        <thead>
          <tr>
            <th>Parcela</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          ${parcelasHtml}
        </tbody>
      </table>

      <div class="section-title">CLÁUSULAS CONTRATUAIS</div>
      <div class="clausulas">${textoClausulas}</div>

      <div class="assinaturas">
        <div class="linha-assinatura">
          CONTRATANTE<br>
          ${currentAluno.nome_completo}<br>
          CPF: ${currentAluno.cpf ?? '—'}
        </div>
        <div class="linha-assinatura">
          CONTRATADO<br>
          JM Stúdio Fotográfico<br>
          CNPJ: 45.124.637/0001-28
        </div>
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();
}

init();
