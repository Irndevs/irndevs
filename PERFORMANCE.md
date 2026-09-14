# Performance — IRN Devs

## Já no código
- Fontes Google com menos pesos (400/600) + `display=swap`
- `preconnect` / `dns-prefetch` para fonts
- `defer` em scripts locais
- `loading="lazy"` em imagens de conteúdo
- Logo em SVG (leve)

## Cloudflare (faça no painel)

### 1. Cache de assets
Rules → Cache Rules → Create:
- When: URI Path starts with `/assets/`
- Then: Eligible for cache, Edge TTL 1 month, Browser TTL 1 week

### 2. HTML
- Edge TTL short (2 min) ou standard — site estático muda no deploy
- Já tem `Always Use HTTPS`

### 3. Speed
- Speed → Optimization: Auto Minify HTML/CSS/JS (se disponível no Free)
- Brotli: On (geralmente padrão)

### 4. Medir
- https://pagespeed.web.dev/?url=https://irndevs.com
- Lighthouse no Chrome (Mobile)

## Próximos ganhos
- Self-host IBM Plex (remove request a Google Fonts) — melhor privacidade + 1 RTT a menos
- Remover JS/CSS legados não usados (`menu-moderno.js`, etc.) se não referenciados
- WebP para fotos de ebook/cases quando forem usadas no HTML
