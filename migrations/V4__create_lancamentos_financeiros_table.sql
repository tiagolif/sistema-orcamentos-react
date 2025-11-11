CREATE TABLE lancamentos_financeiros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    descricao text NOT NULL,
    valor numeric NOT NULL,
    data_vencimento date NOT NULL,
    data_pagamento date,
    tipo text NOT NULL,
    status text NOT NULL,
    fornecedor_id uuid,
    obra_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT lancamentos_financeiros_pkey PRIMARY KEY (id),
    CONSTRAINT lancamentos_financeiros_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    CONSTRAINT lancamentos_financeiros_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES obras(id)
);
