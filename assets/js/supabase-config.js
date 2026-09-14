/**
 * IRN Devs — configuração Supabase
 * 1) Crie o projeto em https://supabase.com
 * 2) Settings → API → copie URL e anon public key
 * 3) Cole abaixo (nunca use a service_role key no front)
 * 4) Rode o SQL em supabase/schema.sql no SQL Editor
 */
window.IRN_SUPABASE = {
  url: 'https://mdbpjvawzerziwphtkkt.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kYnBqdmF3emVyeml3cGh0a2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTcwNTgsImV4cCI6MjEwNDk3MzA1OH0.0RW6AGsUmFT0YMigrKvqCdLi63oRg93YwZSm1U0pOf4',
  /** true só depois de preencher url/key e rodar o schema */
  enabled: true
};
