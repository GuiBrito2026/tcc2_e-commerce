# Estoque após a compra simulada

A confirmação válida do checkout desconta as quantidades e limpa a sacola. Cards, detalhes e limites de quantidade usam o estoque compartilhado no CartProvider. Uma confirmação repetida sem novos itens não desconta novamente. Os dados originais do catálogo não são modificados.

O estoque é local à sessão da SPA: navegar entre rotas preserva as baixas; recarregar a página restaura os valores determinísticos do JSON. Não há estoque global, sincronização entre abas ou persistência das compras. Todos os cinco builds usam o mesmo comportamento. Inicie cada repetição experimental em um contexto novo com carrinho vazio e estoque inicial.

A tela agradece a compra, mas não envia e-mail. Envio real com imagens depende de backend e serviço de e-mail ainda não configurados; não colocar credenciais SMTP ou chaves privadas no React. O formulário continua aceitando dados fictícios sem transmissão externa.
