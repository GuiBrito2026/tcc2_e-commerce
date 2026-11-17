"""Dependency-free integrity check; does not replace TypeScript or browser tests."""
import json,re,xml.etree.ElementTree as ET
from pathlib import Path
root=Path(__file__).resolve().parent.parent
products=json.loads((root/'src/data/products.json').read_text(encoding='utf-8'))
assert len(products)==32
assert len({p['id'] for p in products})==32
for p in products:
    assert p['price']>0 and isinstance(p['price'],int)
    path=root/'public'/p['image'].lstrip('/')
    ET.parse(path)
for path in (root/'src').rglob('*'):
    if path.suffix not in ['.ts','.tsx','.css']:continue
    source=path.read_text(encoding='utf-8-sig')
    assert not re.search(r'https?://|serviceWorker|<link[^>]+preload',source),path
    for target in re.findall(r'(?:from\s*|import\s*\(\s*)[\'"](\.[^\'"]+)',source):
        local=path.parent/target
        assert local.is_file() or any(Path(str(local)+ext).is_file() for ext in ['.ts','.tsx','.json','.css']), (path,target)
print('PASS: 32 produtos únicos, preços em centavos, 32 SVGs válidos, imports locais resolvidos e ausência de URLs externas no código de execução.')
