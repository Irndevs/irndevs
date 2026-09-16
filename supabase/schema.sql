-- IRN Devs — schema v2 (área do cliente completa)
-- Rode no SQL Editor do Supabase (pode rodar de novo com IF NOT EXISTS)

-- ========== PROFILES ==========
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  company text,
  phone text,
  is_admin boolean default false,
  notify_email boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========== LEADS ==========
create table if not exists public.leads_extra (
  id bigserial primary key,
  user_id uuid references auth.users (id) on delete set null,
  source text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ========== CHECKLISTS ==========
create table if not exists public.checklists_saved (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('auto', 'dados', 'rag', 'ia_tool')),
  title text,
  content text not null,
  created_at timestamptz default now()
);

-- ========== QUOTES (orçamentos) ==========
create table if not exists public.quotes (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  status text not null default 'rascunho'
    check (status in ('rascunho', 'enviado', 'em_analise', 'respondido', 'aprovado', 'recusado', 'expirado')),
  amount_cents integer,
  currency text default 'BRL',
  notes text,
  admin_response text,
  admin_amount_cents integer,
  admin_deadline text,
  responded_at timestamptz,
  accepted_at timestamptz,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========== ORDERS (pedidos) ==========
create table if not exists public.orders (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  quote_id bigint references public.quotes (id) on delete set null,
  title text not null,
  status text not null default 'recebido'
    check (status in ('recebido', 'em_analise', 'em_execucao', 'aguardando_cliente', 'entregue', 'cancelado')),
  amount_cents integer,
  currency text default 'BRL',
  notes text,
  expected_delivery date,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ========== ORDER TIMELINE (histórico de status) ==========
create table if not exists public.order_events (
  id bigserial primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  event_type text not null default 'status_change',
  from_status text,
  to_status text,
  note text,
  created_at timestamptz default now()
);

-- ========== FILES (anexos por pedido/orçamento) ==========
create table if not exists public.order_files (
  id bigserial primary key,
  order_id bigint references public.orders (id) on delete cascade,
  quote_id bigint references public.quotes (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  uploaded_by uuid references auth.users (id) on delete set null,
  file_name text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  created_at timestamptz default now(),
  check (order_id is not null or quote_id is not null)
);

-- ========== NOTIFICATIONS ==========
create table if not exists public.notifications (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  link text,
  kind text default 'info',
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ========== IA TOOL RESULTS (salvar resultados de ferramentas) ==========
create table if not exists public.ia_tool_results (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  tool_name text not null,
  title text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ========== MESSAGES (chat simples por pedido) ==========
create table if not exists public.order_messages (
  id bigserial primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  is_admin boolean default false,
  body text not null,
  created_at timestamptz default now()
);

-- ========== RLS ==========
alter table public.profiles enable row level security;
alter table public.leads_extra enable row level security;
alter table public.checklists_saved enable row level security;
alter table public.quotes enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.order_files enable row level security;
alter table public.notifications enable row level security;
alter table public.ia_tool_results enable row level security;
alter table public.order_messages enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- checklists
drop policy if exists "checklists_select_own" on public.checklists_saved;
drop policy if exists "checklists_insert_own" on public.checklists_saved;
drop policy if exists "checklists_delete_own" on public.checklists_saved;
create policy "checklists_select_own" on public.checklists_saved for select using (auth.uid() = user_id);
create policy "checklists_insert_own" on public.checklists_saved for insert with check (auth.uid() = user_id);
create policy "checklists_delete_own" on public.checklists_saved for delete using (auth.uid() = user_id);

-- leads
drop policy if exists "leads_insert_own" on public.leads_extra;
drop policy if exists "leads_select_own" on public.leads_extra;
create policy "leads_insert_own" on public.leads_extra for insert to authenticated with check (auth.uid() = user_id);
create policy "leads_select_own" on public.leads_extra for select to authenticated using (auth.uid() = user_id);

-- quotes
drop policy if exists "quotes_select_own" on public.quotes;
drop policy if exists "quotes_insert_own" on public.quotes;
drop policy if exists "quotes_update_own" on public.quotes;
create policy "quotes_select_own" on public.quotes for select using (auth.uid() = user_id);
create policy "quotes_insert_own" on public.quotes for insert with check (auth.uid() = user_id);
create policy "quotes_update_own" on public.quotes for update using (auth.uid() = user_id);

-- orders
drop policy if exists "orders_select_own" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_update_own" on public.orders;
create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders_update_own" on public.orders for update using (auth.uid() = user_id);

-- order_events (usuário vê eventos dos próprios pedidos)
drop policy if exists "order_events_select_own" on public.order_events;
create policy "order_events_select_own" on public.order_events
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
drop policy if exists "order_events_insert_own" on public.order_events;
create policy "order_events_insert_own" on public.order_events
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- order_files
drop policy if exists "order_files_select_own" on public.order_files;
drop policy if exists "order_files_insert_own" on public.order_files;
create policy "order_files_select_own" on public.order_files
  for select using (auth.uid() = user_id);
create policy "order_files_insert_own" on public.order_files
  for insert with check (auth.uid() = user_id);

-- notifications
drop policy if exists "notifications_select_own" on public.notifications;
drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select using (auth.uid() = user_id);
create policy "notifications_update_own" on public.notifications for update using (auth.uid() = user_id);

-- ia_tool_results
drop policy if exists "ia_results_select_own" on public.ia_tool_results;
drop policy if exists "ia_results_insert_own" on public.ia_tool_results;
drop policy if exists "ia_results_delete_own" on public.ia_tool_results;
create policy "ia_results_select_own" on public.ia_tool_results for select using (auth.uid() = user_id);
create policy "ia_results_insert_own" on public.ia_tool_results for insert with check (auth.uid() = user_id);
create policy "ia_results_delete_own" on public.ia_tool_results for delete using (auth.uid() = user_id);

-- order_messages
drop policy if exists "order_messages_select_own" on public.order_messages;
drop policy if exists "order_messages_insert_own" on public.order_messages;
create policy "order_messages_select_own" on public.order_messages
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
create policy "order_messages_insert_own" on public.order_messages
  for insert with check (
    auth.uid() = user_id and
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- ========== TRIGGER: profile on signup ==========
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========== TRIGGER: order status change → event + notification ==========
create or replace function public.on_order_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.order_events (order_id, user_id, event_type, from_status, to_status, note)
    values (new.id, new.user_id, 'status_change', old.status, new.status, 'Status atualizado');
    insert into public.notifications (user_id, title, body, link, kind)
    values (
      new.user_id,
      'Pedido atualizado: ' || new.title,
      'Status: ' || old.status || ' → ' || new.status,
      'pedido.html?id=' || new.id,
      'order'
    );
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_order_status on public.orders;
create trigger trg_order_status
  before update on public.orders
  for each row execute procedure public.on_order_status_change();

-- ========== TRIGGER: quote accepted → create order ==========
create or replace function public.on_quote_accepted()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if old.status is distinct from new.status and new.status = 'aprovado' then
    insert into public.orders (user_id, quote_id, title, status, amount_cents, currency, notes)
    values (
      new.user_id,
      new.id,
      new.title,
      'recebido',
      coalesce(new.admin_amount_cents, new.amount_cents),
      new.currency,
      coalesce(new.admin_response, new.notes)
    );
    insert into public.notifications (user_id, title, body, link, kind)
    values (
      new.user_id,
      'Orçamento aprovado: ' || new.title,
      'Seu orçamento foi aceito e um pedido foi criado.',
      'pedidos.html',
      'quote'
    );
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_quote_accepted on public.quotes;
create trigger trg_quote_accepted
  before update on public.quotes
  for each row execute procedure public.on_quote_accepted();

-- ========== STORAGE bucket (rodar no Dashboard → Storage ou via SQL se permitido) ==========
-- create bucket "order-files" public false;
-- policies de storage devem ser configuradas no painel do Supabase:
-- - SELECT: auth.uid() = owner
-- - INSERT: authenticated
