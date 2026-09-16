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

## Credibilidade e SEO de conteúdo

A seção de depoimentos de exemplo (marcada como "sample", com citações fictícias) foi removida do `index.html` até que existam depoimentos reais autorizados por clientes.

Os 12 artigos do blog agora têm imagem Open Graph própria (`assets/img/og-<slug>.png`, 1200×630), gerada no mesmo estilo visual do site (card terminal, categoria, título do próprio `<h1>`), em vez de compartilhar `og-default.png`. `og:image` e `twitter:image` de cada artigo apontam para a imagem correspondente.

Todos os 12 artigos agora têm dados estruturados `HowTo` (além do `BlogPosting` e `BreadcrumbList` já existentes), com os passos extraídos da estrutura real de cada texto (sumário/h2), permitindo rich snippets de passo a passo na busca.

Os 5 artigos mais enxutos (`backup-restic`, `fail2ban-ubuntu`, `github-actions-pages`, `nginx-reverse-proxy`, `python-venv`), que não tinham nenhum dado estruturado, ganharam `BlogPosting` + `BreadcrumbList` + `HowTo` completos. A data de publicação usa a precisão real disponível no texto (`"2026-09"` para os que mostram "set 2026", `"2026"` para o que mostra só "2026") — nenhum dia exato foi inventado.

## Validação

Antes do deploy, execute:

```bash
python3 scripts/validate-site.py
```


---

## 2026-09-16 (tarde) — Merge: pacote "melhorias" + fixes de review

### Já presentes neste pacote (confirmado)
- 12 imagens OG únicas (1200×630) — `assets/img/og-*.png` — e `og:image`/`twitter:image` apontados por artigo
- `BlogPosting` + `HowTo` JSON-LD em todos os 12 artigos
- Datas visíveis nos artigos; seção de depoimentos reescrita (removido o "testimonials --sample")

### Aplicado neste merge
- **defer** nos 4 scripts de auth (supabase-config, SDK CDN, auth.js, auth-gates.js) nas 7 páginas que os carregam — parse do HTML não bloqueia mais (`auth.js` já usava DOMContentLoaded; ordem entre scripts defer é preservada)
- **sitemap.xml**: `<lastmod>` completo em 39/39 URLs (25 receberam agora)
- **Analytics centralizado**: injetor no `site-nav.js` (57 páginas), ativado por `window.IRN_ANALYTICS = { enabled: true, ... }` — desligado por padrão até criar conta Plausible/Umami
- **Cache-bust**: `site-nav.js` uniformizado para `?v=20260916c` (52 páginas; restavam `20260914f`/`20260914g`)

### Ainda pendentes (dependem de você)
- WhatsApp real — zero links `wa.me` no site; botão "falar com humano" do chat só abre o formulário
- Fontes Google ainda externas — self-host das IBM Plex pendente
- ebookIA*.jpg (4 imagens) ainda órfãs — decidir: apagar ou criar página de captura de leads
- Conta duplicada: loja Next.js é projeto Supabase separado — decidir estratégia (magic link, ou unificar projetos)
- Criar conta Plausible/Umami e ligar `IRN_ANALYTICS.enabled`
