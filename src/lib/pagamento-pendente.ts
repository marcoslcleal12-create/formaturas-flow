/*  Recado de uma viagem só: "acabei de aderir, abre o pagamento".

    A adesão termina numa página pública e o pagamento vive no painel
    autenticado.  Sem este recado o formando caía no painel e tinha que
    descobrir sozinho o botão "Pagar" da 1ª parcela — e no cartão isso é o
    passo que ele estava procurando, porque o checkout do Asaas é onde os
    dados do cartão são digitados.

    Fica em `sessionStorage` (não na URL) porque a rota do painel não declara
    search param; e some depois de lido, para não reabrir o checkout em toda
    visita ao painel.  */

const CHAVE = "jm_formaturas_abrir_pagamento_v1";

export function marcarPagamentoPendente(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CHAVE, "1");
  } catch {
    /*  navegação privada ou storage bloqueado: o formando só precisa clicar
        em "Pagar" no painel — não é motivo para falhar a adesão.  */
  }
}

/** Lê e APAGA o recado: a segunda chamada já devolve false. */
export function consumirPagamentoPendente(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const tem = window.sessionStorage.getItem(CHAVE) === "1";
    if (tem) window.sessionStorage.removeItem(CHAVE);
    return tem;
  } catch {
    return false;
  }
}
