/**
 * IRN Devs — menu lateral + menu superior + menu inferior
 * Inclua: <link rel="stylesheet" href="assets/css/site-nav.css">
 *         <script src="assets/js/site-nav.js" defer></script>
 */
(function () {
  var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function isActive(href) {
    var h = (href.split('/').pop() || '').split('#')[0].toLowerCase();
    if (!h || h === '#') return false;
    if (path === h) return true;
    if ((path === '' || path === 'index.html') && (h === 'index.html')) return true;
    if (path.indexOf('artigo-') === 0 && h === 'blog.html') return true;
    return false;
  }

  function cls(href) {
    return isActive(href) ? ' active' : '';
  }

  var topLinks = [
    { href: 'index.html#projetos', label: 'projetos', ico: '▸' },
    { href: 'servicos.html', label: 'serviços', ico: '⚙' },
    { href: 'blog.html', label: 'blog', ico: '≡' },
    { href: 'blog.html#buscar', label: 'buscar', ico: '⌕' },
    { href: 'sobre.html', label: 'sobre', ico: 'i' },
    { href: 'homelab.html', label: 'homelab', ico: '▣' }
  ];

  var drawerItems = [
    { href: 'index.html', label: 'início', ico: '⌂' },
    { href: 'index.html#projetos', label: 'projetos', ico: '▸' },
    { href: 'servicos.html', label: 'serviços', ico: '⚙' },
    { href: 'como-contratar.html', label: 'como contratar', ico: '→' },
    { href: 'sobre.html', label: 'sobre', ico: 'i' },
    { href: 'blog.html', label: 'blog', ico: '≡' },
    { href: 'homelab.html', label: 'homelab', ico: '▣' },
    { href: 'produtividade.html', label: 'produtividade', ico: '⏱' },
    { href: 'jogos.html', label: 'jogos', ico: '▶' },
    { href: 'https://loja.irndevs.com', label: 'loja', ico: '⬡' },
    { href: 'contato.html', label: 'contato', ico: '@' },
    { href: 'privacidade.html', label: 'privacidade', ico: '§' }
  ];

  var bottomItems = [
    { href: 'index.html', label: 'início', ico: '⌂' },
    { href: 'blog.html', label: 'blog', ico: '≡' },
    { href: 'produtividade.html', label: 'focus', ico: '⏱' },
    { href: 'jogos.html', label: 'jogos', ico: '▶' },
    { href: 'contato.html', label: 'contato', ico: '@' },
    { href: 'privacidade.html', label: 'privacidade', ico: '§' }
  ];

  function mount() {
    document.querySelectorAll('body > nav:not(.sn-bottom)').forEach(function (legacyNav) {
      legacyNav.remove();
    });
    document.body.classList.add('has-site-nav');

    var topLinksHtml = topLinks.map(function (l) {
      return '<a href="' + l.href + '" class="' + cls(l.href).trim() + '"><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
    }).join('');

    var drawerHtml = drawerItems.map(function (l) {
      return '<a href="' + l.href + '" class="' + cls(l.href).trim() + '"><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
    }).join('');

    var bottomHtml = bottomItems.map(function (l) {
      return '<a href="' + l.href + '" class="' + cls(l.href).trim() + '"><span class="ico">' + l.ico + '</span><span class="label">' + l.label + '</span></a>';
    }).join('');

    var root = document.createElement('div');
    root.id = 'siteNavRoot';
    root.innerHTML =
      '<header class="sn-top" role="banner">' +
      '<button type="button" class="sn-burger" id="snBurger" aria-label="Abrir/fixar menu">☰</button>' +
      '<a href="index.html" class="sn-logo" aria-label="IRN Devs">' +
      '<img src="assets/img/logo-irndevs.svg" alt="~/irndevs $" width="160" height="32" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\'">' +
      '<span class="sn-logo-text" style="display:none">~/irndevs <span>$</span></span>' +
      '</a>' +
      '<nav class="sn-top-links" aria-label="Principal">' + topLinksHtml + '</nav>' +
      '<a href="contato.html" class="sn-top-cta">contato</a>' +
      '</header>' +
      '<div class="sn-overlay" id="snOverlay" hidden></div>' +
      '<aside class="sn-drawer" id="snDrawer" aria-hidden="true">' +
      '<div class="sn-drawer-head">' +
      '<a href="index.html" class="brand"><span class="brand-full">~/irndevs <span>$</span></span><span class="brand-mini">$</span></a>' +
      '<button type="button" class="sn-close" id="snClose" aria-label="Fechar">✕</button>' +
      '</div>' +
      '<div class="sn-drawer-label">$ menu</div>' +
      '<nav class="sn-drawer-links">' + drawerHtml + '</nav>' +
      '</aside>' +
      '<nav class="sn-bottom" aria-label="Atalhos">' + bottomHtml + '</nav>';

    document.body.insertBefore(root, document.body.firstChild);

    var drawer = document.getElementById('snDrawer');
    var overlay = document.getElementById('snOverlay');
    var burger = document.getElementById('snBurger');
    var closeBtn = document.getElementById('snClose');
    var MOBILE_QUERY = window.matchMedia('(max-width: 899px)');
    var pinned = false;

    // --- Mobile: drawer off-canvas com overlay (comportamento original) ---
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

    // --- Desktop: sidebar fixa em modo ícone, expande só com clique no ☰ ---
    // quando expandida (fixada), empurra o conteúdo em vez de cobri-lo
    function updateExpandedState() {
      document.body.classList.toggle('nav-expanded', pinned && !MOBILE_QUERY.matches);
    }

    function setPinned(v) {
      pinned = v;
      drawer.classList.toggle('pinned', pinned);
      burger.setAttribute('aria-pressed', pinned ? 'true' : 'false');
      updateExpandedState();
    }

    function handleBurgerClick() {
      if (MOBILE_QUERY.matches) {
        drawer.classList.contains('open') ? closeMobile() : openMobile();
      } else {
        setPinned(!pinned);
      }
    }

    burger.addEventListener('click', handleBurgerClick);
    closeBtn.addEventListener('click', function () {
      if (MOBILE_QUERY.matches) {
        closeMobile();
      } else {
        setPinned(false);
      }
    });
    overlay.addEventListener('click', closeMobile);
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (MOBILE_QUERY.matches) closeMobile();
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (MOBILE_QUERY.matches) closeMobile();
      else setPinned(false);
    });

    // aria-hidden correto ao trocar de breakpoint
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
    drawer.setAttribute('aria-hidden', MOBILE_QUERY.matches ? 'true' : 'false');

    // ao voltar/avançar pelo histórico, o navegador pode restaurar a página
    // do cache (bfcache) com o menu preso no estado em que você saiu — reseta
    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return;
      setPinned(false);
      closeMobile();
      updateExpandedState();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
