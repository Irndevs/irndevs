-- ============================================================
-- IRN Devs — políticas de admin (rodar DEPOIS do schema.sql)
-- ============================================================
-- Problema que isto resolve: o painel admin.html chama uma função
-- que lista TODOS os pedidos, mas o RLS de schema.sql só libera
-- "auth.uid() = user_id" — então, sem isto, um admin só enxerga
-- os próprios pedidos dele, iguais a qualquer cliente comum.
--
-- Como funciona: is_admin() é "security definer", ou seja, roda
-- com privilégio elevado só PRA CONSULTAR a própria tabela profiles
-- por dentro — sem isso, uma policy de admin que lê profiles.is_admin
-- entraria em recursão (RLS chamando RLS). Isto é o padrão oficial
-- recomendado pelo Supabase pra esse caso.
--
-- Rode este arquivo inteiro de uma vez no SQL Editor do Supabase.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- só usuários autenticados podem chamar; ninguém anônimo
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------- orders: admin lê tudo (além da própria policy já existente) ----------
drop policy if exists "orders_select_admin" on public.orders;
create policy "orders_select_admin" on public.orders
  for select
  to authenticated
  using (public.is_admin());

-- ---------- profiles: admin lê tudo (necessário pro join profiles(email, full_name)) ----------
drop policy if exists "profiles_select_admin" on public.profiles;
create policy "profiles_select_admin" on public.profiles
  for select
  to authenticated
  using (public.is_admin());

-- ---------- quotes: admin lê tudo (schema já tem admin_response/admin_amount_cents/admin_deadline,
--            ou seja, já estava previsto que o admin precisaria ver os orçamentos dos clientes) ----------
drop policy if exists "quotes_select_admin" on public.quotes;
create policy "quotes_select_admin" on public.quotes
  for select
  to authenticated
  using (public.is_admin());

-- ---------- order_messages: admin lê as conversas de qualquer pedido ----------
drop policy if exists "order_messages_select_admin" on public.order_messages;
create policy "order_messages_select_admin" on public.order_messages
  for select
  to authenticated
  using (public.is_admin());

-- ---------- order_events: admin lê o histórico de qualquer pedido ----------
drop policy if exists "order_events_select_admin" on public.order_events;
create policy "order_events_select_admin" on public.order_events
  for select
  to authenticated
  using (public.is_admin());

-- ---------- order_files: admin lê os arquivos de qualquer pedido ----------
drop policy if exists "order_files_select_admin" on public.order_files;
create policy "order_files_select_admin" on public.order_files
  for select
  to authenticated
  using (public.is_admin());

-- ---------- orders: admin ATUALIZA status/notas/prazo de qualquer pedido ----------
-- (o trigger trg_order_status já existente cuida sozinho de registrar em
--  order_events e criar a notificação pro cliente quando o status muda)
drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin" on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- quotes: admin ATUALIZA pra responder orçamento (admin_response,
--            admin_amount_cents, admin_deadline, status → 'respondido') ----------
-- (aprovar/recusar continua sendo decisão do cliente via acceptQuote/refuseQuote,
--  que já tem policy própria "quotes_update_own" — o trigger trg_quote_accepted
--  só roda pra valer quando o CLIENTE muda o status pra 'aprovado')
drop policy if exists "quotes_update_admin" on public.quotes;
create policy "quotes_update_admin" on public.quotes
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- Resumo do que isto libera pro admin (is_admin = true):
-- - SELECT em orders, profiles, quotes, order_messages, order_events,
--   order_files de QUALQUER cliente (antes só via um Edge Function).
-- - UPDATE em orders (mudar status, notas, prazo — o trigger já
--   existente cuida de registrar o evento e notificar o cliente).
-- - UPDATE em quotes (preencher admin_response, admin_amount_cents,
--   admin_deadline e marcar status='respondido').
-- Aprovar/recusar orçamento continua sendo ação exclusiva do cliente
-- (policies quotes_update_own / acceptQuote() / refuseQuote(), já
-- existentes em schema.sql — não mexi nelas).
-- ============================================================
