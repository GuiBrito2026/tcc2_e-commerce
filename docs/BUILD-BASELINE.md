# Estrutura observada do build baseline

Gerado por `node scripts/report-build.mjs` após o build. Tamanhos em bytes no disco, sem compressão HTTP; não são medidas de desempenho. Hashes de nomes podem mudar após alterações.

| Arquivo                     |  Bytes |
| --------------------------- | -----: |
| `index.html`                |    850 |
| `.vite/manifest.json`       |    217 |
| `assets/index-qfZbt1vF.js`  | 266112 |
| `assets/style-k75r-GSa.css` |  14396 |

Além desses arquivos, há 90 SVGs em images/, documentados em image-manifest.json.

Entradas dinâmicas no manifest: 0. O build atual tem um arquivo JavaScript e um CSS, resultado do bundler, sem configuração para forçar um único arquivo JS. Páginas e os dois modais entram pelo grafo estático na baseline.
