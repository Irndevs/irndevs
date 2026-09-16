# Melhorias SEO & Evolução — v6 (implementação dos 8 pontos)

## Pontos implementados um a um

### 1. width / height / loading / decoding nas imagens
- Logo no site-nav.js: width, height, loading="eager", decoding="async"
- Imagem de conteúdo (diagram-stack): loading="lazy" + decoding="async"
- (O site tem pouquíssimas <img> de conteúdo; OGs e ícones já estavam em meta tags)

### 2. FAQ schema nos artigos principais de IA
- FAQPage adicionado em:
  - artigo-rag-pgvector.html
  - artigo-checklist-rag.html
  - artigo-hybrid-search.html
  - artigo-ollama-local.html
  - artigo-agentes-langchain.html
  - artigo-apis-ia.html
  - artigo-avaliacao-rag.html (novo)
  - artigo-guardrails-agentes.html (novo)

### 3. dateModified + “Atualizado em…”
- Schema BlogPosting: dateModified="2026-09-16" nos artigos de IA
- Texto visível no meta: “Atualizado em 16 set 2026”

### 4. CTAs de conversão
- Bloco “Quer implementar isso na sua empresa?” com links para contato.html e como-contratar.html
- Presente nos 6 artigos principais de IA + 2 novos

### 5. Sitemap atualizado
- lastmod atualizado para 2026-09-16
- Novos artigos incluídos no sitemap.xml
- **Ação manual restante**: submeter no Google Search Console

### 6. Novos artigos de autoridade em IA
- **artigo-avaliacao-rag.html** — Avaliação de RAG em produção (métricas, golden set, continuous evaluation)
- **artigo-guardrails-agentes.html** — Guardrails e segurança em agentes
- Cards adicionados no blog.html
- Links no hub ia.html
- Schema HowTo + FAQ + BlogPosting completos

### 7. Self-host de fontes
- Zero dependência de Google Fonts
- Todas as referências IBM Plex substituídas por system-ui / ui-monospace
- Zero RTT externo de fontes + melhor privacidade

### 8. Cases reais + expandir /en/
- en/index.html expandido com seção de AI for production teams + links
- Cases reais: depende de material autorizado do cliente (marcado em PENDENTE-MANUAL)

## Arquivos novos
- artigo-avaliacao-rag.html
- artigo-guardrails-agentes.html
- MELHORIAS_SEO_V6.md

## Próximos passos manuais
1. Push para GitHub Pages
2. Submeter sitemap no Search Console
3. Fornecer cases/depoimentos reais para seção de prova social
4. (Opcional) Baixar woff2 da IBM Plex e self-host completo se quiser tipografia idêntica
