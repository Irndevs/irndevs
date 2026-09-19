/**
 * IRN Devs — carrega chat-bot.js só em idle ou na 1ª interação
 * Uso: <script src="assets/js/chat-bot-loader.js?v=20260919idle" defer></script>
 * (substitui o script direto do chat-bot.js)
 */
(function () {
  'use strict';
  if (window.__irnChatLoaderScheduled) return;
  window.__irnChatLoaderScheduled = true;

  var LOADED = false;
  var SRC = (function () {
    var cur = document.currentScript;
    if (cur && cur.src) {
      return cur.src.replace(/chat-bot-loader\.js[^/]*$/i, 'chat-bot.js?v=20260919idle');
    }
    return '/assets/js/chat-bot.js?v=20260919idle';
  })();

  function load() {
    if (LOADED) return;
    LOADED = true;
    if (document.getElementById('irn-chat-btn')) return;
    if (document.querySelector('script[data-irn-chat]')) return;
    var s = document.createElement('script');
    s.src = SRC;
    s.defer = true;
    s.dataset.irnChat = '1';
    document.head.appendChild(s);
  }

  function onIdle() {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(function () { load(); }, { timeout: 4000 });
    } else {
      setTimeout(load, 2500);
    }
  }

  // 1ª interação do usuário = carregar na hora
  var evs = ['pointerdown', 'keydown', 'touchstart', 'scroll'];
  function onInteract() {
    evs.forEach(function (e) {
      window.removeEventListener(e, onInteract, { capture: true });
    });
    load();
  }
  evs.forEach(function (e) {
    window.addEventListener(e, onInteract, { capture: true, passive: true, once: true });
  });

  if (document.readyState === 'complete') onIdle();
  else window.addEventListener('load', onIdle);
})();
