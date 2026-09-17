/**
 * IRN SQL Engine — geração local heurística NL (pt/en) → SQL / Mongo-ish
 * Uso: IRNSql.generate(pedido, { dialect: 'postgres'|'mysql'|'mongo' })
 */
(function (global) {
  'use strict';

  function normalize(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function extractLimit(t) {
    var m = t.match(/\b(top|primeiros?|ultimos?|last|limit)\s*(\d+)\b/) ||
            t.match(/\b(\d+)\s*(usuarios?|users?|registros?|rows?|itens?|orders?)\b/);
    return m ? parseInt(m[2] || m[1], 10) : null;
  }

  function extractTable(t) {
    var map = [
      [/usuarios?|users?|clientes?|customers?/, 'users'],
      [/pedidos?|orders?|compras?/, 'orders'],
      [/produtos?|products?|itens?/, 'products'],
      [/posts?|artigos?|articles?/, 'posts'],
      [/logs?|eventos?/, 'events'],
      [/pagamentos?|payments?/, 'payments']
    ];
    for (var i = 0; i < map.length; i++) if (map[i][0].test(t)) return map[i][1];
    return 'users';
  }

  function extractOrder(t) {
    if (/mais ativos|most active|total gasto|revenue|maior|highest/.test(t)) {
      if (/gasto|spent|revenue|valor/.test(t)) return { col: 'total_spent', dir: 'DESC' };
      if (/ativos|active|login/.test(t)) return { col: 'last_login_at', dir: 'DESC' };
      return { col: 'created_at', dir: 'DESC' };
    }
    if (/mais recentes|recent|newest|ultimos/.test(t)) return { col: 'created_at', dir: 'DESC' };
    if (/alfabetic|a-z|nome/.test(t)) return { col: 'name', dir: 'ASC' };
    return null;
  }

  function extractWhere(t, table) {
    var clauses = [];
    var params = [];
    if (/ultimos?\s*30\s*dias|last\s*30\s*days|30 days/.test(t)) {
      clauses.push("created_at >= NOW() - INTERVAL '30 days'");
    } else if (/ultimos?\s*7\s*dias|last\s*week|7 days/.test(t)) {
      clauses.push("created_at >= NOW() - INTERVAL '7 days'");
    } else if (/hoje|today/.test(t)) {
      clauses.push('created_at::date = CURRENT_DATE');
    }
    if (/ativos?|active/.test(t) && !/mais ativos/.test(t)) {
      clauses.push("status = 'active'");
    }
    if (/inativos?|inactive/.test(t)) clauses.push("status = 'inactive'");
    if (/compraram|purchased|pedidos?/.test(t) && table === 'users') {
      clauses.push('id IN (SELECT user_id FROM orders WHERE created_at >= NOW() - INTERVAL \'30 days\')');
    }
    var email = t.match(/email\s*[:=]?\s*([\w.+-]+@[\w.-]+)/);
    if (email) {
      params.push(email[1]);
      clauses.push('email = $' + params.length);
    }
    return { clauses: clauses, params: params };
  }

  function toMysql(sql) {
    return sql
      .replace(/NOW\(\) - INTERVAL '(\d+) days'/g, 'DATE_SUB(NOW(), INTERVAL $1 DAY)')
      .replace(/::date/g, '')
      .replace(/\$(\d+)/g, '?');
  }

  function generateSQL(pedido, dialect) {
    var t = normalize(pedido);
    var table = extractTable(t);
    var limit = extractLimit(t) || 10;
    var order = extractOrder(t);
    var w = extractWhere(t, table);

    var select = 'SELECT *';
    if (/total gasto|revenue|sum|soma/.test(t) && table === 'users') {
      select = 'SELECT u.*, COALESCE(SUM(o.amount),0) AS total_spent';
      table = 'users u LEFT JOIN orders o ON o.user_id = u.id';
    } else if (/contar|count|quantos/.test(t)) {
      select = 'SELECT COUNT(*) AS total';
    }

    var sql = select + ' FROM ' + table;
    if (w.clauses.length) sql += '\nWHERE ' + w.clauses.join('\n  AND ');
    if (/LEFT JOIN/.test(table) && /total_spent/.test(select)) sql += '\nGROUP BY u.id';
    if (order) sql += '\nORDER BY ' + order.col + ' ' + order.dir;
    if (!/^SELECT COUNT/.test(select)) sql += '\nLIMIT ' + limit;
    sql += ';';

    if (dialect === 'mysql') sql = toMysql(sql);

    var notes = [
      'Dialeto: ' + (dialect || 'postgres'),
      'Tabela inferida: ' + table.split(' ')[0],
      'Revise nomes de colunas para o seu schema real.'
    ];
    if (w.params.length) notes.push('Parâmetros: ' + JSON.stringify(w.params));

    return { sql: sql, notes: notes, dialect: dialect || 'postgres', table: table };
  }

  function generateMongo(pedido) {
    var t = normalize(pedido);
    var coll = extractTable(t);
    var limit = extractLimit(t) || 10;
    var filter = {};
    if (/ativos?|active/.test(t)) filter.status = 'active';
    if (/ultimos?\s*30|30 days/.test(t)) {
      filter.createdAt = { $gte: 'ISODate("…-30d")' };
    }
    var sort = extractOrder(t);
    var pipeline = [
      { $match: filter },
    ];
    if (sort) pipeline.push({ $sort: { [sort.col === 'total_spent' ? 'totalSpent' : sort.col]: sort.dir === 'DESC' ? -1 : 1 } });
    pipeline.push({ $limit: limit });
    var code = '// MongoDB\ndb.' + coll + '.aggregate(' + JSON.stringify(pipeline, null, 2) + ');';
    return { sql: code, notes: ['Gerado como aggregation MongoDB', 'Ajuste nomes de campos'], dialect: 'mongo', table: coll };
  }

  function generate(pedido, opts) {
    opts = opts || {};
    var dialect = opts.dialect || 'postgres';
    if (!pedido || !String(pedido).trim()) return null;
    if (dialect === 'mongo') return generateMongo(pedido);
    return generateSQL(pedido, dialect);
  }

  function promptForAI(pedido) {
    return 'Você é um especialista em bancos de dados. Gere a query pedida de forma correta, segura (sem SQL injection) e eficiente.\n\nRegras:\n- Identifique SQL (PostgreSQL/MySQL) ou NoSQL\n- Use parâmetros/placeholders\n- Inclua índices sugeridos se pesada\n- Explique brevemente\n\nPedido:\n' + String(pedido).trim();
  }

  global.IRNSql = { generate: generate, promptForAI: promptForAI };
})(window);
