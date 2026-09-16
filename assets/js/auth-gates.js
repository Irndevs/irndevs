/**
 * IRN Devs — mapa do que exige login
 *
 * pages  → exige sessão para ABRIR a página
 * actions → página pode ser pública; só a ação pede login
 */
(function (global) {
  var GATES = {
    pages: [
      'conta.html',
      'area-cliente.html',
      'pedidos.html',
      'orcamentos.html',
      'pedido.html',
      'admin.html'
    ],
    actions: {
      'save-checklist': true,
      'view-history': true,
      'request-quote': false, // formulário público pode criar lead
      'sync-cloud': true
    }
  };

  function currentPage() {
    return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function isProtectedPage(name) {
    name = (name || currentPage()).toLowerCase();
    return GATES.pages.indexOf(name) !== -1;
  }

  function actionNeedsAuth(action) {
    return !!GATES.actions[action];
  }

  /** Se a página atual estiver na lista, redireciona para login */
  async function guardPage() {
    if (!isProtectedPage()) return true;
    if (!global.IRNAuth) {
      location.replace('login.html?next=' + encodeURIComponent(currentPage()));
      return false;
    }
    var u = await global.IRNAuth.requireAuth({ next: currentPage() });
    return !!u;
  }

  global.IRNAuthGates = {
    config: GATES,
    isProtectedPage: isProtectedPage,
    actionNeedsAuth: actionNeedsAuth,
    guardPage: guardPage,
    currentPage: currentPage
  };
})(window);
