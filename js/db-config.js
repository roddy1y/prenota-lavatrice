/**
 * Credenziali Supabase (Project Settings → API).
 * Compila URL e anon key del progetto creato per questa casa.
 * Lascia vuoto = modalità locale di emergenza (solo questo telefono).
 */
export const SUPABASE_URL = "";
export const SUPABASE_ANON_KEY = "";

export function isDbConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
