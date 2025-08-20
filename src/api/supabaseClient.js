import { createClient } from '@supabase/supabase-js'

// Lendo as variáveis de ambiente de forma segura
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// A linha abaixo cria a conexão E a exporta com o nome 'supabase'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);