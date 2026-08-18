ALTER TABLE public.alunos ADD COLUMN IF NOT EXISTS login_usuario text;
CREATE UNIQUE INDEX IF NOT EXISTS alunos_login_usuario_key ON public.alunos (login_usuario) WHERE login_usuario IS NOT NULL;

CREATE TABLE public.contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id uuid NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  turma_id uuid REFERENCES public.turmas(id) ON DELETE SET NULL,
  pacote text NOT NULL DEFAULT 'Pacote padrão',
  valor_total numeric(12,2) NOT NULL DEFAULT 0,
  desconto numeric(12,2) NOT NULL DEFAULT 0,
  valor_entrada numeric(12,2) NOT NULL DEFAULT 0,
  num_parcelas integer NOT NULL DEFAULT 1,
  dia_vencimento integer NOT NULL DEFAULT 10,
  data_contrato date NOT NULL DEFAULT current_date,
  status text NOT NULL DEFAULT 'ativo',
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contratos TO authenticated;
GRANT ALL ON public.contratos TO service_role;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

CREATE POLICY contratos_staff_manage ON public.contratos FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY contratos_select_own ON public.contratos FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.alunos a WHERE a.id = contratos.aluno_id AND a.user_id = auth.uid()));

CREATE TABLE public.parcelas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contrato_id uuid NOT NULL REFERENCES public.contratos(id) ON DELETE CASCADE,
  numero integer NOT NULL,
  valor numeric(12,2) NOT NULL DEFAULT 0,
  vencimento date NOT NULL,
  status text NOT NULL DEFAULT 'pendente',
  valor_pago numeric(12,2) NOT NULL DEFAULT 0,
  data_pagamento date,
  forma_pagamento text,
  observacao text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contrato_id, numero)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.parcelas TO authenticated;
GRANT ALL ON public.parcelas TO service_role;
ALTER TABLE public.parcelas ENABLE ROW LEVEL SECURITY;

CREATE POLICY parcelas_staff_manage ON public.parcelas FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY parcelas_select_own ON public.parcelas FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.contratos c
    JOIN public.alunos a ON a.id = c.aluno_id
    WHERE c.id = parcelas.contrato_id AND a.user_id = auth.uid()
  ));

CREATE TRIGGER contratos_updated_at BEFORE UPDATE ON public.contratos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER parcelas_updated_at BEFORE UPDATE ON public.parcelas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS contratos_aluno_id_idx ON public.contratos(aluno_id);
CREATE INDEX IF NOT EXISTS parcelas_contrato_id_idx ON public.parcelas(contrato_id);