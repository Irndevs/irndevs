/**
 * IRN Devs — progresso multi-curso + copiar código + gabarito
 */
(function () {
  'use strict';

  var COURSES = {
    python: { key: 'irn_python_progress', total: 8, pattern: /curso-python-modulo-(\d)/, cert: 'certificado-python.html', label: 'Python' },
    docker: { key: 'irn_docker_progress', total: 6, pattern: /curso-docker-modulo-(\d)/, cert: 'certificado-docker.html', label: 'Docker' },
    linux: { key: 'irn_linux_progress', total: 6, pattern: /curso-linux-modulo-(\d)/, cert: 'certificado-linux.html', label: 'Linux' }
  };

  function detectCourse() {
    var path = location.pathname;
    for (var id in COURSES) {
      if (COURSES[id].pattern.test(path)) return id;
    }
    var el = document.body.getAttribute('data-course');
    if (el && COURSES[el]) return el;
    return null;
  }

  function load(courseId) {
    var c = COURSES[courseId];
    if (!c) return {};
    try { return JSON.parse(localStorage.getItem(c.key) || '{}'); } catch (e) { return {}; }
  }
  function save(courseId, data) {
    var c = COURSES[courseId];
    if (!c) return;
    localStorage.setItem(c.key, JSON.stringify(data));
  }
  function countDone(courseId, data) {
    var total = COURSES[courseId].total;
    var n = 0;
    for (var i = 1; i <= total; i++) if (data[i]) n++;
    return n;
  }
  function modNum(courseId) {
    var m = location.pathname.match(COURSES[courseId].pattern);
    return m ? parseInt(m[1], 10) : 0;
  }

  function renderProgressBar(container, courseId) {
    if (!container || !courseId) return;
    var data = load(courseId);
    var done = countDone(courseId, data);
    var total = COURSES[courseId].total;
    var pct = Math.round((done / total) * 100);
    container.innerHTML =
      '<div class="progress-bar-wrap"><div class="progress-bar" style="width:' + pct + '%"></div></div>' +
      '<div class="progress-label">' + COURSES[courseId].label + ': ' + done + ' de ' + total + ' módulos (' + pct + '%)</div>';
  }

  function markCards(courseId) {
    if (!courseId) return;
    var data = load(courseId);
    var re = COURSES[courseId].pattern;
    document.querySelectorAll('.mod-card').forEach(function (card) {
      var href = card.getAttribute('href') || '';
      var m = href.match(re);
      if (m && data[m[1]]) card.classList.add('done');
    });
  }

  function setupMarkDone(courseId) {
    var num = modNum(courseId);
    if (!num) return;
    var article = document.querySelector('article.wrap');
    if (!article) return;
    var data = load(courseId);
    var box = document.createElement('label');
    box.className = 'mark-done';
    box.innerHTML = '<input type="checkbox" id="irn-mark-done"' + (data[num] ? ' checked' : '') + '> Marcar este módulo como concluído';
    var progress = article.querySelector('.aula-progress');
    if (progress) article.insertBefore(box, progress);
    else article.appendChild(box);

    box.querySelector('input').addEventListener('change', function (e) {
      var d = load(courseId);
      if (e.target.checked) d[num] = true;
      else delete d[num];
      save(courseId, d);
      markCards(courseId);
      var bar = document.getElementById('irn-progress-bar');
      if (bar) renderProgressBar(bar, courseId);
      var total = COURSES[courseId].total;
      if (e.target.checked && num === total) {
        setTimeout(function () {
          if (confirm('Parabéns! Curso concluído. Gerar certificado?')) {
            location.href = COURSES[courseId].cert;
          }
        }, 300);
      }
    });
  }

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
          setTimeout(function () { btn.textContent = 'copiar'; btn.classList.remove('copied'); }, 1600);
        }).catch(function () { btn.textContent = 'erro'; });
      });
      wrap.appendChild(btn);
    });
  }

  function setupSolutions() {
    document.querySelectorAll('.exercise').forEach(function (ex) {
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
    var courseId = detectCourse();
    // páginas de índice podem ter várias barras
    document.querySelectorAll('[data-progress]').forEach(function (el) {
      renderProgressBar(el, el.getAttribute('data-progress'));
    });
    var bar = document.getElementById('irn-progress-bar');
    if (bar) {
      var cid = bar.getAttribute('data-progress') || courseId;
      if (cid) renderProgressBar(bar, cid);
    }
    if (courseId) {
      markCards(courseId);
      setupMarkDone(courseId);
    }
    setupCopy();
    setupSolutions();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.IRNProgress = { COURSES: COURSES, load: load, countDone: countDone, renderProgressBar: renderProgressBar };
})();
