import { test, expect } from '@playwright/test';

test('catálogo, modais, persistência e compra simulada equivalentes', async ({
  page,
  baseURL,
}, info) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on('request', (r) => requests.push(r.url()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.locator('.card')).toHaveCount(10);
  await expect(page.locator('.categories a')).toHaveCount(5);
  await page.getByRole('link', { name: 'Explorar produtos', exact: false }).click();
  await expect(page.locator('.card')).toHaveCount(30);
  const lazy = ['images', 'combined'].includes(info.project.name);
  const lazyInteraction = ['interaction', 'combined'].includes(info.project.name);
  await expect(page.locator('.card img').first()).toHaveAttribute(
    'loading',
    lazy ? 'lazy' : 'eager',
  );
  expect(requests.some((u) => /Compare-.*\.js/.test(u))).toBe(false);
  expect(requests.some((u) => /ImageViewer-.*\.js/.test(u))).toBe(false);
  if (['routes', 'combined'].includes(info.project.name))
    expect(requests.some((u) => /Checkout-.*\.js/.test(u))).toBe(false);
  await page.getByLabel('Buscar produto').fill('inexistente');
  await expect(page.locator('.card')).toHaveCount(0);
  await expect(page.getByText('Nenhum produto encontrado.', { exact: false })).toBeVisible();
  await page.getByLabel('Buscar produto').fill('');
  await page.getByRole('combobox', { name: 'Categoria', exact: true }).selectOption('Mouses');
  await expect(page.locator('.card')).toHaveCount(6);
  await page.getByRole('combobox', { name: 'Categoria', exact: true }).selectOption('Todos');
  await page.getByRole('combobox', { name: 'Ordenar', exact: true }).selectOption('asc');
  await expect(page.locator('.card h3').first()).toHaveText('Mouse Essencial');
  await page.getByRole('combobox', { name: 'Ordenar', exact: true }).selectOption('desc');
  await expect(page.locator('.card h3').first()).toHaveText('Webcam Travel');
  await page.getByRole('combobox', { name: 'Ordenar', exact: true }).selectOption('default');
  await page.getByLabel('Comparar Teclado Essencial', { exact: true }).check();
  await page.getByLabel('Comparar Teclado Compacto', { exact: true }).check();
  await page.getByLabel('Comparar Teclado Conforto', { exact: true }).check();
  await expect(page.getByLabel('Comparar Teclado Studio', { exact: true })).toBeDisabled();
  const compare = page.getByRole('button', { name: 'Comparar (3/3)', exact: true });
  await compare.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(requests.some((u) => /Compare-.*\.js/.test(u))).toBe(lazyInteraction);
  await page.keyboard.press('Escape');
  await expect(compare).toBeFocused();
  await page.locator('.card a[href="/produtos/p01"]').click();
  await expect(page.getByRole('heading', { name: 'Teclado Essencial', exact: true })).toBeVisible();
  await expect(page.locator('.thumbnails img')).toHaveCount(3);
  await expect(page.locator('.gallery > img')).toHaveAttribute('src', '/images/p01-1.svg');
  const enlarge = page.getByRole('button', { name: 'Ampliar imagens' });
  await enlarge.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(requests.some((u) => /ImageViewer-.*\.js/.test(u))).toBe(lazyInteraction);
  await page.getByRole('button', { name: 'Próxima imagem' }).click();
  await expect(page.getByText('Imagem 2 de 3')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(enlarge).toBeFocused();
  await page.getByLabel('Quantidade', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Adicionar à sacola' }).click();
  await page.getByRole('link', { name: 'Ver sacola', exact: false }).click();
  await page.reload();
  await expect(page.getByLabel('Quantidade de Teclado Essencial')).toHaveValue('2');
  await page.getByLabel('Quantidade de Teclado Essencial').fill('3');
  await expect(page.getByRole('heading', { name: 'Total: R$ 479,70' })).toBeVisible();
  await page.getByRole('link', { name: 'Continuar para checkout' }).click();
  await expect(page.getByRole('region', { name: 'Resumo do pedido' })).toContainText(
    'Teclado Essencial × 3',
  );
  await page.getByRole('button', { name: 'Concluir pedido simulado' }).click();
  await expect(page.getByRole('heading', { name: 'Finalizar pedido' })).toBeVisible();
  await page.getByLabel('Nome fictício').fill('   ');
  await page.getByLabel('E-mail fictício').fill('teste@example.invalid');
  await page.getByLabel('Endereço fictício').fill('Rua fictícia, 123');
  await page.getByRole('button', { name: 'Concluir pedido simulado' }).click();
  await expect(page.getByRole('heading', { name: 'Finalizar pedido' })).toBeVisible();
  await page.getByLabel('Nome fictício').fill('Pessoa Teste');
  await page.getByRole('button', { name: 'Concluir pedido simulado' }).click();
  await expect(page.getByRole('heading', { name: 'Pedido simulado concluído' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sacola (0)' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('conecta.cart.v1'))).toBe('{}');
  expect(requests.every((u) => u.startsWith(baseURL!))).toBe(true);
  expect(errors).toEqual([]);
});

test('limites de estoque, remoção e dados locais inválidos', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() =>
    localStorage.setItem(
      'conecta.cart.v1',
      JSON.stringify({ p01: 999, p30: 5, desconhecido: 4, p02: -3, p03: '2' }),
    ),
  );
  await page.goto('/carrinho');
  await expect(page.locator('.cart-row')).toHaveCount(1);
  await expect(page.getByLabel('Quantidade de Teclado Essencial')).toHaveValue('8');
  await page.goto('/produtos/p01');
  await expect(page.getByRole('button', { name: 'Estoque indisponível' })).toBeDisabled();
  await page.goto('/carrinho');
  await page.getByRole('button', { name: 'Remover Teclado Essencial' }).click();
  await page.reload();
  await expect(page.getByText('Sua sacola está vazia.', { exact: false })).toBeVisible();
  await page.evaluate(() => localStorage.setItem('conecta.cart.v1', '{invalid'));
  await page.reload();
  await expect(page.locator('.cart-row')).toHaveCount(0);
  await page.goto('/produtos/p30');
  await expect(page.getByText('Produto esgotado', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Estoque indisponível' })).toBeDisabled();
  await page.goto('/produtos/inexistente');
  await expect(page.getByRole('heading', { name: 'Produto não encontrado' })).toBeVisible();
  await page.goto('/checkout');
  await expect(page.getByRole('heading', { name: 'Sua sacola está vazia' })).toBeVisible();
});

test('layout móvel e navegação por teclado', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  for (const url of ['/', '/produtos', '/produtos/p01', '/carrinho']) {
    await page.goto(url);
    await expect(page.locator('main')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});

test('compra reduz estoque na sessão e impede nova compra de produto esgotado', async ({
  page,
}) => {
  await page.goto('/produtos/p01');
  await page.getByLabel('Quantidade', { exact: true }).fill('8');
  await page.locator('.product form button').click();
  await page.locator('a[href="/carrinho"]').last().click();
  await page.locator('a[href="/checkout"]').click();
  await page.locator('input[name="name"]').fill('Pessoa Teste');
  await page.locator('input[name="email"]').fill('teste@example.invalid');
  await page.locator('input[name="address"]').fill('Rua fictícia');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText('Agradecemos a sua compra!', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'Voltar aos produtos', exact: true }).click();
  await expect(page.locator('.card').filter({ hasText: 'Teclado Essencial' })).toContainText(
    'Produto esgotado',
  );
  await page.locator('.card a[href="/produtos/p01"]').click();
  await expect(page.locator('.product form button')).toBeDisabled();
  await expect(page.getByLabel('Quantidade', { exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.locator('.product form button')).toBeEnabled();
});
