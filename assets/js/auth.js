/**
 * IRN Devs — auth client (Supabase CDN)
 * Depende de: supabase-config.js + @supabase/supabase-js
 */
(function (global) {
  var client = null;

  function cfg() {
    return global.IRN_SUPABASE || { enabled: false };
  }

  function ready() {
    var c = cfg();
    return !!(c.enabled && c.url && c.anonKey && c.url.indexOf('SEU_PROJETO') === -1);
  }

  function getClient() {
    if (!ready()) return null;
    if (client) return client;
    if (!global.supabase || !global.supabase.createClient) {
      console.warn('[IRN auth] Carregue @supabase/supabase-js antes de auth.js');
      return null;
    }
    client = global.supabase.createClient(cfg().url, cfg().anonKey);
    return client;
  }

  function el(id) { return document.getElementById(id); }

  function setMsg(boxId, text, ok) {
    var box = el(boxId);
    if (!box) return;
    box.hidden = !text;
    box.textContent = text || '';
    box.className = 'auth-msg ' + (ok ? 'ok' : 'err');
  }

  async function signUp(email, password, fullName) {
    var sb = getClient();
    if (!sb) throw new Error('Auth não configurado. Preencha assets/js/supabase-config.js');
    var res = await sb.auth.signUp({
      email: email,
      password: password,
      options: { data: { full_name: fullName || '' } }
    });
    if (res.error) throw res.error;
    return res.data;
  }

  async function signIn(email, password) {
    var sb = getClient();
    if (!sb) throw new Error('Auth não configurado.');
    var res = await sb.auth.signInWithPassword({ email: email, password: password });
    if (res.error) throw res.error;
    return res.data;
  }

  async function signOut() {
    var sb = getClient();
    if (!sb) return;
    await sb.auth.signOut();
  }

  async function session() {
    var sb = getClient();
    if (!sb) return null;
    var res = await sb.auth.getSession();
    return res.data.session || null;
  }

  async function user() {
    var s = await session();
    return s ? s.user : null;
  }

  async function getProfile() {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return null;
    var res = await sb.from('profiles').select('*').eq('id', u.id).maybeSingle();
    if (res.error) throw res.error;
    return res.data;
  }

  async function updateProfile(fields) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('profiles').update(Object.assign({}, fields, {
      updated_at: new Date().toISOString()
    })).eq('id', u.id);
    if (res.error) throw res.error;
  }

  async function saveChecklist(kind, content) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login para salvar.');
    var res = await sb.from('checklists_saved').insert({
      user_id: u.id,
      kind: kind,
      content: content
    });
    if (res.error) throw res.error;
  }

  async function listChecklists() {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('checklists_saved').select('*').order('created_at', { ascending: false }).limit(20);
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function changePassword(newPassword) {
    var sb = getClient();
    if (!sb) throw new Error('Auth não configurado.');
    var u = await user();
    if (!u) throw new Error('Faça login.');
    if (!newPassword || String(newPassword).length < 6) {
      throw new Error('Senha deve ter no mínimo 6 caracteres.');
    }
    var res = await sb.auth.updateUser({ password: String(newPassword) });
    if (res.error) throw res.error;
    return res.data;
  }

  /**
   * Exige sessão ativa. Se não houver, redireciona para login.html?next=...
   * Retorna o user ou null (após redirecionar).
   */
  async function requireAuth(opts) {
    opts = opts || {};
    var next = opts.next || (location.pathname.split('/').pop() || 'index.html') + (location.search || '') + (location.hash || '');
    if (!ready()) {
      if (opts.allowOffline) return null;
      location.replace('login.html?next=' + encodeURIComponent(next));
      return null;
    }
    var u = null;
    try { u = await user(); } catch (e) { u = null; }
    if (!u) {
      location.replace('login.html?next=' + encodeURIComponent(next));
      return null;
    }
    return u;
  }

  /** Atualiza links Conta / Entrar no menu injetado e em [data-auth-slot] */
  async function paintNavAuth() {
    var u = null;
    try { u = await user(); } catch (e) {}

    document.querySelectorAll('[data-auth-slot]').forEach(function (node) {
      if (u) {
        node.innerHTML = '<a href="conta.html">conta</a>';
      } else {
        node.innerHTML = '<a href="login.html">entrar</a> · <a href="cadastro.html">cadastro</a>';
      }
    });

    // Ajusta links do menu injetado por site-nav.js
    function rewriteNav() {
      var root = document.getElementById('siteNavRoot');
      if (!root) return false;
      root.querySelectorAll('a[href="login.html"], a[href="cadastro.html"], a[href="conta.html"]').forEach(function (a) {
        var label = a.querySelector('.label');
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (u) {
          if (href.indexOf('login') !== -1 || href.indexOf('cadastro') !== -1) {
            a.setAttribute('href', 'conta.html');
            if (label) label.textContent = 'conta';
            var ico = a.querySelector('.ico');
            if (ico) ico.textContent = '●';
          }
        } else if (href.indexOf('conta') !== -1) {
          a.setAttribute('href', 'login.html');
          if (label) label.textContent = 'entrar';
          var ico2 = a.querySelector('.ico');
          if (ico2) ico2.textContent = '⚿';
        }
      });
      return true;
    }

    if (!rewriteNav()) {
      // site-nav.js é defer — tenta de novo após montar
      var tries = 0;
      var t = setInterval(function () {
        tries += 1;
        if (rewriteNav() || tries > 20) clearInterval(t);
      }, 50);
    }
  }

  global.IRNAuth = {
    ready: ready,
    getClient: getClient,
    signUp: signUp,
    signIn: signIn,
    signOut: signOut,
    session: session,
    user: user,
    getProfile: getProfile,
    updateProfile: updateProfile,
    changePassword: changePassword,
    saveChecklist: saveChecklist,
    listChecklists: listChecklists,
    requireAuth: requireAuth,
    paintNavAuth: paintNavAuth,
    setMsg: setMsg
  };

  document.addEventListener('DOMContentLoaded', function () {
    paintNavAuth();
  });
})(window);
