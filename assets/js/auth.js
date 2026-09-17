/**
 * IRN Devs — auth client v2 (Supabase CDN)
 * Área do cliente: pedidos, orçamentos, arquivos, notificações, IA tools, magic link
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

  // ---------- Auth basics ----------
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

  async function signInWithMagicLink(email) {
    var sb = getClient();
    if (!sb) throw new Error('Auth não configurado.');
    var res = await sb.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: window.location.origin + '/conta.html' }
    });
    if (res.error) throw res.error;
    return res.data;
  }

  async function resetPassword(email) {
    var sb = getClient();
    if (!sb) throw new Error('Auth não configurado.');
    var res = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/conta.html?reset=1'
    });
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

  async function changePassword(newPassword, currentPassword) {
    var sb = getClient();
    if (!sb) throw new Error('Auth não configurado.');
    var payload = { password: newPassword };
    if (currentPassword) payload.current_password = currentPassword;
    var res = await sb.auth.updateUser(payload);
    if (res.error) throw res.error;
    return res.data;
  }

  // ---------- Profile ----------
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
    return res.data;
  }

  async function isAdmin() {
    var p = await getProfile();
    return !!(p && p.is_admin);
  }

  // ---------- Checklists ----------
  async function saveChecklist(kind, content, title) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('checklists_saved').insert({
      user_id: u.id,
      kind: kind || 'auto',
      title: title || null,
      content: content
    });
    if (res.error) throw res.error;
    return res.data;
  }

  async function listChecklists() {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('checklists_saved').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  // ---------- Quotes (orçamentos) ----------
  async function listQuotes() {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('quotes').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function getQuote(id) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return null;
    var res = await sb.from('quotes').select('*').eq('id', id).eq('user_id', u.id).maybeSingle();
    if (res.error) throw res.error;
    return res.data;
  }

  async function createQuote(title, notes, payload) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('quotes').insert({
      user_id: u.id,
      title: title,
      notes: notes || null,
      status: 'enviado',
      payload: payload || {}
    }).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  async function acceptQuote(id) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('quotes').update({
      status: 'aprovado',
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq('id', id).eq('user_id', u.id).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  async function refuseQuote(id) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('quotes').update({
      status: 'recusado',
      updated_at: new Date().toISOString()
    }).eq('id', id).eq('user_id', u.id).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  // ---------- Orders (pedidos) ----------
  async function listOrders() {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('orders').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function getOrder(id) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return null;
    var res = await sb.from('orders').select('*').eq('id', id).eq('user_id', u.id).maybeSingle();
    if (res.error) throw res.error;
    return res.data;
  }

  async function listOrderEvents(orderId) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('order_events').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function listOrderMessages(orderId) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('order_messages').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function sendOrderMessage(orderId, body) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('order_messages').insert({
      order_id: orderId,
      user_id: u.id,
      body: body,
      is_admin: false
    }).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  // ---------- Files ----------
  async function listOrderFiles(orderId) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var res = await sb.from('order_files').select('*').eq('order_id', orderId).eq('user_id', u.id).order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function uploadOrderFile(orderId, file) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var path = u.id + '/' + orderId + '/' + Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    var up = await sb.storage.from('order-files').upload(path, file, { upsert: false });
    if (up.error) throw up.error;
    var res = await sb.from('order_files').insert({
      order_id: orderId,
      user_id: u.id,
      uploaded_by: u.id,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      mime_type: file.type || null
    }).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  async function getFileUrl(filePath) {
    var sb = getClient();
    if (!sb) return null;
    var res = await sb.storage.from('order-files').createSignedUrl(filePath, 3600);
    if (res.error) throw res.error;
    return res.data.signedUrl;
  }

  // ---------- Notifications ----------
  async function listNotifications(limit) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var q = sb.from('notifications').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
    if (limit) q = q.limit(limit);
    var res = await q;
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function markNotificationRead(id) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return;
    await sb.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id).eq('user_id', u.id);
  }

  async function markAllNotificationsRead() {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return;
    await sb.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', u.id).is('read_at', null);
  }

  // ---------- IA tool results ----------
  async function saveIaResult(toolName, title, content) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login para salvar.');
    var res = await sb.from('ia_tool_results').insert({
      user_id: u.id,
      tool_name: toolName,
      title: title || toolName,
      content: content || {}
    }).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  async function listIaResults(toolName) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) return [];
    var q = sb.from('ia_tool_results').select('*').eq('user_id', u.id).order('created_at', { ascending: false });
    if (toolName) q = q.eq('tool_name', toolName);
    var res = await q;
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function deleteIaResult(id) {
    var sb = getClient();
    var u = await user();
    if (!sb || !u) throw new Error('Faça login.');
    var res = await sb.from('ia_tool_results').delete().eq('id', id).eq('user_id', u.id);
    if (res.error) throw res.error;
  }

  // ---------- Admin (requires is_admin on profile; policies em supabase/admin-policies.sql) ----------
  async function adminListAllOrders() {
    var sb = getClient();
    if (!(await isAdmin())) throw new Error('Acesso admin necessário.');
    var res = await sb.from('orders').select('*, profiles(email, full_name)').order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function adminUpdateOrderStatus(id, status, extra) {
    var sb = getClient();
    if (!(await isAdmin())) throw new Error('Acesso admin necessário.');
    var patch = Object.assign({ status: status }, extra || {});
    var res = await sb.from('orders').update(patch).eq('id', id).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  async function adminListAllQuotes() {
    var sb = getClient();
    if (!(await isAdmin())) throw new Error('Acesso admin necessário.');
    var res = await sb.from('quotes').select('*, profiles(email, full_name)').order('created_at', { ascending: false });
    if (res.error) throw res.error;
    return res.data || [];
  }

  async function adminRespondQuote(id, fields) {
    var sb = getClient();
    if (!(await isAdmin())) throw new Error('Acesso admin necessário.');
    var patch = {
      admin_response: fields.admin_response || null,
      admin_amount_cents: fields.admin_amount_cents != null ? fields.admin_amount_cents : null,
      admin_deadline: fields.admin_deadline || null,
      status: fields.status || 'respondido',
      responded_at: new Date().toISOString()
    };
    var res = await sb.from('quotes').update(patch).eq('id', id).select().single();
    if (res.error) throw res.error;
    return res.data;
  }

  // ---------- Guards ----------
  async function requireAuth(opts) {
    opts = opts || {};
    var u = await user();
    if (!u) {
      var next = opts.next || (location.pathname.split('/').pop() || 'conta.html');
      location.replace('login.html?next=' + encodeURIComponent(next));
      return null;
    }
    return u;
  }

  // ---------- Nav paint ----------
  async function paintNavAuth() {
    var u = null;
    var profile = null;
    try { u = await user(); } catch (e) {}
    if (u) {
      try { profile = await getProfile(); } catch (e) {}
    }

    function initialFromUser() {
      var name = (profile && (profile.full_name || profile.name)) || (u && (u.user_metadata && u.user_metadata.full_name)) || (u && u.email) || '?';
      name = String(name).trim();
      if (!name) return '?';
      // primeira letra legível (ignora email se tiver nome)
      var ch = name.charAt(0).toUpperCase();
      if (ch === name.charAt(0) && /[a-zA-ZÀ-ú0-9]/.test(ch)) return ch;
      return ch || '?';
    }

    function avatarGuestHtml() {
      return '<a class="sn-avatar sn-avatar--guest" href="login.html" title="Entrar / cadastro" aria-label="Entrar ou criar conta">' +
        '<svg class="sn-avatar-ico" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<path d="M5 19.5c0-3.5 3.1-6 7-6s7 2.5 7 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
        '</svg></a>' +
        '<a class="sn-auth-signup" href="cadastro.html">cadastro</a>';
    }

    function avatarUserHtml() {
      var letter = initialFromUser();
      var email = (u && u.email) || '';
      var title = email ? ('Conta · ' + email) : 'Minha conta';
      return '<a class="sn-avatar sn-avatar--user" href="conta.html" title="' + title.replace(/"/g, '&quot;') + '" aria-label="Minha conta">' +
        '<span class="sn-avatar-letter">' + letter + '</span></a>' +
        '<a class="sn-auth-portal" href="area-cliente.html" title="Área do cliente">portal</a>';
    }

    function fillSlots() {
      document.querySelectorAll('[data-auth-slot]').forEach(function (node) {
        if (node.classList.contains('dash-topbar-user')) {
          if (u) {
            var letter = initialFromUser();
            node.innerHTML =
              '<a class="sn-avatar sn-avatar--user sn-avatar--sm" href="conta.html" title="' + ((u.email || 'conta').replace(/"/g, '&quot;')) + '" aria-label="Minha conta">' +
              '<span class="sn-avatar-letter">' + letter + '</span></a>' +
              '<a href="conta.html" class="sn-auth-label">conta</a>' +
              '<a href="index.html" class="sn-back-site">← site</a>';
          } else {
            node.innerHTML = '<a href="login.html">entrar</a><a href="index.html" class="sn-back-site">← site</a>';
          }
          return;
        }
        node.innerHTML = u ? avatarUserHtml() : avatarGuestHtml();
      });
    }

    function rewriteDrawerAuth() {
      var root = document.getElementById('siteNavRoot');
      if (!root) return false;
      fillSlots();
      // Drawer: login/cadastro só deslogado; minha conta / área do cliente só logado
      root.querySelectorAll('.sn-drawer a[href="login.html"], .sn-drawer a[href="cadastro.html"], .sn-drawer a[href="conta.html"], .sn-drawer a[href="area-cliente.html"]').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (u) {
          if (href.indexOf('login') !== -1 || href.indexOf('cadastro') !== -1) a.style.display = 'none';
          else a.style.display = '';
        } else {
          if (href.indexOf('conta.html') !== -1 || href.indexOf('area-cliente') !== -1) a.style.display = 'none';
          else a.style.display = '';
        }
      });
      return true;
    }

    if (!rewriteDrawerAuth()) {
      var tries = 0;
      var timer = setInterval(function () {
        tries += 1;
        if (rewriteDrawerAuth() || tries > 25) clearInterval(timer);
      }, 40);
    }
  }

  global.IRNAuth = {
    ready: ready,
    getClient: getClient,
    signUp: signUp,
    signIn: signIn,
    signInWithMagicLink: signInWithMagicLink,
    resetPassword: resetPassword,
    signOut: signOut,
    session: session,
    user: user,
    getProfile: getProfile,
    updateProfile: updateProfile,
    changePassword: changePassword,
    isAdmin: isAdmin,
    saveChecklist: saveChecklist,
    listChecklists: listChecklists,
    listQuotes: listQuotes,
    getQuote: getQuote,
    createQuote: createQuote,
    acceptQuote: acceptQuote,
    refuseQuote: refuseQuote,
    listOrders: listOrders,
    getOrder: getOrder,
    listOrderEvents: listOrderEvents,
    listOrderMessages: listOrderMessages,
    sendOrderMessage: sendOrderMessage,
    listOrderFiles: listOrderFiles,
    uploadOrderFile: uploadOrderFile,
    getFileUrl: getFileUrl,
    listNotifications: listNotifications,
    markNotificationRead: markNotificationRead,
    markAllNotificationsRead: markAllNotificationsRead,
    saveIaResult: saveIaResult,
    listIaResults: listIaResults,
    deleteIaResult: deleteIaResult,
    adminListAllOrders: adminListAllOrders,
    adminUpdateOrderStatus: adminUpdateOrderStatus,
    adminListAllQuotes: adminListAllQuotes,
    adminRespondQuote: adminRespondQuote,
    requireAuth: requireAuth,
    paintNavAuth: paintNavAuth,
    setMsg: setMsg
  };

  document.addEventListener('DOMContentLoaded', function () {
    paintNavAuth();
  });
})(window);
