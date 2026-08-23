-- Criar tabela de agenda de eventos compartilhada entre administradores
CREATE TABLE IF NOT EXISTS public.agenda_eventos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    empresa_tipo TEXT NOT NULL DEFAULT 'jm',
    empresa_nome TEXT NOT NULL DEFAULT 'JM Formaturas & Eventos',
    local_evento TEXT,
    cidade TEXT,
    data_evento DATE NOT NULL,
    horario_inicio TEXT,
    horario_fim TEXT,
    status TEXT NOT NULL DEFAULT 'confirmado',
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.agenda_eventos ENABLE ROW LEVEL SECURITY;

-- Politicas de acesso para administradores / autenticados
CREATE POLICY "Permitir leitura para todos" ON public.agenda_eventos
    FOR SELECT USING (true);

CREATE POLICY "Permitir insercao para todos" ON public.agenda_eventos
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualizacao para todos" ON public.agenda_eventos
    FOR UPDATE USING (true);

CREATE POLICY "Permitir delecao para todos" ON public.agenda_eventos
    FOR DELETE USING (true);
