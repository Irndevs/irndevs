# Auth IRN Devs — Supabase + GitHub Pages (v2)

## Arquitetura
- Site estático: GitHub Pages (`irndevs.com`)
- Auth + DB: Supabase
- Front: `login.html`, `cadastro.html`, `conta.html`, `area-cliente.html`, `pedidos.html`, `pedido.html`, `orcamentos.html`, `admin.html`
- JS: `assets/js/auth.js` + `auth-gates.js` + `save-ia-result.js`

## Setup
1. Crie projeto no Supabase
2. **SQL Editor** → rode `supabase/schema.sql` (v2 completo)
3. **Authentication → Providers** → Email enabled
4. **Authentication → URL Configuration** → Redirect URLs: `https://irndevs.com/**` e `http://localhost/**`
5. **Storage** → crie bucket privado `order-files`
   - Policy SELECT: `(auth.uid())::text = (storage.foldername(name))[1]`
   - Policy INSERT: authenticated
6. **Settings → API**: copie URL + anon key para `assets/js/supabase-config.js`
7. (Opcional admin) SQL: `update profiles set is_admin = true where email = 'seu@email.com';`

## O que o usuário logado pode fazer (v2)
1. **Pedidos com status + timeline** — `pedido.html?id=N` mostra histórico de status
2. **Upload/download de arquivos** por pedido (Supabase Storage)
3. **Orçamentos com aceite/recusa** — aceitar cria pedido automaticamente (trigger)
4. **Notificações in-app** — geradas por triggers de status; e-mail real via Edge Function + Resend
5. **Painel admin mínimo** — `admin.html` (requer `is_admin`; visão completa precisa service_role)
6. **Magic link + recuperação de senha** — na tela de login
7. **Salvar resultados de ferramentas IA** — `IRNSaveIa.save()` / tabela `ia_tool_results`

## E-mail real (notificações)
Os triggers gravam em `notifications`. Para enviar e-mail:
- Crie uma Edge Function que escuta inserts em `notifications` (Database Webhook) e chama Resend/SendGrid
- Ou use Supabase Auth hooks apenas para auth; para negócio use webhook

## Segurança
- Nunca coloque `service_role` no front
- RLS ativo em todas as tabelas
- Admin cross-user só via Edge Function com service_role
