/*  Padronizacao de mensagens de erro para o usuario final.
 *
 *  A UI faz switch no `codigo` do ProblemDetails (contrato estavel com o
 *  backend) para escolher a mensagem em portugues. Quando nao ha match, cai
 *  para o `detail` do ProblemDetails (mensagem em portugues vinda do dominio)
 *  e, por ultimo, para o texto do Error — evita mostrar
 *  "AxiosError: Request failed with status 404" pro usuario.
 */

import { ApiError } from "./client";

const MENSAGENS_POR_CODIGO: Record<string, string> = {
  // Recursos nao encontrados (RecursoNaoEncontradoException)
  ALUNO_NAO_ENCONTRADO:       "Aluno nao encontrado.",
  TURMA_NAO_ENCONTRADA:       "Turma nao encontrada.",
  CONTRATO_NAO_ENCONTRADO:    "Contrato nao encontrado.",
  PARCELA_NAO_ENCONTRADA:     "Parcela nao encontrada.",
  DESPESA_NAO_ENCONTRADA:     "Despesa nao encontrada.",
  EVENTO_NAO_ENCONTRADO:      "Evento nao encontrado.",
  COBRANCA_NAO_ENCONTRADA:    "Cobranca nao encontrada.",
  USUARIO_NAO_ENCONTRADO:     "Usuario nao encontrado.",

  // Dados invalidos (DadosInvalidosException)
  CPF_INVALIDO:                     "CPF invalido. Informe os 11 digitos.",
  CONTRATO_SALDO_INVALIDO:          "O valor a parcelar precisa ser maior que zero.",
  CONTRATO_NUM_PARCELAS_INVALIDO:   "Numero de parcelas deve ser maior que zero.",
  PAGAMENTO_TIPO_INVALIDO:          "Tipo de pagamento invalido. Use pix, boleto, cartao ou checkout.",
  TIPO_PROJETO_INVALIDO:            "Tipo de projeto invalido.",

  // Conflitos (ConflitoException)
  PARCELA_JA_QUITADA:               "Essa parcela ja esta quitada.",

  // Pagamentos (Payments/PaymentExceptions.cs)
  PAGAMENTO_METODO_NAO_SUPORTADO:   "Metodo de pagamento nao suportado para esse tipo de evento.",
  PAGAMENTO_PROVIDER_NAO_PERMITIDO: "Provedor de pagamento nao permitido para esse fluxo.",
  PAGAMENTO_DADOS_INCOMPLETOS:      "Dados do pagamento incompletos.",
  GATEWAY_INDISPONIVEL:             "Provedor de pagamento indisponivel no momento. Tente novamente em instantes.",

  // Genericos por HTTP status
  HTTP_401: "Sessao expirada. Faca login novamente.",
  HTTP_403: "Voce nao tem permissao para essa acao.",
  HTTP_404: "Registro nao encontrado.",
  HTTP_409: "Operacao em conflito com o estado atual.",
  HTTP_422: "Nao foi possivel processar essa operacao.",
  HTTP_502: "Servico externo indisponivel. Tente novamente em instantes.",
  HTTP_500: "Erro interno. Tente novamente ou contate o suporte.",
};

/*  Converte qualquer erro (ApiError, Error, unknown) em uma mensagem legivel
    para o usuario final. Prefere codigo estavel → detail do backend → texto
    do Error → mensagem generica. */
export function mensagemErro(err: unknown, fallback = "Ocorreu um erro. Tente novamente."): string {
  if (err instanceof ApiError) {
    const porCodigo = MENSAGENS_POR_CODIGO[err.codigo];
    if (porCodigo) return porCodigo;
    if (err.detail) return err.detail;
    return fallback;
  }
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

/*  Discriminador para casos em que a UI precisa saber o tipo do erro
    (mostrar botao "voltar" para 404, "tentar de novo" para 502, etc.). */
export function ehErroTipo(
  err: unknown,
  tipo: "nao_encontrado" | "conflito" | "invalido" | "gateway" | "auth",
): boolean {
  if (!(err instanceof ApiError)) return false;
  switch (tipo) {
    case "nao_encontrado": return err.status === 404;
    case "conflito":       return err.status === 409;
    case "invalido":       return err.status === 400 || err.status === 422;
    case "gateway":        return err.status === 502 || err.status === 503;
    case "auth":           return err.status === 401 || err.status === 403;
  }
}
