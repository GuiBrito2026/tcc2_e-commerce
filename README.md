# Conecta — e-commerce experimental

## Branch code-splitting

O modo `routes` divide o JavaScript por página com `React.lazy` e `Suspense`. Home, catálogo, detalhes, carrinho e checkout são carregados ao acessar as respectivas rotas. As imagens carregam imediatamente e os modais usam importações estáticas. Execute `npm run build` e publique `dist/routes/`.

Protótipo acadêmico para avaliar carregamento sob demanda. React, TypeScript, Vite e React Router, sem backend ou serviços externos. Base compartilhada por cinco builds.

## Executar em produção

Requer Node.js 22 e npm. O package-lock.json está presente: use `npm ci`.

```powershell
npm ci
npm run build
npm run preview -- --port 4173 --strictPort
```

Abra http://127.0.0.1:4173. O preview usa routes por padrão. Para gerar todas as versões: `npm run build:all`. Para servir outra: `npm run preview -- --mode combined --port 4173 --strictPort`. Cada saída deve ser servida na raiz da origem, com fallback SPA para index.html. `npm run dev` é apenas desenvolvimento, nunca coleta experimental.

## Funcionalidades

- Home `/`: apresentação, cinco categorias e dez destaques.
- Catálogo `/produtos`: 30 produtos, busca por nome, categoria, ordenação por preço, sem paginação ou virtualização.
- Detalhes `/produtos/:id`: três imagens, galeria, ampliação, descrição, preço, estoque, avaliações e escolha de quantidade.
- Carrinho `/carrinho`: quantidades limitadas ao estoque, remoção, subtotal, frete gratuito e total.
- Checkout `/checkout`: resumo dos itens, formulário fictício validado localmente e confirmação sem transmissão.
- Comparação explícita de dois ou três produtos. Modais com fechamento por Escape, foco inicial e retorno ao acionador.

Catálogo JSON determinístico: seis produtos em cada categoria (Teclados, Mouses, Áudio, Webcams, Hubs e adaptadores). Um produto esgotado permite testar o estado vazio de estoque. Notas, contagens e exemplos de avaliações são dados fictícios fixos.

Carrinho persistido em `localStorage`, chave `conecta.cart.v1`, apenas IDs e quantidades. Conteúdo inválido é descartado e quantidades são limitadas pelo estoque. Se o armazenamento estiver bloqueado, a loja funciona em memória e informa a limitação. Campos pessoais do checkout nunca são persistidos. Para cada repetição experimental de cache frio, use contexto novo e estado local vazio; manter dados entre tratamentos altera o ponto inicial.

## Tratamentos

| Build       | Imagens da listagem/miniaturas | Páginas    | Modais              |
| ----------- | ------------------------------ | ---------- | ------------------- |
| baseline    | eager                          | estáticas  | estáticos           |
| images      | lazy nativo                    | estáticas  | estáticos           |
| routes      | eager                          | React.lazy | estáticos           |
| interaction | eager                          | estáticas  | React.lazy ao abrir |
| combined    | lazy nativo                    | React.lazy | React.lazy ao abrir |

A imagem principal dos detalhes e o visualizador aberto são eager em todas as versões. Os modais são montados após clique em todos os grupos; somente os imports mudam. CSS, dados, imagens e funcionalidades são compartilhados. A baseline não seleciona módulos com import() ou React.lazy. Não há prefetch, preload manual, service worker ou dependências adicionadas para produzir lentidão.

## Arquivos e verificações

- `src/pages`, `src/components`, `src/interactions`: páginas, interface e modais compartilhados.
- `src/experiment`: imports estáticos/dinâmicos escolhidos pelo Vite.
- `src/state`: persistência e regras de quantidade do carrinho.
- `src/data/products.json`: conjunto único de produtos.
- `public/images`: 90 imagens **provisórias**.
- `docs/IMAGENS.md`, `docs/image-manifest.json`: origem, formato, resolução, bytes e hashes.
- `docs/EXPERIMENTO.md`: controles e protocolo proposto.
- `docs/BUILD-BASELINE.md`: estrutura real observada da saída de produção.

```powershell
npm run format:check
python scripts/check-source.py
npm run build:all
npm test
npx playwright install chromium
npm run test:e2e
node scripts/report-build.mjs
```

Os testes usam os builds de produção das cinco versões, com contextos independentes. Validam catálogo, filtros, ordenação, modais e momento de suas requisições, carrinho persistente, estoque, remoção, dados locais inválidos, checkout, ausência de requests externos, estados vazios e layout móvel/teclado. Acessibilidade básica testada não equivale a certificação WCAG.

## Formatação

Prettier 3.7.4 e EditorConfig. Use `npm run format` para aplicar e `npm run format:check` para verificar. O VS Code recomenda Prettier e configura formatar ao salvar. Dois espaços, aspas simples e largura preferencial de 100 caracteres. Python usa quatro espaços e não é formatado pelo Prettier. Sem hooks Git.

## Limitação antes da coleta

Validação do redesign: os cinco builds de produção, TypeScript, formatação e auditoria de imagens/CSS/manifests passaram. Os 15 testes funcionais passaram usando o Chrome instalado (157.0.8103.79), com inspeção visual desktop e mobile. Para repetir com esse navegador no PowerShell, execute `$env:PLAYWRIGHT_CHANNEL = 'chrome'` antes de `npm run test:e2e`; sem a variável, a suíte usa o Chromium padrão do Playwright. Consulte [DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) para tokens, componentes, validação e controles de comparabilidade. Nenhuma medição de desempenho foi realizada.

As imagens são ilustrações SVG originais leves, provisórias. Substitua-as por imagens representativas com origem/licença documentada, atualize o inventário, valide e congele o mesmo conjunto em todas as versões antes de medir desempenho. Não há resultados experimentais nem ganhos afirmados. Componentes pequenos podem produzir efeitos pequenos ou negativos.
