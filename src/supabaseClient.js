import { createClient } from '@supabase/supabase-js';

// Usa import.meta.env (o padrão do Vite) em vez de process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente Supabase (VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY) não estão definidas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);