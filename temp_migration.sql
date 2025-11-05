-- Script de Migração V2 (Idempotente) --
-- Pode ser executado múltiplas vezes sem causar erros.

-- Renomeia a tabela principal, se ela ainda existir com o nome antigo.
ALTER TABLE IF EXISTS public.itens_da_base RENAME TO insumos;

-- Remove a coluna antiga da tabela de insumos, apenas se ela ainda existir.
ALTER TABLE public.insumos DROP COLUMN IF EXISTS preco_unitario;

-- Adiciona as novas colunas na tabela de insumos, apenas se elas ainda não existirem.
DO $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'insumos' AND column_name = 'preco_material') THEN
        ALTER TABLE public.insumos
        ADD COLUMN preco_material numeric,
        ADD COLUMN preco_mao_obra numeric,
        ADD COLUMN tipo_insumo text, -- Ex: 'material', 'mao_de_obra', 'equipamento'
        ADD COLUMN estado text,
        ADD COLUMN desonerado boolean;
    END IF;
END $$;

-- Cria o índice para o código do item, se ele não existir.
CREATE INDEX IF NOT EXISTS idx_insumos_codigo_item ON public.insumos(codigo_item);

-- Cria a tabela de composições, se ela não existir.
CREATE TABLE IF NOT EXISTS public.composicoes (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    base_id bigint NOT NULL REFERENCES public.bases_de_preco(id),
    codigo text NOT NULL,
    descricao text,
    unidade text,
    custo_total_material numeric,
    custo_total_mao_obra numeric,
    custo_total numeric,
    estado text NOT NULL,
    desonerado boolean NOT NULL
);

-- Adiciona a restrição de unicidade, apenas se ela não existir.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.composicoes'::regclass AND conname = 'uq_composicao_codigo_estado_desonerado') THEN
        ALTER TABLE public.composicoes ADD CONSTRAINT uq_composicao_codigo_estado_desonerado UNIQUE (codigo, estado, desonerado);
    END IF;
END $$;

-- Cria o índice para o código da composição, se ele não existir.
CREATE INDEX IF NOT EXISTS idx_composicoes_codigo ON public.composicoes(codigo);

-- Cria a tabela de itens da composição, se ela não existir.
CREATE TABLE IF NOT EXISTS public.composicao_itens (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    composicao_id bigint NOT NULL REFERENCES public.composicoes(id) ON DELETE CASCADE,
    codigo_insumo text NOT NULL,
    tipo_item text, -- Ex: 'INSUMO', 'COMPOSICAO AUXILIAR'
    coeficiente numeric NOT NULL,
    preco_unitario numeric NOT NULL,
    custo_total numeric NOT NULL
);

-- Cria o índice para os itens da composição, se ele não existir.
CREATE INDEX IF NOT EXISTS idx_composicao_itens_composicao_id ON public.composicao_itens(composicao_id);