/*  Tipos do domínio, espelhando o contrato da API .NET.

    Escritos à mão, e não gerados, porque a API devolve as entidades com as
    navegações (`turma`, `aluno`, `contratos`) que o front raramente usa;
    declarar só o que consumimos deixa o erro de tipo aparecer no lugar
    certo em vez de tudo virar `any`.  */

export type StatusTurma = "Planejamento" | "EmAndamento" | "Concluida" | "Cancelada"
export type TipoEvento = "Formatura" | "Casamento" | "Aniversario" | "Ensaio" | "Outro"
export type StatusAluno = "Ativo" | "Inativo"
export type StatusParcela = "Pendente" | "Pago" | "Atrasado" | "Cancelado"
export type StatusDespesa = "Pendente" | "Pago" | "Cancelado"

export type Turma = {
  id: string
  nome: string
  instituicao: string | null
  faculdade: string | null
  curso: string | null
  cidade: string | null
  semestre: string | null
  anoFormatura: number | null
  previsaoFormatura: string | null
  tipoEvento: TipoEvento
  dataEvento: string | null
  status: StatusTurma
  observacoes: string | null
  criadaEm: string
  atualizadaEm: string
  alunos?: Aluno[]
}

export type Aluno = {
  id: string
  turmaId: string
  turma?: Turma | null
  userId: string | null
  nomeCompleto: string
  cpf: string | null
  rg: string | null
  email: string | null
  telefone: string | null
  whatsapp: string | null
  endereco: string | null
  cidade: string | null
  cep: string | null
  loginUsuario: string | null
  dataNascimento: string | null
  status: StatusAluno
  motivoInativacao: string | null
  linkFotosSelecionadas: string | null
  prazoFotosSelecionadas: number | null
  vencimentoFotosSelecionadas: string | null
  fotosLiberadas: boolean
  linkAprovacaoAlbum: string | null
  prazoAprovacaoAlbum: number | null
  vencimentoAprovacaoAlbum: string | null
  albumLiberado: boolean
  criadoEm: string
  atualizadoEm: string
  contratos?: Contrato[]
}

export type Contrato = {
  id: string
  alunoId: string
  aluno?: Aluno | null
  pacote: string | null
  valorTotal: number
  valorEntrada: number
  desconto: number
  numParcelas: number
  diaVencimento: number | null
  autorizaImagem: boolean
  formaPagamento: string | null
  dataContrato: string
  textoContrato: string | null
  criadoEm: string
  atualizadoEm: string
  parcelas?: Parcela[]
}

export type Parcela = {
  id: string
  contratoId: string
  numero: number
  valor: number
  valorPago: number
  vencimento: string
  dataPagamento: string | null
  status: StatusParcela
  formaPagamento: string | null
  observacao: string | null
  pspProvider: string | null
  pspChargeId: string | null
  pspStatus: string | null
  boletoUrl: string | null
  boletoLinhaDigitavel: string | null
  boletoCodigoBarras: string | null
  pixCopiaCola: string | null
  pixQrCodeUrl: string | null
  linkPagamento: string | null
  criadaEm: string
  atualizadaEm: string
}

export type Despesa = {
  id: string
  descricao: string
  categoria: string
  valor: number
  vencimento: string
  dataPagamento: string | null
  status: StatusDespesa
  formaPagamento: string | null
  observacao: string | null
  turmaId: string | null
  criadaEm: string
  atualizadaEm: string
}

/*  Assinatura eletrônica: `textoIntacto` é o que importa na tela — dizer
    "assinado" sem conferir o hash esconderia justamente o caso em que as
    cláusulas mudaram depois do aceite.  */
export type Assinatura = {
  contratoId: string
  assinado: boolean
  textoIntacto: boolean
  assinanteNome: string | null
  assinanteCpf: string | null
  assinadoEm: string | null
  assinadoIp: string | null
  assinadoUserAgent: string | null
  hashDocumento: string | null
  assinaturaImagem: string | null
}
