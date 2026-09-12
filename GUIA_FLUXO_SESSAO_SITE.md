# Guia de estudo: fluxo completo de manutenção do site

Este documento registra o fluxo executado no site IRN Devs durante a sessao de manutencao. A ideia e mostrar como investigar, decidir, editar, validar e publicar um site estatico com HTML, CSS, JavaScript e GitHub Pages.

## 1. Contexto do projeto

O repositorio e um site estatico publicado pelo GitHub Pages.

Caracteristicas principais:

- paginas HTML independentes;
- CSS originalmente escrito dentro de cada HTML;
- menu compartilhado injetado por `assets/js/site-nav.js`;
- estilos do menu em `assets/css/site-nav.css`;
- imagens e outros recursos em `assets/`;
- deploy feito pelo GitHub Pages a partir da branch `main`;
- sem `package.json`, framework ou bundler obrigatorio.

Repositorio remoto:

```text
git@github.com:org/site.git
```

Branch publicada:

```text
main
```

## 2. Metodo usado em todas as tarefas

O fluxo seguido foi:

1. localizar o arquivo ou comportamento relacionado ao pedido;
2. ler o codigo proximo ao ponto encontrado;
3. formular uma hipotese sobre a causa;
4. executar uma checagem pequena para confirmar ou negar a hipotese;
5. fazer a menor alteracao necessaria;
6. executar uma validacao focada;
7. revisar o estado do Git;
8. criar commit e fazer push quando solicitado.

Essa ordem evita editar o projeto inteiro antes de entender qual arquivo realmente controla o comportamento.

## 3. Primeira investigacao: slogan e header

### Pedido

O slogan parecia nao ter sido removido nem expandido.

### Investigacao

Foram procurados:

- o texto do slogan;
- a regra CSS de largura do titulo;
- textos parecidos dentro do logo e do terminal;
- o menu responsivo que alterava o espacamento da pagina.

Comandos representativos:

```bash
grep -RInE 'Construo e opero|infraestrutura pra aprender|slogan|Slogan' \
  --include='*.html' --include='*.css' --include='*.js' .
```

O resultado mostrou no `index.html`:

```html
<h1>Construo e opero a própria infraestrutura pra aprender do jeito que fica.</h1>
```

E mostrou na folha de estilo:

```css
.hero h1 { ... max-width: 640px; }
```

### Hipotese

O texto ainda aparecia porque havia duas causas diferentes:

1. o titulo estava limitado a `640px`, forçando quebras de linha;
2. o logo e o terminal ainda continham textos relacionados a infraestrutura.

### Correcao

Foram feitas estas mudancas:

- largura maxima do titulo: `640px` para `900px`;
- remocao da etiqueta `infra · obs · k3s` do SVG;
- remocao da linha `infra & observability · self-hosted platforms` do terminal.

Arquivo principal:

- `index.html`
- `assets/img/logo-irndevs.svg`

Validacao:

```bash
git diff --check
```

Esse comando procura erros de espacos em branco no diff, como linhas com espacos no final.

Commit publicado:

```text
ce93e1c Ajusta slogan da página inicial
```

## 4. Publicacao da primeira correcao

Antes do push, foram conferidos branch e remoto:

```bash
git status --short
git branch --show-current
git remote -v
```

Interpretacao:

- `git status --short`: mostra arquivos modificados;
- `git branch --show-current`: mostra a branch atual;
- `git remote -v`: mostra para onde o Git envia e baixa codigo.

Depois:

```bash
git add index.html assets/img/logo-irndevs.svg
git commit -m "Ajusta slogan da página inicial"
git push origin main
```

O `git add` prepara os arquivos, o `git commit` cria um ponto de historico e o `git push` envia esse commit para o GitHub.

## 5. Investigacao do aviso Node.js 20 no GitHub Pages

### Mensagem observada

O build avisava que `actions/upload-artifact@v4` usava Node.js 20 e estava sendo forcada a rodar com Node.js 24.

### Investigacao

Foram procurados workflows locais:

```bash
find .github -maxdepth 3 -type f -print 2>/dev/null
grep -RInE 'upload-artifact|actions/checkout|actions/setup|actions/deploy' .github 2>/dev/null
```

Tambem foi verificado o que o Git rastreava:

```bash
git ls-tree -r --name-only HEAD | grep -E '(^|/)\.github/|workflow|yml$|yaml$'
```

Nenhum workflow foi encontrado no repositorio local.

### Conclusao

O deploy estava configurado como GitHub Pages por branch, e o aviso vinha de uma action interna do fluxo de Pages, nao de um workflow criado no repositorio.

Quando existe workflow proprio, a atualizacao recomendada e trocar:

```yaml
uses: actions/upload-artifact@v4
```

por:

```yaml
uses: actions/upload-artifact@v5
```

Neste repositorio nao havia arquivo local para editar. Por isso nao foi criada uma mudanca artificial apenas para esconder o aviso.

## 6. Expansao da pagina de jogos

### Estado inicial

A pagina `jogos.html` tinha dois jogos:

- Snake;
- Memory.

A estrutura usava cards HTML, canvas para Snake, botoes para Memory e JavaScript embutido na propria pagina.

Investigacao:

```bash
grep -RInE 'game|jogo|canvas|score|jogos' jogos.html assets/js assets/css
```

Depois foi lida a parte final do arquivo para entender as funcoes existentes:

- inicializacao do Snake;
- controle por teclado e toque;
- criacao do tabuleiro Memory;
- armazenamento de recorde no `localStorage`.

### Decisao

Foram adicionados dois jogos simples, sem dependencias externas:

1. **Reaction**: mede o tempo de reacao em milissegundos e guarda o melhor tempo no navegador;
2. **Terminal Quiz**: cinco perguntas sobre Linux, redes e observabilidade.

### Alteracoes

Em `jogos.html` foram adicionados:

- novos cards;
- estilos de painel, opcoes e estados de resposta;
- pontuacao e recordes;
- suporte a clique e barra de espaco no Reaction;
- perguntas, respostas corretas e resultado final no Quiz;
- atualizacao de `description`, Open Graph e Twitter description.

### Validacoes usadas

Extracao do JavaScript inline e verificacao sintatica com Node:

```bash
awk 'BEGIN{inside=0} /<script>/{inside=1; next} /<\/script>/{inside=0} inside{print}' \
  jogos.html | node --check
```

O `node --check` verifica sintaxe JavaScript sem executar o jogo.

Tambem foram conferidos os IDs usados pelos scripts:

```bash
for id in reactionPad reactionStart reactionTime reactionBest reactionMsg \
  quizQuestion quizOptions quizScore quizNumber quizMsg quizRestart; do
  grep -q "id=\"$id\"" jogos.html || exit 1
done
```

Commit:

```text
895f695 Expande catalogo de minijogos
```

## 7. Localizacao do case do Homelab

Foi perguntado onde estava o case relacionado ao Homelab.

Busca usada:

```bash
grep -RInE 'homelab|case|Case|solução|Solução' \
  --include='*.html' --include='*.md' .
```

O resultado mostrou duas entradas em `servicos.html`:

- `Homelab + observabilidade`;
- `Menu com expansão inconsistente em site estático`.

Trecho conceitual do case:

```html
<section>
  <h2>Cases (resumo)</h2>
  ...
</section>
```

O case foi colocado em `servicos.html`, e nao dentro de `homelab.html`, porque ele documenta uma solucao entregue e funciona como prova de capacidade na pagina de servicos.

## 8. Revisao geral do site

Foi feita uma revisao orientada a riscos, nao apenas estetica.

### Comandos de inventario

```bash
find . -maxdepth 2 -type f | sort
```

Lista a estrutura do repositorio.

```bash
for f in *.html; do
  printf '%-32s ' "$f"
  printf 'title='; grep -q '<title>' "$f" && printf yes || printf no
  printf ' desc='; grep -q 'meta name="description"' "$f" && printf yes || printf no
  printf ' h1='; grep -c '<h1' "$f"
  printf ' navjs='; grep -q 'assets/js/site-nav.js' "$f" && printf yes || printf no
  printf '\n'
done
```

Compara title, description, quantidade de `h1` e uso do menu compartilhado.

### Links locais

Foi usado um pequeno script Python para extrair `href`, ignorar URLs externas e verificar se cada pagina local existia.

Resultado:

```text
Nenhum link local quebrado encontrado
```

### Arquivos pesados

```bash
wc -c homelab.html index.html *.html | sort -n
```

O comando mostrou que `homelab.html` tinha aproximadamente 1,97 MB.

### Problemas encontrados

- `homelab.html` tinha 13 imagens PNG embutidas como Base64;
- havia menu HTML legado junto com o menu injetado por JavaScript;
- links para LinkedIn apontavam apenas para `https://linkedin.com` em algumas paginas;
- a home e os metadados dos jogos ainda diziam apenas Snake e Memory;
- `404.html` nao possuia meta description;
- CSS estava espalhado dentro dos HTMLs;
- nao existia validacao automatica do site.

## 9. Correcao de performance do Homelab

### Investigacao

As imagens foram localizadas com:

```bash
grep -nE 'data:image|<svg|<script|<nav|<img|base64' homelab.html
```

Depois foram contadas:

```bash
grep -o 'src="data:image[^" ]*' homelab.html | wc -l
```

Resultado: 13 imagens Base64.

### Solucao

Foi criado `scripts/extract-homelab-media.py`. O script:

1. abre `homelab.html`;
2. encontra `src="data:image/...;base64,..."`;
3. decodifica cada imagem;
4. salva os PNGs em `assets/img/homelab/`;
5. troca o Base64 por caminhos relativos;
6. preserva o restante do HTML.

Execucao:

```bash
python3 scripts/extract-homelab-media.py
```

Resultado:

- antes: aproximadamente 1.969 KB;
- depois: aproximadamente 39 KB;
- imagens extraidas: 13.

A reducao aconteceu porque o navegador deixou de ler megabytes de Base64 dentro do documento HTML.

## 10. Correcao de links e SEO

Foram corrigidos links genericos:

```text
https://linkedin.com
```

para:

```text
perfil profissional removido por privacidade
```

Arquivos envolvidos incluem artigos, blog e home.

Tambem foram corrigidos:

- descricao da home sobre os quatro jogos;
- `og:description` de `jogos.html`;
- `twitter:description` de `jogos.html`;
- meta description de `404.html`.

Essas alteracoes evitam previews sociais desatualizados e melhoram a indexacao.

## 11. Validador automatico

Foi criado `scripts/validate-site.py` sem dependencias externas.

Ele verifica:

- existencia de `<title>`;
- existencia de meta description;
- exatamente um `h1` por pagina;
- IDs duplicados;
- links locais quebrados;
- LinkedIn generico;
- descricao antiga dos jogos;
- paginas maiores que 500 KB.

Execucao:

```bash
python3 scripts/validate-site.py
```

Resultado esperado:

```text
Validated 17 HTML pages: OK
```

O arquivo Homelab chegou a ser tratado como aviso de performance antes da extracao. Depois da extracao, deixou de ultrapassar o limite configurado.

## 12. Centralizacao de todo CSS

### Problema

Cada pagina tinha um bloco `<style>` dentro do proprio HTML. Alem disso, havia atributos como:

```html
<div style="margin-top: 10px">
```

Isso dificultava manutencao, revisao e reutilizacao.

### Solucao em duas etapas

Foi criado `scripts/extract-inline-css.py`, que:

- encontra blocos `<style>`;
- cria `assets/css/pages/<pagina>.css`;
- substitui o bloco por um `<link rel="stylesheet">`.

Execucao:

```bash
python3 scripts/extract-inline-css.py
```

Depois foi criado `scripts/extract-inline-style-attrs.py`, que:

- encontra atributos `style="..."`;
- cria classes como `.inline-style-1`;
- coloca essas regras no CSS da pagina;
- substitui o atributo inline pela classe.

Execucao:

```bash
python3 scripts/extract-inline-style-attrs.py
```

Resultado:

- 17 paginas com CSS externo;
- nenhum bloco `<style>` nas paginas publicas;
- nenhum `style="..."` nas paginas publicas;
- estilos especificos preservados em `assets/css/pages/`.

A pasta `_legado/` nao foi alterada porque e uma area antiga excluida pelo `robots.txt` e nao faz parte da navegacao publica atual.

## 13. Menu legado e menu compartilhado

O menu compartilhado e montado em `assets/js/site-nav.js`.

Foi adicionada a remocao do menu antigo durante a montagem:

```javascript
document.querySelectorAll('body > nav:not(.sn-bottom)').forEach(function (legacyNav) {
  legacyNav.remove();
});
```

Motivo:

- as paginas antigas ainda tinham um `<nav>` proprio;
- o script inseria outro menu;
- o CSS escondia o primeiro;
- remover o legado evita duas estruturas de navegacao no DOM.

## 14. Validacao final executada

### Validacao do site

```bash
python3 scripts/validate-site.py
```

Resultado:

```text
Validated 17 HTML pages: OK
```

### Validacao de CSS referenciado

Foi usado Python para confirmar que cada `href="...css"` apontava para um arquivo existente.

Resultado:

```text
Todas as folhas CSS referenciadas existem
```

### Validacao de JavaScript

```bash
for file in $(find . -maxdepth 1 -name '*.html' -print); do
  awk 'BEGIN{inside=0} /<script>/{inside=1; next} /<\/script>/{inside=0} inside{print}' "$file" \
    | node --check >/dev/null || exit 1
done
```

Resultado:

```text
JavaScript inline: OK
```

### Validacao do diff

```bash
git diff --check
```

Esse comando passou sem erros.

## 15. Commits e publicacao

Commits relevantes vistos no historico:

```text
ce93e1c Ajusta slogan da página inicial
895f695 Expande catalogo de minijogos
91e7587 Centraliza estilos e otimiza paginas
```

O push final foi executado com:

```bash
git add 404.html artigo-aws-cloud.html artigo-hardening-linux.html \
  artigo-k3s-homelab.html artigo-observabilidade-docker.html \
  artigo-opentelemetry.html artigo-proxmox-homelab.html \
  artigo-ubuntu-server.html assets/js/site-nav.js blog.html \
  como-contratar.html contato.html homelab.html index.html jogos.html \
  produtividade.html servicos.html sobre.html assets/css/pages \
  assets/img/homelab scripts

git commit -m "Centraliza estilos e otimiza paginas"
git push origin main
```

Estado final confirmado:

```text
91e7587 (HEAD -> main, origin/main, origin/HEAD) Centraliza estilos e otimiza paginas
```

Isso significa que a copia local e o remoto estao no mesmo commit.

## 16. Como repetir este fluxo em outro projeto

Use esta sequencia como checklist:

```bash
git status --short
git branch --show-current
git remote -v
find . -maxdepth 2 -type f | sort
python3 scripts/validate-site.py
git diff --check
git add <arquivos>
git commit -m "mensagem curta e objetiva"
git push origin main
git status --short
git log -1 --oneline
```

Regra pratica:

- investigar antes de editar;
- alterar pouco por vez;
- validar logo depois da alteracao;
- nunca apagar mudancas de outra pessoa sem confirmar;
- revisar `git status` antes do commit;
- conferir o commit remoto depois do push.

## 17. O que estudar a partir deste documento

Para aprofundar o aprendizado, estude nesta ordem:

1. seletores CSS, cascade e classes;
2. estrutura semantica HTML com `title`, `description` e `h1`;
3. `localStorage`, eventos de teclado e eventos de toque em JavaScript;
4. expressoes regulares para localizar markup;
5. scripts Python para automatizar manutencao;
6. `git add`, `git commit`, `git log`, `git diff` e `git push`;
7. funcionamento do GitHub Pages e DNS/CNAME;
8. performance web: tamanho do HTML, imagens externas, lazy loading e cache.
