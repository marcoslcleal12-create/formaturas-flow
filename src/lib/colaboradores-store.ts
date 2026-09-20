/*  Camada de compatibilidade sobre a API .NET.
 *
 *  A UI (colaboradores.tsx) ainda espera funcoes sincronas — o refactor
 *  completo pra React Query seria grande. Como MVP, este arquivo mantem
 *  a API antiga (getColaboradores/getLancamentos/adicionar/deletar/editar)
 *  mas armazena os dados em memoria + resincroniza da API sob demanda.
 *
 *  Fluxo:
 *  - Boot: `carregarSincrono()` (chamado no useEffect da pagina) puxa da API
 *    e popula o cache em memoria.
 *  - Get*: retornam o cache atual sincrono.
 *  - Adicionar/Editar/Deletar: chamam a API e atualizam o cache.
 *
 *  Depois vale migrar tudo pra useQuery — mas isso ja tira o mock antigo do
 *  ar e passa a operar contra o banco real. */

import {
  listColaboradores,
  listLancamentos,
  createColaborador as apiCreateColaborador,
  updateColaborador as apiUpdateColaborador,
  deleteColaborador as apiDeleteColaborador,
  createLancamento as apiCreateLancamento,
  deleteLancamento as apiDeleteLancamento,
  type Colaborador as ApiColaborador,
  type LancamentoColaborador as ApiLancamento,
} from "@/lib/api/colaboradores";

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
  tipo: LancamentoTipo;
  categoria: CategoriaEntrada | CategoriaSaida | string;
  descricao: string;
  valor: number;
  data: string;
  referenciaMesAno?: string | undefined;
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

let cacheColaboradores: Colaborador[] = [];
let cacheLancamentos: LancamentoColaborador[] = [];

function adaptarColab(c: ApiColaborador): Colaborador {
  return {
    id: c.id,
    nome: c.nome,
    funcao: c.funcao,
    salarioBase: Number(c.salarioBase),
    telefone: c.telefone ?? undefined,
    chavePix: c.chavePix ?? undefined,
    status: c.status === "Ativo" ? "ativo" : "inativo",
    dataAdmissao: c.dataAdmissao ?? undefined,
    email: c.email ?? undefined,
    observacoes: c.observacoes ?? undefined,
    createdAt: c.criadoEm,
  };
}

function adaptarLanc(l: ApiLancamento): LancamentoColaborador {
  return {
    id: l.id,
    colaboradorId: l.colaboradorId,
    tipo: l.tipo === "Entrada" ? "entrada" : "saida",
    categoria: l.categoria,
    descricao: l.descricao,
    valor: Number(l.valor),
    data: l.data,
    referenciaMesAno: l.referenciaMesAno ?? undefined,
    createdAt: l.criadoEm,
  };
}

export async function sincronizarColaboradores(): Promise<void> {
  const [colabs, lancs] = await Promise.all([
    listColaboradores(),
    listLancamentos(),
  ]);
  cacheColaboradores = colabs.map(adaptarColab);
  cacheLancamentos = lancs.map(adaptarLanc);
}

export function getColaboradores(): Colaborador[] {
  return cacheColaboradores;
}

export function getLancamentos(): LancamentoColaborador[] {
  return cacheLancamentos;
}

export async function adicionarColaborador(c: Omit<Colaborador, 'id' | 'createdAt'>): Promise<Colaborador> {
  const criado = await apiCreateColaborador({
    nome: c.nome,
    funcao: c.funcao,
    salarioBase: c.salarioBase,
    telefone: c.telefone,
    chavePix: c.chavePix,
    email: c.email,
    dataAdmissao: c.dataAdmissao,
    observacoes: c.observacoes,
  });
  const adaptado = adaptarColab(criado);
  cacheColaboradores = [...cacheColaboradores, adaptado];
  return adaptado;
}

export async function editarColaborador(id: string, c: Partial<Omit<Colaborador, 'id' | 'createdAt'>>): Promise<Colaborador> {
  const existente = cacheColaboradores.find((x) => x.id === id);
  if (!existente) throw new Error("Colaborador não encontrado no cache.");
  const merged = { ...existente, ...c };
  const atualizado = await apiUpdateColaborador(id, {
    nome: merged.nome,
    funcao: merged.funcao,
    salarioBase: merged.salarioBase,
    telefone: merged.telefone,
    chavePix: merged.chavePix,
    email: merged.email,
    dataAdmissao: merged.dataAdmissao,
    observacoes: merged.observacoes,
    status: (merged.status === "ativo" ? "Ativo" : "Inativo") as "Ativo" | "Inativo",
  });
  const adaptado = adaptarColab(atualizado);
  cacheColaboradores = cacheColaboradores.map((x) => (x.id === id ? adaptado : x));
  return adaptado;
}

export async function deletarColaborador(id: string): Promise<void> {
  await apiDeleteColaborador(id);
  cacheColaboradores = cacheColaboradores.filter((c) => c.id !== id);
  cacheLancamentos = cacheLancamentos.filter((l) => l.colaboradorId !== id);
}

export async function adicionarLancamento(l: Omit<LancamentoColaborador, 'id' | 'createdAt'>): Promise<LancamentoColaborador> {
  const criado = await apiCreateLancamento({
    colaboradorId: l.colaboradorId,
    tipo: l.tipo === "entrada" ? "Entrada" : "Saida",
    categoria: l.categoria,
    descricao: l.descricao,
    valor: l.valor,
    data: l.data,
    referenciaMesAno: l.referenciaMesAno,
  });
  const adaptado = adaptarLanc(criado);
  cacheLancamentos = [adaptado, ...cacheLancamentos];
  return adaptado;
}

export async function deletarLancamento(id: string): Promise<void> {
  await apiDeleteLancamento(id);
  cacheLancamentos = cacheLancamentos.filter((l) => l.id !== id);
}

/*  Aliases usados pela pagina de colaboradores (nomes historicos ficaram
    com sufixos add/update/delete em ingles). */
export const addColaborador     = adicionarColaborador;
export const updateColaborador  = editarColaborador;
export const deleteColaborador  = deletarColaborador;
export const addLancamento      = adicionarLancamento;
export const deleteLancamento   = deletarLancamento;

export type TotaisColaborador = {
  colaborador: Colaborador;
  salarioBase: number;
  totalEntradas: number;
  totalSaidas: number;
  valorFinal: number;
  lancamentos: LancamentoColaborador[];
};

/*  Consolida os lancamentos do mes (`YYYY-MM`) e devolve o liquido do
    colaborador. Quando `mesAno` for "todos", agrega tudo. */
export function calcularTotaisColaborador(
  colab: Colaborador,
  lancamentos: LancamentoColaborador[],
  mesAno: string,
): TotaisColaborador {
  const doColab = lancamentos.filter((l) => l.colaboradorId === colab.id);
  const filtrados = mesAno === "todos"
    ? doColab
    : doColab.filter((l) => (l.referenciaMesAno ?? l.data.substring(0, 7)) === mesAno);

  const totalEntradas = filtrados
    .filter((l) => l.tipo === "entrada")
    .reduce((s, l) => s + Number(l.valor), 0);
  const totalSaidas = filtrados
    .filter((l) => l.tipo === "saida")
    .reduce((s, l) => s + Number(l.valor), 0);

  return {
    colaborador: colab,
    salarioBase: Number(colab.salarioBase),
    totalEntradas,
    totalSaidas,
    valorFinal: Number(colab.salarioBase) + totalEntradas - totalSaidas,
    lancamentos: filtrados,
  };
}
