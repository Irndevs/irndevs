# Cloudflare na frente do irndevs.com

## Por quê
- HTTPS/HSTS e headers de segurança sem depender só do GitHub Pages
- Cache de assets estáticos
- Proteção básica (DDoS, bot fight opcional)
- Analytics opcional

## Passos
1. Conta em https://dash.cloudflare.com
2. Add site → `irndevs.com`
3. Trocar nameservers no registrador pelos da Cloudflare
4. SSL/TLS: **Full (strict)** quando o origin (Pages) já tem HTTPS
5. DNS: registros do GitHub Pages (A/AAAA ou CNAME conforme docs atuais do GitHub)
6. Proxy laranja (proxied) nas entradas do site

## Headers sugeridos (Transform Rules / Response Headers)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- CSP: começar em *report-only*, depois enforce

## Cache
- HTML: bypass ou TTL curto
- `/assets/*`: cache longo

## Depois
- securityheaders.com e SSL Labs no domínio
- Manter `CNAME` / DNS alinhados ao setup Pages + Cloudflare
