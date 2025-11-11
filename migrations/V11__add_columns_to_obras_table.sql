ALTER TABLE public.obras
ADD COLUMN status_obra text DEFAULT 'Em Planejamento',
ADD COLUMN responsavel_tecnico text,
ADD COLUMN centro_de_custo text;