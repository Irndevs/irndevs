/**
 * IRN Devs — progresso do curso + botão copiar código + gabarito
 */
(function () {
  'use strict';
  var KEY = 'irn_python_progress';
  var TOTAL = 8;

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }
  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function modNumFromPath() {
    var m = location.pathname.match(/curso-python-modulo-(\d)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function countDone(data) {
    var n = 0;
    for (var i = 1; i <= TOTAL; i++) if (data[i]) n++;
    return n;
  }

  // Barra de progresso
  function renderProgressBar(container) {
    if (!container) return;
    var data = load();
    var done = countDone(data);
    var pct = Math.round((done / TOTAL) * 100);
    container.innerHTML =
      '<div class="progress-bar-wrap"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="progress-label">' + done + ' de ' + TOTAL + ' módulos concluídos (' + pct + '%)</div>';
  }

  // Marcar cards concluídos no sumário
  function markCards() {
    var data = load();
    document.querySelectorAll('.mod-card').forEach(function (card) {
      var href = card.getAttribute('href') || '';
      var m = href.match(/modulo-(\d)/);
      if (m && data[m[1]]) card.classList.add('done');
    });
  }

  // Checkbox "marcar como concluído"
  function setupMarkDone() {
    var num = modNumFromPath();
    if (!num) return;
    var article = document.querySelector('article.wrap');
    if (!article) return;
    var data = load();
    var box = document.createElement('label');
    box.className = 'mark-done';
    box.innerHTML = '<input type="checkbox" id="irn-mark-done"' + (data[num] ? ' checked' : '') + '> Marcar este módulo como concluído';
    var progress = article.querySelector('.aula-progress');
    if (progress) article.insertBefore(box, progress);
    else article.appendChild(box);

    box.querySelector('input').addEventListener('change', function (e) {
      var d = load();
      if (e.target.checked) d[num] = true;
      else delete d[num];
      save(d);
      markCards();
      var bar = document.getElementById('irn-progress-bar');
      if (bar) renderProgressBar(bar);
      if (e.target.checked && num === TOTAL) {
        setTimeout(function () {
          if (confirm('Parabéns! Você concluiu os 8 módulos. Gerar certificado?')) {
            location.href = 'certificado-python.html';
          }
        }, 300);
      }
    });
  }

  // Botões copiar em cada <pre>
  function setupCopy() {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.closest('.code-block')) return;
      var wrap = document.createElement('div');
      wrap.className = 'code-block';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'copiar';
      btn.addEventListener('click', function () {
        var text = pre.innerText || pre.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'copiado!';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = 'copiar';
            btn.classList.remove('copied');
          }, 1600);
        }).catch(function () {
          btn.textContent = 'erro';
        });
      });
      wrap.appendChild(btn);
    });
  }

  // Gabaritos (botão toggle em .exercise com data-solution)
  function setupSolutions() {
    document.querySelectorAll('.exercise').forEach(function (ex, idx) {
      var solText = ex.getAttribute('data-solution');
      if (!solText) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toggle-sol';
      btn.textContent = 'mostrar gabarito';
      var sol = document.createElement('div');
      sol.className = 'solution';
      sol.innerHTML = solText;
      ex.appendChild(btn);
      ex.appendChild(sol);
      btn.addEventListener('click', function () {
        sol.classList.toggle('open');
        btn.textContent = sol.classList.contains('open') ? 'ocultar gabarito' : 'mostrar gabarito';
      });
    });
  }

  function init() {
    var barHost = document.getElementById('irn-progress-bar');
    if (barHost) renderProgressBar(barHost);
    markCards();
    setupMarkDone();
    setupCopy();
    setupSolutions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // export para cursos.html
  window.IRNProgress = { load: load, countDone: countDone, TOTAL: TOTAL, renderProgressBar: renderProgressBar };
})();
