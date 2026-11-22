import { Suspense, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products, money, type ProductData } from '../data/catalog';
import { ImageViewer } from '@interactions';
import { useCart } from '../state/CartContext';
function Details({ p }: { p: ProductData }) {
  const { add, items, stock } = useCart();
  const [image, setImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [viewer, setViewer] = useState(false);
  const [message, setMessage] = useState('');
  const available = stock[p.id] - (items[p.id] || 0);
  return (
    <main id="conteudo" tabIndex={-1}>
      <Link to="/produtos">← Voltar aos produtos</Link>
      <section className="product">
        <div className="gallery">
          <img
            src={p.images[image].src}
            alt={p.images[image].alt}
            width="800"
            height="800"
            loading="eager"
          />
          <div className="thumbnails">
            {p.images.map((img, i) => (
              <button
                key={img.src}
                className="thumbnail"
                aria-label={`Ver imagem ${i + 1} de ${p.name}`}
                aria-pressed={i === image}
                onClick={() => setImage(i)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  width="800"
                  height="800"
                  loading={__LAZY_IMAGES__ ? 'lazy' : 'eager'}
                />
              </button>
            ))}
          </div>
          <button className="secondary" onClick={() => setViewer(true)}>
            Ampliar imagens
          </button>
        </div>
        <div>
          <span className="eyebrow">{p.category}</span>
          <h1>{p.name}</h1>
          <p className="price">{money(p.price)}</p>
          <p>{p.description}</p>
          <p>
            {p.rating.toFixed(1)} / 5 · {p.reviewCount} avaliações fictícias
          </p>
          <p>{stock[p.id] ? `Estoque fictício: ${stock[p.id]} unidades` : 'Produto esgotado'}</p>
          <dl>
            <dt>Conexão</dt>
            <dd>{p.connection}</dd>
            <dt>Dimensões</dt>
            <dd>{p.dimensions}</dd>
          </dl>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!Number.isInteger(quantity) || quantity < 1 || quantity > available) return;
              add(p.id, quantity);
              setMessage(`${quantity} unidade(s) adicionada(s) à sacola.`);
              setQuantity(1);
            }}
          >
            <label>
              Quantidade
              <input
                type="number"
                min="1"
                max={Math.max(1, available)}
                step="1"
                required
                disabled={!available}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <button type="submit" disabled={!available}>
              {available ? 'Adicionar à sacola' : 'Estoque indisponível'}
            </button>
          </form>
          <p role="status">{message}</p>
          <Link to="/carrinho">Ver sacola →</Link>
        </div>
      </section>
      <section aria-labelledby="reviews">
        <h2 id="reviews">Avaliações de exemplo</h2>
        <p>Dados fixos e fictícios. Abaixo, duas avaliações ilustrativas do catálogo.</p>
        {p.reviews.map((r) => (
          <article className="review" key={r.id}>
            <strong>
              {r.author} · {r.rating}/5
            </strong>
            <p>{r.text}</p>
          </article>
        ))}
      </section>
      {viewer && (
        <Suspense fallback={<p role="status">Carregando visualizador…</p>}>
          <ImageViewer product={p} initialIndex={image} onClose={() => setViewer(false)} />
        </Suspense>
      )}
    </main>
  );
}
export default function Product() {
  const { id } = useParams();
  const p = products.find((p) => p.id === id);
  return p ? (
    <Details key={p.id} p={p} />
  ) : (
    <main id="conteudo" tabIndex={-1}>
      <h1>Produto não encontrado</h1>
      <Link to="/produtos">Voltar aos produtos</Link>
    </main>
  );
}
