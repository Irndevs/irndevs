# IRN Devs IA — v8 Motor Real

## O que mudou

### 1. Conversor de linguagens — MOTOR REAL (principal)
Arquivo: `site/demo-conversor-linguagens.html`

- **Antes**: só montava prompt para colar no ChatGPT/Claude/Cursor.
- **Agora**: motor de conversão **local no browser** (zero rede) para:
  - Python → JavaScript
  - Python → TypeScript
  - JavaScript → Python
  - TypeScript → Python
  - JavaScript → TypeScript (anotações `any` simples)
  - TypeScript → JavaScript (strip de tipos)

**O que o motor transforma de verdade:**
- `def` / `async def` → `function` / `async function` / `constructor`
- classes + `self` → `this`
- type hints Python → tipos TS (`int`→`number`, `list[str]`→`string[]`, `dict|None`, etc.)
- `True/False/None`, `and/or/not`
- f-strings → template literals
- `if/elif/else`, `for range`, `for in`, `while`
- `try/except/finally` → `try/catch/finally`
- `raise` → `throw new Error`
- `print` → `console.log`
- docstrings → JSDoc
- fechamento de blocos por indentação (heurística)

**Limitações honestas** (listadas na própria UI):
- list comprehensions complexas, decorators avançados, genéricos profundos → use o botão de **prompt** + LLM
- imports precisam de ajuste manual (marcados com `// TODO`)

Botão principal: **“converter local (motor real)”**  
Fallback: “gerar e copiar prompt” (para qualquer par de linguagens).

### 2. Outras ferramentas reforçadas (já tinham lógica local)

| Ferramenta | Arquivo | Lógica genuína |
|---|---|---|
| Commits inteligentes | `demo-commit-ia.html` | Heurísticas no browser: tipo de arquivo, keywords do diff, adições/remoções → Conventional Commits |
| Mock data | `demo-mock-data.html` | Geradores locais por domínio (vet, e-commerce, SaaS, homelab) com IDs/datas/relações |
| Checklist | `ferramenta-checklist.html` | Score e geração de checklist interativo (automação / pipeline) |
| SQL / legado / lab de prompts | `ia.html` | Prompts base + cards atualizados apontando para demos com motor local |

### 3. Hub `ia.html`
- Card do conversor marcado **MOTOR REAL**
- Textos de commit e mock atualizados para refletir lógica local
- Linha de status das demos atualizada

## Como testar
1. Abra `site/demo-conversor-linguagens.html`
2. Clique em “ex: Python função”
3. Clique em **converter local (motor real)**
4. Veja o TypeScript gerado no browser (sem rede)

## Integração no site completo
Substitua os arquivos correspondentes no deploy (mesmo caminho sob `site/`).
