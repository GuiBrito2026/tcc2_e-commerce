# Forma — e-commerce experimental

Protótipo acadêmico React + TypeScript + Vite. Catálogo de 32 produtos, busca, filtros, ordenação, detalhes, comparação de até três produtos, carrinho e checkout fictício. Sem backend, APIs, fontes externas ou armazenamento de dados pessoais. O carrinho vive em memória e é reiniciado ao recarregar.

## Executar

Requer Node.js 22 e npm. Nesta primeira instalação, execute `npm install` para gerar `package-lock.json`; revise e versione esse arquivo antes de qualquer coleta. Nas instalações seguintes, use `npm ci` para reproduzir a árvore. As dependências diretas já estão fixadas em package.json. Execute `npm run dev` para desenvolvimento. **Nunca use o servidor de desenvolvimento para medir desempenho.**

```
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

Os builds são escritos em `dist/baseline`, `dist/images`, `dist/routes`, `dist/interaction` e `dist/combined`.

Para servir uma versão: `npm run preview -- --mode combined --port 4173 --strictPort`. Troque `combined` pelo tratamento desejado. Acesse http://127.0.0.1:4173. Execute cada versão como raiz de sua origem; não sirva os diretórios como subcaminhos. Hospedagens alternativas precisam de fallback SPA para `index.html`.

## Estrutura

- `src/pages`: catálogo, produto, carrinho e checkout compartilhados.
- `src/experiment`: adaptadores eager/lazy selecionados no build.
- `src/interactions`: comparador montado somente após clique.
- `src/components`, `src/state`, `src/data`: imagens, estado e catálogo JSON.
- `public/images`: 32 ilustrações SVG locais, originais e reproduzíveis.
- `scripts`: geração das fixtures, builds e auditoria de artefatos.
- `tests`: fluxos de navegador repetidos nos cinco builds.
- `docs/EXPERIMENTO.md`: decisões, limitações e protocolo.

As ilustrações SVG são **fixtures funcionais leves**, não um conjunto fotográfico representativo. Antes da coleta definitiva, substitua todo o conjunto por fotos locais licenciadas, congele os arquivos e regenere os cinco builds. Não altere imagens entre tratamentos. Nenhuma melhoria de desempenho é afirmada por este projeto.

Dependências de execução: React/React DOM (interface), React Router DOM (SPA). Desenvolvimento: Vite/plugin React (compilação), TypeScript e tipos (verificação), Playwright (testes fora da aplicação). Nenhuma biblioteca de UI, estado, ícones ou gráficos foi adicionada.

## Estado da validação em 17/11/2026

A geração do catálogo e a verificação estática sem dependências passaram. A instalação npm falhou por DNS (`ENOTFOUND registry.npmjs.org`); a tentativa offline também falhou (`ENOTCACHED`). Por isso ainda não há lockfile nem builds de produção validados. Typecheck, auditoria dos builds e testes Playwright estão preparados, mas pendentes de instalação. A tentativa inicial de build encontrou tipos ausentes. Não iniciar medições antes de executar os comandos acima com sucesso. Não foi realizada inspeção visual em navegador.
