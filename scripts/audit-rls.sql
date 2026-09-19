-- IRN Devs — auditoria de RLS no Supabase (SOMENTE LEITURA).
-- Como usar: Supabase → SQL Editor → cole e rode cada bloco. Nada aqui altera dados ou policies.
-- Contexto: o site é estático; a proteção real de admin.html / área do cliente é a RLS do banco,
-- não o redirecionamento feito no navegador (auth-gates.js).

-- 1) Tabelas do schema public SEM RLS (esperado: nenhuma linha)
select schemaname, tablename
from pg_tables
where schemaname = 'public' and not rowsecurity;

-- 2) Tabelas com RLS ligado mas sem nenhuma policy (ninguém acessa — ou algo está errado)
select c.relname as tabela
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity
  and not exists (
    select 1 from pg_policies p
    where p.schemaname = 'public' and p.tablename = c.relname
  );

-- 3) Todas as policies (revise USING / WITH CHECK de cada uma)
select tablename, policyname, cmd, roles, qual as using_expr, with_check
from pg_policies
where schemaname = 'public'
order by tablename, cmd, policyname;

-- 4) Policies abertas ao visitante sem login (anon/public) — confirme que é intencional
select tablename, policyname, cmd, roles, qual as using_expr, with_check
from pg_policies
where schemaname = 'public'
  and ('anon' = any(roles) or 'public' = any(roles));

-- 5) Policies de UPDATE em profiles. Risco clássico: se o usuário comum pode atualizar a
--    própria linha sem restringir colunas, ele consegue definir is_admin = true em si mesmo.
select policyname, cmd, roles, qual as using_expr, with_check
from pg_policies
where schemaname = 'public' and tablename = 'profiles' and cmd in ('UPDATE', 'ALL');

-- 6) Colunas de profiles que anon/authenticated podem escrever (is_admin NÃO deveria aparecer)
select grantee, privilege_type, column_name
from information_schema.column_privileges
where table_schema = 'public' and table_name = 'profiles'
  and grantee in ('anon', 'authenticated') and privilege_type in ('INSERT', 'UPDATE')
order by grantee, privilege_type, column_name;

-- 7) Funções SECURITY DEFINER (executam com privilégios do dono — revise search_path e validações)
select n.nspname as schema, p.proname as funcao
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prosecdef;
