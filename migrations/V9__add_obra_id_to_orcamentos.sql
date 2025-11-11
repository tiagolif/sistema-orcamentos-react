ALTER TABLE orcamentos
ADD COLUMN obra_id bigint,
ADD CONSTRAINT orcamentos_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES obras(id);
