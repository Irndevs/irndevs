document.querySelectorAll(".faq-q").forEach(c=>{c.addEventListener("click",()=>{const n=c.parentElement,e=n.classList.contains("active");document.querySelectorAll(".faq-item").forEach(t=>t.classList.remove("active")),e||n.classList.add("active")})});(function(){try{var n=new URLSearchParams(location.search),e=n.get("assunto")||n.get("subject")||"",t=n.get("msg")||n.get("message")||"",s=document.getElementById("subject"),o=document.getElementById("message"),d={"MVP web":`Olá, IRN Devs.

Tenho interesse no pacote MVP web.

Contexto do produto/ideia:
-

Prazo desejado:
-

Orçamento aproximado (opcional):
-
`,"Automacao de processo":`Olá, IRN Devs.

Tenho interesse no pacote Automação de processo.

Processo atual (passos manuais):
-

Sistemas envolvidos:
-

Volume aproximado (ex.: N casos/semana):
-
`,"Automação de processo":`Olá, IRN Devs.

Tenho interesse no pacote Automação de processo.

Processo atual (passos manuais):
-

Sistemas envolvidos:
-

Volume aproximado (ex.: N casos/semana):
-
`,"Dashboard de indicadores":`Olá, IRN Devs.

Tenho interesse no pacote Dashboard de indicadores.

Fontes de dados:
-

Indicadores que preciso ver:
-

Quem usa o painel:
-
`,"Checklist automacao":`Olá, IRN Devs.

Gerei o checklist de automação no site e gostaria de ajuda para implementar os itens pendentes.

(Cole aqui o texto do checklist, se quiser.)

`,"Checklist dados":`Olá, IRN Devs.

Gerei o checklist de pipeline de dados no site e gostaria de ajuda para implementar os itens pendentes.

(Cole aqui o texto do checklist, se quiser.)

`};if(s&&e){for(var l=!1,r=0;r<s.options.length;r++){var a=s.options[r];if(a.value===e||a.textContent===e||a.textContent&&a.textContent.indexOf(e)!==-1){a.selected=!0,l=!0;break}}if(!l){var i=document.createElement("option");i.value=e,i.textContent=e,i.selected=!0,s.appendChild(i)}var m=document.querySelector('input[name="_subject"]');m&&(m.value="IRN Devs — "+e)}if(o)if(t)try{o.value=decodeURIComponent(t)}catch{o.value=t}else e&&d[e]&&(o.value=d[e]);if(o&&o.value)try{o.focus()}catch{}}catch{}})();document.getElementById("contactForm").addEventListener("submit",async function(c){c.preventDefault();const n=c.target,e=n.querySelector(".submit-btn"),t=document.getElementById("successMessage"),s=n.querySelector("#email").value;if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)){alert("Por favor, insira um email válido.");return}e.disabled=!0,e.textContent="enviando...";try{const d=new FormData(n);if(!(await fetch("https://formsubmit.co/ajax/contato@irndevs.com",{method:"POST",body:d,headers:{Accept:"application/json"}})).ok)throw new Error("fail");t.classList.add("show"),n.reset(),setTimeout(()=>t.classList.remove("show"),6e3)}catch{const l=n.querySelector("#name").value,r=n.querySelector("#subject").value,a=n.querySelector("#message").value,i=encodeURIComponent("De: "+l+" <"+s+`>
Assunto: `+r+`

`+a);window.location.href="mailto:contato@irndevs.com?subject="+encodeURIComponent("IRN Devs — "+r)+"&body="+i}e.disabled=!1,e.textContent="enviar mensagem →"});
