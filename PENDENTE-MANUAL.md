# Pendências manuais (após correções de segurança)

## Já corrigido no código
- Formsubmit AJAX + labels de e-mail + honeypot
- Captcha Formsubmit ligado
- Honeypot oculto e validação básica de campos
- Política de Privacidade (`privacidade.html`)
- Textos corrompidos (k3s, homelab, observabilidade, etc.)
- Hero em voz de empresa
- Remoção de `_legado/`
- Meta referrer / nosniff onde aplicável

## Ainda depende de você
1. **Configurar um número real de WhatsApp**, caso queira reativar esse canal (o placeholder foi removido)
2. **Push** deste pacote para o GitHub Pages
3. **Search Console** — verificação + sitemap
4. **Confirmar e-mail** no Formsubmit (primeira mensagem / captcha)
5. **SSL Labs + securityheaders.com** no domínio em produção
6. **Cloudflare** (opcional) na frente do DNS
7. Analytics — só se quiser, e atualizar a política de privacidade
8. **Depoimentos reais**: a seção de exemplo foi removida do `index.html`; quando tiver depoimentos reais com autorização, me passa que eu recrio a seção
9. **Self-host das fontes Google (IBM Plex)**: não deu para baixar `fonts.googleapis.com`/`fonts.gstatic.com`/registro npm nesta sessão — domínios fora da allowlist de rede do ambiente. Segue carregando via Google Fonts por enquanto; dá para retomar numa sessão com esses domínios liberados nas configurações de rede
