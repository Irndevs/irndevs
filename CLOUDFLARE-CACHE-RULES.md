# Cloudflare — regras de cache (IRN Devs)

Faça no painel: [dash.cloudflare.com](https://dash.cloudflare.com) → domínio **irndevs.com**.

---

## 1. Cache Rule — assets estáticos (obrigatória)

**Caching → Cache Rules → Create rule**

| Campo | Valor |
|--------|--------|
| Rule name | `assets-long-cache` |
| When | Custom filter expression |
| Expression | `(starts_with(http.request.uri.path, "/assets/"))` |
| Then | **Eligible for cache** |
| Edge TTL | Override → **1 month** |
| Browser TTL | Override → **1 week** (ou Respect origin) |
| Cache key | Standard |

Opcional na mesma regra:
- Origin Cache Control: **Ignore** (se o GitHub Pages mandar `no-cache` em tudo)

Salvar e **Deploy**.

---

## 2. Cache Rule — HTML curto / quase bypass

**Create rule** (ordem: **depois** da regra de assets, ou com prioridade menor)

| Campo | Valor |
|--------|--------|
| Rule name | `html-short-ttl` |
| Expression | `(http.request.uri.path.extension eq "html") or (http.request.uri.path eq "/")` |
| Then | Eligible for cache |
| Edge TTL | **2 minutes** (ou 30 seconds) |
| Browser TTL | **Bypass** ou 0 |

Assim deploys de HTML aparecem rápido; `/assets/*` continua longo.

---

## 3. Speed / compressão

**Speed → Optimization**
- Auto Minify: CSS + JS (HTML opcional)
- Brotli: **On**

**Caching → Configuration**
- Caching Level: Standard
- Browser Cache TTL: se não usar rules, não deixar “Respect Existing Headers” se o origin não manda max-age (a Rule do `/assets/` resolve)

---

## 4. Headers (Transform Rules → Modify Response Header)

Sugestão (uma regra “Security headers”):

| Header | Value |
|--------|--------|
| `Strict-Transport-Security` | `max-age=15552000; includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

SSL/TLS: **Full (strict)** com GitHub Pages.

---

## 5. Após cada deploy de JS/CSS

1. Bump `?v=` nos HTML **ou**
2. Caching → **Configuration → Purge Cache → Custom purge**:
   - `https://irndevs.com/assets/js/site-nav.js`
   - `https://irndevs.com/assets/js/chat-bot.js`
   - `https://irndevs.com/assets/js/chat-bot-loader.js`
   - `https://irndevs.com/assets/css/site-nav.css`
3. Bump `CACHE` no `sw.js` (já feito: `irn-v20260919b`)

---

## 6. Conferir

```bash
# deve mostrar cache HIT após 2ª visita e max-age alto em /assets/
curl -sI "https://irndevs.com/assets/js/site-nav.js" | grep -i cache
curl -sI "https://irndevs.com/" | grep -i cache
```

Esperado em `/assets/`:
- `cf-cache-status: HIT` (2ª request)
- idade de cache crescente

Esperado em `/` ou `*.html`:
- TTL curto ou `DYNAMIC` / bypass browser
