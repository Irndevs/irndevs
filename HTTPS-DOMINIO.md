# HTTPS e domínio canônico — irndevs.com

## GitHub Pages
1. Settings → Pages → Custom domain: **irndevs.com**
2. Marque **Enforce HTTPS**
3. DNS:
   - `A` / `ALIAS` apex → IPs do GitHub Pages
   - `CNAME` www → `yrandilson.github.io` (ou o user/org pages)
4. Canônico do site: **https://irndevs.com** (sem www)
5. No registrador, redirecione **www → apex** (301) se o DNS permitir

O arquivo `CNAME` do repositório já contém `irndevs.com`.
