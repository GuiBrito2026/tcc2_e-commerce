import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
const dir = 'dist/baseline';
const files = [
  'index.html',
  '.vite/manifest.json',
  ...(await readdir(`${dir}/assets`)).map((f) => `assets/${f}`),
];
const manifest = JSON.parse(await readFile(`${dir}/.vite/manifest.json`, 'utf8'));
let report =
  '# Estrutura observada do build baseline\n\nGerado por `node scripts/report-build.mjs` após o build. Tamanhos em bytes no disco, sem compressão HTTP; não são medidas de desempenho. Hashes de nomes podem mudar após alterações.\n\n| Arquivo | Bytes |\n|---|---:|\n';
for (const f of files) report += `| \`${f}\` | ${(await stat(`${dir}/${f}`)).size} |\n`;
report += `\nAlém desses arquivos, há ${(await readdir(`${dir}/images`)).length} ilustrações SVG em images/, documentados em image-manifest.json.\n\nEntradas dinâmicas no manifest: ${Object.values(manifest).filter((v) => v.isDynamicEntry).length}. O build atual tem um arquivo JavaScript e um CSS, resultado do bundler, sem configuração para forçar um único arquivo JS. Páginas e os dois modais entram pelo grafo estático na baseline.\n`;
await writeFile('docs/BUILD-BASELINE.md', report);
