# Desenho experimental e decisões

## Tratamentos

| Build       | Imagens do catálogo | Rotas      | Comparador          |
| ----------- | ------------------- | ---------- | ------------------- |
| baseline    | eager               | estáticas  | import estático     |
| images      | lazy nativo         | estáticas  | import estático     |
| routes      | eager               | React.lazy | import estático     |
| interaction | eager               | estáticas  | React.lazy ao abrir |
| combined    | lazy nativo         | React.lazy | React.lazy ao abrir |

O comparador só é montado ao clicar em todas as versões. O tratamento altera a transferência/avaliação do módulo, não antecipa sua renderização na baseline. O catálogo inicial também é uma rota lazy em routes/combined: existe custo adicional de descoberta que deve ser medido. O carregamento nativo é decidido pelo navegador; lazy não garante aguardar a entrada exata no viewport. Não há IntersectionObserver ou preload manual.

Produto principal: eager em todas as versões. Todas as imagens do catálogo participam do tratamento, inclusive as visíveis inicialmente; isso pode afetar o LCP. Width/height e decoding=async são iguais. Imagens SVG 800×800 foram escolhidas como fixtures originais, sem conteúdo externo; seu baixo peso limita a validade externa do experimento de rede. O hero usa o mesmo CSS em todos os grupos e pode ser candidato a LCP: registre o elemento efetivamente medido.

Aliases de build evitam que imports estáticos tornem módulos lazy antecipadamente alcançáveis. O mesmo package-lock, compilador, target es2022, minificação padrão, CSS global e dependências se aplicam a todos. modulePreload=false desliga a antecipação automática do Vite para todos; cssCodeSplit=false impede tratamentos adicionais de CSS. Sem manualChunks, service worker, fontes externas, analytics ou prefetch. Suspense introduz apenas estados transitórios necessários; o conteúdo final e as funcionalidades são compartilhados. A marca do tratamento não aparece na interface.

Referências técnicas: https://react.dev/reference/react/lazy e https://vite.dev/config/build-options (consultadas em 17/11/2026).

## Etapas

1. Definição da matriz, estrutura e controles antes do código.
2. Implementação do fluxo compartilhado e fixtures locais.
3. Seleção de imports e atributos de imagem na compilação.
4. Typecheck, auditoria dos manifests/hashes e testes funcionais em produção.
5. Coleta científica futura: **não realizada nesta implementação**.

## Protocolo proposto (congelar antes da coleta)

Use mesma máquina, energia, navegador/versão, viewport 1365×900, servidor, compressão e ferramentas. Feche extensões e tarefas concorrentes. Não compare versões em máquinas diferentes. Registre SO, CPU, RAM, Node, versões do lockfile, hashes dos arquivos e data de cada sessão.

Perfis iniciais sugeridos, ainda não validados: controle sem throttling; rede limitada com download 1.600 kbit/s, upload 750 kbit/s e latência 150 ms; CPU com slowdown 4×; combinação de rede limitada e CPU 4×. Estes valores são parâmetros de simulação, não descrição de dispositivos reais. Escolha aplicação de throttling no navegador ou simulação Lighthouse e mantenha-a constante; não misture métodos nem aplique ambos simultaneamente.

Faça piloto para fixar duração, estabilidade e número de repetições; ponto de partida: 20 por célula tratamento × perfil. Randomize e balanceie a ordem, guarde a semente e execute sequencialmente. Use um contexto novo por repetição e estado inicial vazio. Cache frio: contexto novo/cache limpo antes de navegar. Cache quente, se estudado, é outra condição com aquecimento padronizado; não misture amostras. Mantenha cache natural entre ações de um mesmo roteiro.

Roteiros separados:

1. Navegação direta ao catálogo; capturar métricas de carregamento inicial sem rolagem.
2. Catálogo e rolagem até o último produto em posições/intervalos fixos; registrar requisições e bytes de imagens.
3. Catálogo → produto p01 → adicionar → carrinho → checkout; medir cada transição.
4. Catálogo → selecionar p01/p02 → abrir comparação → fechar → reabrir; medir primeira e segunda abertura separadamente.
5. Submissão com dados fictícios, quantidade 2, total R$ 258,00 e confirmação; verificação funcional.

Registrar FCP, LCP (com elemento candidato), CLS, TBT em Lighthouse/trace, bytes transferidos, quantidade de requests, JS inicial e total, e latência clique→conteúdo pronto para navegação/comparação. TBT é métrica de laboratório; não é substituto equivalente de INP. Não usar TTI como principal sem verificar suporte na versão fixada da ferramenta. Não concluir desempenho de interação apenas com Lighthouse de navegação. Instrumentação deve ser externa ou idêntica em todos os tratamentos. Capturar arquivos brutos de relatório e trace, inclusive erros; nunca preencher métricas ausentes com zero.

Analisar por perfil e roteiro: mediana, dispersão e intervalos de confiança; registrar exclusões justificadas previamente. Os cinco grupos permitem contrastes individuais com baseline e efeito conjunto, mas não separar todas as interações fatoriais (faltam três combinações duplas). Ganhos pequenos/nulos ou regressões são resultados válidos. Não inflar componentes, adicionar loops, requests ou dependências para obter diferenças maiores.

## Riscos restantes

Fixtures leves e comparador pequeno podem limitar efeitos observáveis. Threshold do lazy depende do navegador e rede. Fragmentação pode piorar primeira navegação. Cache, compressão, antivírus, tarefas concorrentes e temperatura podem dominar diferenças. Falhas de chunk são tratadas com recarga explícita; execuções com falha devem ser registradas. Filtros removem imagens da página, portanto congele a sequência. Este protótipo não contém infraestrutura de coleta automática nem resultados experimentais.
