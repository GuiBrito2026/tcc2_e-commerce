import { useCart } from '../state/CartContext';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { money, type ProductData } from '../data/catalog';
import ProductImage from './ProductImage';
export default function ProductCard({
  product,
  children,
}: {
  product: ProductData;
  children?: ReactNode;
}) {
  const { stock } = useCart();
  const available = stock[product.id] > 0;
  return (
    <article className="card" data-available={available}>
      <Link className="card-link" to={`/produtos/${product.id}`}>
        <div className="card-media">
          <ProductImage product={product} />
          {(!available || product.featured) && (
            <span className="card-badge">{available ? 'Em destaque' : 'Esgotado'}</span>
          )}
        </div>
        <div className="card-copy">
          <small>{product.category}</small>
          <div className="card-heading">
            <h3>{product.name}</h3>
          </div>
          <p className="rating">
            <span className="rating-score">
              <span aria-hidden="true">★</span> {product.rating.toFixed(1)} / 5
            </span>
            <span>{product.reviewCount} avaliações fictícias</span>
          </p>
          <strong className="card-price">{money(product.price)}</strong>
          <span className="card-stock">
            <span className="stock-dot" aria-hidden="true" />
            {available ? `${stock[product.id]} unidades em estoque` : 'Produto esgotado'}
          </span>
          <span className="card-cta">
            Ver detalhes <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
      {children && <div className="card-options">{children}</div>}
    </article>
  );
}
