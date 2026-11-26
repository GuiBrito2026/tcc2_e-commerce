# Imagens do catálogo

Restauradas as 90 ilustrações SVG anteriores: três vistas por produto, 30 produtos e cinco categorias. Arquivos locais em `public/images`, com dimensões de 800 × 800. Origem, tamanho em bytes e SHA-256 registrados em `image-manifest.json`. São ilustrações originais provisórias geradas por `scripts/catalog-fixtures.py`; devem ser substituídas e congeladas antes da coleta definitiva.

As fotografias baixadas permanecem somente em `assets/catalog-candidates`, com suas fontes em `CREDITOS-IMAGENS.md`, sem uso ou publicação no site. A integração fotográfica foi desfeita a pedido do usuário.

Todos os builds usam o mesmo catálogo, imagens e estilos. Baseline mantém imports estáticos e carregamento imediato das imagens. Validação: `python scripts/check-source.py`, `npm run build`, `npm test` e testes de navegador.
