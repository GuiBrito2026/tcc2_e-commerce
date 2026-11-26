# Branch baseline

A branch `baseline` parte do commit `8a2e3a8` de `prototipo` e representa o cenário de controle do TCC. O protótipo já implementava esse modo. A mudança desta branch está nos comandos de compilação do `package.json`.

| Comando | Em `prototipo` | Em `baseline` |
| --- | --- | --- |
| `npm run build` | Gera os cinco cenários | Gera somente a baseline em `dist/baseline/` |
| `npm run build:all` | Comando ausente | Gera os cinco cenários |
| `npm run build:baseline` | Gera a baseline | Continua disponível e é chamado pelo build padrão |

## Como reproduzir

Na raiz do projeto, execute `npm ci`, depois `npm run build`. O comando verifica os tipos com TypeScript e compila com Vite no modo `baseline`. Para abrir a versão de produção localmente, execute `npm run preview` e acesse o endereço exibido. Para hospedagem estática, use `npm run build` como comando de compilação e `dist/baseline` como diretório de publicação.

## Como identificar o controle experimental

As páginas e os módulos de interação entram no pacote JavaScript inicial por importações estáticas. O componente de imagem dos produtos usa `loading="eager"`. Esse comportamento já existia no protótipo e serve como referência para avaliar as otimizações das demais branches.

Na compilação verificada, o Vite gerou um arquivo JavaScript de 269.592 bytes, um CSS de 20.275 bytes e nenhuma entrada dinâmica no manifesto. Esses valores descrevem os arquivos compilados. As métricas de desempenho serão obtidas durante a coleta experimental.
