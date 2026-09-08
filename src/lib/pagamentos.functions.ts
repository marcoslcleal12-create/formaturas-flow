import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { criarCobranca, buscarCobrancaPorRef, type TipoPagamento } from "@/lib/api/pagamentos";

export type MetodoPagamento = "pix" | "cartao" | "boleto" | "checkout";

type ParcelaContext = {
  id: string;
  numero: number;
  valor: number;
  valorPago: number;
  vencimento: string;
  dataPagamento?: string | null;
  status: string;
  pspProvider?: string | null;
  pspStatus?: string | null;
  linkPagamento?: string | null;
  contratoId: string;
  contratoPacote?: string | null;
  alunoId: string;
  alunoNomeCompleto: string;
  alunoCpf?: string | null;
  alunoEmail?: string | null;
  alunoWhatsapp?: string | null;
  alunoTelefone?: string | null;
  turmaId: string;
  turmaNome: string;
  turmaCurso?: string | null;
  tipoEvento: "Formatura" | "Casamento" | "Outro";
};

const iniciarSchema = z.object({
  parcelaId: z.string().uuid(),
  metodo: z.enum(["pix", "cartao", "boleto", "checkout"]),
  numParcelasCartao: z.number().int().positive().optional(),
});

export const iniciarPagamento = createServerFn({ method: "POST" })
  .validator((input: { parcelaId: string; metodo: MetodoPagamento; numParcelasCartao?: number }) =>
    iniciarSchema.parse(input),
  )
  .handler(async ({ data }) => {
    const p = await apiFetch<ParcelaContext>({
      method: "GET",
      path: `/api/v1/parcelas/${data.parcelaId}`,
    });
    if (p.status === "Pago") throw new Error("Esta parcela já está quitada.");

    const saldo = Number(p.valor) - Number(p.valorPago);
    const tipoEvento = p.tipoEvento === "Casamento" ? "Casamento" : "Formatura";

    const cobranca = await criarCobranca({
      externalReference: p.id,
      clienteNome: p.alunoNomeCompleto,
      ...(p.alunoCpf ? { clienteCpf: p.alunoCpf } : {}),
      ...(p.alunoEmail ? { clienteEmail: p.alunoEmail } : {}),
      ...(p.alunoWhatsapp ? { clienteWhatsapp: p.alunoWhatsapp } : {}),
      ...(p.alunoTelefone ? { clienteTelefone: p.alunoTelefone } : {}),
      valor: saldo,
      vencimento: p.vencimento,
      descricao: `Parcela ${p.numero} · ${p.contratoPacote ?? "Pacote"} · ${p.turmaNome}`,
      tipo: data.metodo as TipoPagamento,
      ...(data.numParcelasCartao ? { numParcelasCartao: data.numParcelasCartao } : {}),
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

export const consultarStatusPagamento = createServerFn({ method: "POST" })
  .validator((input: { parcelaId: string }) => consultarSchema.parse(input))
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
