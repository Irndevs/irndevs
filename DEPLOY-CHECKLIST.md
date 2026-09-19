# Checklist de deploy — IRN Devs

Antes de cada publish:

1. [ ] Bump `CACHE` em `sw.js` (ex.: irn-vAAAAMMDDx)
2. [ ] Unificar `?v=` de `site-nav.js` e `site-nav.css` em todas as páginas HTML
3. [ ] Atualizar `sitemap.xml` (`lastmod` das páginas alteradas + URLs novas)
4. [ ] Atualizar `feed.xml` se houver artigo novo
5. [ ] Purge Cloudflare (HTML + `/assets/js/site-nav.js`)
6. [ ] Hard refresh / janela anônima para validar menu cursos e ferramentas
7. [ ] Testar: hover categoria → mover até item do flyout → clicar (sem fechar)
8. [ ] Search Console: inspeção de URL novas (opcional IndexNow)
9. [ ] Conferir `privacidade.html` se analytics/cookies mudaram
10. [ ] Smoke mobile: drawer accordion cursos + bottom nav

## Menu flyout (referência)
- OPEN_DELAY categorias: 220ms
- CLOSE_DELAY categorias: 450ms
- CLOSE dropdown pai: 400ms
- Gap flyout: -2px (sobreposição)
