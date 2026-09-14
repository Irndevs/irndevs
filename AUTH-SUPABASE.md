# Auth IRN Devs — Supabase + GitHub Pages

## Arquitetura
- Site estático: GitHub Pages (`irndevs.com`)
- Auth + DB: Supabase (projeto free)
- Front: `login.html`, `cadastro.html`, `conta.html` + `assets/js/auth.js`

## Passo a passo
1. Crie conta em https://supabase.com → New project
2. **SQL Editor** → cole e rode `supabase/schema.sql`
3. **Authentication → Providers** → Email enabled  
   (opcional: desative “Confirm email” em Dev para testar mais rápido)
4. **Settings → API**:
   - Project URL
   - `anon` `public` key
5. Edite `assets/js/supabase-config.js`:
```js
window.IRN_SUPABASE = {
  url: 'https://xxxx.supabase.co',
  anonKey: 'eyJhbGciOi...',
  enabled: true
};
```
6. Commit + push para o Pages
7. Teste: `/cadastro.html` → `/conta.html`

## Segurança
- **Nunca** coloque a `service_role` key no front ou no GitHub
- RLS ativo nas tabelas do schema
- Atualize `privacidade.html` mencionando conta e Supabase

## O que o usuário pode fazer
- Criar conta / login / logout
- Editar perfil (nome, empresa, telefone)
- Salvar checklists na conta (botão na ferramenta)

## Próximos passos
- Magic link (sem senha)
- Pedidos de pacote salvos em `leads_extra`
- Painel admin (só com service role no backend separado)
