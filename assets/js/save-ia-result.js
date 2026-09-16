/**
 * Helper: salvar resultado de ferramenta IA na conta do usuário
 * Uso: await IRNSaveIa.save('mock-data', 'Meu dataset', { rows: [...] })
 */
(function (global) {
  async function save(toolName, title, content) {
    if (!global.IRNAuth || !IRNAuth.ready()) {
      alert('Auth não configurado.');
      return null;
    }
    var u = await IRNAuth.user();
    if (!u) {
      if (confirm('Faça login para salvar na sua conta. Ir para login?')) {
        location.href = 'login.html?next=' + encodeURIComponent(location.pathname.split('/').pop());
      }
      return null;
    }
    try {
      var row = await IRNAuth.saveIaResult(toolName, title, content);
      alert('Salvo na sua conta!');
      return row;
    } catch (e) {
      alert('Erro ao salvar: ' + (e.message || e));
      return null;
    }
  }

  async function list(toolName) {
    if (!global.IRNAuth) return [];
    try { return await IRNAuth.listIaResults(toolName); }
    catch (e) { return []; }
  }

  global.IRNSaveIa = { save: save, list: list };
})(window);
