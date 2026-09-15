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
    { href: 'homelab.html', label: 'homelab', ico: '▣' }
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
    { href: 'homelab.html', label: 'homelab', ico: '▣' },
	{ href: 'cursos.html', label: 'cursos', ico: '◈' },
    { href: 'contato.html', label: 'contato', ico: '@' }
	
  ];

  function linkHtml(l) {
    return '<a href="' + l.href + '" class="' + cls(l.href).trim() + '"><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
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

    /* Floating CTA + Chat (mobile sticky + desktop) */
    if (!document.getElementById('irn-float-cta')) {
      var float = document.createElement('div');
      float.id = 'irn-float-cta';
      float.innerHTML =
        '<a href="contato.html" class="irn-float-btn irn-float-chat" title="Falar / Contato" aria-label="Abrir contato">' +
        '<span class="irn-float-ico">💬</span><span class="irn-float-txt">Falar</span></a>' +
        '<a href="https://wa.me/5500000000000?text=Ol%C3%A1%2C%20vim%20pelo%20site%20IRN%20Devs%20e%20gostaria%20de%20falar%20sobre%20um%20projeto" ' +
        'class="irn-float-btn irn-float-wa" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">' +
        '<span class="irn-float-ico">↗</span><span class="irn-float-txt">WhatsApp</span></a>';
      document.body.appendChild(float);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
