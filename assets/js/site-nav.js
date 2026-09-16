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
    { href: 'cursos.html', label: 'cursos', ico: '◈' },
    { href: 'ia.html', label: 'IA', ico: '✦', extraClass: 'sn-top-ia' }
  ];

  var drawerGroups = [
    {
      label: 'produto',
      items: [
        { href: 'index.html', label: 'início', ico: '⌂' },
        { href: 'index.html#projetos', label: 'projetos', ico: '▸' },
        { href: 'servicos.html', label: 'serviços', ico: '⚙' },
        { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
        { href: 'como-contratar.html', label: 'como contratar', ico: '→' }
      ]
    },
    {
      label: 'ferramentas',
      items: [
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
        { href: 'login.html', label: 'entrar', ico: '⚿' },
        { href: 'cadastro.html', label: 'cadastro', ico: '+' },
        { href: 'conta.html', label: 'minha conta', ico: '●' },
        { href: 'area-cliente.html', label: 'área do cliente', ico: '◆' }
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
    { href: 'index.html#projetos', label: 'projetos', ico: '▸' },
    { href: 'pacotes.html', label: 'pacotes', ico: '▣' },
    { href: 'cursos.html', label: 'cursos', ico: '◈' },
    { href: 'contato.html', label: 'contato', ico: '@' }
	
  ];

  function linkHtml(l) {
    return '<a href="' + l.href + '" class="' + (cls(l.href).trim() + (l.extraClass ? ' ' + l.extraClass : '')).trim() + '"><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
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

    var authSlot = isInternal
      ? '<div class="sn-auth-slot dash-topbar-user" data-auth-slot><a href="index.html">← site</a></div>'
      : '<div class="sn-auth-slot" data-auth-slot></div>';

    var root = document.createElement('div');
    root.id = 'siteNavRoot';
    root.innerHTML =
      '<header class="sn-top" role="banner">' +
      (isInternal ? '' : '<button type="button" class="sn-burger" id="snBurger" aria-label="Abrir menu">☰</button>') +
      '<a href="index.html" class="sn-logo" aria-label="IRN Devs">' +
      '<img src="assets/img/logo-irndevs.svg" alt="~/irndevs $" width="160" height="32" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\'">' +
      '<span class="sn-logo-text" style="display:none">~/irndevs <span>$</span></span>' +
      '</a>' +
      (isInternal
        ? authSlot
        : '<nav class="sn-top-links" aria-label="Principal">' + topLinksHtml + '</nav>' +
          authSlot +
          '<a href="contato.html" class="sn-top-cta">contato</a>') +
      '</header>' +
      (isInternal ? '' :
        '<div class="sn-overlay" id="snOverlay" hidden></div>' +
        '<aside class="sn-drawer" id="snDrawer" aria-hidden="true">' +
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
    var MOBILE_QUERY = window.matchMedia('(max-width: 899px)');
    var pinned = false;

    function openMobile() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      overlay.hidden = false;
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeMobile() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      overlay.hidden = true;
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function updateExpandedState() {
      document.body.classList.toggle('nav-expanded', pinned && !MOBILE_QUERY.matches);
    }
    function setPinned(v) {
      pinned = v;
      drawer.classList.toggle('pinned', pinned);
      if (burger) burger.setAttribute('aria-pressed', pinned ? 'true' : 'false');
      updateExpandedState();
    }
    function handleBurgerClick() {
      if (MOBILE_QUERY.matches) {
        drawer.classList.contains('open') ? closeMobile() : openMobile();
      } else {
        setPinned(!pinned);
      }
    }

    if (burger) burger.addEventListener('click', handleBurgerClick);
    if (closeBtn) closeBtn.addEventListener('click', function () {
      if (MOBILE_QUERY.matches) closeMobile();
      else setPinned(false);
    });
    if (overlay) overlay.addEventListener('click', closeMobile);
    if (drawer) {
      drawer.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          if (MOBILE_QUERY.matches) closeMobile();
        });
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (MOBILE_QUERY.matches) closeMobile();
      else setPinned(false);
    });
    MOBILE_QUERY.addEventListener('change', function (e) {
      if (e.matches) {
        drawer.classList.remove('pinned');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-expanded');
      } else {
        closeMobile();
        drawer.setAttribute('aria-hidden', 'false');
      }
      updateExpandedState();
    });
    if (drawer) drawer.setAttribute('aria-hidden', MOBILE_QUERY.matches ? 'true' : 'false');

    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      setPinned(false);
      closeMobile();
      updateExpandedState();
    });

    /* Floating social links (mobile sticky + desktop) */
    if (!document.getElementById('irn-float-cta')) {
      var float = document.createElement('div');
      float.id = 'irn-float-cta';
      float.innerHTML =
        '<a href="https://instagram.com/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="Instagram da IRN Devs" aria-label="Instagram da IRN Devs">' +
        '<span class="irn-float-ico">◎</span><span class="irn-float-txt">Instagram</span></a>' +
        '<a href="https://linkedin.com/company/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="LinkedIn da IRN Devs" aria-label="LinkedIn da IRN Devs">' +
        '<span class="irn-float-ico">in</span><span class="irn-float-txt">LinkedIn</span></a>' +
        '<a href="https://github.com/iri-afk" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="GitHub da IRN Devs" aria-label="GitHub da IRN Devs">' +
        '<span class="irn-float-ico">⌘</span><span class="irn-float-txt">GitHub</span></a>' +
        '<a href="https://youtube.com/@irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="YouTube da IRN Devs" aria-label="YouTube da IRN Devs">' +
        '<span class="irn-float-ico">▶</span><span class="irn-float-txt">YouTube</span></a>' +
        '<a href="https://x.com/irndevs" target="_blank" rel="noopener noreferrer" class="irn-float-btn irn-float-social" title="X da IRN Devs" aria-label="X da IRN Devs">' +
        '<span class="irn-float-ico">𝕏</span><span class="irn-float-txt">X</span></a>';
      document.body.appendChild(float);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
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
