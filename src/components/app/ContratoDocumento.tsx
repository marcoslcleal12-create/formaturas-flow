import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileDown, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  CLAUSULAS_PADRAO,
  FORMAS_PAGAMENTO,
  formaPagamentoLabel,
  gerarContratoPdf,
  type ParcelaPdf,
} from "@/lib/contrato-modelo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Contrato = {
  id: string;
  pacote: string;
  valor_total: number;
  desconto: number;
  valor_entrada: number;
  dia_vencimento: number;
  data_contrato: string;
  forma_pagamento: string | null;
  autoriza_imagem: boolean | null;
  texto_contrato: string | null;
};

type Aluno = {
  nome_completo: string;
  cpf: string | null;
  endereco: string | null;
  cidade: string | null;
  telefone: string | null;
  email: string | null;
};

export function ContratoDocumento({
  aluno,
  contrato,
  parcelas,
  alunoId,
}: {
  aluno: Aluno;
  contrato: Contrato;
  parcelas: ParcelaPdf[];
  alunoId: string;
}) {
  const queryClient = useQueryClient();
  const [texto, setTexto] = useState(contrato.texto_contrato ?? CLAUSULAS_PADRAO);
  const [forma, setForma] = useState(contrato.forma_pagamento ?? "boleto");
  const [autoriza, setAutoriza] = useState(contrato.autoriza_imagem ?? true);

  const salvar = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("contratos")
        .update({ texto_contrato: texto, forma_pagamento: forma, autoriza_imagem: autoriza })
        .eq("id", contrato.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contrato salvo");
      void queryClient.invalidateQueries({ queryKey: ["aluno", alunoId] });
    },
    onError: (error) => toast.error((error as Error).message),
  });

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="text-base">Contrato do formando (modelo editável)</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={salvar.isPending} onClick={() => salvar.mutate()}>
            <Save className="size-4" /> Salvar
          </Button>
          <Button
            size="sm"
            onClick={() =>
              gerarContratoPdf({
                aluno,
                contrato: {
                  pacote: contrato.pacote,
                  valor_total: Number(contrato.valor_total),
                  desconto: Number(contrato.desconto),
                  valor_entrada: Number(contrato.valor_entrada),
                  dia_vencimento: contrato.dia_vencimento,
                  data_contrato: contrato.data_contrato,
                  forma_pagamento: forma,
                  autoriza_imagem: autoriza,
                },
                parcelas,
                texto,
              })
            }
          >
            <FileDown className="size-4" /> Gerar PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="texto-contrato">Cláusulas (editáveis)</Label>
            <button
              type="button"
              className="text-xs text-muted-foreground underline"
              onClick={() => setTexto(CLAUSULAS_PADRAO)}
            >
              restaurar modelo padrão
            </button>
          </div>
          <Textarea
            id="texto-contrato"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="min-h-[320px] font-mono text-xs leading-relaxed"
          />
        </div>
      </CardContent>
    </Card>
  );
}
