import { products, money } from '../data/catalog';
export default function OrderSummary({ items }: { items: Record<string, number> }) {
  const chosen = products.filter((p) => items[p.id]);
  const total = chosen.reduce((sum, p) => sum + p.price * items[p.id], 0);
  return (
    <section className="order-summary" aria-label="Resumo do pedido">
      <h2>Resumo do pedido</h2>
      <ul>
        {chosen.map((p) => (
          <li key={p.id}>
            {p.name} × {items[p.id]} <strong>{money(p.price * items[p.id])}</strong>
          </li>
        ))}
      </ul>
      <p>Subtotal: {money(total)}</p>
      <p>Frete simulado: {money(0)}</p>
      <h2>Total: {money(total)}</h2>
    </section>
  );
}
