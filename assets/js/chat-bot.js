/**
 * IRN Devs — Chat Bot avançado
 * Inclua com: <script src="assets/js/chat-bot.js?v=20260916" defer></script>
 */
(function () {
  'use strict';

  var IRN_NOME = 'IRN Devs';
  if (document.getElementById('irn-chat-btn')) return;

  var css = [
    '#irn-chat-btn{position:fixed;bottom:132px;right:24px;width:56px;height:56px;background:#1a1f18;border:1px solid #3a4a32;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.4);transition:transform .2s,border-color .2s}',
    '#irn-chat-btn:hover{transform:scale(1.08);border-color:#c9a227}',
    '#irn-chat-btn svg{width:26px;height:26px;fill:#c9a227}',
    '#irn-chat-win{position:fixed;bottom:200px;right:24px;width:380px;max-width:calc(100vw - 32px);height:520px;background:#121610;border:1px solid #2a3326;border-radius:12px;display:none;flex-direction:column;overflow:hidden;z-index:9999;font-family:"IBM Plex Sans",system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.5)}',
    '#irn-chat-win.open{display:flex}',
    '#irn-chat-head{background:#1a1f18;border-bottom:1px solid #2a3326;padding:14px 16px;display:flex;align-items:center;gap:12px}',
    '#irn-chat-head .av{width:38px;height:38px;background:#252b22;border:1px solid #3a4a32;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px}',
    '#irn-chat-head .info h3{margin:0;font-size:14px;font-weight:600;color:#e8e6e0}',
    '#irn-chat-head .info span{font-size:11px;color:#8a9a7a;font-family:"IBM Plex Mono",monospace}',
    '#irn-chat-close{margin-left:auto;background:none;border:none;color:#8a9a7a;font-size:20px;cursor:pointer;line-height:1}',
    '#irn-chat-close:hover{color:#c9a227}',
    '#irn-chat-msgs{flex:1;padding:16px;overflow-y:auto;background:#0e120c}',
    '.irn-msg{max-width:88%;margin-bottom:12px;padding:10px 13px;border-radius:10px;font-size:13.5px;line-height:1.5;word-wrap:break-word}',
    '.irn-msg.bot{background:#1a1f18;border:1px solid #2a3326;color:#d4d2cc;border-top-left-radius:3px}',
    '.irn-msg.user{background:#252b22;border:1px solid #3a4a32;color:#e8e6e0;margin-left:auto;border-top-right-radius:3px}',
    '.irn-msg .t{font-size:10px;color:#6a7a5a;text-align:right;margin-top:5px;font-family:"IBM Plex Mono",monospace}',
    '.irn-opts{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}',
    '.irn-opt{background:#252b22;border:1px solid #3a4a32;color:#e8e6e0;padding:7px 11px;border-radius:20px;font-size:12.5px;cursor:pointer;transition:border-color .15s,background .15s}',
    '.irn-opt:hover{border-color:#c9a227;background:#2a3326}',
    '.irn-typing{display:flex;gap:4px;padding:8px 12px}',
    '.irn-typing span{width:7px;height:7px;background:#8a9a7a;border-radius:50%;animation:irn-bounce 1.2s infinite}',
    '.irn-typing span:nth-child(2){animation-delay:.15s}',
    '.irn-typing span:nth-child(3){animation-delay:.3s}',
    '@keyframes irn-bounce{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}',
    '#irn-chat-foot{border-top:1px solid #2a3326;padding:10px 12px;display:flex;gap:8px;background:#1a1f18}',
    '#irn-chat-input{flex:1;background:#0e120c;border:1px solid #2a3326;border-radius:8px;padding:10px 12px;color:#e8e6e0;font-size:13.5px;outline:none;font-family:inherit}',
    '#irn-chat-input:focus{border-color:#c9a227}',
    '#irn-chat-send{background:#c9a227;border:none;border-radius:8px;width:40px;height:40px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '#irn-chat-send:hover{filter:brightness(1.1)}',
    '#irn-chat-send svg{width:18px;height:18px;fill:#121610}',
    '.irn-wa-btn{display:inline-block;margin-top:8px;padding:8px 14px;background:#c9a227;color:#121610;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px}',
    '.irn-link{color:#c9a227;text-decoration:underline}',
    '@media(max-width:480px){#irn-chat-win{bottom:0;right:0;left:0;width:100%;max-width:100%;height:70vh;border-radius:12px 12px 0 0}#irn-chat-btn{bottom:100px;right:16px}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'irn-chat-btn';
  btn.setAttribute('aria-label', 'Abrir chat');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'irn-chat-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'Chat IRN Devs');
  win.innerHTML =
    '<div id="irn-chat-head">' +
      '<div class="av">🤖</div>' +
      '<div class="info"><h3>' + IRN_NOME + '</h3><span>● online</span></div>' +
      '<button id="irn-chat-close" aria-label="Fechar">×</button>' +
    '</div>' +
    '<div id="irn-chat-msgs"></div>' +
    '<div id="irn-chat-foot">' +
      '<input id="irn-chat-input" type="text" placeholder="Digite sua mensagem..." autocomplete="off" maxlength="500">' +
      '<button id="irn-chat-send" aria-label="Enviar"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
    '</div>';
  document.body.appendChild(win);

  var kb = [
    { k: ['oi', 'olá', 'ola', 'hey', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'], r: 'Olá! 👋 Sou o assistente da ' + IRN_NOME + '.\n\nPosso falar sobre cursos, serviços, projetos ou te conectar com um humano.' },
    { k: ['curso', 'cursos', 'python', 'aula', 'módulo', 'modulo', 'aprender', 'treinamento'], r: 'Temos o curso completo **Automações em Python** (8 módulos, ~14h):\n• Setup e scripts\n• Web scraping\n• Automação de navegador\n• Planilhas e dados\n• E-mails e arquivos\n• APIs e webhooks\n• Agendamento e Docker\n• Projeto final\n\nAcesse: <a class="irn-link" href="cursos.html">cursos.html</a>' },
    { k: ['preço', 'preços', 'valor', 'valores', 'quanto custa', 'orçamento', 'orcamento', 'custo', 'investimento'], r: 'Os valores variam conforme o escopo.\n\nPara um orçamento personalizado, abra o contato ou me diga o tipo de projeto (automação, site, API, infra...).' },
    { k: ['serviço', 'serviços', 'o que vocês fazem', 'trabalham com', 'desenvolvimento', 'automação', 'automacoes', 'infra'], r: 'Atuamos em:\n• Desenvolvimento de software e APIs\n• Automações (Python, bots, integrações)\n• Análise de dados e relatórios\n• Infraestrutura (Docker, k3s, observabilidade)\n• Homelab e hardening\n\nQuer detalhes de algum serviço? Veja também <a class="irn-link" href="servicos.html">servicos.html</a>' },
    { k: ['prazo', 'tempo', 'demora', 'quando fica', 'entrega'], r: 'MVPs simples: 2–4 semanas.\nProjetos médios/grandes: cronograma combinado após o briefing.\n\nPrefere falar com um atendente para alinhar prazo?' },
    { k: ['contato', 'telefone', 'email', 'e-mail', 'falar', 'whatsapp'], r: 'E-mail: contato@irndevs.com\nOu use o formulário em <a class="irn-link" href="contato.html">contato.html</a>.\n\nQuer que eu abra a página de contato agora?' },
    { k: ['humano', 'atendente', 'pessoa', 'falar com alguém', 'suporte', 'atendimento'], r: 'Claro! Abrindo o formulário de contato...' },
    { k: ['projeto', 'projetos', 'portfólio', 'portfolio', 'case', 'cases'], r: 'Temos projetos em produção: ZapAgendador IA, NeoBank, EcoMonitor, Homelab, observabilidade etc.\n\nQuer ver a página principal ou falar de um caso específico?' },
    { k: ['homelab', 'k3s', 'kubernetes', 'docker', 'proxmox'], r: 'Publicamos artigos práticos sobre Homelab, k3s, Proxmox, Docker e observabilidade.\n\nVeja o blog: <a class="irn-link" href="blog.html">blog.html</a> ou a página <a class="irn-link" href="homelab.html">homelab.html</a>.' },
    { k: ['pacote', 'pacotes', 'plano', 'planos'], r: 'Temos pacotes de contratação descritos em <a class="irn-link" href="pacotes.html">pacotes.html</a>.\n\nQuer um resumo ou prefere ir direto para orçamento?' },
    { k: ['obrigado', 'obrigada', 'valeu', 'thanks', 'vlw'], r: 'Por nada! Se precisar de mais alguma coisa, é só chamar. 👍' },
    { k: ['login', 'cadastro', 'conta', 'área do cliente', 'area do cliente'], r: 'Você pode criar conta ou entrar em <a class="irn-link" href="cadastro.html">cadastro.html</a> / <a class="irn-link" href="login.html">login.html</a>.\nA área do cliente fica em <a class="irn-link" href="area-cliente.html">area-cliente.html</a>.' },
    { k: ['privacidade', 'lgpd', 'dados', 'política'], r: 'Nossa Política de Privacidade está em <a class="irn-link" href="privacidade.html">privacidade.html</a>.' }
  ];

  var userCount = 0;
  var typingEl = null;

  function openChat() {
    win.classList.add('open');
    var msgs = document.getElementById('irn-chat-msgs');
    if (msgs.children.length === 0) {
      botMsg('Olá! 👋 Sou o assistente da ' + IRN_NOME + '.\n\nComo posso ajudar?');
      showOpts();
    }
    setTimeout(function () {
      var inp = document.getElementById('irn-chat-input');
      if (inp) inp.focus();
    }, 120);
  }

  function closeChat() {
    win.classList.remove('open');
  }

  function timeStr() {
    var d = new Date();
    return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function botMsg(txt) {
    removeTyping();
    var box = document.getElementById('irn-chat-msgs');
    var div = document.createElement('div');
    div.className = 'irn-msg bot';
    var safe = txt
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    div.innerHTML = safe + '<div class="t">' + timeStr() + '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function userMsg(txt) {
    var box = document.getElementById('irn-chat-msgs');
    var div = document.createElement('div');
    div.className = 'irn-msg user';
    div.innerHTML = escapeHtml(txt) + '<div class="t">' + timeStr() + '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function showTyping() {
    removeTyping();
    var box = document.getElementById('irn-chat-msgs');
    typingEl = document.createElement('div');
    typingEl.className = 'irn-msg bot';
    typingEl.innerHTML = '<div class="irn-typing"><span></span><span></span><span></span></div>';
    box.appendChild(typingEl);
    box.scrollTop = box.scrollHeight;
  }

  function removeTyping() {
    if (typingEl && typingEl.parentNode) {
      typingEl.parentNode.removeChild(typingEl);
    }
    typingEl = null;
  }

  function showOpts() {
    var box = document.getElementById('irn-chat-msgs');
    var div = document.createElement('div');
    div.className = 'irn-msg bot';
    div.innerHTML =
      '<div class="irn-opts">' +
        '<button type="button" class="irn-opt" data-opt="Quero um orçamento">💰 Orçamento</button>' +
        '<button type="button" class="irn-opt" data-opt="Quais serviços vocês oferecem?">🛠️ Serviços</button>' +
        '<button type="button" class="irn-opt" data-opt="Quero saber dos cursos">📚 Cursos</button>' +
        '<button type="button" class="irn-opt" data-opt="Quero falar com um atendente">👤 Humano</button>' +
      '</div>';
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    div.querySelectorAll('.irn-opt').forEach(function (b) {
      b.onclick = function () {
        document.getElementById('irn-chat-input').value = b.getAttribute('data-opt');
        sendMsg();
      };
    });
  }

  function sendMsg() {
    var inp = document.getElementById('irn-chat-input');
    var t = (inp.value || '').trim();
    if (!t) return;
    userMsg(t);
    inp.value = '';
    userCount++;
    showTyping();
    setTimeout(function () { reply(t); }, 600 + Math.random() * 900);
  }

  function reply(t) {
    var low = t.toLowerCase();

    if (/humano|atendente|pessoa|falar com|whatsapp|suporte|atendimento/.test(low)) {
      botMsg('Perfeito! Abrindo o contato...');
      setTimeout(function () {
        window.location.href = 'contato.html?assunto=Atendimento';
        closeChat();
      }, 800);
      return;
    }

    var best = null;
    var bestScore = 0;
    for (var i = 0; i < kb.length; i++) {
      var item = kb[i];
      var score = 0;
      for (var j = 0; j < item.k.length; j++) {
        if (low.indexOf(item.k[j]) !== -1) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        best = item.r;
      }
    }

    var resp = best || 'Não entendi completamente.\n\nVocê pode reformular ou escolher uma opção:\n• Orçamento\n• Serviços\n• Cursos\n• Falar com humano';
    botMsg(resp);

    if (userCount >= 3 && bestScore === 0) {
      setTimeout(function () {
        var box = document.getElementById('irn-chat-msgs');
        var div = document.createElement('div');
        div.className = 'irn-msg bot';
        div.innerHTML =
          'Prefere falar com um humano?<br>' +
          '<a href="contato.html?assunto=Atendimento" class="irn-wa-btn">✉️ Abrir contato</a>';
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
      }, 500);
    }
  }

  btn.addEventListener('click', function () {
    if (win.classList.contains('open')) closeChat();
    else openChat();
  });
  document.getElementById('irn-chat-close').addEventListener('click', closeChat);
  document.getElementById('irn-chat-send').addEventListener('click', sendMsg);
  document.getElementById('irn-chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMsg();
    }
  });
})();
