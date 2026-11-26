"""Reproducible provisional SVGs. No external assets or random values."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / 'public/images'
IMAGES.mkdir(parents=True, exist_ok=True)
GROUPS = [
    ('Teclados', 'Teclado', 15990, 'USB-C', '36 × 13 × 3 cm'),
    ('Mouses', 'Mouse', 8990, 'USB', '12 × 6 × 4 cm'),
    ('Áudio', 'Headset', 19990, 'P2 / USB', '18 × 20 × 8 cm'),
    ('Webcams', 'Webcam', 22990, 'USB', '9 × 3 × 5 cm'),
    ('Hubs e adaptadores', 'Hub', 11990, 'USB-C', '11 × 4 × 2 cm'),
]
MODELS = ['Essencial', 'Compacto', 'Conforto', 'Studio', 'Pro', 'Travel']
COLORS = ['#263d50', '#485e68', '#4f536c', '#356c68', '#805d49', '#3e4957']
SHAPES = [
    '<rect x="140" y="260" width="520" height="240" rx="24"/>' + ''.join(
        f'<rect x="{165+c*48}" y="{282+r*45}" width="36" height="30" rx="4" fill="#a9bbc6"/>'
        for r in range(4) for c in range(10)),
    '<rect x="285" y="175" width="230" height="420" rx="110"/><path d="M400 180v180m-110 0h220" stroke="#a9bbc6" stroke-width="6"/><rect x="389" y="240" width="22" height="65" rx="10" fill="#a9bbc6"/>',
    '<path d="M255 420v-90a145 145 0 0 1 290 0v90" fill="none" stroke="currentColor" stroke-width="40"/><rect x="220" y="360" width="90" height="170" rx="38"/><rect x="490" y="360" width="90" height="170" rx="38"/><path d="M535 510q0 60-110 60" stroke="currentColor" fill="none" stroke-width="18"/>',
    '<path d="M360 450h80v100h-80zm-70 100h220v25H290Z"/><rect x="180" y="260" width="440" height="200" rx="70"/><circle cx="400" cy="360" r="74" fill="#132430"/><circle cx="400" cy="360" r="48" fill="#478b9c"/><circle cx="382" cy="345" r="15" fill="#cee4e8"/>',
    '<path d="M540 360q130-80 110-180" stroke="currentColor" stroke-width="14" fill="none"/><rect x="170" y="290" width="410" height="200" rx="30"/><g fill="#a9bbc6"><rect x="205" y="355" width="70" height="45" rx="4"/><rect x="295" y="355" width="70" height="45" rx="4"/><rect x="385" y="355" width="70" height="45" rx="4"/><rect x="480" y="360" width="55" height="30" rx="12"/></g>',
]
products, assets = [], []
for group_index, (category, kind, price, connection, dimensions) in enumerate(GROUPS):
    for variant, model in enumerate(MODELS):
        number = group_index * 6 + variant + 1
        ident = f'p{number:02}'
        name = f'{kind} {model}'
        gallery = []
        for view, (rotation, scale, caption) in enumerate([(0, 1, 'Vista principal'), (-12, .9, 'Vista inclinada'), (8, 1.15, 'Detalhe ilustrativo')], 1):
            filename = f'{ident}-{view}.svg'
            svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#eef2f4"/><circle cx="400" cy="385" r="290" fill="#e0e7eb"/><ellipse cx="400" cy="650" rx="225" ry="24" fill="#cbd5dc"/><g fill="{COLORS[variant]}" color="{COLORS[variant]}" transform="translate(400 400) rotate({rotation}) scale({scale}) translate(-400 -400)">{SHAPES[group_index]}</g></svg>\n'
            file = IMAGES / filename
            file.write_text(svg, encoding='utf-8', newline='\n')
            url = f'/images/{filename}'
            gallery.append({'src': url, 'alt': f'{name} — {caption.lower()}'})
            assets.append({'file': url, 'format': 'SVG', 'width': 800, 'height': 800, 'bytes': file.stat().st_size, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'provisional': True, 'origin': 'Ilustração vetorial original gerada por scripts/catalog-fixtures.py; não é fotografia de fabricante.', 'license': 'Sem arquivo de terceiros; nenhuma licença de fabricante atribuída. Fixture original deste protótipo acadêmico.'})
        products.append({'id': ident, 'name': name, 'category': category, 'description': f'{name}: acessório fictício para organizar seu espaço de trabalho e estudo. Conexão {connection}, acabamento em ABS e desenho compacto. As características são ilustrativas e não descrevem um produto comercial.', 'price': price + variant * 2500, 'stock': 0 if number == 30 else 8 + variant * 3, 'rating': round(4.1 + variant * .1, 1), 'reviewCount': 12 + number * 3, 'reviews': [{'id': f'{ident}-r1', 'author': 'Cliente de exemplo A', 'rating': 5, 'text': 'Atendeu à proposta do meu espaço de estudo.'}, {'id': f'{ident}-r2', 'author': 'Cliente de exemplo B', 'rating': 4, 'text': 'Boa praticidade no uso diário. Avaliação fictícia.'}], 'material': 'ABS', 'connection': connection, 'dimensions': dimensions, 'featured': variant < 2, 'image': gallery[0]['src'], 'images': gallery})
(ROOT / 'src/data/products.json').write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(ROOT / 'docs/image-manifest.json').write_text(json.dumps(assets, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(products)} produtos; {len(assets)} imagens provisórias documentadas.')
