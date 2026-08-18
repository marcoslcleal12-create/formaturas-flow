ALTER TABLE public.contratos
  ADD COLUMN IF NOT EXISTS texto_contrato text,
  ADD COLUMN IF NOT EXISTS autoriza_imagem boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS forma_pagamento text NOT NULL DEFAULT 'boleto';

CREATE TABLE IF NOT EXISTS public.despesas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao text NOT NULL,
  categoria text NOT NULL DEFAULT 'geral',
  turma_id uuid REFERENCES public.turmas(id) ON DELETE SET NULL,
  valor numeric NOT NULL DEFAULT 0,
  vencimento date NOT NULL DEFAULT CURRENT_DATE,
  data_pagamento date,
  status text NOT NULL DEFAULT 'pendente',
  forma_pagamento text,
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.despesas TO authenticated;
GRANT ALL ON public.despesas TO service_role;

ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "despesas_staff_manage" ON public.despesas
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER despesas_updated_at BEFORE UPDATE ON public.despesas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();