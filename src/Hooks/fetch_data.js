// src/utilsAndHooks/fetch_data.js
import { supabase } from '../../supabase';

export async function fetchCustomers() {
  const { data, error } = await supabase
    .from('newVisitors')
    .select('*');

  return { data, error };
}

