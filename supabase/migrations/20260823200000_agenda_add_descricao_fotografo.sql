-- Adicionar coluna descricao e fotografo à tabela agenda_eventos
-- e garantir que as colunas essenciais existam

ALTER TABLE public.agenda_eventos
  ADD COLUMN IF NOT EXISTS descricao TEXT,
  ADD COLUMN IF NOT EXISTS fotografo TEXT;

-- Copiar titulo para descricao onde descricao for nulo
UPDATE public.agenda_eventos
  SET descricao = titulo
  WHERE descricao IS NULL AND titulo IS NOT NULL;
