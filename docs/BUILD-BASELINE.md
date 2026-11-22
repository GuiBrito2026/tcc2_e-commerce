# Estrutura observada do build baseline

Gerado por `node scripts/report-build.mjs` após o build. Tamanhos em bytes no disco, sem compressão HTTP; não são medidas de desempenho. Hashes de nomes podem mudar após alterações.

| Arquivo                     |  Bytes |
| --------------------------- | -----: |
| `index.html`                |    939 |
| `.vite/manifest.json`       |    217 |
| `assets/index-0NaEwPrv.js`  | 269495 |
| `assets/style-gkJn4NMr.css` |  20275 |

Além desses arquivos, há 90 SVGs em images/, documentados em image-manifest.json.

Entradas dinâmicas no manifest: 0. O build atual tem um arquivo JavaScript e um CSS, resultado do bundler, sem configuração para forçar um único arquivo JS. Páginas e os dois modais entram pelo grafo estático na baseline.
