/**
 * IRN Mock Engine — datasets realistas + schema livre
 * Uso: IRNMock.generate({ domain, count, schema })
 */
(function (global) {
  'use strict';

  var firstNames = ['Ana','Bruno','Carla','Diego','Elena','Felipe','Gabriela','Hugo','Iris','João','Karina','Lucas','Marina','Nicolas','Olívia','Pedro','Queila','Rafael','Sofia','Thiago'];
  var lastNames = ['Silva','Santos','Oliveira','Souza','Lima','Pereira','Costa','Rodrigues','Almeida','Nascimento'];
  var cities = ['São Paulo','Curitiba','Belo Horizonte','Porto Alegre','Recife','Florianópolis','Campinas','Brasília'];
  var species = ['cão','gato','ave'];
  var breeds = { 'cão': ['SRD','Labrador','Poodle'], 'gato': ['SRD','Siamês','Persa'], 'ave': ['Calopsita','Periquito'] };
  var petNames = ['Thor','Luna','Mel','Bob','Nina','Toby','Mimi','Rex'];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function id(prefix, n) { return prefix + '-' + String(n).padStart(3, '0'); }
  function isoDate(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - (daysAgo != null ? daysAgo : Math.floor(Math.random() * 90)));
    return d.toISOString().slice(0, 10);
  }
  function isoDateTime(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - (daysAgo != null ? daysAgo : Math.floor(Math.random() * 60)));
    d.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
    return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  }
  function email(first, last) {
    return (first + '.' + last).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '@email.com';
  }
  function phone() {
    return '+55 11 9' + String(1000 + Math.floor(Math.random() * 9000)) + '-' + String(1000 + Math.floor(Math.random() * 9000));
  }
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  function genFromSchema(schema, count) {
    // schema: [{ name, type: string|number|boolean|email|date|datetime|enum|id|uuid|ref, values?, ref? }]
    var rows = [];
    for (var i = 1; i <= count; i++) {
      var row = {};
      schema.forEach(function (field) {
        var t = (field.type || 'string').toLowerCase();
        var n = field.name;
        if (t === 'id') row[n] = id((field.prefix || n).slice(0, 3), i);
        else if (t === 'uuid') row[n] = uuid();
        else if (t === 'number' || t === 'int') row[n] = field.min != null
          ? field.min + Math.floor(Math.random() * ((field.max || field.min + 100) - field.min + 1))
          : Math.floor(Math.random() * 1000);
        else if (t === 'boolean' || t === 'bool') row[n] = Math.random() > 0.5;
        else if (t === 'email') {
          var fn = pick(firstNames), ln = pick(lastNames);
          row[n] = email(fn, ln);
        } else if (t === 'date') row[n] = isoDate(Math.floor(Math.random() * 200));
        else if (t === 'datetime') row[n] = isoDateTime(Math.floor(Math.random() * 100));
        else if (t === 'enum' || t === 'choice') row[n] = pick(field.values || ['a', 'b', 'c']);
        else if (t === 'phone') row[n] = phone();
        else if (t === 'name') row[n] = pick(firstNames) + ' ' + pick(lastNames);
        else if (t === 'city') row[n] = pick(cities);
        else if (t === 'ref') row[n] = id((field.ref || 'ref').slice(0, 3), ((i - 1) % count) + 1);
        else row[n] = (field.prefix || n) + '-' + i;
      });
      rows.push(row);
    }
    return rows;
  }

  function parseSchemaText(text) {
    // "id:id, name:name, email:email, status:enum:ativo|inativo, age:number:18-80"
    if (!text || !text.trim()) return null;
    return text.split(',').map(function (part) {
      var bits = part.trim().split(':');
      var field = { name: bits[0].trim(), type: (bits[1] || 'string').trim() };
      if (field.type === 'enum' && bits[2]) field.values = bits[2].split('|').map(function (s) { return s.trim(); });
      if (field.type === 'number' && bits[2] && bits[2].indexOf('-') >= 0) {
        var r = bits[2].split('-');
        field.min = parseInt(r[0], 10);
        field.max = parseInt(r[1], 10);
      }
      if (field.type === 'ref' && bits[2]) field.ref = bits[2];
      if (field.type === 'id' && bits[2]) field.prefix = bits[2];
      return field;
    }).filter(function (f) { return f.name; });
  }

  function genVet(n) {
    var tutors = [], pets = [], consultas = [];
    for (var i = 1; i <= n; i++) {
      var fn = pick(firstNames), ln = pick(lastNames);
      tutors.push({ id: id('tut', i), name: fn + ' ' + ln, email: email(fn, ln), phone: phone(), created_at: isoDate(120 - i * 3) });
    }
    for (var j = 1; j <= n; j++) {
      var sp = pick(species);
      pets.push({ id: id('pet', j), tutor_id: id('tut', ((j - 1) % n) + 1), name: pick(petNames), species: sp, breed: pick(breeds[sp]), birth_date: isoDate(365 + Math.floor(Math.random() * 2000)), status: Math.random() > 0.15 ? 'ativo' : 'inativo' });
    }
    var statuses = ['agendada', 'concluída', 'cancelada', 'em_andamento'];
    for (var k = 1; k <= Math.min(n + 4, 20); k++) {
      var petIdx = ((k - 1) % n) + 1;
      consultas.push({ id: id('con', k), pet_id: id('pet', petIdx), tutor_id: id('tut', ((petIdx - 1) % n) + 1), scheduled_at: isoDateTime(k * 2), reason: pick(['check-up', 'vacina', 'consulta de rotina', 'emergência', 'retorno']), status: pick(statuses), notes: Math.random() > 0.6 ? null : 'Observação clínica de exemplo' });
    }
    return { domain: 'clínica veterinária', tutors: tutors, pets: pets, consultas: consultas };
  }

  function genEcommerce(n) {
    var customers = [], orders = [], items = [];
    for (var i = 1; i <= n; i++) {
      var fn = pick(firstNames), ln = pick(lastNames);
      customers.push({ id: id('cus', i), name: fn + ' ' + ln, email: email(fn, ln), city: pick(cities), created_at: isoDate(200 - i * 5) });
    }
    for (var o = 1; o <= n; o++) {
      orders.push({ id: id('ord', o), customer_id: id('cus', ((o - 1) % n) + 1), total: Math.round((50 + Math.random() * 500) * 100) / 100, status: pick(['paid', 'pending', 'shipped', 'cancelled']), created_at: isoDate(o * 2) });
      items.push({ id: id('itm', o), order_id: id('ord', o), product: pick(['Teclado', 'Mouse', 'Monitor', 'Headset', 'SSD']), qty: 1 + Math.floor(Math.random() * 3), price: Math.round((30 + Math.random() * 200) * 100) / 100 });
    }
    return { domain: 'e-commerce', customers: customers, orders: orders, items: items };
  }

  function genSaas(n) {
    var accounts = [], members = [], invoices = [];
    for (var i = 1; i <= n; i++) {
      accounts.push({ id: id('acc', i), name: pick(['Nimbus', 'Orbit', 'Pulse', 'Stack', 'Nova']) + ' ' + pick(['Labs', 'Inc', 'Tech']), plan: pick(['free', 'pro', 'business']), seats: pick([3, 5, 10, 25]), created_at: isoDate(90 - i) });
      members.push({ id: id('mem', i), account_id: id('acc', i), email: email(pick(firstNames), pick(lastNames)), role: pick(['owner', 'admin', 'member']), active: Math.random() > 0.1 });
      invoices.push({ id: id('inv', i), account_id: id('acc', i), amount: pick([0, 29, 99, 249]), status: pick(['paid', 'open', 'void']), due_date: isoDate(-i * 3) });
    }
    return { domain: 'saas', accounts: accounts, members: members, invoices: invoices };
  }

  function genHomelab(n) {
    var hosts = [], services = [], alerts = [];
    for (var i = 1; i <= n; i++) {
      hosts.push({ id: id('hst', i), hostname: 'node-' + i, ip: '10.0.0.' + (10 + i), os: pick(['Ubuntu 24.04', 'Debian 12', 'Proxmox']), role: pick(['k3s-master', 'k3s-worker', 'storage', 'backup']) });
      services.push({ id: id('svc', i), host_id: id('hst', i), name: pick(['nginx', 'postgres', 'redis', 'grafana', 'traefik']), port: pick([80, 443, 5432, 6379, 3000]), status: pick(['up', 'up', 'up', 'degraded']) });
      if (Math.random() > 0.5) alerts.push({ id: id('alt', i), service_id: id('svc', i), severity: pick(['info', 'warning', 'critical']), message: pick(['High CPU', 'Disk > 85%', 'Cert expiring', 'OOM kill']), at: isoDateTime(i) });
    }
    return { domain: 'homelab', hosts: hosts, services: services, alerts: alerts };
  }

  function generate(opts) {
    opts = opts || {};
    var count = Math.min(Math.max(parseInt(opts.count, 10) || 5, 1), 50);
    var schema = opts.schema;
    if (typeof schema === 'string') schema = parseSchemaText(schema);
    if (schema && schema.length) {
      return { domain: 'custom-schema', schema: schema, rows: genFromSchema(schema, count) };
    }
    var domain = (opts.domain || 'vet').toLowerCase();
    if (domain === 'ecommerce' || domain === 'e-commerce') return genEcommerce(count);
    if (domain === 'saas') return genSaas(count);
    if (domain === 'homelab') return genHomelab(count);
    if (domain === 'vet' || domain === 'veterinaria') return genVet(count);
    // custom description fallback: generic people
    return {
      domain: 'custom',
      description: opts.description || '',
      rows: genFromSchema([
        { name: 'id', type: 'id', prefix: 'row' },
        { name: 'name', type: 'name' },
        { name: 'email', type: 'email' },
        { name: 'city', type: 'city' },
        { name: 'active', type: 'boolean' },
        { name: 'created_at', type: 'date' }
      ], count)
    };
  }

  global.IRNMock = {
    generate: generate,
    parseSchemaText: parseSchemaText,
    genFromSchema: genFromSchema
  };
})(window);
