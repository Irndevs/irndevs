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
├── assets/css/                        # Estilos compartilhados e por página
├── assets/js/                         # Navegação, autenticação e interações
├── assets/img/                        # Logos, ícones, diagramas e OG images
├── supabase/                          # Schema e políticas do banco
├── scripts/validate-site.py           # Validador de HTML, links e metadados
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

A versão entregue após as melhorias foi validada com o resultado:

```text
Validated 86 HTML pages: OK
```

Também foram verificados os arquivos CSS, assets locais, sintaxe dos arquivos JavaScript, IDs duplicados, referências do sitemap e carregamento HTTP das páginas comerciais principais. A auditoria publicada encontrou zero problemas nesses arquivos ativos.

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

Ao criar uma nova página pública, adicione título, descrição, canonical, Open Graph, favicon, idioma, um único `h1` e os links necessários ao sitemap. Depois execute `scripts/validate-site.py`.

Ao criar um artigo, mantenha a estrutura dos artigos existentes e inclua uma chamada contextual para o diagnóstico quando o tema tiver relação com serviços da IRN Devs. Evite afirmar resultados ou métricas que não possam ser comprovados.

## Contato

- **E-mail:** contato@irndevs.com
- **GitHub:** https://github.com/iri-afk
- **Site:** https://irndevs.com/

## Identidade visual atual

O site utiliza a identidade visual azul-marinho, roxo, azul elétrico e ciano inspirada na comunicação visual da IRN Devs. A camada global está em `assets/css/irndevs-theme.css` e é carregada pelas 86 páginas HTML ativas.

As principais variáveis são:

```css
--irn-bg: #000517;
--irn-surface: #07132F;
--irn-purple: #6D2BFF;
--irn-blue: #155BFF;
--irn-cyan: #16C8FF;
--irn-white: #F4F7FF;
--irn-muted: #B9C8E8;
```

A camada preserva a estrutura existente, mas atualiza fundos, navegação, botões, cards, formulários, rodapés, links, estados ativos, badges, terminal, grades e chamadas para ação. O gradiente principal combina violeta, roxo, azul e ciano.

A cobertura visual inclui 85 páginas HTML com estrutura visual (`<head>`), incluindo as cinco páginas em inglês. O arquivo `googleb23553d3569257db.html` é apenas uma página técnica de verificação do Google, sem interface visual, e por isso não carrega a camada de tema.
