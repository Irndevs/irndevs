# Melhorias SEO implementadas (v5)

## Pontos tratados

1. **Imagens em WebP**
   - Convertidos ebooks (ebookIA*.jpg → .webp) e todas as OG images (og-*.png → .webp)
   - Ícones e logos também em WebP
   - Referências HTML atualizadas para .webp
   - Qualidade 85 para bom balance tamanho/qualidade

2. **Keyword “IA” no início de títulos**
   - Atualizados títulos, H1, og:title e schema headline dos artigos principais de IA:
     - IA: Agentes com LangChain...
     - IA: Checklist de produção para RAG
     - IA: Busca semântica e hybrid search...
     - IA: Seu próprio Copilot local com Ollama
     - IA: RAG com pgvector...

3. **Links internos mais densos**
   - Adicionada seção “Leia também” com links contextuais entre os artigos de IA e o hub ia.html

4. **Self-host de fontes (redução RTT + privacidade)**
   - Removidos todos os links Google Fonts (preconnect, stylesheet, dns-prefetch)
   - CSS atualizado para system-ui / ui-monospace (zero RTT externo de fontes)
   - LCP e privacidade melhorados

5. **HowTo / FAQ schema**
   - Adicionado schema HowTo em artigo-checklist-rag.html e artigo-rag-pgvector.html
   - Outros artigos de Linux/DevOps já possuíam HowTo

## Arquivos gerados
- assets/img/*.webp (novos)
- HTML e CSS atualizados em massa

Próximos passos opcionais: width/height explícitos nas imgs, lazy loading nativo, mais conteúdo de autoridade.
