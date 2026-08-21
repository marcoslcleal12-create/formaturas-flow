// Armazenamento local e regras de negócio para Colaboradores e Lançamentos

export type LancamentoTipo = 'entrada' | 'saida';

export type CategoriaEntrada =
  | 'Freelancer'
  | 'Horas Extras'
  | 'Comissão'
  | 'Bônus / Premiação'
  | 'Diária Externa'
  | 'Reembolso'
  | 'Outros Acréscimos';

export type CategoriaSaida =
  | 'Vale / Adiantamento'
  | 'Desconto de Falta'
  | 'Adiantamento Salarial'
  | 'Atrasos / Deduções'
  | 'Empréstimo'
  | 'Outros Descontos';

export interface LancamentoColaborador {
  id: string;
  colaboradorId: string;
  tipo: LancamentoTipo; // 'entrada' (acréscimo) | 'saida' (desconto)
  categoria: CategoriaEntrada | CategoriaSaida | string;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD
  referenciaMesAno?: string | undefined; // YYYY-MM
  createdAt: string;
}

export interface Colaborador {
  id: string;
  nome: string;
  funcao: string;
  salarioBase: number;
  telefone?: string | undefined;
  chavePix?: string | undefined;
  status: 'ativo' | 'inativo';
  dataAdmissao?: string | undefined;
  email?: string | undefined;
  observacoes?: string | undefined;
  createdAt: string;
}

const STORAGE_KEY_COLABORADORES = 'jm_colaboradores_v1';
const STORAGE_KEY_LANCAMENTOS = 'jm_colaboradores_lancamentos_v1';

const COLABORADORES_INICIAIS: Colaborador[] = [
  {
    id: 'colab-1',
    nome: 'Carlos Eduardo Mendes',
    funcao: 'Fotógrafo Principal',
    salarioBase: 3800,
    telefone: '(11) 98765-4321',
    chavePix: 'carlos.mendes@email.com',
    status: 'ativo',
    dataAdmissao: '2023-02-15',
    email: 'carlos.mendes@email.com',
    observacoes: 'Responsável pelas coberturas de eventos e ensaios externos.',
    createdAt: new Date('2023-02-15').toISOString(),
  },
  {
    id: 'colab-2',
    nome: 'Mariana Silva Souza',
    funcao: 'Editora de Vídeo & Designer',
    salarioBase: 3200,
    telefone: '(11) 97654-3210',
    chavePix: '123.456.789-00',
    status: 'ativo',
    dataAdmissao: '2023-05-10',
    email: 'mariana.design@email.com',
    observacoes: 'Edição de reels, vídeos de formatura e tratamento de álbuns.',
    createdAt: new Date('2023-05-10').toISOString(),
  },
  {
    id: 'colab-3',
    nome: 'Rafael Costa Albuquerque',
    funcao: 'Cerimonialista & Produção',
    salarioBase: 2900,
    telefone: '(11) 96543-2109',
    chavePix: 'rafael.cerimonial@pix.com',
    status: 'ativo',
    dataAdmissao: '2023-08-01',
    email: 'rafael.producao@email.com',
    observacoes: 'Coordenação no dia dos bailes e eventos solenes.',
    createdAt: new Date('2023-08-01').toISOString(),
  },
  {
    id: 'colab-4',
    nome: 'Beatriz Lima Rocha',
    funcao: 'Atendimento & Comercial',
    salarioBase: 2600,
    telefone: '(11) 95432-1098',
    chavePix: 'beatriz.comercial@email.com',
    status: 'ativo',
    dataAdmissao: '2024-01-10',
    email: 'beatriz.lima@email.com',
    observacoes: 'Suporte às comissões de formatura e contratos.',
    createdAt: new Date('2024-01-10').toISOString(),
  },
];

const hojeISO = new Date().toISOString().split('T')[0] ?? '2026-08-21';
const mesAtual = hojeISO.substring(0, 7);

const LANCAMENTOS_INICIAIS: LancamentoColaborador[] = [
  {
    id: 'lanc-1',
    colaboradorId: 'colab-1',
    tipo: 'entrada',
    categoria: 'Freelancer',
    descricao: 'Cobertura Baile Medicina Turma XXII (Freelance extra)',
    valor: 450,
    data: hojeISO,
    referenciaMesAno: mesAtual,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lanc-2',
    colaboradorId: 'colab-1',
    tipo: 'entrada',
    categoria: 'Horas Extras',
    descricao: '6 horas extras tratamento de fotos fim de semana',
    valor: 180,
    data: hojeISO,
    referenciaMesAno: mesAtual,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lanc-3',
    colaboradorId: 'colab-1',
    tipo: 'saida',
    categoria: 'Vale / Adiantamento',
    descricao: 'Adiantamento de transporte e alimentação para viagem',
    valor: 200,
    data: hojeISO,
    referenciaMesAno: mesAtual,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lanc-4',
    colaboradorId: 'colab-2',
    tipo: 'entrada',
    categoria: 'Horas Extras',
    descricao: 'Edição expressa de vídeo retrospectiva',
    valor: 250,
    data: hojeISO,
    referenciaMesAno: mesAtual,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lanc-5',
    colaboradorId: 'colab-2',
    tipo: 'saida',
    categoria: 'Vale / Adiantamento',
    descricao: 'Vale adiantado quinzenal',
    valor: 300,
    data: hojeISO,
    referenciaMesAno: mesAtual,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lanc-6',
    colaboradorId: 'colab-3',
    tipo: 'entrada',
    categoria: 'Freelancer',
    descricao: 'Apoio em evento de Aniversário externo',
    valor: 350,
    data: hojeISO,
    referenciaMesAno: mesAtual,
    createdAt: new Date().toISOString(),
  },
];

export function getColaboradores(): Colaborador[] {
  if (typeof window === 'undefined') return COLABORADORES_INICIAIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLABORADORES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_COLABORADORES, JSON.stringify(COLABORADORES_INICIAIS));
      return COLABORADORES_INICIAIS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler colaboradores:', err);
    return COLABORADORES_INICIAIS;
  }
}

export function saveColaboradores(colaboradores: Colaborador[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_COLABORADORES, JSON.stringify(colaboradores));
  } catch (err) {
    console.error('Erro ao salvar colaboradores:', err);
  }
}

export function getLancamentos(): LancamentoColaborador[] {
  if (typeof window === 'undefined') return LANCAMENTOS_INICIAIS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANCAMENTOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LANCAMENTOS, JSON.stringify(LANCAMENTOS_INICIAIS));
      return LANCAMENTOS_INICIAIS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler lançamentos:', err);
    return LANCAMENTOS_INICIAIS;
  }
}

export function saveLancamentos(lancamentos: LancamentoColaborador[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LANCAMENTOS, JSON.stringify(lancamentos));
  } catch (err) {
    console.error('Erro ao salvar lançamentos:', err);
  }
}

export function addColaborador(dados: Omit<Colaborador, 'id' | 'createdAt'>): Colaborador {
  const list = getColaboradores();
  const novo: Colaborador = {
    ...dados,
    id: 'colab-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString(),
  };
  list.unshift(novo);
  saveColaboradores(list);
  return novo;
}

export function updateColaborador(id: string, atualizacao: Partial<Colaborador>): Colaborador | null {
  const list = getColaboradores();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const atual = list[index];
  if (!atual) return null;

  const atualizado: Colaborador = {
    id: atual.id,
    nome: atualizacao.nome ?? atual.nome,
    funcao: atualizacao.funcao ?? atual.funcao,
    salarioBase: atualizacao.salarioBase ?? atual.salarioBase,
    telefone: atualizacao.telefone !== undefined ? atualizacao.telefone : atual.telefone,
    chavePix: atualizacao.chavePix !== undefined ? atualizacao.chavePix : atual.chavePix,
    status: atualizacao.status ?? atual.status,
    dataAdmissao: atualizacao.dataAdmissao !== undefined ? atualizacao.dataAdmissao : atual.dataAdmissao,
    email: atualizacao.email !== undefined ? atualizacao.email : atual.email,
    observacoes: atualizacao.observacoes !== undefined ? atualizacao.observacoes : atual.observacoes,
    createdAt: atual.createdAt,
  };

  list[index] = atualizado;
  saveColaboradores(list);
  return atualizado;
}

export function deleteColaborador(id: string): void {
  const list = getColaboradores().filter((c) => c.id !== id);
  saveColaboradores(list);

  // Também limpa lançamentos deste colaborador
  const lancamentos = getLancamentos().filter((l) => l.colaboradorId !== id);
  saveLancamentos(lancamentos);
}

export function addLancamento(
  dados: Omit<LancamentoColaborador, 'id' | 'createdAt' | 'referenciaMesAno'>
): LancamentoColaborador {
  const list = getLancamentos();
  const refMes = dados.data ? dados.data.substring(0, 7) : new Date().toISOString().substring(0, 7);
  const novo: LancamentoColaborador = {
    ...dados,
    id: 'lanc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    referenciaMesAno: refMes,
    createdAt: new Date().toISOString(),
  };
  list.unshift(novo);
  saveLancamentos(list);
  return novo;
}

export function deleteLancamento(id: string): void {
  const list = getLancamentos().filter((l) => l.id !== id);
  saveLancamentos(list);
}

export function calcularTotaisColaborador(
  colaborador: Colaborador,
  lancamentos: LancamentoColaborador[],
  filtroMesAno?: string
) {
  const lancamentosFiltrados = lancamentos.filter((l) => {
    if (l.colaboradorId !== colaborador.id) return false;
    if (filtroMesAno && filtroMesAno !== 'todos') {
      const dataRef = l.referenciaMesAno || l.data.substring(0, 7);
      return dataRef === filtroMesAno;
    }
    return true;
  });

  const totalEntradas = lancamentosFiltrados
    .filter((l) => l.tipo === 'entrada')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const totalSaidas = lancamentosFiltrados
    .filter((l) => l.tipo === 'saida')
    .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);

  const salarioBase = Number(colaborador.salarioBase) || 0;
  const valorFinal = Math.max(0, salarioBase + totalEntradas - totalSaidas);

  return {
    salarioBase,
    totalEntradas,
    totalSaidas,
    valorFinal,
    lancamentos: lancamentosFiltrados,
  };
}
