# O que ainda precisa ser feito manualmente

## Obrigatório / conta externa
1. **Google Search Console** — verificar `https://irndevs.com` e enviar `sitemap.xml` (ver SEARCH-CONSOLE.md).
2. **Confirmar e-mail do formulário** — a primeira mensagem via Formsubmit pode exigir confirmação no e-mail comercial da empresa.
3. **Analytics** — criar conta Plausible ou Umami e descomentar o script no `index.html` (e outras páginas se quiser).
4. **DNS / HTTPS** — Enforce HTTPS no GitHub Pages; redirect www → apex (ver HTTPS-DOMINIO.md).

## Conteúdo de negócio
5. **Cases com números reais** — substituir os textos genéricos de "Resultados" por métricas verdadeiras de clientes (com permissão).
6. **Preços / faixas** (opcional) — se fizer sentido comercialmente, acrescentar em `como-contratar.html`.
7. **Depoimentos** — 1–3 frases de clientes ou parceiros.

## Conteúdo e produto
8. **Versão em inglês** — pasta `en/` com index, services, about, contact.
9. **Laboratório de software** — revisar a narrativa comercial e adicionar demonstrações de produtos.
10. **Ritmo de blog** — publicar com regularidade e atualizar `feed.xml`.

## Técnico (quando houver tempo)
11. Unificar CSS inline em `terminal-base.css` em todas as páginas.
12. CI no GitHub Actions (link check no deploy).
13. Monitoramento de uptime do site (UptimeRobot / Healthchecks).
