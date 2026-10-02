import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PenLine, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { assinarContrato, getAssinatura } from "@/lib/api/contratos";
import { mensagemErro } from "@/lib/api/errors";
import { AssinaturaPad } from "@/components/app/AssinaturaPad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/*  Assinatura do contrato pelo próprio formando, dentro do painel dele.

    Faltava um caminho: a rubrica só era colhida no fluxo de adesão.  Contrato
    criado pela equipe — que é como a maioria nasce — nunca podia ser assinado
    por ninguém, e ficava para sempre sem prova de aceite.  */
export function AssinarContratoCard({
  contratoId,
  nomeCompleto,
  cpf,
}: {
  contratoId: string;
  nomeCompleto: string;
  cpf?: string | null | undefined;
}) {
  const queryClient = useQueryClient();
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [aceitou, setAceitou] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["assinatura", contratoId],
    queryFn: () => getAssinatura(contratoId),
  });

  const assinar = useMutation({
    mutationFn: () =>
      assinarContrato(contratoId, {
        imagem: assinatura!,
        nome: nomeCompleto,
        cpf: cpf ?? undefined,
      }),
    onSuccess: () => {
      toast.success("Contrato assinado. A assinatura e o horário ficaram registrados.");
      void queryClient.invalidateQueries({ queryKey: ["assinatura", contratoId] });
    },
    onError: (e) => toast.error(mensagemErro(e, "Não foi possível assinar o contrato.")),
  });

  if (isLoading) return null;

  const assinado = data?.assinado ?? false;
  const adulterado = assinado && data?.textoIntacto === false;

  /*  Já assinado: mostra a prova, não o formulário.  Reassinar é recusado
      pelo servidor de propósito, e oferecer o campo convidaria ao erro.  */
  if (assinado) {
    return (
      <Card className="shadow-card">
        <CardHeader className="p-4 pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
            {adulterado
              ? <ShieldAlert className="size-4 text-destructive shrink-0" />
              : <ShieldCheck className="size-4 text-emerald-600 shrink-0" />}
            {adulterado ? "Contrato alterado após a assinatura" : "Contrato assinado"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-1 text-xs text-muted-foreground border-t border-border/40 pt-2.5">
          <p>
            <span className="font-medium text-foreground">{data?.assinanteNome ?? nomeCompleto}</span>
            {data?.assinanteCpf ? ` · CPF ${data.assinanteCpf}` : ""}
          </p>
          {data?.assinadoEm && <p>{new Date(data.assinadoEm).toLocaleString("pt-BR")}</p>}
          {data?.hashDocumento && (
            <p className="break-all">
              Impressão digital do documento: <span className="font-mono">{data.hashDocumento}</span>
            </p>
          )}
          {adulterado && (
            <p className="text-destructive font-medium">
              O texto atual não corresponde ao que foi assinado. Procure a JM Formaturas.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-primary/30">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
          <PenLine className="size-4 text-primary shrink-0" />
          Assine seu contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4 border-t border-border/40 pt-3">
        <p className="text-xs text-muted-foreground">
          Leia o contrato acima e assine no campo abaixo. Registramos a data, o horário, seu
          dispositivo e uma impressão digital do texto, de modo que ele não possa ser alterado
          depois de assinado.
        </p>

        <AssinaturaPad onChange={setAssinatura} disabled={assinar.isPending} />

        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{nomeCompleto}</span>
          {cpf ? ` · CPF ${cpf}` : ""}
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={aceitou}
            onChange={(e) => setAceitou(e.target.checked)}
            className="size-4 rounded border-primary text-primary mt-0.5"
          />
          <span className="text-xs text-foreground">
            Li e aceito os termos do contrato, e reconheço esta assinatura eletrônica como válida.
          </span>
        </label>

        <Button
          size="sm"
          className="w-full gap-1.5"
          disabled={!assinatura || !aceitou || assinar.isPending}
          onClick={() => assinar.mutate()}
        >
          <PenLine className="size-4" />
          {assinar.isPending ? "Registrando..." : "Assinar contrato"}
        </Button>
      </CardContent>
    </Card>
  );
}
