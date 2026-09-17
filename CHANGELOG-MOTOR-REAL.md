# IRN Devs IA — v8.1 Evolução completa

## Motores locais (assets/js/)

| Arquivo | Função |
|---------|--------|
| `commit-engine.js` | Conventional Commits: tipo, escopo, breaking, body, confiança |
| `sql-engine.js` | NL (pt) → PostgreSQL / MySQL / MongoDB |
| `mock-engine.js` | Domínios + **schema livre** (`id:id, email:email, status:enum:a\|b`) |
| `legacy-engine.js` | Score, smells, segredos, SQL injection, cabeçalho |
| `ia-history.js` | Histórico unificado em localStorage |

## Demos interativas

- `demo-conversor-linguagens.html` — motor Python ⇄ JS ⇄ TS
- `demo-commit-ia.html` — motor commits reforçado
- `demo-mock-data.html` — schema opcional + engine
- `demo-sql.html` — **novo** gerador SQL local
- `demo-legado.html` — **novo** análise de código legado
- `ferramenta-checklist.html` — checklist interativo

## Hub `ia.html`

- Links para todas as demos com motor local
- Seção **Histórico local** das ferramentas
- Textos atualizados (não é só “copiar prompt”)

## Como validar

1. Abra cada demo e clique no botão principal (gerar/analisar/converter)
2. Confira que a saída aparece **sem rede**
3. Em `ia.html` role até o histórico após usar as demos
