


-- Tabela: bases_de_preco
CREATE TABLE bases_de_preco (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome text NOT NULL
);

-- Tabela: itens_da_base
CREATE TABLE itens_da_base (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    base_id bigint NOT NULL,
    codigo_item text,
    descricao text,
    unidade text,
    preco_unitario numeric,
    CONSTRAINT fk_base
        FOREIGN KEY(base_id)
        REFERENCES bases_de_preco(id)
);

-- Tabela: orcamento_itens
CREATE TABLE orcamento_itens (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    orcamento_id bigint NOT NULL,
    item_id bigint NOT NULL,
    quantidade numeric,
    preco_unitario_congelado numeric,
    CONSTRAINT fk_orcamento
        FOREIGN KEY(orcamento_id)
        REFERENCES orcamentos(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_item_base
        FOREIGN KEY(item_id)
        REFERENCES itens_da_base(id)
);
