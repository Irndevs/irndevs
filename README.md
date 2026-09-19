# IRN Devs

Site institucional, portfólio técnico e área de ferramentas da IRN Devs. O projeto é um site estático construído com HTML, CSS e JavaScript vanilla, com páginas de serviços, projetos, artigos, cursos, ferramentas e área de contato.

## Demonstração

- **Site:** https://irndevs.com/
- **Diagnóstico gratuito:** https://irndevs.com/diagnostico.html
- **GitHub:** https://github.com/iri-afk

## Proposta comercial

O site apresenta software, automações, dados e infraestrutura em produção. A principal porta de entrada comercial é o **diagnóstico gratuito de 30 minutos**, destinado a identificar gargalos de processo, integração, dados ou infraestrutura e indicar próximos passos proporcionais ao problema.

A página de diagnóstico informa o fluxo da conversa, os tipos de problema analisados, a ausência de obrigação de contratação e o prazo de resposta de até 1 dia útil.

## Estrutura principal

```text
irndevs/
├── index.html                         # Home e projetos em produção
├── diagnostico.html                   # Oferta de diagnóstico gratuito
├── servicos.html                      # Serviços, processo, cases e FAQ
├── pacotes.html                       # Pacotes de desenvolvimento, automação e dados
├── como-contratar.html                # Jornada de contratação
├── contato.html                       # Formulário de contato
├── sobre.html                         # História, método, stack e formação
├── blog.html                          # Índice dos artigos
├── artigo-*.html                      # Artigos técnicos
├── cursos.html                        # Índice dos cursos
├── curso-*-modulo-*.html              # Módulos de cursos
├── ia.html                            # Ferramentas e conteúdo de IA
├── ferramentas.html                   # Ferramentas gratuitas
├── ferramenta-checklist.html          # Checklist de diagnóstico
├── orcamentos.html                    # Área de orçamentos
├── en/                                # Versão em inglês (home, services, packages, diagnostic, how-to-hire, courses, about, contact)
├── assets/css/                        # Estilos compartilhados e por página (en.css = páginas em inglês)
├── assets/js/                         # Navegação (site-nav.js, PT/EN), autenticação e interações
├── assets/img/                        # Logos, ícones, diagramas e OG images
├── supabase/                          # Schema e políticas do banco (versionar aqui: schema.sql, admin-policies.sql)
├── scripts/validate-site.py           # Validador: HTML, links, canonical, sitemap, hreflang, acessibilidade
├── scripts/audit-rls.sql              # Auditoria somente-leitura da RLS do Supabase
├── .github/workflows/validate.yml     # CI: roda o validador e checa a sintaxe dos JS
├── sitemap.xml                        # Sitemap do site publicado
├── robots.txt                         # Regras para crawlers
└── README.md                          # Esta documentação
```

A pasta `_legado/` contém páginas históricas que não fazem parte da navegação publicada atual. Elas não devem ser reativadas sem uma migração dos caminhos antigos.

## Melhorias comerciais implementadas

A home agora usa o diagnóstico gratuito como CTA principal e direciona o visitante para uma conversa de baixo atrito antes da proposta. As páginas de serviços, pacotes, contato, Sobre e Como contratar também apresentam essa jornada.

A página de contato recebeu campos opcionais para prazo desejado e faixa de investimento. O formulário mantém a categorização por assunto e informa que a resposta ocorre em até 1 dia útil.

A página Sobre foi reorganizada para combinar narrativa, princípios de trabalho e prova técnica. A página de serviços recebeu anchors para as frentes de desenvolvimento, automações e dados. Os 24 artigos técnicos ativos receberam uma chamada contextual para o diagnóstico.

O sitemap inclui `diagnostico.html` e os links da versão completa do projeto, incluindo `ia.html` e `orcamentos.html`, foram preservados.

## Tecnologias

- HTML5 sem framework de frontend;
- CSS3, Grid, Flexbox e propriedades customizadas;
- JavaScript ES6+ modular;
- formulários com validação no navegador e FormSubmit;
- Supabase para os recursos que usam autenticação e dados;
- JSON-LD, Open Graph, canonical e sitemap para SEO;
- WebP para imagens quando disponível;
- `prefers-reduced-motion` e foco visível para acessibilidade.

## Como executar localmente

Na raiz do site, inicie um servidor HTTP simples:

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Depois acesse `http://localhost:8000/` no navegador. Para uma alternativa com Node.js, use:

```bash
npx serve .
```

Como o projeto é estático, não há etapa de build obrigatória para a publicação normal.

## Validação

Execute o validador incluído no projeto:

```bash
python3 scripts/validate-site.py
```

Saída esperada (o número de páginas cresce com o site):

```text
Validated 174 HTML pages: OK
```

O validador confere, por página: `<title>`, meta description, um único `h1`, IDs duplicados (só no HTML estático — templates dentro de `<script>` são ignorados), links/CSS/JS locais, `canonical`, fechamento de `</body></html>`, presença do `site-nav.js`, nome acessível em todo campo de formulário e `hreflang` nas páginas `/en/`. No site inteiro, confere o `sitemap.xml`: toda página indexável precisa estar listada e nenhuma página `noindex` pode estar. O mesmo comando roda no GitHub Actions a cada push/PR (`.github/workflows/validate.yml`).

## Segurança (Supabase)

O site é estático: `admin.html` e a área do cliente só redirecionam no navegador (`auth-gates.js`). A proteção real dos dados é a RLS do Supabase. Mantenha `supabase/schema.sql` e `supabase/admin-policies.sql` versionados neste repositório e rode `scripts/audit-rls.sql` no SQL Editor depois de qualquer mudança de schema ou de policy. Nunca coloque a `service_role` key no front-end (só a `anon` key).

## Publicação

O site pode ser publicado como conteúdo estático em GitHub Pages, Cloudflare Pages, Netlify ou Vercel. Para GitHub Pages, publique a raiz que contém `index.html`, `CNAME`, `robots.txt` e `sitemap.xml`.

Antes de uma publicação definitiva, confirme:

1. o domínio configurado em `CNAME`;
2. o HTTPS do domínio;
3. o recebimento do formulário em `contato@irndevs.com`;
4. o endereço informado no `sitemap.xml`;
5. a verificação do Google Search Console;
6. os links externos de projetos e redes sociais.

## Manutenção

Ao criar uma nova página pública, adicione título, descrição, canonical, Open Graph, favicon, idioma, um único `h1` e os links necessários ao sitemap. Páginas privadas (login, certificados, pedidos) devem ter `noindex` e **não** entrar no sitemap. Depois execute `scripts/validate-site.py`.

Páginas com equivalente em inglês devem ter `hreflang` nos dois sentidos (`pt-BR`, `en`, `x-default`) e o par cadastrado no mapa `PT_TO_EN`/`EN_TO_PT` do `assets/js/site-nav.js`, que também controla o seletor de idioma no menu. O menu injetado por `site-nav.js` usa caminhos absolutos em `/en/*`; ao criar novos links no nav, use sempre `/caminho.html` nas páginas em inglês.

Ao alterar `site-nav.js` ou `site-nav.css`, troque o token `?v=` em **todas** as páginas de uma vez (busca e substituição global) e incremente `CACHE` em `sw.js`.

Ao criar um artigo, mantenha a estrutura dos artigos existentes e inclua uma chamada contextual para o diagnóstico quando o tema tiver relação com serviços da IRN Devs. Evite afirmar resultados ou métricas que não possam ser comprovados.

## Contato

- **E-mail:** contato@irndevs.com
- **GitHub:** https://github.com/iri-afk
- **Site:** https://irndevs.com/
