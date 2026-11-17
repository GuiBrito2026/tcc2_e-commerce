import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const hash=x=>createHash('sha256').update(x).digest('hex');
let baselineCss;
for(const mode of ['baseline','images','routes','interaction','combined']){
 const dir=`dist/${mode}`;
 const manifest=JSON.parse(await readFile(`${dir}/.vite/manifest.json`,'utf8'));
 const dynamic=Object.values(manifest).filter(v=>v.isDynamicEntry).map(v=>v.src);
 assert.equal(dynamic.some(s=>s.includes('pages/')),['routes','combined'].includes(mode));
 assert.equal(dynamic.some(s=>s.includes('interactions/')),['interaction','combined'].includes(mode));
 const html=await readFile(`${dir}/index.html`,'utf8');
 assert(!/rel="(?:modulepreload|preload|prefetch)"/.test(html));
 const css=(await readdir(`${dir}/assets`)).filter(f=>f.endsWith('.css'));
 assert.equal(css.length,1);
 const cssHash=hash(await readFile(`${dir}/assets/${css[0]}`));
 baselineCss??=cssHash;assert.equal(cssHash,baselineCss);
 for(const file of await readdir('public/images'))assert.equal(hash(await readFile(`${dir}/images/${file}`)),hash(await readFile(`public/images/${file}`)));
 console.log(`${mode}: CSS e imagens idênticos; divisão de código conforme matriz.`);
}
