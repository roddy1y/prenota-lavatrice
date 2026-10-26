/**
 * Credenziali Supabase — progetto dedicato solo a questa casa.
 * Publishable key: ok sul frontend con RLS attivo.
 */
export const SUPABASE_URL = "https://ogrndedwmljiucjfkxjy.supabase.co";
export const SUPABASE_ANON_KEY =
  "sb_publishable_sEA13VTFyiYuvOm4pwj1Nw_PBxBMciI";

export function isDbConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
