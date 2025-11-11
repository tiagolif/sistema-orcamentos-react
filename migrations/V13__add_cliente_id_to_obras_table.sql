ALTER TABLE public.obras
ADD COLUMN cliente_id bigint,
ADD CONSTRAINT obras_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id);