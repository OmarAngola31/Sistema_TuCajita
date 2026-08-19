/**
 * supabaseClient.js — Inicializa el cliente de Supabase (backend as a service).
 *
 * Lee las credenciales desde variables de entorno de Vite:
 *   VITE_SUPABASE_URL       -> URL del proyecto de Supabase
 *   VITE_SUPABASE_ANON_KEY  -> Clave pública (anon) del proyecto
 *
 * Estas variables se definen en un archivo `.env` en la raíz del proyecto
 * (no se sube a git). Ejemplo de `.env`:
 *   VITE_SUPABASE_URL=https://xxxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
 *
 * Si las variables no están configuradas o la URL es inválida, `supabase`
 * queda en `null` y el resto de la app (dbService.js) cae automáticamente
 * en datos de ejemplo (mock data) para que la aplicación siga funcionando
 * en modo demo sin backend real.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client = null;

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

if (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Error inicializando Supabase Client:', e.message);
  }
} else {
  console.warn('Supabase URL no es una URL válida o no está configurada.');
}

export const supabase = client;