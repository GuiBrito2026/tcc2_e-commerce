# Conecta — identidade visual

## Alternância de tema

O botão “Modo escuro” no header alterna a paleta e expõe o estado com aria-pressed. A paleta clara permanece o padrão em contextos novos, independentemente do tema do sistema operacional. A escolha é salva na chave localStorage `conecta.theme`; quando o armazenamento está bloqueado, o botão continua funcionando na página atual. Um script pequeno e idêntico em todos os builds restaura a preferência antes da renderização, evitando o flash inicial da paleta clara.

O modo escuro substitui apenas tokens de cores e color-scheme; não modifica arquivos de imagem, proporções ou estratégias de carregamento. Na coleta experimental, mantenha o mesmo tema em todos os tratamentos e repetições (recomenda-se o padrão claro com contexto novo). O componente ThemeToggle é importado estaticamente e não adiciona dependências.

## Direção

Minimalismo editorial: branco quente, contraste preto/cinza, espaço entre blocos, linhas finas e assinatura tipográfica. A Home reutiliza seus dez destaques e as cinco categorias, sem imagens adicionais. O monograma decorativo do hero é composto em CSS e fica fora da árvore de acessibilidade.

## Tokens

| Papel                      | Valor                                      |
| -------------------------- | ------------------------------------------ |
| Fundo                      | `#faf9f6`                                  |
| Superfície                 | `#ffffff`                                  |
| Superfície secundária      | `#f0efeb`                                  |
| Texto principal            | `#20201e`                                  |
| Texto secundário           | `#66645f`                                  |
| Divisórias                 | `#d9d7d0`                                  |
| Borda de controle          | `#85827a`                                  |
| Tipografia principal       | Helvetica Neue / Arial / sans-serif locais |
| Acento editorial do título | Georgia / Times New Roman locais           |
| Espaçamento                | 4, 8, 12, 16, 24, 32, 40, 48, 64 e 96 px   |
| Largura máxima             | 1320 px                                    |
| Recuo lateral              | 40 px desktop / 20 px mobile               |
| Raio de controles          | 3 px                                       |
| Transições                 | 160 ms, cores e bordas                     |

Tokens em `src/design-tokens.css`, incorporados ao CSS global por import local. Nenhuma fonte externa, biblioteca, imagem ou requisição adicional. As cores dos arquivos de produto permanecem intactas: não há filtro de imagem para forçar a paleta neutra.

## Componentes e composição

- `SiteHeader.tsx`: apresentação compacta, marca, navegação principal e contador recebido por prop. Estado ativo com sublinhado; sem alteração no estado do carrinho.
- `SiteFooter.tsx`: marca, frase existente, links para rotas existentes e aviso de loja fictícia. Não contém formulários ou integrações.
- `Home.tsx`: hero com título em duas vozes tipográficas, composição decorativa, categorias numeradas derivadas dos mesmos dados, destaques filtrados pela mesma propriedade `featured`.
- `ProductCard.tsx`: mesma informação, imagem, rota e espaço para checkbox. Hierarquia por categoria, nome, preço, avaliações e estoque; borda sutil em vez de sombra.
- `styles.css`: estilos comuns da interface e breakpoints. Removidos os desenhos de vasos, sombras e cores antigas que não eram usados. As páginas internas recebem os mesmos tokens para manter consistência.
- `main.tsx`: usa header/footer compartilhados através de imports estáticos; rotas, providers e fallback experimental preservados.

## Responsividade e acessibilidade

Grid mantém quatro colunas no desktop e duas até 900 px; em telas menores que 360 px usa uma coluna. Hero empilha até 700 px. Categorias passam de cinco para três e duas colunas. Header quebra a linha em telas estreitas, mantendo links visíveis sem menu escondido.

Links e botões principais têm alvo de pelo menos 44 px; foco visível de alto contraste, link de salto, landmarks nomeados e estado de navegação ativo. Elementos puramente decorativos recebem aria-hidden. Textos e cards não dependem de hover. prefers-reduced-motion desativa transições. Navegação por teclado e layout móvel foram verificados no Chrome; isso não constitui certificação WCAG.

## Controle experimental

O redesign é único e compartilhado pelos cinco builds. Não houve alteração em products.json, arquivos de imagem, ProductImage.tsx, package.json, lockfile, vite.config.ts ou adaptadores experimentais; verificação por SHA-256 realizada contra o estado anterior à edição. Width/height intrínsecos das imagens permanecem 800 × 800 e a proporção visual permanece quadrada.

As dimensões de layout se adaptam ao viewport com o mesmo CSS em todos os tratamentos. Alterações de espaçamento e hero podem mudar a posição das imagens e o elemento LCP em relação ao visual anterior. Portanto, gerar novamente os cinco builds e usar somente este visual em uma nova coleta; não misturar medições anteriores e posteriores ao redesign. O layout responsivo de uma coluna abaixo de 360 px também deve ser congelado antes da coleta.

Validações: os cinco builds de produção e TypeScript passaram, assim como a auditoria de manifests, hashes de CSS/imagens, integridade do catálogo e formatação. Inspeção visual da Home em 1365 × 900 e 390 × 844 no Chrome 157.0.8103.79, sem overflow horizontal no celular. Os 15 cenários funcionais passaram no Chrome instalado (três por tratamento). O Chromium padrão do Playwright não estava disponível no ambiente; não foi trocada nenhuma dependência.

Para reproduzir com o Chrome instalado, no PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:e2e
```

Sem essa variável, permanece o Chromium padrão do Playwright. Para coleta científica, fixe e registre a versão do navegador: o Chrome instalado pode receber atualizações. A suíte teve apenas seus seletores de categoria/ordenação corrigidos para usar o papel acessível combobox, sem alterar comportamento da aplicação.

Os 15 cenários emitiram resultado `ok`. Após esses resultados, o processo ficou retido no encerramento dos servidores no Windows e foi interrompido; portanto, registra-se o sucesso das asserções, não uma saída global de processo com código zero.

## Redesign da navegação por categorias

A Home usa `CategoryNavigation.tsx`, importado estaticamente, com cinco cards derivados das categorias do catálogo. Cada card apresenta um ícone vetorial decorativo local, numeração, nome, quantidade real de produtos e indicação de acesso. O card inteiro é um link para o filtro existente `/produtos?categoria=...`; não há estado ou lógica de filtragem duplicada.

Os cards usam os tokens compartilhados nos temas claro e escuro, bordas discretas e foco visível. São cinco colunas no desktop, três até 900 px e duas até 600 px, com o último card ocupando a linha inteira no celular. Ícones SVG inline não adicionam requisições, dependências ou alterações às 90 imagens dos produtos. A mesma seção integra os cinco tratamentos. Como sua altura mudou, gere novamente todos os builds e não misture medições do layout anterior com as novas.
