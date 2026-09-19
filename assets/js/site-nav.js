/**
 * IRN Devs — navegação
 * - Site público: topo enxuto + drawer por categorias
 * - Área logada (conta, pedidos…): só top bar mínima (shell próprio no CSS)
 */
(function () {
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* Páginas em /en/ usam a mesma engine, mas com textos em inglês e destinos absolutos.
     O nav é injetado por JS: um href relativo como "servicos.html" viraria /en/servicos.html (404). */
  var IS_EN = /^\/en(\/|$)/.test(location.pathname);

  function abs(u) {
    return (!u || /^([a-z][a-z0-9+.-]*:|\/|#|\?)/i.test(u)) ? u : '/' + u;
  }
  /* Só reescreve em /en/ — nas páginas PT o caminho relativo já funciona e o auth.js
     localiza links do drawer por href relativo. */
  function P(u) { return IS_EN ? abs(u) : u; }

  /* Equivalência PT ↔ EN (chave = nome do arquivo atual) */
  var PT_TO_EN = {
    'index.html': '/en/', 'servicos.html': '/en/services.html', 'sobre.html': '/en/about.html',
    'contato.html': '/en/contact.html', 'cursos.html': '/en/courses.html',
    'diagnostico.html': '/en/diagnostic.html', 'pacotes.html': '/en/packages.html',
    'como-contratar.html': '/en/how-to-hire.html'
  };
  var EN_TO_PT = {
    'index.html': '/', 'services.html': '/servicos.html', 'about.html': '/sobre.html',
    'contact.html': '/contato.html', 'courses.html': '/cursos.html',
    'diagnostic.html': '/diagnostico.html', 'packages.html': '/pacotes.html',
    'how-to-hire.html': '/como-contratar.html'
  };

  /* Textos da interface (PT = valores originais, sem mudança de comportamento) */
  var T = IS_EN ? {
    menuOpen: 'Open navigation menu', menuClose: 'Close navigation menu', nav: 'Main',
    searchOpen: 'Open search', searchTitle: 'Search', signinTitle: 'Sign in / sign up',
    signinAria: 'Sign in or create account', signup: 'sign up', cta: 'contact', ctaHref: '/en/contact.html',
    searchPanel: 'Site search', placeholder: 'search: services, courses, k3s, blog...',
    searchAria: 'Search the site', searchClose: 'Close search', results: 'Results',
    drawer: 'Navigation menu', close: 'Close', shortcuts: 'Shortcuts',
    noHits: 'No direct match — see the blog (PT)', socialOpen: 'Open social links', social: 'social',
    soc: function (n) { return 'IRN Devs on ' + n; }
  } : {
    menuOpen: 'Abrir menu de navegação', menuClose: 'Fechar menu de navegação', nav: 'Principal',
    searchOpen: 'Abrir busca', searchTitle: 'Buscar', signinTitle: 'Entrar / cadastro',
    signinAria: 'Entrar ou criar conta', signup: 'cadastro', cta: 'contato', ctaHref: 'contato.html',
    searchPanel: 'Busca no site', placeholder: 'buscar: k3s, grafana, projetos, blog...',
    searchAria: 'Buscar no site', searchClose: 'Fechar busca', results: 'Resultados',
    drawer: 'Menu de navegação', close: 'Fechar', shortcuts: 'Atalhos',
    noHits: 'Nada direto — ver blog', socialOpen: 'Abrir redes sociais', social: 'redes',
    soc: function (n) { return n + ' da IRN Devs'; }
  };

  var INTERNAL = {
    'conta.html': 1,
    'area-cliente.html': 1,
    'pedidos.html': 1,
    'orcamentos.html': 1,
    'login.html': 1,
    'cadastro.html': 1
  };
  var isInternal = !!INTERNAL[path];

  function isActive(href) {
    var h = (href.split('/').pop() || '').split('#')[0].toLowerCase();
    if (!h || h === '#') return false;
    if (path === h) return true;
    if ((path === '' || path === 'index.html') && h === 'index.html') return true;
    if (path.indexOf('artigo-') === 0 && h === 'blog.html') return true;
    // páginas de módulo/certificado marcam o item "cursos" (e a página listagem) como ativo
    if ((path.indexOf('curso-') === 0 || path.indexOf('certificado-') === 0) && h === 'cursos.html') return true;
    return false;
  }

  function cls(href) {
    return isActive(href) ? ' active' : '';
  }

  /* Categorias de ferramentas — fonte única, usada tanto no mega-dropdown
     desktop (flyout lateral) quanto no accordion retrátil do drawer mobile. */
  var toolCategories = [
        { cat: 'finanças & trabalho', ico: '₽', items: [
          { href: 'ferramenta-salario-liquido.html', label: 'Salário Líquido', ico: '₽' },
          { href: 'ferramenta-clt-pj.html', label: 'CLT vs PJ', ico: '⚖' },
          { href: 'ferramenta-rescisao.html', label: 'Rescisão', ico: '📋' },
          { href: 'ferramenta-13-ferias.html', label: '13º e Férias', ico: '📅' },
          { href: 'ferramenta-horas-extras.html', label: 'Horas Extras', ico: '⏱' },
          { href: 'ferramenta-porcentagem.html', label: 'Porcentagem', ico: '%' },
          { href: 'ferramenta-juros-compostos.html', label: 'Juros Compostos', ico: '%' },
          { href: 'ferramenta-desconto-margem.html', label: 'Desconto e Margem', ico: '🏷' },
          { href: 'ferramenta-financiamento.html', label: 'Financiamento Imobiliário', ico: '🏠' },
          { href: 'ferramenta-investimento.html', label: 'Simulador de Investimento', ico: '📈' },
          { href: 'ferramenta-moeda.html', label: 'Conversor de Moedas', ico: '💱' },
          { href: 'ferramenta-combustivel.html', label: 'Combustível', ico: '⛽' }
        ] },
        { cat: 'saúde & fitness', ico: '♥', items: [
          { href: 'ferramenta-tmb-calorias.html', label: 'TMB e Calorias', ico: '🔥' },
          { href: 'ferramenta-biometria-saude.html', label: 'Biometria & IMC', ico: '♥' },
          { href: 'ferramenta-macros.html', label: 'Macros', ico: '🍎' },
          { href: 'ferramenta-periodo-fertil.html', label: 'Período Fértil', ico: '🌱' },
          { href: 'ferramenta-esportivas.html', label: 'Calculadoras Esportivas', ico: '🏃' },
          { href: 'ferramenta-consumo-agua.html', label: 'Consumo de Água', ico: '💧' }
        ] },
        { cat: 'esporte & apostas', ico: '⚽', items: [
          { href: 'ferramenta-pelada.html', label: 'Sorteador de Equipes', ico: '⚽' },
          { href: 'ferramenta-odds.html', label: 'Odds / Apostas', ico: '∑' },
          { href: 'ferramenta-surebet.html', label: 'Surebet', ico: '⇄' },
          { href: 'ferramenta-mata-mata.html', label: 'Mata-Mata', ico: '🏆' },
          { href: 'ferramenta-tabela-pontos.html', label: 'Tabela de Pontos', ico: '📊' }
        ] },
        { cat: 'produtividade & estudos', ico: '📚', items: [
          { href: 'ferramenta-pomodoro.html', label: 'Pomodoro', ico: '⏱' },
          { href: 'ferramenta-plano-aula.html', label: 'Plano de Aula', ico: '📚' },
          { href: 'ferramenta-cronograma-estudos.html', label: 'Cronograma de Estudos', ico: '🗓' },
          { href: 'ferramenta-media-escolar.html', label: 'Média Escolar', ico: '🎓' },
          { href: 'ferramenta-abnt.html', label: 'Referências ABNT', ico: '📖' },
          { href: 'ferramenta-datas.html', label: 'Datas / Dias Úteis', ico: '📅' },
          { href: 'ferramenta-idade.html', label: 'Idade e Tempo de Vida', ico: '🎂' },
          { href: 'ferramenta-planilha.html', label: 'Gerador de Planilhas', ico: '▦' },
          { href: 'ferramenta-checklist.html', label: 'Checklist grátis', ico: '✓' }
        ] },
        { cat: 'social & marketing', ico: '#', items: [
          { href: 'ferramenta-hashtags.html', label: 'Hashtags', ico: '#' },
          { href: 'ferramenta-engajamento.html', label: 'Engajamento', ico: '%' },
          { href: 'ferramenta-thread.html', label: 'Divisor de Threads', ico: '✂' },
          { href: 'ferramenta-fontes.html', label: 'Gerador de Fontes', ico: '𝒜' },
          { href: 'ferramenta-link-whatsapp.html', label: 'Link WhatsApp', ico: '💬' },
          { href: 'ferramenta-utm.html', label: 'Links UTM', ico: '🔗' },
          { href: 'ferramenta-nome-empresa.html', label: 'Nomes de Empresas', ico: '🏢' },
          { href: 'ferramenta-sorteio.html', label: 'Sorteador de Nomes', ico: '🎲' }
        ] },
        { cat: 'conversores & utilitários', ico: '🔧', items: [
          { href: 'ferramenta-webp.html', label: 'WEBP → JPG', ico: '🖼' },
          { href: 'ferramenta-youtube-thumb.html', label: 'Thumb YouTube', ico: '▶' },
          { href: 'ferramenta-rachar-conta.html', label: 'Rachar Conta', ico: '🍽' },
          { href: 'ferramenta-base64.html', label: 'Base64 / URL Encode', ico: '⌘' },
          { href: 'ferramenta-caracteres.html', label: 'Contador de Caracteres', ico: '🔤' },
          { href: 'ferramenta-conversor-texto.html', label: 'Conversor de Texto', ico: '🔡' },
          { href: 'ferramenta-temperatura.html', label: 'Conversor de Temperatura', ico: '🌡' },
          { href: 'ferramenta-sensibilidade.html', label: 'Sensibilidade de Mouse', ico: '🎮' },
          { href: 'ferramenta-uuid.html', label: 'Gerador de UUID', ico: '🔑' }
        ] },
        { cat: 'dev & IA', ico: '✦', items: [
          { href: 'ferramenta-json.html', label: 'Validador JSON', ico: '{ }' },
          { href: 'ferramenta-prompt.html', label: 'Melhorador de Prompt', ico: '🤖' },
          { href: 'ia.html', label: 'Hub de IA', ico: '✦' }
        ] }
  ];

  /* Categorias de cursos — mesma engine do mega-dropdown de ferramentas
     (flyout lateral no desktop + accordion no drawer mobile). */
  var courseCategories = [
    { cat: 'iniciantes', ico: '★', items: [
      { href: 'curso-git-modulo-1.html', label: 'Git e GitHub do zero', ico: '⎇' },
      { href: 'curso-html-css-modulo-1.html', label: 'HTML e CSS', ico: '<>' },
      { href: 'curso-sql-modulo-1.html', label: 'SQL na prática', ico: '▦' },
      { href: 'curso-js-modulo-1.html', label: 'JavaScript iniciantes', ico: 'JS' },
      { href: 'curso-seguranca-modulo-1.html', label: 'Segurança digital', ico: '🔒' }
    ] },
    { cat: 'programação', ico: '🐍', items: [
      { href: 'curso-python-modulo-1.html', label: 'Automações em Python', ico: '🐍' }
    ] },
    { cat: 'linux & terminal', ico: '⌘', items: [
      { href: 'curso-cmd-modulo-1.html', label: 'Comandos Linux e Windows', ico: '⌘' },
      { href: 'curso-linux-modulo-1.html', label: 'Linux e Servidores', ico: '🐧' }
    ] },
    { cat: 'containers & devops', ico: '🐳', items: [
      { href: 'curso-docker-modulo-1.html', label: 'Docker em Produção', ico: '🐳' }
    ] }
  ];

  var topLinks = [
    { href: '/#projetos', label: 'projetos', ico: '▸' },
    { href: 'servicos.html', label: 'serviços', ico: '⚙' },
    { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
    {
      href: 'ferramentas.html',
      label: 'ferramentas',
      ico: '▣',
      extraClass: 'sn-top-tools',
      dropdown: true,
      children: [{ href: 'ferramentas.html', label: 'Todas as ferramentas', ico: '▣' }].concat(toolCategories)
    },
    {
      href: 'cursos.html',
      label: 'cursos',
      ico: '◈',
      extraClass: 'sn-top-cursos',
      dropdown: true,
      children: [{ href: 'cursos.html', label: 'Todos os cursos', ico: '◈' }].concat(courseCategories)
    },
    { href: 'ia.html', label: 'IA', ico: '✦', extraClass: 'sn-top-ia' }
  ];

  var drawerGroups = [
    {
      label: 'para o negócio',
      items: [
        { href: '/', label: 'início', ico: '⌂' },
        { href: 'diagnostico.html', label: 'diagnóstico grátis', ico: '⚡' },
        { href: 'servicos.html', label: 'serviços', ico: '⚙' },
        { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
        { href: 'como-contratar.html', label: 'como contratar', ico: '→' },
        { href: 'contato.html', label: 'contato', ico: '@' }
      ]
    },
    {
      label: 'para o time técnico',
      items: [
        { href: '/#projetos', label: 'projetos', ico: '▸' },
        { href: 'homelab.html', label: 'homelab', ico: '▣' },
        { href: 'blog.html', label: 'blog', ico: '≡' },
        { href: 'kubernetes.html', label: 'kubernetes / k3s', ico: '☸' },
        { href: 'observabilidade.html', label: 'observabilidade', ico: '◉' },
        { href: 'sobre.html', label: 'sobre', ico: 'i' }
      ]
    },
    {
      label: 'ferramentas',
      accordion: true,
      lead: { href: 'ferramentas.html', label: 'todas as ferramentas', ico: '▣' },
      cats: toolCategories
    },
    {
      label: 'cursos',
      accordion: true,
      lead: { href: 'cursos.html', label: 'todos os cursos', ico: '◈' },
      cats: courseCategories
    },
    {
      label: 'conta',
      items: [
        { href: 'login.html', label: 'entrar', ico: '⚿', auth: 'guest' },
        { href: 'cadastro.html', label: 'cadastro', ico: '+', auth: 'guest' },
        { href: 'conta.html', label: 'minha conta', ico: '●', auth: 'user' },
        { href: 'area-cliente.html', label: 'área do cliente', ico: '◆', auth: 'user' }
      ]
    },
    {
      label: 'contato',
      items: [
        { href: 'contato.html', label: 'contato', ico: '@' },
        { href: 'privacidade.html', label: 'privacidade', ico: '§' }
      ]
    }
  ];

  var bottomItems = [
    { href: '/', label: 'início', ico: '⌂' },
    { href: 'ferramentas.html', label: 'tools', ico: '▣' },
    { href: 'cursos.html', label: 'cursos', ico: '◈' },
    { href: 'ia.html', label: 'IA', ico: '✦' },
    { href: 'contato.html', label: 'contato', ico: '@' }
  ];

  if (IS_EN) {
    /* Menu em inglês: destinos EN quando existem; conteúdo só em PT é indicado como (PT). */
    var enTwin = EN_TO_PT[path] || '/';
    topLinks = [
      { href: '/en/services.html', label: 'services', ico: '⚙' },
      { href: '/en/packages.html', label: 'packages', ico: '▣' },
      { href: '/en/how-to-hire.html', label: 'how to hire', ico: '→' },
      { href: '/en/courses.html', label: 'courses', ico: '◈' },
      { href: '/en/about.html', label: 'about', ico: 'i' },
      { href: enTwin, label: 'PT', ico: '⇄', extraClass: 'sn-top-lang' }
    ];
    drawerGroups = [
      {
        label: 'for business',
        items: [
          { href: '/en/', label: 'home', ico: '⌂' },
          { href: '/en/diagnostic.html', label: 'free diagnostic', ico: '⚡' },
          { href: '/en/services.html', label: 'services', ico: '⚙' },
          { href: '/en/packages.html', label: 'packages', ico: '▣' },
          { href: '/en/how-to-hire.html', label: 'how to hire', ico: '→' },
          { href: '/en/contact.html', label: 'contact', ico: '@' }
        ]
      },
      {
        label: 'about us',
        items: [
          { href: '/en/about.html', label: 'about', ico: 'i' },
          { href: '/#projetos', label: 'projects (PT)', ico: '▸' }
        ]
      },
      {
        label: 'learn · in Portuguese',
        items: [
          { href: '/en/courses.html', label: 'courses overview', ico: '◈' },
          { href: '/cursos.html', label: 'all courses (PT)', ico: '◈' },
          { href: '/ferramentas.html', label: 'free tools (PT)', ico: '▣' },
          { href: '/blog.html', label: 'blog (PT)', ico: '≡' }
        ]
      },
      {
        label: 'language',
        items: [{ href: enTwin, label: 'português', ico: 'PT' }]
      }
    ];
    bottomItems = [
      { href: '/en/', label: 'home', ico: '⌂' },
      { href: '/en/services.html', label: 'services', ico: '⚙' },
      { href: '/en/courses.html', label: 'courses', ico: '◈' },
      { href: '/en/about.html', label: 'about', ico: 'i' },
      { href: '/en/contact.html', label: 'contact', ico: '@' }
    ];
  } else if (PT_TO_EN[path]) {
    drawerGroups.push({
      label: 'idioma',
      items: [{ href: PT_TO_EN[path], label: 'english version', ico: 'EN' }]
    });
  }

  function linkHtml(l) {
    var extra = (cls(l.href).trim() + (l.extraClass ? ' ' + l.extraClass : '')).trim();
    var style = '';
    // Por padrão esconde itens só-logado (paintNavAuth mostra se houver sessão)
    if (l.auth === 'user') style = ' style="display:none"';
    return '<a href="' + l.href + '" class="' + extra + '"' + style + '><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
  }

  function topItemHtml(l) {
    if (!l.dropdown || !l.children || !l.children.length) {
      return linkHtml(l);
    }
    var extra = (cls(l.href).trim() + (l.extraClass ? ' ' + l.extraClass : '')).trim();
    // marcar ativo se a página atual for ferramentas ou qualquer filho (direto ou dentro de categoria)
    var isDropActive = cls(l.href) || l.children.some(function (c) {
      if (c.href) return !!cls(c.href);
      if (c.items) return c.items.some(function (it) { return cls(it.href); });
      return false;
    });
    if (isDropActive && extra.indexOf('active') === -1) extra = (extra + ' active').trim();

    var childrenHtml = l.children.map(function (c) {
      if (c.cat) {
        var catActive = c.items.some(function (it) { return cls(it.href); });
        var subItemsHtml = c.items.map(function (it) {
          return '<a href="' + it.href + '" class="sn-dd-item' + cls(it.href) + '" role="menuitem">' +
            '<span class="ico">' + (it.ico || '·') + '</span><span class="label">' + it.label + '</span></a>';
        }).join('');
        return '<div class="sn-dd-cat' + (catActive ? ' has-active' : '') + '" data-dd-cat>' +
          '<button type="button" class="sn-dd-cat-trigger' + (catActive ? ' active' : '') + '" aria-haspopup="true" aria-expanded="false" data-dd-cat-trigger>' +
          '<span class="ico">' + c.ico + '</span><span class="label">' + c.cat + '</span>' +
          '<span class="sn-dd-cat-arrow" aria-hidden="true">›</span></button>' +
          '<div class="sn-dd-flyout" role="menu" data-dd-flyout>' + subItemsHtml + '</div>' +
          '</div>';
      }
      if (c.head) {
        return '<div class="sn-dd-head sn-dd-head--cat" role="presentation">' + c.head + '</div>';
      }
      return '<a href="' + c.href + '" class="sn-dd-item' + cls(c.href) + '" role="menuitem">' +
        '<span class="ico">' + (c.ico || '·') + '</span><span class="label">' + c.label + '</span></a>';
    }).join('');

    return '<div class="sn-dropdown' + (isDropActive ? ' is-active' : '') + '" data-dropdown>' +
      '<a href="' + l.href + '" class="sn-dd-trigger ' + extra + '" aria-haspopup="true" aria-expanded="false" data-dd-trigger>' +
      '<span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span>' +
      '<span class="sn-dd-caret" aria-hidden="true">▾</span></a>' +
      '<div class="sn-dd-panel" role="menu" hidden data-dd-panel>' +
      childrenHtml +
      '</div></div>';
  }

  /* Grupo comum do drawer: lista simples de links */
  function drawerGroupHtml(g) {
    if (g.accordion) {
      var leadHtml = g.lead ? linkHtml(g.lead) : '';
      var catsHtml = g.cats.map(function (c) {
        var catActive = c.items.some(function (it) { return cls(it.href); });
        var itemsHtml = c.items.map(function (it) {
          return '<a href="' + it.href + '" class="sn-drawer-cat-item' + cls(it.href) + '">' +
            '<span class="ico">' + (it.ico || '·') + '</span><span class="label">' + it.label + '</span></a>';
        }).join('');
        return '<div class="sn-drawer-cat' + (catActive ? ' has-active' : '') + '" data-drawer-cat>' +
          '<button type="button" class="sn-drawer-cat-trigger' + (catActive ? ' active' : '') + '" aria-expanded="' + (catActive ? 'true' : 'false') + '" data-drawer-cat-trigger>' +
          '<span class="ico">' + c.ico + '</span><span class="label">' + c.cat + '</span>' +
          '<span class="sn-drawer-cat-arrow" aria-hidden="true">›</span></button>' +
          '<div class="sn-drawer-cat-panel"' + (catActive ? '' : ' hidden') + ' data-drawer-cat-panel>' +
          '<div class="sn-drawer-cat-panel-inner">' + itemsHtml + '</div></div></div>';
      }).join('');
      return '<div class="sn-group"><div class="sn-group-label">' + g.label + '</div>' +
        leadHtml + '<div class="sn-drawer-cats">' + catsHtml + '</div></div>';
    }
    return '<div class="sn-group"><div class="sn-group-label">' + g.label + '</div>' +
      g.items.map(linkHtml).join('') + '</div>';
  }

  function mount() {
    document.querySelectorAll('body > nav:not(.sn-bottom)').forEach(function (legacyNav) {
      legacyNav.remove();
    });
    document.body.classList.add('has-site-nav');
    if (isInternal) document.body.classList.add('dash-app');

    var topLinksHtml = topLinks.map(topItemHtml).join('');
    var drawerHtml = drawerGroups.map(drawerGroupHtml).join('');
    var bottomHtml = bottomItems.map(linkHtml).join('');

    /* Avatar de login: círculo com ícone de usuário (estado deslogado por padrão).
       paintNavAuth() em auth.js troca para avatar com inicial quando logado. */
    var authSlot = isInternal
      ? '<div class="sn-auth-slot dash-topbar-user" data-auth-slot><a href="/" class="sn-back-site">← site</a></div>'
      : '<div class="sn-auth-slot" data-auth-slot>' +
        '<a class="sn-avatar sn-avatar--guest" href="login.html" title="' + T.signinTitle + '" aria-label="' + T.signinAria + '">' +
        '<svg class="sn-avatar-ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M5 19.5c0-3.5 3.1-6 7-6s7 2.5 7 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
        '</svg></a>' +
        '<a class="sn-auth-signup" href="cadastro.html">' + T.signup + '</a>' +
        '</div>';

    var root = document.createElement('div');
    root.id = 'siteNavRoot';
    root.innerHTML =
      '<header class="sn-top" role="banner">' +
      (isInternal ? '' : '<button type="button" class="sn-burger" id="snBurger" aria-label="' + T.menuOpen + '" aria-expanded="false" aria-controls="snDrawer">☰</button>') +
      '<a href="/" class="sn-logo" aria-label="IRN Devs">' +
      '<img src="assets/img/logo-irndevs.svg" alt="~/irndevs $" width="160" height="32" loading="eager" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\'">' +
      '<span class="sn-logo-text" style="display:none">~/irndevs <span>$</span></span>' +
      '</a>' +
      (isInternal
        ? authSlot
        : '<nav class="sn-top-links" aria-label="' + T.nav + '">' + topLinksHtml + '</nav>' +
          '<button type="button" class="sn-search-btn" id="snSearchBtn" aria-label="' + T.searchOpen + '" aria-expanded="false" aria-controls="snSearchPanel" title="' + T.searchTitle + '">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
          '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
          '<path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg></button>' +
          authSlot +
          '<a href="' + T.ctaHref + '" class="sn-top-cta">' + T.cta + '</a>') +
      '</header>' +
      (isInternal ? '' :
        '<div class="sn-search-panel" id="snSearchPanel" hidden role="search" aria-label="' + T.searchPanel + '">' +
        '<div class="sn-search-inner">' +
        '<span class="sn-search-prompt" aria-hidden="true">$</span>' +
        '<input type="search" id="snSearchInput" class="sn-search-input" placeholder="' + T.placeholder + '" autocomplete="off" enterkeyhint="search" aria-label="' + T.searchAria + '">' +
        '<button type="button" class="sn-search-close" id="snSearchClose" aria-label="' + T.searchClose + '">✕</button>' +
        '</div>' +
        '<div id="snSearchResults" class="sn-search-results" hidden role="listbox" aria-label="' + T.results + '"></div>' +
        '</div>' +
        '<div class="sn-overlay" id="snOverlay" hidden></div>' +
        '<aside class="sn-drawer" id="snDrawer" role="dialog" aria-modal="true" aria-label="' + T.drawer + '" aria-hidden="true">' +
        '<div class="sn-drawer-head">' +
        '<a href="/" class="brand"><span class="brand-full">~/irndevs <span>$</span></span><span class="brand-mini">$</span></a>' +
        '<button type="button" class="sn-close" id="snClose" aria-label="' + T.close + '">✕</button>' +
        '</div>' +
        '<nav class="sn-drawer-links">' + drawerHtml + '</nav>' +
        '</aside>' +
        '<nav class="sn-bottom" aria-label="' + T.shortcuts + '">' + bottomHtml + '</nav>');

    document.body.insertBefore(root, document.body.firstChild);

    if (IS_EN) {
      root.querySelectorAll('a[href]').forEach(function (a) {
        var h = a.getAttribute('href');
        if (h && abs(h) !== h) a.setAttribute('href', abs(h));
      });
      root.querySelectorAll('img[src]').forEach(function (im) {
        var v = im.getAttribute('src');
        if (v && abs(v) !== v) im.setAttribute('src', abs(v));
      });
      root.querySelectorAll('a.sn-logo, a.brand').forEach(function (a) { a.setAttribute('href', '/en/'); });
    }

    if (isInternal) return;

    var drawer = document.getElementById('snDrawer');
    var overlay = document.getElementById('snOverlay');
    var burger = document.getElementById('snBurger');
    var closeBtn = document.getElementById('snClose');

    var lastFocus = null;

    function getFocusable(container) {
      if (!container) return [];
      return Array.prototype.slice.call(
        container.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(function (el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
    }

    function openMenu() {
      if (!drawer) return;
      lastFocus = document.activeElement;
      drawer.classList.add('open');
      if (overlay) {
        overlay.classList.add('open');
        overlay.hidden = false;
      }
      drawer.setAttribute('aria-hidden', 'false');
      if (burger) {
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-pressed', 'true');
        burger.setAttribute('aria-label', T.menuClose);
      }
      document.body.style.overflow = 'hidden';
      // foca o botão fechar ou o primeiro link
      var focusables = getFocusable(drawer);
      var target = closeBtn || focusables[0];
      if (target) {
        setTimeout(function () { target.focus(); }, 50);
      }
    }
    function closeMenu() {
      if (!drawer) return;
      drawer.classList.remove('open');
      drawer.classList.remove('pinned');
      if (overlay) {
        overlay.classList.remove('open');
        overlay.hidden = true;
      }
      drawer.setAttribute('aria-hidden', 'true');
      if (burger) {
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-pressed', 'false');
        burger.setAttribute('aria-label', T.menuOpen);
      }
      document.body.style.overflow = '';
      document.body.classList.remove('nav-expanded');
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      } else if (burger) {
        burger.focus();
      }
    }
    function handleBurgerClick() {
      if (drawer && drawer.classList.contains('open')) closeMenu();
      else openMenu();
    }

    if (burger) burger.addEventListener('click', handleBurgerClick);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    /* ---- Dropdown Ferramentas (topo desktop) ---- */
    (function bindDropdowns() {
      var drops = root.querySelectorAll('[data-dropdown]');
      if (!drops.length) return;

      function closeAll(except) {
        drops.forEach(function (dd) {
          if (except && dd === except) return;
          dd.classList.remove('open');
          var t = dd.querySelector('[data-dd-trigger]');
          var p = dd.querySelector('[data-dd-panel]');
          if (t) t.setAttribute('aria-expanded', 'false');
          if (dd._closeCats) dd._closeCats();
          // delay hidden para a animação CSS de saída (~220ms)
          if (p) {
            setTimeout(function () {
              if (!dd.classList.contains('open')) p.hidden = true;
            }, 220);
          }
        });
      }

      function openDd(dd) {
        closeAll(dd);
        var t = dd.querySelector('[data-dd-trigger]');
        var p = dd.querySelector('[data-dd-panel]');
        if (p) p.hidden = false;
        // force reflow antes de adicionar .open (garante animação de entrada)
        void dd.offsetWidth;
        dd.classList.add('open');
        if (t) t.setAttribute('aria-expanded', 'true');
      }

      drops.forEach(function (dd) {
        var trigger = dd.querySelector('[data-dd-trigger]');
        var panel = dd.querySelector('[data-dd-panel]');
        if (!trigger || !panel) return;

        var closeTimer = null;
        function cancelClose() {
          if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        }
        function scheduleClose() {
          cancelClose();
          // 400ms: tempo pra atravessar o gap até o flyout de categoria (em <body>)
          closeTimer = setTimeout(function () { closeAll(); }, 400);
        }

        // Hover (desktop)
        dd.addEventListener('mouseenter', function () {
          cancelClose();
          openDd(dd);
        });
        dd.addEventListener('mouseleave', scheduleClose);
        // exposto para o bind das categorias: como o flyout de categoria é
        // movido para <body> ao abrir, ele "sai" da área de hover deste
        // dropdown — sem isso, passar o mouse nele fecharia o painel todo.
        dd._cancelClose = cancelClose;
        dd._scheduleClose = scheduleClose;

        // Click no trigger: alterna (útil em touch / teclado)
        trigger.addEventListener('click', function (e) {
          // se já está aberto e o usuário quer ir para a página, deixa seguir
          // se está fechado, abre e impede navegação imediata no primeiro toque
          if (!dd.classList.contains('open')) {
            e.preventDefault();
            openDd(dd);
          }
        });

        // Teclado
        trigger.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
            if (!dd.classList.contains('open')) {
              e.preventDefault();
              openDd(dd);
              var first = panel.querySelector('a');
              if (first) first.focus();
            }
          }
          if (e.key === 'Escape') {
            closeAll();
            trigger.focus();
          }
        });

        panel.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            closeAll();
            trigger.focus();
          }
        });
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest || !e.target.closest('[data-dropdown]')) {
          closeAll();
        }
      });
    })();

    /* ---- Categorias do dropdown (ferramentas + cursos): flyout lateral ----
       Timers compartilhados + delays longos: o flyout vive em <body>, então
       há um “buraco” entre a lista de categorias e o painel. Sem grace period
       generoso, o menu fecha/troca antes de o usuário conseguir clicar. */
    (function bindToolCategoryFlyouts() {
      var cats = root.querySelectorAll('[data-dd-cat]');
      if (!cats.length) return;

      var OPEN_DELAY = 220;   // evita troca ao raspar categoria no caminho
      var CLOSE_DELAY = 450;  // tempo de atravessar o gap até o flyout
      var openTimer = null;
      var closeTimer = null;
      var pendingCat = null;

      function cancelOpen() {
        if (openTimer) { clearTimeout(openTimer); openTimer = null; }
        pendingCat = null;
      }
      function cancelClose() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      }
      function cancelAll() { cancelOpen(); cancelClose(); }

      function closeCat(cat) {
        cat.classList.remove('is-open');
        var t = cat.querySelector('[data-dd-cat-trigger]');
        if (t) t.setAttribute('aria-expanded', 'false');
        var fly = cat.querySelector('[data-dd-flyout]') || cat._flyoutRef;
        if (fly) fly.classList.remove('is-open');
      }
      function closeAllCats() {
        cancelAll();
        cats.forEach(closeCat);
      }
      function closeSiblings(except) {
        cats.forEach(function (c) { if (c !== except) closeCat(c); });
      }

      function positionFlyout(cat, fly, t) {
        requestAnimationFrame(function () {
          if (!cat.classList.contains('is-open')) return;
          var tr = t.getBoundingClientRect();
          var flyWidth = fly.offsetWidth || 280;
          var flyHeight = fly.offsetHeight || 300;
          // gap negativo = sobreposição de 2px: o mouse não “cai no vazio”
          var gap = -2;
          var left = tr.right + gap;
          if (left + flyWidth > window.innerWidth - 8) {
            left = tr.left - flyWidth - gap;
          }
          if (left < 8) left = 8;
          var top = tr.top - 8;
          if (top + flyHeight > window.innerHeight - 8) {
            top = Math.max(8, window.innerHeight - 8 - flyHeight);
          }
          fly.style.left = left + 'px';
          fly.style.top = top + 'px';
          fly.classList.add('is-open');
        });
      }

      function openCat(cat) {
        cancelAll();
        closeSiblings(cat);
        cat.classList.add('is-open');
        var t = cat.querySelector('[data-dd-cat-trigger]');
        if (t) t.setAttribute('aria-expanded', 'true');
        var fly = cat.querySelector('[data-dd-flyout]') || cat._flyoutRef;
        if (fly && t) {
          if (fly.parentNode !== document.body) {
            cat._flyoutRef = fly;
            document.body.appendChild(fly);
          }
          positionFlyout(cat, fly, t);
        }
      }

      function scheduleOpen(cat) {
        cancelClose();
        if (cat.classList.contains('is-open')) return;
        cancelOpen();
        pendingCat = cat;
        openTimer = setTimeout(function () {
          openTimer = null;
          if (pendingCat === cat) openCat(cat);
          pendingCat = null;
        }, OPEN_DELAY);
      }

      function scheduleCloseCat(cat) {
        cancelOpen();
        cancelClose();
        closeTimer = setTimeout(function () {
          closeTimer = null;
          closeCat(cat);
        }, CLOSE_DELAY);
      }

      function holdOpen(parentDd) {
        cancelClose();
        cancelOpen();
        if (parentDd && parentDd._cancelClose) parentDd._cancelClose();
      }

      cats.forEach(function (cat) {
        var trigger = cat.querySelector('[data-dd-cat-trigger]');
        var flyout = cat.querySelector('[data-dd-flyout]');
        if (!trigger || !flyout) return;
        var parentDd = cat.closest('[data-dropdown]');

        cat.addEventListener('mouseenter', function () {
          holdOpen(parentDd);
          scheduleOpen(cat);
        });
        cat.addEventListener('mouseleave', function () {
          // não cancela open se ainda estamos no delay da MESMA cat
          if (pendingCat !== cat) cancelOpen();
          scheduleCloseCat(cat);
        });

        flyout.addEventListener('mouseenter', function () {
          holdOpen(parentDd);
          // garante que esta categoria permanece a aberta
          if (!cat.classList.contains('is-open')) openCat(cat);
        });
        flyout.addEventListener('mouseleave', function () {
          scheduleCloseCat(cat);
          if (parentDd && parentDd._scheduleClose) parentDd._scheduleClose();
        });

        // clique: abre/fecha na hora (sem delay)
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          cancelAll();
          if (cat.classList.contains('is-open')) closeCat(cat);
          else openCat(cat);
        });

        trigger.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openCat(cat);
            var first = flyout.querySelector('a');
            if (first) first.focus();
          } else if (e.key === 'Escape') {
            closeCat(cat);
          }
        });
        flyout.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft' || e.key === 'Escape') {
            closeCat(cat);
            trigger.focus();
          }
        });
      });

      root.querySelectorAll('[data-dropdown]').forEach(function (dd) {
        dd._closeCats = closeAllCats;
        // NÃO fechar categorias no mouseleave imediato do pai —
        // o scheduleClose do dropdown (400ms) + _closeCats no closeAll bastam.
      });
    })();

    /* ---- Categorias no drawer mobile: accordion retrátil (clique expande/recolhe) ---- */
    (function bindDrawerCategoryAccordion() {
      var cats = root.querySelectorAll('[data-drawer-cat]');
      if (!cats.length) return;

      function setOpen(cat, open) {
        var trigger = cat.querySelector('[data-drawer-cat-trigger]');
        var panel = cat.querySelector('[data-drawer-cat-panel]');
        if (!trigger || !panel) return;
        if (open) {
          panel.hidden = false;
          var inner = panel.querySelector('.sn-drawer-cat-panel-inner');
          // força reflow para animar de 0 até a altura real do conteúdo
          void panel.offsetHeight;
          panel.style.maxHeight = (inner ? inner.scrollHeight : panel.scrollHeight) + 'px';
          cat.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        } else {
          panel.style.maxHeight = '0px';
          cat.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          setTimeout(function () {
            if (!cat.classList.contains('is-open')) panel.hidden = true;
          }, 240);
        }
      }

      cats.forEach(function (cat) {
        var trigger = cat.querySelector('[data-drawer-cat-trigger]');
        if (!trigger) return;
        // categoria com item ativo já abre expandida
        if (cat.classList.contains('has-active')) setOpen(cat, true);

        trigger.addEventListener('click', function () {
          var isOpen = cat.classList.contains('is-open');
          setOpen(cat, !isOpen);
        });
      });
    })();

    if (drawer) {
      drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });
      // trap de foco dentro do menu aberto
      drawer.addEventListener('keydown', function (e) {
        if (e.key !== 'Tab' || !drawer.classList.contains('open')) return;
        var focusables = getFocusable(drawer);
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
        closeSearch();
      }
    });
    if (drawer) drawer.setAttribute('aria-hidden', 'true');

    /* ---- Busca no header (lupa) ---- */
    var searchBtn = document.getElementById('snSearchBtn');
    var searchPanel = document.getElementById('snSearchPanel');
    var searchInput = document.getElementById('snSearchInput');
    var searchClose = document.getElementById('snSearchClose');
    var searchResults = document.getElementById('snSearchResults');
    var searchPageIndex = null;
    var searchIndexLoading = false;
    function loadSearchIndex(cb) {
      if (searchPageIndex) { if (cb) cb(); return; }
      if (searchIndexLoading) return;
      searchIndexLoading = true;
      var s = document.createElement('script');
      s.src = P('assets/js/search-index.js');
      s.onload = function () {
        searchPageIndex = window.IRN_SEARCH_INDEX || [];
        searchIndexLoading = false;
        if (cb) cb();
      };
      document.head.appendChild(s);
    }

    function openSearch() {
      if (!searchPanel) return;
      loadSearchIndex();
      searchPanel.hidden = false;
      searchPanel.classList.add('open');
      if (searchBtn) {
        searchBtn.setAttribute('aria-expanded', 'true');
        searchBtn.classList.add('active');
      }
      document.body.classList.add('sn-search-open');
      setTimeout(function () {
        if (searchInput) searchInput.focus();
      }, 30);
    }
    function closeSearch() {
      if (!searchPanel) return;
      searchPanel.classList.remove('open');
      searchPanel.hidden = true;
      if (searchBtn) {
        searchBtn.setAttribute('aria-expanded', 'false');
        searchBtn.classList.remove('active');
      }
      document.body.classList.remove('sn-search-open');
      if (searchResults) {
        searchResults.hidden = true;
        searchResults.innerHTML = '';
      }
      if (searchInput) searchInput.value = '';
    }
    function runSearch() {
      if (!searchInput || !searchResults) return;
      var q = (searchInput.value || '').trim().toLowerCase();
      if (q.length < 2) {
        searchResults.hidden = true;
        searchResults.innerHTML = '';
        return;
      }
      if (!searchPageIndex) {
        loadSearchIndex(runSearch);
        return;
      }
      var hits = searchPageIndex.filter(function (p) {
        return p.q.indexOf(q) !== -1 || p.label.toLowerCase().indexOf(q) !== -1;
      });
      // também filtra cards na home se existirem
      if (path === 'index.html' || path === '') {
        document.querySelectorAll('.proj-card, .tool, .entrega-card, .pacote-card').forEach(function (el) {
          var text = (el.textContent || '').toLowerCase();
          el.style.display = !q || text.indexOf(q) !== -1 ? '' : 'none';
        });
      }
      if (hits.length) {
        searchResults.hidden = false;
        searchResults.innerHTML = hits.slice(0, 8).map(function (p) {
          return '<a href="' + P(p.href) + '" role="option">' + p.label + '<span>→</span></a>';
        }).join('');
      } else {
        searchResults.hidden = false;
        searchResults.innerHTML = '<a href="' + P('blog.html') + '">' + T.noHits + ' <span>→</span></a>';
      }
    }
    if (searchBtn) {
      searchBtn.addEventListener('click', function () {
        if (searchPanel && searchPanel.classList.contains('open')) closeSearch();
        else openSearch();
      });
    }
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchInput) {
      searchInput.addEventListener('input', runSearch);
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSearch();
          if (searchBtn) searchBtn.focus();
        }
      });
    }

    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      closeMenu();
    });

    /* Floating social links (mobile sticky + desktop) */
    if (!document.getElementById('irn-float-cta')) {
      var float = document.createElement('div');
      float.id = 'irn-float-cta';
      float.innerHTML =
        '<button type="button" class="irn-float-btn irn-float-social-toggle" id="irn-social-toggle" aria-expanded="false" aria-controls="irn-social-links" title="' + T.socialOpen + '" aria-label="' + T.socialOpen + '">' +
        '<span class="irn-float-ico">◎</span><span class="irn-float-txt">' + T.social + '</span></button>' +
        '<div id="irn-social-links" class="irn-social-links" hidden>' +
        '<a href="https://instagram.com/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="' + T.soc('Instagram') + '" aria-label="' + T.soc('Instagram') + '">' +
        '<span class="irn-float-ico">◎</span><span class="irn-float-txt">Instagram</span></a>' +
        '<a href="https://linkedin.com/company/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="' + T.soc('LinkedIn') + '" aria-label="' + T.soc('LinkedIn') + '">' +
        '<span class="irn-float-ico">in</span><span class="irn-float-txt">LinkedIn</span></a>' +
        '<a href="https://github.com/iri-afk" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="' + T.soc('GitHub') + '" aria-label="' + T.soc('GitHub') + '">' +
        '<span class="irn-float-ico">⌘</span><span class="irn-float-txt">GitHub</span></a>' +
        '<a href="https://youtube.com/@irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="' + T.soc('YouTube') + '" aria-label="' + T.soc('YouTube') + '">' +
        '<span class="irn-float-ico">▶</span><span class="irn-float-txt">YouTube</span></a>' +
        '<a href="https://x.com/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="' + T.soc('X') + '" aria-label="' + T.soc('X') + '">' +
        '<span class="irn-float-ico">𝕏</span><span class="irn-float-txt">X</span></a></div>';
      document.body.appendChild(float);
      var socialToggle = document.getElementById('irn-social-toggle');
      var socialLinks = document.getElementById('irn-social-links');
      socialToggle.addEventListener('click', function () {
        var open = socialToggle.getAttribute('aria-expanded') === 'true';
        socialToggle.setAttribute('aria-expanded', String(!open));
        socialToggle.classList.toggle('open', !open);
        socialLinks.hidden = open;
      });
      document.addEventListener('click', function (event) {
        if (!float.contains(event.target) && socialToggle.getAttribute('aria-expanded') === 'true') {
          socialToggle.setAttribute('aria-expanded', 'false');
          socialToggle.classList.remove('open');
          socialLinks.hidden = true;
        }
      });
    }
  }

  function loadAuthThenPaint() {
    /* Login/área do cliente são só em PT; em /en/ não carrega Supabase nem repinta o slot. */
    if (IS_EN) return;
    if (window.IRNAuth && typeof window.IRNAuth.paintNavAuth === 'function') {
      window.IRNAuth.paintNavAuth();
      return;
    }
    // Carrega supabase + auth em páginas públicas para o avatar refletir a sessão
    function ensureScript(src, attrs) {
      return new Promise(function (resolve) {
        if (document.querySelector('script[src="' + src + '"]')) { resolve(); return; }
        var s = document.createElement('script');
        s.src = src;
        s.defer = true;
        if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
        s.onload = function () { resolve(); };
        s.onerror = function () { resolve(); };
        document.head.appendChild(s);
      });
    }
    ensureScript('assets/js/supabase-config.js')
      .then(function () {
        return ensureScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js', {
          integrity: 'sha384-GFr3yTh5lJznCbZfpTtXnwboFsxqtTQoeTZCRHhE0579KrRmlCzen5AA8ohaB5ug',
          crossorigin: 'anonymous'
        });
      })
      .then(function () { return ensureScript('assets/js/auth.js'); })
      .then(function () {
        // auth.js se auto-pinta no DOMContentLoaded; força de novo
        if (window.IRNAuth && typeof window.IRNAuth.paintNavAuth === 'function') {
          window.IRNAuth.paintNavAuth();
        }
      });
  }

  function boot() {
    mount();
    loadAuthThenPaint();
    // Banner LGPD / cookies (todas as páginas)
    if (!document.querySelector('script[src*="cookie-consent.js"]')) {
      var cs = document.createElement('script');
      cs.src = P('assets/js/cookie-consent.js?v=20260919i18n');
      cs.defer = true;
      document.head.appendChild(cs);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* PWA: service worker site-wide + botão de instalar quando disponível */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  var deferredInstallPrompt = null;

  function showInstallButton() {
    if (isInternal || document.getElementById('irn-install-btn')) return;
    var floatWrap = document.getElementById('irn-float-cta');
    if (!floatWrap) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'irn-install-btn';
    btn.className = 'irn-float-btn irn-float-install';
    btn.title = 'Instalar o app da IRN Devs';
    btn.setAttribute('aria-label', 'Instalar o app da IRN Devs');
    btn.innerHTML = '<span class="irn-float-ico">⤓</span><span class="irn-float-txt">Instalar</span>';
    btn.addEventListener('click', function () {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.finally(function () {
        deferredInstallPrompt = null;
        btn.remove();
      });
    });
    floatWrap.appendChild(btn);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showInstallButton);
    } else {
      showInstallButton();
    }
  });

  window.addEventListener('appinstalled', function () {
    deferredInstallPrompt = null;
    var btn = document.getElementById('irn-install-btn');
    if (btn) btn.remove();
  });
})();

/* ------------------------------------------------------------------
 * Analytics centralizado — roda em TODAS as páginas que carregam site-nav.js
 * Para ativar: crie a conta no Plausible/Umami e defina
 *   window.IRN_ANALYTICS = { enabled: true, src: '...', domain: 'irndevs.com' }
 * antes deste script, ou edite o default abaixo.
 * A política de privacidade (privacidade.html) já prevê analytics sem cookies.
 * ------------------------------------------------------------------ */
(function () {
  /* Analytics só após consentimento (cookie-consent.js) ou se já aceito.
     Não carrega automaticamente aqui — cookie-consent.js controla o load. */
  var cfg = window.IRN_ANALYTICS || {};
  if (cfg.enabled !== true) return;
  try {
    var raw = localStorage.getItem('irn_cookie_consent');
    if (!raw) return;
    var data = JSON.parse(raw);
    if (!data || data.choice !== 'accepted') return;
  } catch (e) { return; }
  if (document.querySelector('script[data-irn-analytics]')) return;
  var src = cfg.src || 'https://plausible.io/js/script.js';
  var domain = cfg.domain || 'irndevs.com';
  var s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.dataset.irnAnalytics = '1';
  s.src = src;
  document.head.appendChild(s);
})();
