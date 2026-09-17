/**
 * IRN Legacy Engine — análise heurística de código legado
 */
(function (global) {
  'use strict';

  function analyze(code) {
    if (!code || !String(code).trim()) return null;
    var c = String(code);
    var lines = c.split(/\r?\n/);
    var issues = [];
    var comments = [];
    var metrics = {
      lines: lines.length,
      functions: (c.match(/\bfunction\b|\bdef\b|\bfunc\b/g) || []).length,
      classes: (c.match(/\bclass\b/g) || []).length,
      todos: (c.match(/TODO|FIXME|HACK|XXX/gi) || []).length,
      magicNumbers: (c.match(/(?<![.\w])\b\d{2,}\b(?![.\w])/g) || []).length,
      longLines: lines.filter(function (l) { return l.length > 100; }).length,
      nestedIf: (c.match(/if\s*\([^)]*\)\s*\{[^}]*if\s*\(/g) || []).length
    };

    if (metrics.todos) issues.push({ severity: 'info', msg: metrics.todos + ' TODO/FIXME encontrados — priorize ou crie issues' });
    if (metrics.longLines > 3) issues.push({ severity: 'warn', msg: metrics.longLines + ' linhas > 100 chars — legibilidade ruim' });
    if (metrics.nestedIf > 0) issues.push({ severity: 'warn', msg: 'Ifs aninhados detectados — considere early return ou extrair função' });
    if (/\beval\s*\(|document\.write\s*\(/i.test(c)) issues.push({ severity: 'critical', msg: 'Uso de eval/document.write — risco de segurança' });
    if (/password\s*=\s*['\"][^'\"]+['\"]|api[_-]?key\s*=\s*['\"][^'\"]+['\"]/i.test(c)) {
      issues.push({ severity: 'critical', msg: 'Possível segredo hardcoded' });
    }
    if (/SELECT \* FROM|SELECT\s+\*\s+FROM/i.test(c) && /\+|concat/i.test(c)) {
      issues.push({ severity: 'critical', msg: 'Possível SQL montado por concatenação (injection)' });
    }
    if (!/\/\*|\/\/|#/.test(c) && metrics.lines > 30) {
      issues.push({ severity: 'info', msg: 'Poucos comentários em arquivo longo' });
    }
    if (/\bvar\b/.test(c) && /\b(let|const)\b/.test(c) === false && /\.js\b|function/.test(c)) {
      issues.push({ severity: 'info', msg: 'Uso de var — prefira const/let' });
    }

    // suggested header comment
    comments.push('/**');
    comments.push(' * Módulo analisado automaticamente (heurística local).');
    comments.push(' * Funções: ~' + metrics.functions + ' | Classes: ~' + metrics.classes + ' | Linhas: ' + metrics.lines);
    comments.push(' */');

    var score = 100;
    issues.forEach(function (i) {
      if (i.severity === 'critical') score -= 25;
      else if (i.severity === 'warn') score -= 10;
      else score -= 3;
    });
    score = Math.max(0, Math.min(100, score));

    return {
      metrics: metrics,
      issues: issues,
      score: score,
      suggestedHeader: comments.join('\n'),
      summary: score >= 80 ? 'Código relativamente saudável' : score >= 50 ? 'Atenção a alguns pontos' : 'Revisão prioritária recomendada'
    };
  }

  function formatReport(result) {
    if (!result) return '';
    var lines = [];
    lines.push('=== Análise local de código legado ===');
    lines.push('Score: ' + result.score + '/100 — ' + result.summary);
    lines.push('');
    lines.push('Métricas:');
    lines.push('- Linhas: ' + result.metrics.lines);
    lines.push('- Funções: ' + result.metrics.functions);
    lines.push('- Classes: ' + result.metrics.classes);
    lines.push('- TODOs: ' + result.metrics.todos);
    lines.push('');
    if (result.issues.length) {
      lines.push('Achados:');
      result.issues.forEach(function (i) {
        lines.push('- [' + i.severity.toUpperCase() + '] ' + i.msg);
      });
    } else {
      lines.push('Nenhum smell óbvio detectado pelas regras locais.');
    }
    lines.push('');
    lines.push('Cabeçalho sugerido:');
    lines.push(result.suggestedHeader);
    lines.push('');
    lines.push('(Heurística local — para explicação profunda use o prompt + LLM.)');
    return lines.join('\n');
  }

  function promptForAI(code) {
    return 'Você é um engenheiro sênior especializado em código legado.\n\n1. Explique o que o código faz (visão de alto nível)\n2. Liste riscos (bugs, segurança, performance)\n3. Adicione comentários profissionais (em português) que um dev júnior entenderia\n4. Sugira refatorações prioritárias sem reescrever tudo de uma vez\n\nCódigo:\n```\n' + String(code).slice(0, 8000) + '\n```';
  }

  global.IRNLegacy = { analyze: analyze, formatReport: formatReport, promptForAI: promptForAI };
})(window);
