# Melhorias implementadas — IRN Devs

Esta versão mantém o site estático em HTML, CSS e JavaScript vanilla e registra as correções atualmente aplicadas.

## Segurança

O redirecionamento pós-login aceita somente destinos internos previamente autorizados. A policy da tabela `leads_extra` não permite inserções anônimas: gravações e leituras exigem autenticação e pertencimento ao usuário. O SDK do Supabase está fixado na versão `2.45.4` e carregado com SRI.

## Qualidade e manutenção

O validador cobre as páginas da raiz e da pasta `en/`, ignora o arquivo especial de verificação do Search Console e valida título, descrição, `h1`, IDs e links locais. Os estilos dos artigos foram consolidados em `assets/css/pages/artigo-base.css`, e os arquivos herdados que não eram carregados pelo site atual foram removidos.

## SEO e acessibilidade

As páginas atuais possuem canonical e metadados Open Graph. As páginas comerciais receberam dados estruturados JSON-LD. Os títulos dos módulos Python foram encurtados para melhorar a exibição nos resultados de busca. A preferência `prefers-reduced-motion` é aplicada globalmente por `assets/css/motion.css`.

## PWA e modo offline

O site agora é instalável. Um `manifest.json` na raiz declara nome, ícones (192, 512, versão maskable e o favicon SVG), atalhos para cursos/blog/contato e `theme-color` combinando com o visual atual. Os ícones foram gerados a partir do logo mark existente (`assets/img/logo-irndevs-mark.png`), sem depender de arte nova. `manifest.json` e `apple-touch-icon` estão referenciados em todas as páginas HTML (raiz e `en/`).

O registro do service worker, que antes só acontecia em `index.html` e `cursos.html`, foi centralizado em `assets/js/site-nav.js` e passa a rodar em qualquer página. Quando o navegador oferece a instalação (`beforeinstallprompt`), um botão "Instalar" aparece ao lado dos botões flutuantes de contato existentes. O service worker também ganhou uma página de fallback (`offline.html`, no mesmo estilo visual do `404.html`) exibida quando a rede falha em uma navegação sem conteúdo em cache.

## Validação

Antes do deploy, execute:

```bash
python3 scripts/validate-site.py
```
