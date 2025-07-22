// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // <-- replace with your URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // <-- replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
