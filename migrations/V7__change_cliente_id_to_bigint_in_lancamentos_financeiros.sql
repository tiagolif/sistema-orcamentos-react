ALTER TABLE lancamentos_financeiros
DROP COLUMN IF EXISTS cliente_id;

ALTER TABLE lancamentos_financeiros
ADD COLUMN cliente_id BIGINT,
ADD CONSTRAINT lancamentos_financeiros_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES clientes(id);
