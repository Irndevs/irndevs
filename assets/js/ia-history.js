/**
 * IRN IA History — histórico local unificado (localStorage)
 * Uso: IRNHistory.push({ tool, title, content }); IRNHistory.list(); IRNHistory.clear();
 */
(function (global) {
  'use strict';
  var KEY = 'irn_ia_history_v1';
  var MAX = 40;

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) { return []; }
  }

  function write(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(0, MAX))); } catch (e) {}
  }

  function push(entry) {
    if (!entry || !entry.tool) return;
    var list = read();
    list.unshift({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      tool: entry.tool,
      title: entry.title || entry.tool,
      content: typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content, null, 2),
      at: new Date().toISOString()
    });
    write(list);
    return list[0];
  }

  function list(tool) {
    var all = read();
    return tool ? all.filter(function (e) { return e.tool === tool; }) : all;
  }

  function remove(id) {
    write(read().filter(function (e) { return e.id !== id; }));
  }

  function clear(tool) {
    if (!tool) { write([]); return; }
    write(read().filter(function (e) { return e.tool !== tool; }));
  }

  global.IRNHistory = { push: push, list: list, remove: remove, clear: clear };
})(window);
