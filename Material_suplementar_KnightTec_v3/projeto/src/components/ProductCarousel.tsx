import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { money, products } from '../data/catalog';
import ProductImage from './ProductImage';

const slides = [...new Set(products.map((product) => product.category))].map(
  (category) => products.find((product) => product.category === category)!,
);

export default function ProductCarousel() {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(() => document.hidden);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const rotating = !hidden && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [rotating]);

  function select(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  return (
    <section
      className="product-carousel"
      aria-label="Seleção de produtos"
      aria-roledescription="carrossel"
    >
      <div className="carousel-heading">
        <span className="eyebrow">ESCOLHAS KNIGHT-TEC</span>
      </div>
      <div className="carousel-slides" aria-live={rotating ? 'off' : 'polite'} aria-atomic="true">
        {slides.map((product, position) => (
          <div
            key={product.id}
            hidden={position !== index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} de ${slides.length}`}
          >
            <Link className="carousel-product" to={`/produtos/${product.id}`}>
              <div className="carousel-image">
                <ProductImage product={product} primary observeVisibility={position !== 0} />
              </div>
              <div className="carousel-copy">
                <span className="eyebrow">{product.category}</span>
                <h2>{product.name}</h2>
                <div className="carousel-price">
                  <strong>{money(product.price)}</strong>
                  <span>Ver produto ↗</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button type="button" aria-label="Produto anterior" onClick={() => select(index - 1)}>
          ←
        </button>
        <div className="carousel-dots">
          {slides.map((product, position) => (
            <button
              type="button"
              key={product.id}
              aria-label={`Mostrar ${product.name}`}
              aria-pressed={index === position}
              onClick={() => select(position)}
            >
              <span />
            </button>
          ))}
        </div>
        <button type="button" aria-label="Próximo produto" onClick={() => select(index + 1)}>
          →
        </button>
      </div>
    </section>
  );
}
