ALTER TABLE public.obras
ADD COLUMN user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();