/**
 * IRN Devs — Chat Bot + redirecionamento WhatsApp
 * Inclua com: <script src="assets/js/chat-bot.js?v=1" defer></script>
 *
 * Configure o número do WhatsApp abaixo (somente dígitos, com DDI).
 */
(function () {
  'use strict';

  // ====== CONFIGURE AQUI ======
  var IRN_WA = '5500000000000'; // Ex: 5511987654321
  var IRN_NOME = 'IRN Devs';
  // ============================

  if (document.getElementById('irn-chat-btn')) return; // já carregado

  var css = [
    '#irn-chat-btn{position:fixed;bottom:132px;right:24px;width:56px;height:56px;background:#1a1f18;border:1px solid #3a4a32;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.4);transition:transform .2s,border-color .2s}',
    '#irn-chat-btn:hover{transform:scale(1.08);border-color:#c9a227}',
    '#irn-chat-btn svg{width:26px;height:26px;fill:#c9a227}',
    '#irn-chat-win{position:fixed;bottom:200px;right:24px;width:360px;max-width:calc(100vw - 32px);height:500px;background:#121610;border:1px solid #2a3326;border-radius:12px;display:none;flex-direction:column;overflow:hidden;z-index:9999;font-family:"IBM Plex Sans",system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.5)}',
    '#irn-chat-win.open{display:flex}',
    '#irn-chat-head{background:#1a1f18;border-bottom:1px solid #2a3326;padding:14px 16px;display:flex;align-items:center;gap:12px}',
    '#irn-chat-head .av{width:38px;height:38px;background:#252b22;border:1px solid #3a4a32;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px}',
    '#irn-chat-head .info h3{margin:0;font-size:14px;font-weight:600;color:#e8e6e0}',
    '#irn-chat-head .info span{font-size:11px;color:#8a9a7a;font-family:"IBM Plex Mono",monospace}',
    '#irn-chat-close{margin-left:auto;background:none;border:none;color:#8a9a7a;font-size:20px;cursor:pointer;line-height:1}',
    '#irn-chat-close:hover{color:#c9a227}',
    '#irn-chat-msgs{flex:1;padding:16px;overflow-y:auto;background:#0e120c}',
    '.irn-msg{max-width:85%;margin-bottom:12px;padding:10px 13px;border-radius:10px;font-size:13.5px;line-height:1.5;word-wrap:break-word}',
    '.irn-msg.bot{background:#1a1f18;border:1px solid #2a3326;color:#d4d2cc;border-top-left-radius:3px}',
    '.irn-msg.user{background:#252b22;border:1px solid #3a4a32;color:#e8e6e0;margin-left:auto;border-top-right-radius:3px}',
    '.irn-msg .t{font-size:10px;color:#6a7a5a;text-align:right;margin-top:5px;font-family:"IBM Plex Mono",monospace}',
    '.irn-opts{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}',
    '.irn-opt{background:transparent;border:1px solid #3a4a32;color:#c9a227;padding:7px 12px;border-radius:16px;font-size:12.5px;cursor:pointer;font-family:"IBM Plex Sans",sans-serif;transition:all .15s}',
    '.irn-opt:hover{background:#c9a227;color:#121610;border-color:#c9a227}',
    '#irn-chat-input-area{padding:12px;background:#1a1f18;border-top:1px solid #2a3326;display:flex;gap:8px}',
    '#irn-chat-input{flex:1;background:#0e120c;border:1px solid #2a3326;border-radius:8px;padding:10px 14px;color:#e8e6e0;font-size:13.5px;outline:none;font-family:"IBM Plex Sans",sans-serif}',
    '#irn-chat-input:focus{border-color:#c9a227}',
    '#irn-chat-input::placeholder{color:#5a6a4a}',
    '#irn-chat-send{width:40px;height:40px;background:#252b22;border:1px solid #3a4a32;border-radius:8px;color:#c9a227;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center}',
    '#irn-chat-send:hover{background:#c9a227;color:#121610;border-color:#c9a227}',
    '.irn-wa-btn{display:inline-flex;align-items:center;gap:8px;background:#1f2a1a;border:1px solid #3a4a32;color:#c9a227;padding:9px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:500;margin-top:8px;transition:all .15s}',
    '.irn-wa-btn:hover{background:#c9a227;color:#121610;border-color:#c9a227}',
    '@media (max-width:899px){#irn-chat-btn{bottom:178px}#irn-chat-win{bottom:246px;height:min(500px,calc(100dvh - 270px))}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('div');
  btn.id = 'irn-chat-btn';
  btn.title = 'Chat';
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>';
  btn.onclick = openChat;
  document.body.appendChild(btn);

  var win = document.createElement('div');
  win.id = 'irn-chat-win';
  win.innerHTML =
    '<div id="irn-chat-head">' +
      '<div class="av">🤖</div>' +
      '<div class="info"><h3>' + IRN_NOME + '</h3><span>assistente · online</span></div>' +
      '<button id="irn-chat-close" type="button" aria-label="Fechar">×</button>' +
    '</div>' +
    '<div id="irn-chat-msgs"></div>' +
    '<div id="irn-chat-input-area">' +
      '<input type="text" id="irn-chat-input" placeholder="Digite sua mensagem..." autocomplete="off">' +
      '<button id="irn-chat-send" type="button" aria-label="Enviar">→</button>' +
    '</div>';
  document.body.appendChild(win);

  document.getElementById('irn-chat-close').onclick = closeChat;
  document.getElementById('irn-chat-send').onclick = sendMsg;
  document.getElementById('irn-chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMsg();
  });

  var kb = [
    { k: ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hey', 'eae', 'fala'], r: 'Olá! 👋 Sou o assistente da ' + IRN_NOME + '.\n\nPosso te ajudar com informações sobre projetos, serviços ou te conectar com um humano.' },
    { k: ['preço', 'preços', 'valor', 'valores', 'quanto custa', 'orçamento', 'orcamento', 'custo'], r: 'Os valores variam conforme o escopo do projeto.\n\nQuer que eu te redirecione para o WhatsApp para um orçamento personalizado?' },
    { k: ['serviço', 'serviços', 'o que vocês fazem', 'trabalham com', 'desenvolvimento', 'automação', 'automacoes'], r: 'Trabalhamos com:\n• Desenvolvimento de software\n• Automações e integrações\n• Análise de dados\n• Infra (k3s, Docker, observabilidade)\n\nQuer detalhes de algum serviço?' },
    { k: ['prazo', 'tempo', 'demora', 'quando fica'], r: 'Depende da complexidade. MVPs simples costumam ficar prontos em 2–4 semanas. Projetos maiores seguem cronograma combinado.\n\nPrefere falar com um atendente?' },
    { k: ['contato', 'telefone', 'email', 'e-mail', 'falar'], r: 'Você pode falar conosco pelo WhatsApp ou pelo e-mail contato@irndevs.com.\n\nQuer ir direto pro WhatsApp?' },
    { k: ['humano', 'atendente', 'pessoa', 'falar com alguém', 'suporte', 'whatsapp'], r: 'Claro! Vou te redirecionar para o WhatsApp agora.' },
    { k: ['projeto', 'projetos', 'portfólio', 'portfolio'], r: 'Temos vários projetos em produção (ZapAgendador IA, NeoBank, EcoMonitor, Homelab etc.).\n\nQuer ver a lista completa na página ou prefere falar sobre um caso específico?' },
    { k: ['obrigado', 'obrigada', 'valeu', 'thanks'], r: 'Por nada! Se precisar de mais alguma coisa, é só chamar.' }
  ];

  var userCount = 0;

  function openChat() {
    win.classList.add('open');
    var msgs = document.getElementById('irn-chat-msgs');
    if (msgs.children.length === 0) {
      botMsg('Olá! 👋 Sou o assistente da ' + IRN_NOME + '.\n\nComo posso ajudar?');
      showOpts();
    }
    setTimeout(function () {
      document.getElementById('irn-chat-input').focus();
    }, 100);
  }

  function closeChat() {
    win.classList.remove('open');
  }

  function timeStr() {
    var d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function botMsg(txt) {
    var box = document.getElementById('irn-chat-msgs');
    var div = document.createElement('div');
    div.className = 'irn-msg bot';
    div.innerHTML = txt.replace(/\n/g, '<br>') + '<div class="t">' + timeStr() + '</div>';
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

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function showOpts() {
    var box = document.getElementById('irn-chat-msgs');
    var div = document.createElement('div');
    div.className = 'irn-msg bot';
    div.innerHTML =
      '<div class="irn-opts">' +
        '<button type="button" class="irn-opt" data-opt="Quero um orçamento">💰 Orçamento</button>' +
        '<button type="button" class="irn-opt" data-opt="Quais serviços vocês oferecem?">🛠️ Serviços</button>' +
        '<button type="button" class="irn-opt" data-opt="Quero falar com um atendente">👤 Falar com humano</button>' +
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
    setTimeout(function () { reply(t); }, 500 + Math.random() * 700);
  }

  function reply(t) {
    var low = t.toLowerCase();

    if (/humano|atendente|pessoa|falar com|whatsapp|suporte/.test(low)) {
      botMsg('Perfeito! Abrindo o WhatsApp...');
      setTimeout(function () {
        window.open(
          'https://wa.me/' + IRN_WA + '?text=' + encodeURIComponent('Olá! Vim do site IRN Devs e gostaria de atendimento.'),
          '_blank'
        );
        closeChat();
      }, 900);
      return;
    }

    var resp = null;
    for (var i = 0; i < kb.length; i++) {
      var item = kb[i];
      for (var j = 0; j < item.k.length; j++) {
        if (low.indexOf(item.k[j]) !== -1) {
          resp = item.r;
          break;
        }
      }
      if (resp) break;
    }
    if (!resp) {
      resp = 'Não entendi completamente.\n\nPode reformular ou prefere falar direto com um atendente no WhatsApp?';
    }

    botMsg(resp);

    if (userCount >= 2) {
      setTimeout(function () {
        var box = document.getElementById('irn-chat-msgs');
        var div = document.createElement('div');
        div.className = 'irn-msg bot';
        div.innerHTML =
          'Quer continuar com um humano?<br>' +
          '<a href="https://wa.me/' + IRN_WA + '?text=' + encodeURIComponent('Olá! Vim do site IRN Devs e gostaria de atendimento.') +
          '" target="_blank" rel="noopener noreferrer" class="irn-wa-btn">📱 Abrir WhatsApp</a>';
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        div.querySelector('a').addEventListener('click', closeChat);
      }, 600);
    }
  }
})();
