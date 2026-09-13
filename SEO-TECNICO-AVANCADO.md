# SEO técnico avançado — IRN Devs

## Já implementado no código
- Canonical, Open Graph, Twitter Card
- hreflang pt-BR / en / x-default (EN mínimo em `/en/`)
- JSON-LD: Organization, WebSite, ProfessionalService, BlogPosting, FAQPage, BreadcrumbList
- sitemap.xml + robots.txt + feed.xml (RSS)
- security.txt em `/.well-known/security.txt`
- Meta referrer / privacidade (E-E-A-T auxiliar)

## Estratégias avançadas (próximos níveis)

### 1. Indexação e descoberta
- Google Search Console: inspeção de URL, cobertura, Core Web Vitals
- Bing Webmaster com o mesmo sitemap
- IndexNow (Bing/Yandex) em deploys novos de artigos
- Manter `lastmod` real no sitemap quando republicar posts

### 2. Performance (ranqueia indireto)
- Lighthouse / PageSpeed: LCP < 2.5s, CLS baixo
- Homelab e imagens: WebP/AVIF, `width`/`height`, lazy-load
- CSS/JS críticos: evitar CSS enorme bloqueante; cache de assets com hash no futuro
- CDN (Cloudflare) na frente do GitHub Pages

### 3. Headers e segurança (confiança + às vezes ranking)
Via Cloudflare ou proxy:
- HSTS
- CSP (começar report-only)
- X-Content-Type-Options, X-Frame-Options, Permissions-Policy
Testar: securityheaders.com + SSL Labs (A ou A+)

### 4. Dados estruturados avançados
- `Service` por oferta (já há ProfessionalService genérico)
- `HowTo` nos artigos passo a passo (observabilidade, hardening)
- `ItemList` na listagem do blog
Validar: https://search.google.com/test/rich-results

### 5. Internal linking estratégico
- Cada serviço → 2–3 artigos âncora
- Artigos → CTA serviços/contato (já existe)
- Hub “observabilidade” / “kubernetes” (páginas pilar) quando o conteúdo crescer

### 6. Conteúdo e E-E-A-T
- Autoria organizacional clara (já IRN Devs)
- Cases e depoimentos reais (substituir placeholders)
- Datas de atualização visíveis nos artigos
- Evitar thin content; expandir guias com diagramas

### 7. Internacionalização
- Expandir `/en/` (services, about, contact) com conteúdo próprio (não só translate 1:1 genérico)
- hreflang em todas as pares PT↔EN
- Não misturar idiomas na mesma URL

### 8. Logs e monitoramento SEO
- Search Console: queries, CTR, páginas órfãs
- 404 reais → corrigir ou redirect 301
- Uptime do domínio (disponibilidade = crawl ok)

### 9. Entidades e marca
- Mesmo NAP/nome “IRN Devs” em GitHub, LinkedIn, site
- sameAs no JSON-LD apontando perfis oficiais
- Google Business Profile só se houver endereço físico elegível

### 10. O que evitar
- Cloaking, texto escondido, compra de link
- Duplicar PT/EN na mesma URL
- Sitemap com URLs 404 ou bloqueadas por robots

## Ordem sugerida pós-deploy
1. Search Console + sitemap
2. Cloudflare + headers
3. Rich Results test nos artigos
4. Substituir depoimentos placeholder
5. Expandir EN e pilares de conteúdo
