import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { criarCobranca, buscarCobrancaPorRef, type TipoPagamento } from "@/lib/api/pagamentos";

export type MetodoPagamento = "pix" | "cartao" | "boleto" | "checkout";

const iniciarSchema = z.object({
  parcelaId: z.string().uuid(),
  metodo: z.enum(["pix", "cartao", "boleto", "checkout"]),
  numParcelasCartao: z.number().int().positive().optional(),
});

/**
 * Inicia a cobrança de uma parcela chamando a API FormaturasFlow (VPS).
 *
 * Fluxo:
 * 1. RLS Supabase garante que o usuário só acessa parcelas permitidas.
 * 2. Busca dados agregados (parcela, contrato, aluno, turma) para montar
 *    o payload de cobrança standalone.
 * 3. Chama POST /api/v1/cobrancas na API — o roteador escolhe o PSP correto
 *    (Asaas para casamento/cartão/checkout, Cora para PIX/boleto formatura).
 * 4. Retorna o link de pagamento para o front abrir/compartilhar.
 *
 * Idempotência: a API guarda `externalReference = parcelaId`, então chamar
 * de novo com o mesmo parcelaId retorna a cobrança existente sem duplicar.
 */
export const iniciarPagamento = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { parcelaId: string; metodo: MetodoPagamento; numParcelasCartao?: number }) =>
    iniciarSchema.parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: parcela, error } = await context.supabase
      .from("parcelas")
      .select(`
        id, numero, valor, valor_pago, vencimento, status,
        contratos!inner (
          id, pacote,
          alunos!inner (
            id, nome_completo, cpf, email, telefone, whatsapp,
            turmas!inner ( id, nome, curso )
          )
        )
      `)
      .eq("id", data.parcelaId)
      .maybeSingle();
    if (error) throw error;
    if (!parcela) throw new Error("Parcela não encontrada.");
    if (parcela.status === "pago") throw new Error("Esta parcela já está quitada.");

    type Selecionado = {
      id: string;
      numero: number;
      valor: number | string;
      valor_pago: number | string;
      vencimento: string;
      status: string;
      contratos: {
        pacote?: string | null;
        alunos: {
          nome_completo: string;
          cpf?: string | null;
          email?: string | null;
          telefone?: string | null;
          whatsapp?: string | null;
          turmas: { nome: string; curso?: string | null };
        };
      };
    };
    const p = parcela as unknown as Selecionado;
    const aluno = p.contratos.alunos;
    const turma = aluno.turmas;

    const saldo = Number(p.valor) - Number(p.valor_pago);
    const tipoEvento =
      /casamento/i.test(turma.nome ?? "") || /casamento/i.test(turma.curso ?? "")
        ? "Casamento"
        : "Formatura";

    const cobranca = await criarCobranca({
      externalReference: p.id,
      clienteNome: aluno.nome_completo,
      clienteCpf: aluno.cpf ?? undefined,
      clienteEmail: aluno.email ?? undefined,
      clienteWhatsapp: aluno.whatsapp ?? undefined,
      clienteTelefone: aluno.telefone ?? undefined,
      valor: saldo,
      vencimento: p.vencimento,
      descricao: `Parcela ${p.numero} · ${p.contratos.pacote ?? "Pacote"} · ${turma.nome}`,
      tipo: data.metodo as TipoPagamento,
      numParcelasCartao: data.numParcelasCartao,
      tipoEvento,
    });

    return {
      status: "cobranca_gerada" as const,
      metodo: data.metodo,
      valor: saldo,
      vencimento: p.vencimento,
      numero: p.numero,
      cobrancaId: cobranca.id,
      pspProvider: cobranca.pspProvider,
      pspChargeId: cobranca.pspChargeId,
      pspStatus: cobranca.pspStatus,
      linkPagamento: cobranca.linkPagamento,
      boletoUrl: cobranca.boletoUrl,
      boletoLinhaDigitavel: cobranca.boletoLinhaDigitavel,
      boletoCodigoBarras: cobranca.boletoCodigoBarras,
      pixCopiaCola: cobranca.pixCopiaCola,
      pixQrCodeUrl: cobranca.pixQrCodeUrl,
    };
  });

const consultarSchema = z.object({ parcelaId: z.string().uuid() });

/**
 * Consulta o status atual da cobrança de uma parcela na API FormaturasFlow.
 * O webhook do PSP já atualiza cobrancas.status automaticamente quando
 * o pagamento é confirmado — este endpoint só serve pra o front ler.
 */
export const consultarStatusPagamento = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { parcelaId: string }) => consultarSchema.parse(input))
  .handler(async ({ data }) => {
    const cobranca = await buscarCobrancaPorRef(data.parcelaId);
    if (!cobranca) return { encontrada: false as const };
    return {
      encontrada: true as const,
      status: cobranca.status,
      pspStatus: cobranca.pspStatus,
      valorPago: cobranca.valorPago,
      dataPagamento: cobranca.dataPagamento,
      linkPagamento: cobranca.linkPagamento,
    };
  });
