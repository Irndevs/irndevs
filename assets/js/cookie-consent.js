/**
 * IRN Devs — banner de consentimento (LGPD)
 * - Preferência em localStorage: irn_cookie_consent = "accepted" | "rejected"
 * - Analytics (Plausible) só carrega se o usuário aceitar E IRN_ANALYTICS.enabled
 * - Compatível com site-nav.js (todas as páginas públicas)
 */
(function () {
  'use strict';

  var KEY = 'irn_cookie_consent';
  var VERSION = '1'; // incrementar se a política mudar de forma material

  function getChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.v !== VERSION) return null;
      return data.choice; // accepted | rejected
    } catch (e) {
      return null;
    }
  }

  function setChoice(choice) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        v: VERSION,
        choice: choice,
        at: new Date().toISOString()
      }));
    } catch (e) { /* private mode */ }
  }

  function loadAnalyticsIfAllowed() {
    var choice = getChoice();
    if (choice !== 'accepted') return;
    var cfg = window.IRN_ANALYTICS || {};
    // Só carrega se explicitamente habilitado no site
    if (cfg.enabled !== true) return;
    if (document.querySelector('script[data-irn-analytics]')) return;
    var src = cfg.src || 'https://plausible.io/js/script.js';
    var domain = cfg.domain || 'irndevs.com';
    var s = document.createElement('script');
    s.defer = true;
    s.dataset.domain = domain;
    s.dataset.irnAnalytics = '1';
    s.src = src;
    document.head.appendChild(s);
  }

  function injectStyles() {
    if (document.getElementById('irn-cookie-css')) return;
    var css = document.createElement('style');
    css.id = 'irn-cookie-css';
    css.textContent = [
      '#irn-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;max-width:640px;margin:0 auto;',
      'background:#171b16;border:1px solid #2a3126;border-radius:12px;padding:16px 18px;box-shadow:0 12px 40px rgba(0,0,0,.45);',
      'color:#eae6d9;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5}',
      '#irn-cookie-banner p{margin:0 0 12px;color:#b8beb0}',
      '#irn-cookie-banner a{color:#e8a33d;text-decoration:underline}',
      '#irn-cookie-banner .irn-cookie-actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
      '#irn-cookie-banner button{cursor:pointer;border-radius:8px;padding:9px 14px;font-size:13.5px;font-weight:600;border:1px solid transparent}',
      '#irn-cookie-banner .irn-cookie-accept{background:#e8a33d;color:#10130f;border-color:#e8a33d}',
      '#irn-cookie-banner .irn-cookie-reject{background:transparent;color:#eae6d9;border-color:#2a3126}',
      '#irn-cookie-banner .irn-cookie-accept:hover{filter:brightness(1.05)}',
      '#irn-cookie-banner .irn-cookie-reject:hover{border-color:#e8a33d;color:#e8a33d}',
      '@media (max-width:480px){#irn-cookie-banner{left:10px;right:10px;bottom:10px;padding:14px}}'
    ].join('');
    document.head.appendChild(css);
  }

  function hideBanner() {
    var el = document.getElementById('irn-cookie-banner');
    if (el) el.remove();
  }

  function showBanner() {
    if (document.getElementById('irn-cookie-banner')) return;
    injectStyles();
    var el = document.createElement('div');
    el.id = 'irn-cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-label', 'Preferências de cookies e privacidade');
    el.innerHTML =
      '<p>Usamos armazenamento local para preferências do site e, se você aceitar, ' +
      'métricas agregadas de visitas (sem rastreamento invasivo). ' +
      'Detalhes em <a href="privacidade.html">Política de Privacidade</a>.</p>' +
      '<div class="irn-cookie-actions">' +
      '<button type="button" class="irn-cookie-accept">Aceitar</button>' +
      '<button type="button" class="irn-cookie-reject">Recusar</button>' +
      '</div>';
    document.body.appendChild(el);

    el.querySelector('.irn-cookie-accept').addEventListener('click', function () {
      setChoice('accepted');
      hideBanner();
      loadAnalyticsIfAllowed();
    });
    el.querySelector('.irn-cookie-reject').addEventListener('click', function () {
      setChoice('rejected');
      hideBanner();
    });
  }

  function init() {
    var choice = getChoice();
    if (choice === 'accepted') {
      loadAnalyticsIfAllowed();
      return;
    }
    if (choice === 'rejected') return;
    showBanner();
  }

  // API pública: reabrir preferências (link no rodapé, se quiser)
  window.IRNCookieConsent = {
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      showBanner();
    },
    getChoice: getChoice
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
