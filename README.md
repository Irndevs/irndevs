# Portfolio Desenvolvedor Full Stack

Um portfolio moderno e interativo desenvolvido com HTML, CSS e JavaScript vanilla, apresentando projetos, habilidades e experiências de um desenvolvedor full stack.

## 🚀 Demonstração

- **Site Principal**: [Ver site online](https://irndevs.com/)
- **Repositório**: [GitHub Repository](#)

## ✨ Características Principais

### 🎨 Design Moderno
- Interface elegante com gradientes e animações suaves
- Design responsivo que funciona em todos os dispositivos
- Tema escuro/claro com toggle interativo
- Efeitos visuais avançados (cursor trail, animações 3D)

### 📱 Páginas Implementadas
- **Página Principal**: Hero section, estatísticas, projetos em destaque
- **Sobre Mim**: Biografia, timeline de carreira, certificações
- **Projetos**: Galeria de projetos com páginas detalhadas
- **Blog**: Sistema de artigos com busca e filtros
- **Contato**: Formulário funcional com validação

### ⚡ Funcionalidades Avançadas
- Navegação suave entre seções
- Menu mobile responsivo
- Sistema de busca no blog
- Formulários com validação em tempo real
- Animações on-scroll
- Efeitos 3D nos cards
- Lightbox para galeria de imagens

### 🛠️ Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Estilização**: CSS Grid, Flexbox, Custom Properties
- **Animações**: CSS Animations, Intersection Observer API
- **Responsividade**: Mobile-first approach
- **Performance**: Lazy loading, debounced events

## 📁 Estrutura do Projeto

```
irndevs/
├── index.html                  # Página principal
├── servicos.html               # Serviços e soluções
├── pacotes.html                # Pacotes de contratação
├── contato.html                # Formulário de contato
├── blog.html                   # Índice do blog
├── artigo-*.html               # Artigos individuais
├── cursos.html                 # Índice dos cursos
├── curso-python-modulo-*.html  # Módulos do curso
├── assets/css/                 # Estilos compartilhados e por página
├── assets/js/                  # Navegação, autenticação e interações
├── assets/img/                 # Logos, diagramas e imagens
├── supabase/schema.sql         # Estrutura e políticas do banco
├── scripts/validate-site.py    # Validação de HTML, links e metadados
└── README.md                   # Documentação
```

## 🎯 Melhorias Implementadas

### Comparado ao Portfolio Original

#### ✅ Navegação Melhorada
- Menu mobile funcional com animações
- Breadcrumbs para navegação contextual
- Links ativos baseados na seção atual
- Smooth scrolling entre seções

#### ✅ SEO e Acessibilidade
- Meta tags otimizadas para SEO
- Estrutura semântica HTML5
- Atributos ARIA para acessibilidade
- Suporte a navegação por teclado
- Foco visível em elementos interativos

#### ✅ Performance
- Lazy loading de imagens
- Debounced scroll events
- Intersection Observer para animações
- CSS otimizado com variáveis
- JavaScript modular e eficiente

#### ✅ Funcionalidades Interativas
- Formulário de contato com validação
- Sistema de busca no blog
- Filtros dinâmicos por categoria
- Lightbox para galeria de imagens
- Notificações de feedback

#### ✅ Design Responsivo
- Breakpoints otimizados
- Layout adaptativo para mobile
- Tipografia responsiva
- Imagens flexíveis

## 🚀 Como Executar

### Opção 1: Servidor Local Simples
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd portfolio-melhorado

# Inicie um servidor local (Python)
python -m http.server 8000

# Ou com Node.js
npx serve .

# Acesse http://localhost:8000
```

### Opção 2: Live Server (VS Code)
1. Instale a extensão "Live Server" no VS Code
2. Abra o projeto no VS Code
3. Clique com botão direito em `index.html`
4. Selecione "Open with Live Server"

### Opção 3: Deploy Direto
O projeto pode ser hospedado diretamente em:
- **Netlify**: Drag & drop da pasta
- **Vercel**: Conectar repositório GitHub
- **GitHub Pages**: Ativar nas configurações do repo

## 📋 Funcionalidades Detalhadas

### Página Principal (index.html)
- Hero section com typing effect
- Estatísticas animadas com counters
- Grid de projetos com hover effects
- Seção de habilidades com progress bars
- Call-to-action para contato

### Página Sobre (sobre/index.html)
- Timeline interativa de carreira
- Seção de habilidades detalhadas
- Certificações e conquistas
- Interesses pessoais
- Stats pessoais animados

### Blog (blog/index.html)
- Sistema de busca em tempo real
- Filtros por categoria
- Post em destaque
- Paginação funcional
- Newsletter signup
- FAQ interativo

### Contato (contato/index.html)
- Formulário com validação completa
- Informações de contato
- Status de disponibilidade
- Links para redes sociais
- FAQ sobre serviços
- Tempo de resposta estimado

### Projetos Detalhados
- Galeria de screenshots
- Detalhes técnicos completos
- Desafios e soluções
- Links para demo e código
- Navegação entre projetos

## 🎨 Personalização

### Cores e Tema
As cores principais são definidas em CSS custom properties:

```css
:root {
    --primary: #6366f1;      /* Azul principal */
    --secondary: #8b5cf6;    /* Roxo secundário */
    --accent: #ec4899;       /* Rosa accent */
    --dark: #0f172a;         /* Fundo escuro */
    --light: #f8fafc;        /* Texto claro */
}
```

### Fontes
- **Fonte Principal**: Inter (Google Fonts)
- **Fallbacks**: System fonts (-apple-system, BlinkMacSystemFont)

### Animações
Todas as animações respeitam `prefers-reduced-motion` para acessibilidade.

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Estratégia Mobile-First
Todo o CSS foi desenvolvido com abordagem mobile-first, garantindo performance otimizada em dispositivos móveis.

## 🔧 Manutenção

### Adicionando Novos Projetos
1. Crie uma nova pasta em `projetos/[nome-projeto]/`
2. Copie a estrutura de `projetos/ecommerce/index.html`
3. Atualize o conteúdo e metadados
4. Adicione o card na página principal

### Adicionando Posts no Blog
1. Adicione um novo `article.blog-card` em `blog/index.html`
2. Configure o `data-category` para filtros
3. Atualize meta informações (data, categoria, tags)

### Atualizando Informações Pessoais
- **Contato**: Edite `contato/index.html`
- **Sobre**: Edite `sobre/index.html`
- **Links Sociais**: Atualize em todos os footers

## 🚀 Deploy

### Netlify
1. Conecte seu repositório GitHub
2. Configure build settings:
   - Build command: (deixe vazio)
   - Publish directory: `/`
3. Deploy automático a cada push

### Vercel
1. Importe o projeto do GitHub
2. Configure como site estático
3. Deploy automático configurado

### GitHub Pages
1. Vá em Settings > Pages
2. Selecione source: Deploy from branch
3. Branch: main, folder: / (root)

## 📊 Performance

### Métricas Alvo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Otimizações Implementadas
- CSS minificado e otimizado
- JavaScript modular e eficiente
- Imagens otimizadas (WebP quando possível)
- Lazy loading de conteúdo
- Preload de recursos críticos

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

- **Email**: contato@irndevs.com
- **LinkedIn**: configure o link real antes de publicar
- **GitHub**: https://github.com/iri-afk
- **Portfolio**: https://irndevs.com/

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!

## 🔄 Changelog

### v2.0.0 (Atual)
- ✅ Navegação mobile implementada
- ✅ Páginas secundárias criadas
- ✅ Sistema de blog adicionado
- ✅ Formulários funcionais
- ✅ SEO e acessibilidade melhorados
- ✅ Performance otimizada

### v1.0.0 (Original)
- ✅ Landing page básica
- ✅ Design responsivo inicial
- ✅ Animações CSS
- ✅ Seções principais
