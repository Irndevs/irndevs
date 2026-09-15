# Melhorias implementadas — IRN Devs

Esta versão mantém o site estático em HTML, CSS e JavaScript vanilla e registra as correções atualmente aplicadas.

## Segurança

O redirecionamento pós-login aceita somente destinos internos previamente autorizados. A policy da tabela `leads_extra` não permite inserções anônimas: gravações e leituras exigem autenticação e pertencimento ao usuário. O SDK do Supabase está fixado na versão `2.45.4` e carregado com SRI.

## Qualidade e manutenção

O validador cobre as páginas da raiz e da pasta `en/`, ignora o arquivo especial de verificação do Search Console e valida título, descrição, `h1`, IDs e links locais. Os estilos dos artigos foram consolidados em `assets/css/pages/artigo-base.css`, e os arquivos herdados que não eram carregados pelo site atual foram removidos.

## SEO e acessibilidade

As páginas atuais possuem canonical e metadados Open Graph. As páginas comerciais receberam dados estruturados JSON-LD. Os títulos dos módulos Python foram encurtados para melhorar a exibição nos resultados de busca. A preferência `prefers-reduced-motion` é aplicada globalmente por `assets/css/motion.css`.

## Validação

Antes do deploy, execute:

```bash
python3 scripts/validate-site.py
```
