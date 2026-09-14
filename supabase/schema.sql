-- IRN Devs — schema mínimo (rode no SQL Editor do Supabase)
-- Habilita perfil ligado ao auth.users

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  company text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.leads_extra (
  id bigserial primary key,
  user_id uuid references auth.users (id) on delete set null,
  source text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.checklists_saved (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('auto', 'dados')),
  content text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.leads_extra enable row level security;
alter table public.checklists_saved enable row level security;

-- profiles: usuário só lê/edita o próprio
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- checklists salvos
create policy "checklists_select_own" on public.checklists_saved
  for select using (auth.uid() = user_id);
create policy "checklists_insert_own" on public.checklists_saved
  for insert with check (auth.uid() = user_id);
create policy "checklists_delete_own" on public.checklists_saved
  for delete using (auth.uid() = user_id);

-- leads: insert autenticado ou anônimo (opcional)
create policy "leads_insert_auth" on public.leads_extra
  for insert with check (true);
create policy "leads_select_own" on public.leads_extra
  for select using (auth.uid() = user_id);

-- Cria profile ao registrar
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

-- ---- Área do cliente: pedidos e orçamentos ----

create table if not exists public.quotes (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  status text not null default 'rascunho'
    check (status in ('rascunho', 'enviado', 'em_analise', 'aprovado', 'recusado', 'expirado')),
  amount_cents integer,
  currency text default 'BRL',
  notes text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.orders (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  quote_id bigint references public.quotes (id) on delete set null,
  title text not null,
  status text not null default 'aberto'
    check (status in ('aberto', 'em_andamento', 'aguardando_cliente', 'entregue', 'cancelado')),
  amount_cents integer,
  currency text default 'BRL',
  notes text,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.quotes enable row level security;
alter table public.orders enable row level security;

create policy "quotes_select_own" on public.quotes
  for select using (auth.uid() = user_id);
create policy "quotes_insert_own" on public.quotes
  for insert with check (auth.uid() = user_id);
create policy "quotes_update_own" on public.quotes
  for update using (auth.uid() = user_id);

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);
create policy "orders_update_own" on public.orders
  for update using (auth.uid() = user_id);
