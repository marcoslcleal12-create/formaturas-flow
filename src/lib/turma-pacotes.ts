export interface PacoteItem {
  id: string;
  nome: string;
  material: string;
  investimento: number;
  ativo?: boolean;
}

export const PACOTES_PADRAO: PacoteItem[] = [
  {
    id: "pacote-1",
    nome: "1º PACOTE - SOMENTE COLAÇÃO DE GRAU",
    material: "30 fotos editadas em mídia digitais, enviadas via link.",
    investimento: 870.0,
    ativo: true,
  },
  {
    id: "pacote-2",
    nome: "2º PACOTE - ENSAIO + COLAÇÃO DE GRAU",
    material: "40 fotos editadas em mídia digitais, enviadas via link.",
    investimento: 1400.0,
    ativo: true,
  },
  {
    id: "pacote-3",
    nome: "3º PACOTE - ENSAIO + COLAÇÃO DE GRAU (ALTA RESOLUÇÃO)",
    material: "Todas as fotos em alta resolução e enviadas via link.",
    investimento: 1740.0,
    ativo: true,
  },
  {
    id: "pacote-4",
    nome: "4º PACOTE - ENSAIO + COLAÇÃO DE GRAU (ÁLBUM LUXO)",
    material: "1 Álbum encadernado luxo 20X30 com 60 fotos em 30 páginas, capa personalizada com foto.",
    investimento: 2200.0,
    ativo: true,
  },
];

export const PACOTES_CASAMENTO: PacoteItem[] = [
  {
    id: "cas-1",
    nome: "1º PACOTE - COBERTURA FOTOGRÁFICA (CERIMÔNIA + RECEPÇÃO)",
    material: "Cobertura fotográfica completa, fotos tratadas em alta resolução entregues via link em galeria exclusiva.",
    investimento: 4500.0,
    ativo: true,
  },
  {
    id: "cas-2",
    nome: "2º PACOTE - FOTO + FILME CINEMATIC + REELS",
    material: "Fotografia + Vídeo cinematográfico com teaser para redes sociais e documentário completo em 4K.",
    investimento: 7900.0,
    ativo: true,
  },
  {
    id: "cas-3",
    nome: "3º PACOTE - COBERTURA COMPLETA + ÁLBUM LUXO + MAKING OF",
    material: "Foto + Filme + Making of dos noivos + 1 Álbum panorâmico luxo 30x30 com 80 fotos em estojo personalizado.",
    investimento: 11800.0,
    ativo: true,
  },
  {
    id: "cas-4",
    nome: "4º PACOTE - PREMIUM ALL-INCLUSIVE (DRONE + 2 ÁLBUNS + CABINE)",
    material: "2 Fotógrafos + 2 Cinegrafistas + Drone + 2 Álbuns (Noivos e Pais) + Cabine fotográfica com impressão ilimitada.",
    investimento: 15500.0,
    ativo: true,
  },
];

export const PACOTES_ANIVERSARIO: PacoteItem[] = [
  {
    id: "ani-1",
    nome: "1º PACOTE - COBERTURA FOTOGRÁFICA (4 HORAS)",
    material: "Todas as fotos da recepção, parabéns e convidados tratadas em alta resolução via link.",
    investimento: 1900.0,
    ativo: true,
  },
  {
    id: "ani-2",
    nome: "2º PACOTE - FOTO + VÍDEO HIGHLIGHTS",
    material: "Fotografia completa + Vídeo com melhores momentos da festa e teaser dinâmico.",
    investimento: 3800.0,
    ativo: true,
  },
  {
    id: "ani-3",
    nome: "3º PACOTE - DEBUTANTE 15 ANOS VIP (FOTO + VÍDEO + ENSAIO + ÁLBUM)",
    material: "Ensaio pré-festa + Cobertura completa de foto e vídeo + Álbum encadernado 20x30 com 50 fotos.",
    investimento: 5900.0,
    ativo: true,
  },
  {
    id: "ani-4",
    nome: "4º PACOTE - FESTA COMPLETA + CABINE DE FOTOS",
    material: "Foto + Vídeo + Cabine de Fotos interativa para os convidados + Livro de assinaturas personalizado.",
    investimento: 7400.0,
    ativo: true,
  },
];

export const PACOTES_ENSAIO: PacoteItem[] = [
  {
    id: "ens-1",
    nome: "1º PACOTE - ENSAIO ESSENTIAL (1 HORA)",
    material: "1 hora de sessão fotográfica, 20 fotos tratadas em alta resolução enviadas via galeria digital.",
    investimento: 650.0,
    ativo: true,
  },
  {
    id: "ens-2",
    nome: "2º PACOTE - ENSAIO GOLD (2 HORAS)",
    material: "2 horas de sessão externa ou estúdio, até 3 trocas de look, 40 fotos tratadas em alta resolução.",
    investimento: 1200.0,
    ativo: true,
  },
  {
    id: "ens-3",
    nome: "3º PACOTE - ENSAIO PREMIUM + FOTOLIVRO 20X20",
    material: "3 horas de sessão, todas as fotos digitais da sessão entregues tratadas + 1 Fotolivro 20x20 capa dura.",
    investimento: 1850.0,
    ativo: true,
  },
  {
    id: "ens-4",
    nome: "4º PACOTE - PRÉ-WEDDING / GESTANTE EXCLUSIVO + QUADRO 50X70",
    material: "Sessão fotográfica completa + Teaser de vídeo cinematic + Quadro fotográfico 50x70 com moldura.",
    investimento: 2400.0,
    ativo: true,
  },
];

export function obterPacotesPadraoPorTipo(tipo?: string | null): PacoteItem[] {
  if (!tipo) return PACOTES_PADRAO;
  const t = tipo.toLowerCase();
  if (t.includes("casamento")) return PACOTES_CASAMENTO;
  if (t.includes("aniversario") || t.includes("aniversário") || t.includes("festa")) return PACOTES_ANIVERSARIO;
  if (t.includes("ensaio")) return PACOTES_ENSAIO;
  return PACOTES_PADRAO;
}

export const DIAS_VENCIMENTO = [5, 10, 15, 20, 25, 30] as const;

export interface ParcelaCalculada {
  numero: number;
  valor: number;
  vencimento: string;
  mesAno: string;
}

const NOMES_MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

/**
 * Calcula a grade de parcelas a partir de uma data de início / vencimento selecionado.
 */
export function calcularParcelas(
  valorTotal: number,
  numParcelas: number,
  diaVencimento: number,
  dataInicio?: Date
): ParcelaCalculada[] {
  const parcelas: ParcelaCalculada[] = [];
  const qtd = Math.min(Math.max(1, numParcelas), 12);
  const valorParcela = Math.round((valorTotal / qtd) * 100) / 100;
  const valorResidual = Math.round((valorTotal - (valorParcela * qtd)) * 100) / 100;

  const baseDate = dataInicio ? new Date(dataInicio) : new Date();
  
  // Se o dia atual for maior ou igual ao dia escolhido menos 5 dias, começa no próximo mês
  let mesInicial = baseDate.getMonth();
  let anoInicial = baseDate.getFullYear();
  if (baseDate.getDate() > diaVencimento - 5) {
    mesInicial += 1;
    if (mesInicial > 11) {
      mesInicial = 0;
      anoInicial += 1;
    }
  }

  for (let i = 0; i < qtd; i++) {
    const dataParcela = new Date(anoInicial, mesInicial + i, 1);
    const ano = dataParcela.getFullYear();
    const mes = dataParcela.getMonth();
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate();
    const diaReal = Math.min(diaVencimento, ultimoDiaDoMes);
    const diaFormatado = String(diaReal).padStart(2, "0");
    const mesFormatado = String(mes + 1).padStart(2, "0");
    const vencimentoIso = `${ano}-${mesFormatado}-${diaFormatado}`;
    
    // Adiciona o resíduo na primeira parcela
    const valorFinal = i === 0 ? valorParcela + valorResidual : valorParcela;

    parcelas.push({
      numero: i + 1,
      valor: Math.round(valorFinal * 100) / 100,
      vencimento: vencimentoIso,
      mesAno: `${NOMES_MESES[mes]} ${ano}`,
    });
  }

  return parcelas;
}

/**
 * Extrai a lista de pacotes configurados para uma turma/evento (ou retorna os pacotes padrão se nenhum estiver gravado)
 */
export function extrairPacotesTurma(
  observacoes: string | null | undefined,
  tipoFallback?: string | null
): PacoteItem[] {
  if (!observacoes) return obterPacotesPadraoPorTipo(tipoFallback);
  try {
    const parsed = JSON.parse(observacoes);
    if (parsed && Array.isArray(parsed.pacotes) && parsed.pacotes.length > 0) {
      return parsed.pacotes;
    }
  } catch {
    // Não é JSON ou são observações de texto livre
  }
  return obterPacotesPadraoPorTipo(tipoFallback);
}

/**
 * Serializa a lista de pacotes mantendo eventuais notas textuais existentes
 */
export function serializarPacotesTurma(
  observacoesAtuais: string | null | undefined,
  novosPacotes: PacoteItem[]
): string {
  let obj: any = {};
  try {
    if (observacoesAtuais) {
      const parsed = JSON.parse(observacoesAtuais);
      if (typeof parsed === "object" && parsed !== null) {
        obj = { ...parsed };
      } else {
        obj.notas = observacoesAtuais;
      }
    }
  } catch {
    obj.notas = observacoesAtuais || "";
  }

  obj.pacotes = novosPacotes;

  return JSON.stringify(obj);
}
