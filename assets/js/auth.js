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

  /** Atualiza links Conta / Entrar no menu injetado */
  async function paintNavAuth() {
    var u = null;
    try { u = await user(); } catch (e) {}
    document.querySelectorAll('[data-auth-slot]').forEach(function (node) {
      if (u) {
        node.innerHTML = '<a href="conta.html">conta</a>';
      } else {
        node.innerHTML = '<a href="login.html">entrar</a>';
      }
    });
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
    saveChecklist: saveChecklist,
    listChecklists: listChecklists,
    paintNavAuth: paintNavAuth,
    setMsg: setMsg
  };

  document.addEventListener('DOMContentLoaded', function () {
    paintNavAuth();
  });
})(window);
