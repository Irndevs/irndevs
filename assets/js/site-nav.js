/**
 * IRN Devs — navegação
 * - Site público: topo enxuto + drawer por categorias
 * - Área logada (conta, pedidos…): só top bar mínima (shell próprio no CSS)
 */
(function () {
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

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
	if (path.indexOf('curso-python-') === 0 && h === 'cursos.html') return true;
    return false;
  }

  function cls(href) {
    return isActive(href) ? ' active' : '';
  }

  var topLinks = [
    { href: 'index.html#projetos', label: 'projetos', ico: '▸' },
    { href: 'servicos.html', label: 'serviços', ico: '⚙' },
    { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
    { href: 'ferramentas.html', label: 'ferramentas', ico: '▣', extraClass: 'sn-top-tools' },
    { href: 'cursos.html', label: 'cursos', ico: '◈' },
    { href: 'ia.html', label: 'IA', ico: '✦', extraClass: 'sn-top-ia' }
  ];

  var drawerGroups = [
    {
      label: 'produto',
      items: [
        { href: 'index.html', label: 'início', ico: '⌂' },
        { href: 'diagnostico.html', label: 'diagnóstico grátis', ico: '⚡' },
        { href: 'index.html#projetos', label: 'projetos', ico: '▸' },
        { href: 'servicos.html', label: 'serviços', ico: '⚙' },
        { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
        { href: 'como-contratar.html', label: 'como contratar', ico: '→' }
      ]
    },
    {
      label: 'ferramentas prioritárias',
      items: [
        { href: 'ferramentas.html', label: 'todas as ferramentas', ico: '▣' },
        { href: 'ferramenta-salario-liquido.html', label: 'salário líquido CLT', ico: '₽' },
        { href: 'ferramenta-clt-pj.html', label: 'CLT vs PJ', ico: '⇄' },
        { href: 'ferramenta-link-whatsapp.html', label: 'link WhatsApp', ico: '✉' },
        { href: 'ferramenta-biometria-saude.html', label: 'biometria & saúde', ico: '♥' },
        { href: 'ferramenta-esportivas.html', label: 'esporte & performance', ico: '⚡' },
        { href: 'ferramenta-macros.html', label: 'macros fitness', ico: '⚖' },
        { href: 'ferramenta-prompt.html', label: 'melhorador de prompt', ico: '✦' },
        { href: 'ferramenta-json.html', label: 'validador JSON', ico: '{ }' },
        { href: 'ia.html', label: 'hub de IA', ico: '✦' },
        { href: 'ferramenta-checklist.html', label: 'checklist grátis', ico: '✓' },
        { href: 'produtividade.html', label: 'produtividade', ico: '⏱' },
        { href: 'jogos.html', label: 'jogos', ico: '▶' }
      ]
    },
    {
      label: 'conteúdo',
      items: [
        { href: 'blog.html', label: 'blog', ico: '≡' },
        { href: 'cursos.html', label: 'cursos', ico: '◈' },
        { href: 'homelab.html', label: 'homelab', ico: '▣' },
        { href: 'sobre.html', label: 'sobre', ico: 'i' }
      ]
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
    { href: 'index.html', label: 'início', ico: '⌂' },
    { href: 'ferramentas.html', label: 'tools', ico: '▣' },
    { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
    { href: 'ia.html', label: 'IA', ico: '✦' },
    { href: 'contato.html', label: 'contato', ico: '@' }
  ];

  function linkHtml(l) {
    var extra = (cls(l.href).trim() + (l.extraClass ? ' ' + l.extraClass : '')).trim();
    var style = '';
    // Por padrão esconde itens só-logado (paintNavAuth mostra se houver sessão)
    if (l.auth === 'user') style = ' style="display:none"';
    return '<a href="' + l.href + '" class="' + extra + '"' + style + '><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
  }

  function mount() {
    document.querySelectorAll('body > nav:not(.sn-bottom)').forEach(function (legacyNav) {
      legacyNav.remove();
    });
    document.body.classList.add('has-site-nav');
    if (isInternal) document.body.classList.add('dash-app');

    var topLinksHtml = topLinks.map(linkHtml).join('');
    var drawerHtml = drawerGroups.map(function (g) {
      return '<div class="sn-group"><div class="sn-group-label">' + g.label + '</div>' +
        g.items.map(linkHtml).join('') + '</div>';
    }).join('');
    var bottomHtml = bottomItems.map(linkHtml).join('');

    /* Avatar de login: círculo com ícone de usuário (estado deslogado por padrão).
       paintNavAuth() em auth.js troca para avatar com inicial quando logado. */
    var authSlot = isInternal
      ? '<div class="sn-auth-slot dash-topbar-user" data-auth-slot><a href="index.html" class="sn-back-site">← site</a></div>'
      : '<div class="sn-auth-slot" data-auth-slot>' +
        '<a class="sn-avatar sn-avatar--guest" href="login.html" title="Entrar / cadastro" aria-label="Entrar ou criar conta">' +
        '<svg class="sn-avatar-ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M5 19.5c0-3.5 3.1-6 7-6s7 2.5 7 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
        '</svg></a>' +
        '<a class="sn-auth-signup" href="cadastro.html">cadastro</a>' +
        '</div>';

    var root = document.createElement('div');
    root.id = 'siteNavRoot';
    root.innerHTML =
      '<header class="sn-top" role="banner">' +
      (isInternal ? '' : '<button type="button" class="sn-burger" id="snBurger" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="snDrawer">☰</button>') +
      '<a href="index.html" class="sn-logo" aria-label="IRN Devs">' +
      '<img src="assets/img/logo-irndevs.svg" alt="~/irndevs $" width="160" height="32" loading="eager" decoding="async" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\'">' +
      '<span class="sn-logo-text" style="display:none">~/irndevs <span>$</span></span>' +
      '</a>' +
      (isInternal
        ? authSlot
        : '<nav class="sn-top-links" aria-label="Principal">' + topLinksHtml + '</nav>' +
          '<button type="button" class="sn-search-btn" id="snSearchBtn" aria-label="Abrir busca" aria-expanded="false" aria-controls="snSearchPanel" title="Buscar">' +
          '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
          '<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>' +
          '<path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg></button>' +
          authSlot +
          '<a href="contato.html" class="sn-top-cta">contato</a>') +
      '</header>' +
      (isInternal ? '' :
        '<div class="sn-search-panel" id="snSearchPanel" hidden role="search" aria-label="Busca no site">' +
        '<div class="sn-search-inner">' +
        '<span class="sn-search-prompt" aria-hidden="true">$</span>' +
        '<input type="search" id="snSearchInput" class="sn-search-input" placeholder="buscar: k3s, grafana, projetos, blog..." autocomplete="off" enterkeyhint="search" aria-label="Buscar no site">' +
        '<button type="button" class="sn-search-close" id="snSearchClose" aria-label="Fechar busca">✕</button>' +
        '</div>' +
        '<div id="snSearchResults" class="sn-search-results" hidden role="listbox" aria-label="Resultados"></div>' +
        '</div>' +
        '<div class="sn-overlay" id="snOverlay" hidden></div>' +
        '<aside class="sn-drawer" id="snDrawer" role="dialog" aria-modal="true" aria-label="Menu de navegação" aria-hidden="true">' +
        '<div class="sn-drawer-head">' +
        '<a href="index.html" class="brand"><span class="brand-full">~/irndevs <span>$</span></span><span class="brand-mini">$</span></a>' +
        '<button type="button" class="sn-close" id="snClose" aria-label="Fechar">✕</button>' +
        '</div>' +
        '<nav class="sn-drawer-links">' + drawerHtml + '</nav>' +
        '</aside>' +
        '<nav class="sn-bottom" aria-label="Atalhos">' + bottomHtml + '</nav>');

    document.body.insertBefore(root, document.body.firstChild);

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
        burger.setAttribute('aria-label', 'Fechar menu de navegação');
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
        burger.setAttribute('aria-label', 'Abrir menu de navegação');
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
    var searchPageIndex = [
      { q: 'projetos portfolio', href: 'index.html#projetos', label: 'Projetos em produção' },
      { q: 'servicos automacao', href: 'servicos.html', label: 'Serviços' },
      { q: 'pacotes precos', href: 'pacotes.html', label: 'Pacotes' },
      { q: 'cursos python docker linux', href: 'cursos.html', label: 'Cursos' },
      { q: 'ia ferramentas sql commit', href: 'ia.html', label: 'Ferramentas de IA' },
      { q: 'ferramentas gratis checklist', href: 'ferramentas.html', label: 'Ferramentas grátis' },
      { q: 'biometria saude corporativa imc roi', href: 'ferramenta-biometria-saude.html', label: 'Biometria & Saúde Corporativa' },
      { q: 'esporte performance 1rm vo2 pace zonas fc', href: 'ferramenta-esportivas.html', label: 'Calculadoras Esportivas' },
      { q: 'salario liquido clt inss irrf', href: 'ferramenta-salario-liquido.html', label: 'Salário Líquido CLT' },
      { q: 'clt pj comparar freela', href: 'ferramenta-clt-pj.html', label: 'Simulador CLT vs PJ' },
      { q: 'whatsapp link wa.me gerador', href: 'ferramenta-link-whatsapp.html', label: 'Gerador Link WhatsApp' },
      { q: 'macros proteina carboidrato fitness', href: 'ferramenta-macros.html', label: 'Calculadora de Macros' },
      { q: 'prompt chatgpt midjourney melhorar', href: 'ferramenta-prompt.html', label: 'Melhorador de Prompt' },
      { q: 'json formatar validar minificar', href: 'ferramenta-json.html', label: 'Validador JSON' },
      { q: 'diagnostico', href: 'diagnostico.html', label: 'Diagnóstico gratuito' },
      { q: 'contato', href: 'contato.html', label: 'Contato' },
      { q: 'blog artigos', href: 'blog.html', label: 'Blog' },
      { q: 'homelab k3s proxmox', href: 'homelab.html', label: 'Homelab' },
      { q: 'sobre', href: 'sobre.html', label: 'Sobre' },
      { q: 'zapagendador whatsapp', href: 'https://zapagendador-ia.onrender.com', label: 'ZapAgendador IA' },
      { q: 'neobank banco', href: 'https://neobankirn.irndevs.com', label: 'NeoBank' },
      { q: 'docker observabilidade', href: 'artigo-observabilidade-docker.html', label: 'Artigo: Observabilidade Docker' },
      { q: 'k3s kubernetes', href: 'artigo-k3s-homelab.html', label: 'Artigo: k3s' },
      { q: 'proxmox', href: 'artigo-proxmox-homelab.html', label: 'Artigo: Proxmox' },
      { q: 'hardening linux', href: 'artigo-hardening-linux.html', label: 'Artigo: Hardening Linux' },
      { q: 'rag pgvector', href: 'artigo-rag-pgvector.html', label: 'Artigo: RAG + pgvector' },
      { q: 'ollama local', href: 'artigo-ollama-local.html', label: 'Artigo: Ollama local' }
    ];

    function openSearch() {
      if (!searchPanel) return;
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
          return '<a href="' + p.href + '" role="option">' + p.label + '<span>→</span></a>';
        }).join('');
      } else {
        searchResults.hidden = false;
        searchResults.innerHTML = '<a href="blog.html">Nada direto — ver blog <span>→</span></a>';
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
        '<button type="button" class="irn-float-btn irn-float-social-toggle" id="irn-social-toggle" aria-expanded="false" aria-controls="irn-social-links" title="Abrir redes sociais" aria-label="Abrir redes sociais">' +
        '<span class="irn-float-ico">◎</span><span class="irn-float-txt">redes</span></button>' +
        '<div id="irn-social-links" class="irn-social-links" hidden>' +
        '<a href="https://instagram.com/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="Instagram da IRN Devs" aria-label="Instagram da IRN Devs">' +
        '<span class="irn-float-ico">◎</span><span class="irn-float-txt">Instagram</span></a>' +
        '<a href="https://linkedin.com/company/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="LinkedIn da IRN Devs" aria-label="LinkedIn da IRN Devs">' +
        '<span class="irn-float-ico">in</span><span class="irn-float-txt">LinkedIn</span></a>' +
        '<a href="https://github.com/iri-afk" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="GitHub da IRN Devs" aria-label="GitHub da IRN Devs">' +
        '<span class="irn-float-ico">⌘</span><span class="irn-float-txt">GitHub</span></a>' +
        '<a href="https://youtube.com/@irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="YouTube da IRN Devs" aria-label="YouTube da IRN Devs">' +
        '<span class="irn-float-ico">▶</span><span class="irn-float-txt">YouTube</span></a>' +
        '<a href="https://x.com/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="X da IRN Devs" aria-label="X da IRN Devs">' +
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
  var cfg = window.IRN_ANALYTICS || {};
  var enabled = cfg.enabled === true;
  var src = cfg.src || 'https://plausible.io/js/script.js';
  var domain = cfg.domain || 'irndevs.com';
  if (!enabled) return; // inativo até você criar a conta e ligar
  if (document.querySelector('script[data-irn-analytics]')) return;
  var s = document.createElement('script');
  s.defer = true;
  s.dataset.domain = domain;
  s.dataset.irnAnalytics = '1';
  s.src = src;
  document.head.appendChild(s);
})();
