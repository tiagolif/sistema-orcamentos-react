-- Adiciona coluna valor_mao_de_obra na tabela itens_da_base
ALTER TABLE itens_da_base 
ADD COLUMN valor_mao_de_obra numeric DEFAULT 0;