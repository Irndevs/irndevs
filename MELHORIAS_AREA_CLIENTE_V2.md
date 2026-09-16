# Área do cliente — 7 melhorias implementadas

1. **Status + timeline de pedidos**
   - Status: recebido → em_analise → em_execucao → aguardando_cliente → entregue / cancelado
   - Tabela `order_events` + trigger
   - Página `pedido.html?id=` com timeline visual

2. **Upload de arquivos**
   - Tabela `order_files` + Supabase Storage bucket `order-files`
   - Upload e download com signed URL em `pedido.html`

3. **Fluxo de orçamento com aceite**
   - Solicitar orçamento na própria página
   - Aceitar / recusar quando houver resposta
   - Trigger: status `aprovado` → cria `orders` automaticamente

4. **Notificações**
   - Tabela `notifications` + triggers em mudança de status / aceite de orçamento
   - Lista no dashboard `area-cliente.html`
   - E-mail real: Edge Function + provedor (documentado)

5. **Painel admin mínimo**
   - `admin.html` + flag `profiles.is_admin`
   - Documentação para service_role / Edge Function para visão global

6. **Magic link + recuperação de senha**
   - `signInWithMagicLink` e `resetPassword` no `auth.js`
   - UI na `login.html`

7. **Salvar resultados de ferramentas IA**
   - Tabela `ia_tool_results`
   - Helper `assets/js/save-ia-result.js`
   - Exemplo ligado em `demo-mock-data.html`

## Arquivos novos/alterados
- supabase/schema.sql (v2)
- assets/js/auth.js (v2)
- assets/js/auth-gates.js
- assets/js/save-ia-result.js
- pedido.html, admin.html
- pedidos.html, orcamentos.html, login.html, area-cliente.html
- AUTH-SUPABASE.md
