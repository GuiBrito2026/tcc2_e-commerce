import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products, money } from '../data/catalog';
import ProductImage from '../components/ProductImage';
import { useCart } from '../state/CartContext';
export default function Product() {
  const { id } = useParams();
  const p = products.find((p) => p.id === id);
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  if (!p)
    return (
      <main>
        <h1>Produto não encontrado</h1>
        <Link to="/">Voltar à coleção</Link>
      </main>
    );
  return (
    <main>
      <Link to="/">← Voltar à coleção</Link>
      <section className="product">
        <ProductImage product={p} primary />
        <div>
          <span className="eyebrow">{p.category}</span>
          <h1>{p.name}</h1>
          <p className="price">{money(p.price)}</p>
          <p>{p.description}</p>
          <dl>
            <dt>Material</dt>
            <dd>{p.material}</dd>
            <dt>Dimensões</dt>
            <dd>{p.dimensions}</dd>
          </dl>
          <button
            onClick={() => {
              add(p.id);
              setAdded(true);
            }}
          >
            Adicionar à sacola
          </button>
          <p role="status">{added ? 'Produto adicionado à sacola.' : ''}</p>
          <Link to="/carrinho">Ver sacola →</Link>
        </div>
      </section>
    </main>
  );
}
