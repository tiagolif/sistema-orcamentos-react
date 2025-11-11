ALTER TABLE public.obras
ADD COLUMN endereco text,
ADD COLUMN cidade text,
ADD COLUMN estado text,
ADD COLUMN cep text,
ADD COLUMN data_inicio date,
ADD COLUMN data_fim date;