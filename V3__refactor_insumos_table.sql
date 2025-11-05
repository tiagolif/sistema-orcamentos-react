-- V3: Refatora a tabela de insumos para um modelo de custo unificado e rastreável

-- Adiciona as novas colunas, se elas ainda não existirem.
DO $$
BEGIN
    -- Adiciona a coluna de custo unitário
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='insumos' AND column_name='custo_unitario') THEN
        ALTER TABLE public.insumos ADD COLUMN custo_unitario numeric NOT NULL DEFAULT 0;
    END IF;

    -- Adiciona a coluna para a data do preço
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='insumos' AND column_name='data_preco') THEN
        ALTER TABLE public.insumos ADD COLUMN data_preco date;
    END IF;

    -- Adiciona a coluna para a fonte do preço
    IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name='insumos'- AND column_name='fonte_preco') THEN
        ALTER TABLE public.insumos ADD COLUMN fonte_preco text;
    END IF;
END $$;

-- Migra os dados existentes (se possível) antes de remover as colunas antigas.
-- Esta é uma migração simples que soma os custos. Pode precisar de ajuste.
UPDATE public.insumos
SET custo_unitario = COALESCE(preco_material, 0) + COALESCE(preco_mao_obra, 0)
WHERE custo_unitario = 0; -- Apenas atualiza se ainda não foi preenchido

-- Remove as colunas antigas de preço, se elas ainda existirem.
ALTER TABLE public.insumos DROP COLUMN IF EXISTS preco_material;
ALTER TABLE public.insumos DROP COLUMN IF EXISTS preco_mao_obra;

-- Garante que a coluna de tipo_insumo tenha um valor padrão para evitar problemas
ALTER TABLE public.insumos ALTER COLUMN tipo_insumo SET DEFAULT 'OUTROS';

-- Opcional: Adicionar um comentário à coluna para explicar as opções
COMMENT ON COLUMN public.insumos.tipo_insumo IS 'Tipo do insumo, ex: MAT, MO, EQUIP, SERV, TRANSP, OUTROS';
