import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const hash = (x) => createHash('sha256').update(x).digest('hex');
let baselineCss;
const inventory = JSON.parse(await readFile('docs/image-manifest.json', 'utf8'));
const products = JSON.parse(await readFile('src/data/products.json', 'utf8'));
assert.equal(products.length, 30);
assert.equal(new Set(products.map((p) => p.category)).size, 5);
const referenced = new Set(products.flatMap((p) => p.images.map((image) => image.src)));
assert.deepEqual([...referenced].sort(), inventory.map((asset) => asset.file).sort());
assert.equal((await readdir('public/images')).length, inventory.length);
for (const product of products) {
  assert.equal(product.images.length, 3);
  assert.equal(product.image, product.images[0].src);
  for (const image of product.images) {
    const asset = inventory.find((asset) => asset.file === image.src);
    assert.equal(asset.width, 800);
    assert.equal(asset.height, 800);
    assert(asset.origin && asset.license);
  }
}
for (const asset of inventory) {
  const bytes = await readFile(`public${asset.file}`);
  assert.equal(bytes.length, asset.bytes);
  assert.equal(hash(bytes), asset.sha256);
}
for (const mode of ['baseline', 'images', 'routes', 'interaction', 'combined']) {
  const dir = `dist/${mode}`;
  const manifest = JSON.parse(await readFile(`${dir}/.vite/manifest.json`, 'utf8'));
  const dynamic = Object.values(manifest)
    .filter((v) => v.isDynamicEntry)
    .map((v) => v.src);
  assert.equal(
    dynamic.length,
    (['routes', 'combined'].includes(mode) ? 5 : 0) +
      (['interaction', 'combined'].includes(mode) ? 2 : 0),
  );
  if (['interaction', 'combined'].includes(mode)) {
    assert(dynamic.includes('src/interactions/Compare.tsx'));
    assert(dynamic.includes('src/interactions/ImageViewer.tsx'));
  }
  assert.equal(
    dynamic.some((s) => s.includes('pages/')),
    ['routes', 'combined'].includes(mode),
  );
  assert.equal(
    dynamic.some((s) => s.includes('interactions/')),
    ['interaction', 'combined'].includes(mode),
  );
  const html = await readFile(`${dir}/index.html`, 'utf8');
  assert(!/rel="(?:modulepreload|preload|prefetch)"/.test(html));
  const css = (await readdir(`${dir}/assets`)).filter((f) => f.endsWith('.css'));
  assert.equal(css.length, 1);
  const cssHash = hash(await readFile(`${dir}/assets/${css[0]}`));
  baselineCss ??= cssHash;
  assert.equal(cssHash, baselineCss);
  for (const { file } of inventory)
    assert.equal(hash(await readFile(`${dir}${file}`)), hash(await readFile(`public${file}`)));
  console.log(`${mode}: CSS e imagens idênticos; divisão de código conforme matriz.`);
}
