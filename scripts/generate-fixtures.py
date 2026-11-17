"""Reproduce the catalog's original vector illustrations. No downloaded assets."""
import json
from pathlib import Path
root = Path(__file__).resolve().parent.parent
(root/'public/images').mkdir(parents=True,exist_ok=True)
(root/'src/data').mkdir(parents=True,exist_ok=True)
groups=[('Vaso','Decoração','Cerâmica','18 × 18 × 28 cm',12900),('Luminária','Iluminação','Metal e madeira','25 × 25 × 42 cm',24900),('Poltrona','Móveis','Madeira e tecido','72 × 80 × 85 cm',89900),('Mesa lateral','Móveis','Madeira','45 × 45 × 50 cm',34900)]
colors=['#b77756','#7c896a','#c7af89','#6f868a','#c3998d','#9b947f','#797772','#c6b48f']
names=['Aurora','Brisa','Terra','Horizonte','Sereno','Raiz','Nuvem','Duna']
shapes=[ '<path d="M320 230h160l-15 95q110 220-65 250Q225 545 335 325Z"/><ellipse cx="400" cy="230" rx="80" ry="18" fill="#533e31"/>', '<rect x="385" y="340" width="30" height="240"/><ellipse cx="400" cy="590" rx="135" ry="20"/><path d="M300 200h200l80 200H220Z"/>', '<rect x="240" y="210" width="320" height="300" rx="65"/><rect x="200" y="360" width="400" height="150" rx="45"/><path d="M255 495h30v120h-30zm260 0h30v120h-30Z" fill="#745843"/>', '<path d="M275 365h30v240h-30zm220 0h30v240h-30Z"/><ellipse cx="400" cy="350" rx="230" ry="65"/>' ]
products=[]
for i in range(32):
    kind,category,material,dimensions,price=groups[i%4]
    name=f'{kind} {names[i//4]}'
    ident=f'p{i+1:02}'
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#eeece6"/><circle cx="400" cy="350" r="265" fill="#e5e3da"/><ellipse cx="400" cy="635" rx="225" ry="26" fill="#d3d1c7"/><g fill="{colors[i//4]}">{shapes[i%4]}</g></svg>'
    (root/f'public/images/{ident}.svg').write_text(svg,encoding='utf-8')
    products.append(dict(id=ident,name=name,category=category,material=material,dimensions=dimensions,price=price+(i//4)*1000,image=f'/images/{ident}.svg',description=f'{name}: formas essenciais e acabamento em {material.lower()} para compor ambientes acolhedores. Produto fictício da coleção Forma.'))
(root/'src/data/products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
