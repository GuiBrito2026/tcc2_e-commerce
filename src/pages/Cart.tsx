import { Link } from 'react-router-dom';
import { products, money } from '../data/catalog';
import { useCart } from '../state/CartContext';
export default function Cart() {
  const { items, setQuantity, total, stock } = useCart();
  return (
    <main id="conteudo" tabIndex={-1}>
      <span className="eyebrow">SUAS ESCOLHAS</span>
      <h1>Sacola</h1>
      {total === 0 ? (
        <p>
          Sua sacola está vazia. <Link to="/produtos">Explorar coleção</Link>
        </p>
      ) : (
        <>
          <div className="cart-list">
            {products
              .filter((p) => items[p.id])
              .map((p) => (
                <article className="cart-row" key={p.id}>
                  <div>
                    <Link to={`/produtos/${p.id}`}>
                      <h2>{p.name}</h2>
                    </Link>
                    <p>{money(p.price)} por unidade</p>
                  </div>
                  <label>
                    Quantidade de {p.name}
                    <input
                      type="number"
                      min="1"
                      max={stock[p.id]}
                      value={items[p.id]}
                      onChange={(e) => setQuantity(p.id, Number(e.target.value) || 1)}
                    />
                  </label>
                  <strong>{money(p.price * items[p.id])}</strong>
                  <button className="secondary" onClick={() => setQuantity(p.id, 0)}>
                    Remover {p.name}
                  </button>
                </article>
              ))}
          </div>
          <div className="summary">
            <p>Subtotal: {money(total)}</p>
            <h2>Total: {money(total)}</h2>
            <p>Frete simulado gratuito.</p>
            <Link className="button" to="/checkout">
              Continuar para checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
