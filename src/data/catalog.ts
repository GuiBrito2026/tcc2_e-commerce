import products from './products.json';
export { products };
export type ProductData = (typeof products)[number];
export const money = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
