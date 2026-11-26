"""Local SVG integrity check; does not replace TypeScript or browser tests."""
import json,re,xml.etree.ElementTree as ET
from pathlib import Path
root=Path(__file__).resolve().parent.parent
products=json.loads((root/'src/data/products.json').read_text(encoding='utf-8'))
assert len(products)==30
assert len({p['id'] for p in products})==30
assert len({p['category'] for p in products}) == 5
for p in products:
    assert p['price']>0 and isinstance(p['price'],int)
    assert len(p['images']) == 3
    assert isinstance(p['stock'],int) and p['stock']>=0
    for image in p['images']:
        svg=ET.parse(root/'public'/image['src'].lstrip('/')).getroot()
        assert svg.attrib['width']=='800' and svg.attrib['height']=='800'
for path in (root/'src').rglob('*'):
    if path.suffix not in ['.ts','.tsx','.css']:continue
    source=path.read_text(encoding='utf-8-sig')
    assert not re.search(r'https?://|serviceWorker|<link[^>]+preload',source),path
    for target in re.findall(r'(?:from\s*|import\s*\(\s*)[\'"](\.[^\'"]+)',source):
        local=path.parent/target
        assert local.is_file() or any(Path(str(local)+ext).is_file() for ext in ['.ts','.tsx','.json','.css']), (path,target)
print('PASS: 30 produtos, 5 categorias, 90 ilustrações SVG válidas, imports locais e sem recursos externos no código de execução.')
