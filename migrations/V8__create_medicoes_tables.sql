/* Passo 0: Limpar tentativas anteriores (Segurança) */
DROP TABLE IF EXISTS public.medicoes_itens CASCADE;
DROP TABLE IF EXISTS public.medicoes_boletins CASCADE;

/* Passo 1: Criar a tabela 'cabeçalho' com o tipo CORRETO */
CREATE TABLE public.medicoes_boletins (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    obra_id bigint NOT NULL,  /* <-- CORREÇÃO: De uuid para bigint */
    mes_referencia date NOT NULL,
    status text NOT NULL,
    numero_boletim text,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT medicoes_boletins_obra_id_fkey FOREIGN KEY (obra_id) REFERENCES public.obras(id)
);

/* Passo 2: Criar a tabela 'detalhe' (Script original estava correto) */
CREATE TABLE public.medicoes_itens (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    boletim_id uuid NOT NULL,
    orcamento_item_id bigint NOT NULL,
    quantidade_medida numeric NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT medicoes_itens_boletim_id_fkey FOREIGN KEY (boletim_id) REFERENCES public.medicoes_boletins(id) ON DELETE CASCADE,
    CONSTRAINT medicoes_itens_orcamento_item_id_fkey FOREIGN KEY (orcamento_item_id) REFERENCES public.orcamento_itens(id)
);
