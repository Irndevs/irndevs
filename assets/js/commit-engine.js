/**
 * IRN Commit Engine — heurísticas locais para Conventional Commits
 * Uso: IRNCommit.generate(diffText) → { header, body, type, scope, breaking, confidence }
 */
(function (global) {
  'use strict';

  var TYPE_RULES = [
    { type: 'fix', re: /\b(fix|bug|hotfix|patch|corrig|error|exception|null\s*pointer|crash|regression|broken)\b/i },
    { type: 'docs', re: /\b(readme|\.md\b|docs?\/|changelog|typo|jsdoc|godoc)\b/i },
    { type: 'test', re: /\b(test|spec|__tests__|\.test\.|\.spec\.|jest|pytest|vitest)\b/i },
    { type: 'ci', re: /\b(\.github\/workflows|ci\.yml|gitlab-ci|circleci|workflow)\b/i },
    { type: 'style', re: /\b(prettier|eslint|format|lint|whitespace)\b/i },
    { type: 'perf', re: /\b(perf|performance|optimiz|cache|lazy|memoiz|speed)\b/i },
    { type: 'refactor', re: /\b(refactor|rename|cleanup|extract|simplify|restructure)\b/i },
    { type: 'build', re: /\b(package\.json|Dockerfile|webpack|vite\.config|tsconfig|Makefile)\b/i },
    { type: 'chore', re: /\b(chore|deps|dependency|bump|upgrade\s+version)\b/i }
  ];

  var SCOPE_MAP = [
    { re: /auth|jwt|login|session|oauth/i, scope: 'auth' },
    { re: /api\/|routes?\/|controller/i, scope: 'api' },
    { re: /user|account|profile/i, scope: 'users' },
    { re: /db|database|migration|schema|sql/i, scope: 'db' },
    { re: /ui|component|css|style|frontend/i, scope: 'ui' },
    { re: /docker|k8s|kubernetes|helm|deploy/i, scope: 'infra' },
    { re: /test|spec/i, scope: 'test' },
    { re: /ci|workflow|github/i, scope: 'ci' },
    { re: /config|\.env|settings/i, scope: 'config' }
  ];

  function detectType(diff) {
    var lower = diff.toLowerCase();
    var scores = {};
    TYPE_RULES.forEach(function (r) {
      if (r.re.test(diff) || r.re.test(lower)) scores[r.type] = (scores[r.type] || 0) + 1;
    });
    // new file without fix keywords → feat
    if (/new file mode/i.test(diff) && !scores.fix) scores.feat = (scores.feat || 0) + 2;
    // only deletions of error paths
    if (/\+\s*.*\b(throw|Error|catch)\b/.test(diff) && /-\s*.*\b(throw|Error)\b/.test(diff)) {
      scores.fix = (scores.fix || 0) + 1;
    }
    var best = 'feat', bestScore = 0;
    Object.keys(scores).forEach(function (t) {
      if (scores[t] > bestScore) { best = t; bestScore = scores[t]; }
    });
    if (bestScore === 0) best = /new file mode/i.test(diff) ? 'feat' : 'chore';
    return { type: best, confidence: Math.min(0.95, 0.4 + bestScore * 0.15) };
  }

  function detectScope(diff) {
    var files = [];
    var re = /(?:\+\+\+ b\/|\-\-\- a\/)([^\s\n]+)/g;
    var m;
    while ((m = re.exec(diff))) {
      if (m[1] !== '/dev/null') files.push(m[1]);
    }
    for (var i = 0; i < SCOPE_MAP.length; i++) {
      if (SCOPE_MAP[i].re.test(diff) || files.some(function (f) { return SCOPE_MAP[i].re.test(f); })) {
        return SCOPE_MAP[i].scope;
      }
    }
    if (files.length) {
      var parts = files[0].split('/');
      if (parts.length >= 2) return parts[parts.length - 2].replace(/[^a-z0-9-]/gi, '').slice(0, 20) || null;
      var base = parts[parts.length - 1].replace(/\.\w+$/, '');
      return base.slice(0, 20) || null;
    }
    return null;
  }

  function detectBreaking(diff) {
    if (/BREAKING[\s-]?CHANGE/i.test(diff)) return true;
    if (/^\-\s*(export\s+)?(function|class|interface|type)\s+\w+/m.test(diff) &&
        !/^\+\s*(export\s+)?(function|class|interface|type)\s+\w+/m.test(diff)) return true;
    return false;
  }

  function summarize(diff, type) {
    var added = (diff.match(/^\+[^+].*/gm) || []).join('\n');
    var patterns = [
      [/function\s+(\w+)/, 'add $1'],
      [/export\s+(?:async\s+)?function\s+(\w+)/, 'add $1'],
      [/def\s+(\w+)/, 'add $1'],
      [/class\s+(\w+)/, 'add $1'],
      [/interface\s+(\w+)/, 'add $1 interface'],
      [/CREATE TABLE\s+(\w+)/i, 'add table $1'],
      [/validateToken|requireAuth|jwt/i, 'authentication helpers'],
      [/SELECT \* FROM|sql injection|\$1|parameterized/i, 'parameterized queries'],
      [/README|\.env\.example/i, 'setup and environment docs'],
      [/timeout|retry|backoff/i, 'resilience'],
      [/docker|compose/i, 'container setup'],
      [/migration/i, 'database migration']
    ];
    for (var i = 0; i < patterns.length; i++) {
      var match = patterns[i][0].exec(added) || patterns[i][0].exec(diff);
      if (match) {
        var label = patterns[i][1];
        var s = label.indexOf('$1') >= 0 ? label.replace('$1', match[1] || '') : label;
        if (type === 'fix') return 'prevent ' + s.replace(/^add /, '');
        if (type === 'docs') return 'document ' + s.replace(/^add /, '');
        if (type === 'refactor') return 'refactor ' + s.replace(/^add /, '');
        return s;
      }
    }
    var fileMatch = diff.match(/\+\+\+ b\/([^\s\n]+)/);
    var file = fileMatch ? fileMatch[1].split('/').pop().replace(/\.\w+$/, '') : 'module';
    var map = {
      feat: 'add ' + file + ' support',
      fix: 'resolve issue in ' + file,
      docs: 'update documentation',
      test: 'add tests for ' + file,
      refactor: 'refactor ' + file,
      style: 'format ' + file,
      ci: 'update CI workflow',
      chore: 'update ' + file,
      perf: 'improve performance in ' + file,
      build: 'update build config'
    };
    return map[type] || 'update ' + file;
  }

  function buildBody(diff, type) {
    var lines = [];
    var files = [];
    var re = /\+\+\+ b\/([^\s\n]+)/g;
    var m;
    while ((m = re.exec(diff))) files.push(m[1]);
    if (files.length > 1) {
      lines.push('Affected files:');
      files.slice(0, 8).forEach(function (f) { lines.push('- ' + f); });
    }
    var plus = (diff.match(/^\+[^+]/gm) || []).length;
    var minus = (diff.match(/^\-[^-]/gm) || []).length;
    if (plus || minus) lines.push('', 'Stats: +' + plus + ' / -' + minus + ' lines');
    if (type === 'fix') lines.push('', 'Why: prevent regressions and incorrect behavior.');
    return lines.length ? lines.join('\n').trim() : '';
  }

  function generate(diff) {
    if (!diff || !String(diff).trim()) return null;
    var d = String(diff);
    var td = detectType(d);
    var scope = detectScope(d);
    var breaking = detectBreaking(d);
    var summary = summarize(d, td.type);
    summary = summary.charAt(0).toLowerCase() + summary.slice(1);
    if (summary.length > 72) summary = summary.slice(0, 69) + '...';
    var header = td.type + (scope ? '(' + scope + ')' : '') + (breaking ? '!' : '') + ': ' + summary;
    var body = buildBody(d, td.type);
    if (breaking) body = (body ? body + '\n\n' : '') + 'BREAKING CHANGE: public API or schema may be incompatible.';
    return {
      header: header,
      body: body,
      full: body ? header + '\n\n' + body : header,
      type: td.type,
      scope: scope,
      breaking: breaking,
      confidence: td.confidence
    };
  }

  function promptForAI(diff) {
    return 'Você é um engenheiro sênior. Gere UMA mensagem de commit no padrão Conventional Commits a partir do git diff abaixo.\n\nRegras:\n- Formato: tipo(escopo opcional): descrição no imperativo, até 72 caracteres\n- Tipos: feat, fix, docs, style, refactor, perf, test, chore, ci, build\n- Use ! após o tipo/escopo se for breaking change\n- Corpo opcional com o porquê\n- Sem ponto final no subject\n- Responda com a mensagem completa (subject + body se útil)\n\nDiff:\n```\n' + String(diff).trim().slice(0, 6000) + '\n```';
  }

  global.IRNCommit = { generate: generate, promptForAI: promptForAI, detectType: detectType, detectScope: detectScope };
})(window);
