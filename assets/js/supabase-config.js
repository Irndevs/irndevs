/**
 * IRN Devs — configuração Supabase
 * 1) Crie o projeto em https://supabase.com
 * 2) Settings → API → copie URL e anon public key
 * 3) Cole abaixo (nunca use a service_role key no front)
 * 4) Rode o SQL em supabase/schema.sql no SQL Editor
 */
window.IRN_SUPABASE = {
  url: 'https://SEU_PROJETO.supabase.co',
  anonKey: 'SUA_ANON_KEY_AQUI',
  /** true só depois de preencher url/key e rodar o schema */
  enabled: false
};
