import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type MetodoPagamento = "pix" | "cartao" | "boleto";

const schema = z.object({
  parcelaId: z.string().uuid(),
  metodo: z.enum(["pix", "cartao", "boleto"]),
});

/**
 * Inicia a cobrança de uma parcela.
 * A integração com o banco/adquirente ainda não foi contratada: o ponto de
 * entrada já está pronto e validado (parcela do próprio formando, valor e
 * método), bastando trocar o bloco marcado abaixo pela chamada da API do banco.
 */
export const iniciarPagamento = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { parcelaId: string; metodo: MetodoPagamento }) => schema.parse(input))
  .handler(async ({ data, context }) => {
    // RLS garante que o formando só enxerga as próprias parcelas.
    const { data: parcela, error } = await context.supabase
      .from("parcelas")
      .select("id, numero, valor, valor_pago, vencimento, status")
      .eq("id", data.parcelaId)
      .maybeSingle();
    if (error) throw error;
    if (!parcela) throw new Error("Parcela não encontrada.");
    if (parcela.status === "pago") throw new Error("Esta parcela já está quitada.");

    const valor = Number(parcela.valor) - Number(parcela.valor_pago);

    // === Integração bancária (pendente de contratação) ===
    // Aqui entra a chamada ao PSP/banco para gerar:
    //  - pix    -> copia e cola + QR Code
    //  - boleto -> linha digitável + PDF
    //  - cartao -> link/checkout tokenizado
    const gatewayConfigurado = Boolean(process.env["PSP_API_KEY"]);
    if (!gatewayConfigurado) {
      return {
        status: "pendente_integracao" as const,
        metodo: data.metodo,
        valor,
        vencimento: parcela.vencimento,
        numero: parcela.numero,
        mensagem:
          "Cobrança preparada. A integração com o banco ainda será ativada — assim que o banco liberar as credenciais, o pagamento é concluído por aqui.",
      };
    }

    return {
      status: "pendente_integracao" as const,
      metodo: data.metodo,
      valor,
      vencimento: parcela.vencimento,
      numero: parcela.numero,
      mensagem: "Cobrança gerada.",
    };
  });
