// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = {
  auth: {
    signInWithPassword: async () => {
      console.warn("Supabase not installed. This is a dummy client.");
      return { data: null, error: new Error("Supabase client is not installed.") };
    },
    signUp: async () => {
      console.warn("Supabase not installed. This is a dummy client.");
      return { data: null, error: new Error("Supabase client is not installed.") };
    }
  }
};
