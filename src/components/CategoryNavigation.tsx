import { Link } from 'react-router-dom';
import { products } from '../data/catalog';

const iconPaths: Record<string, string> = {
  Teclados: 'M5 12h38v24H5z M11 18h2m5 0h2m5 0h2m5 0h2 M11 24h2m5 0h2m5 0h2m5 0h2 M14 30h20',
  Mouses:
    'M24 5c-8 0-13 6-13 14v10c0 8 5 14 13 14s13-6 13-14V19c0-8-5-14-13-14Z M24 5v15 M11 22h26 M24 12v3',
  Áudio:
    'M8 27v-6a16 16 0 0 1 32 0v6 M8 25h6v15H8a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z M40 25h-6v15h6a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3Z',
  Webcams:
    'M8 9h32a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z M30 20a6 6 0 1 1-12 0 6 6 0 0 1 12 0 M24 32v7 M14 40h20 M36 16h1',
  'Hubs e adaptadores':
    'M9 20h30v20H9z M24 20v-8a5 5 0 0 1 5-5h7 M36 4v6h7V4z M15 27h5v6h-5z M27 27h6v6h-6z',
};

const categories = [...new Set(products.map((product) => product.category))].map((name) => ({
  name,
  count: products.filter((product) => product.category === name).length,
}));

export default function CategoryNavigation() {
  return (
    <nav className="categories" aria-label="Categorias de produtos">
      {categories.map(({ name, count }, index) => (
        <Link
          className="category-card"
          key={name}
          to={`/produtos?categoria=${encodeURIComponent(name)}`}
        >
          <div className="category-card-top" aria-hidden="true">
            <svg className="category-icon" viewBox="0 0 48 48" fill="none" focusable="false">
              <path d={iconPaths[name]} />
            </svg>
            <span className="category-index">0{index + 1}</span>
          </div>
          <div className="category-card-copy">
            <span className="category-name">{name}</span>
            <span className="category-count">{count} produtos</span>
          </div>
          <span className="category-card-action" aria-hidden="true">
            Explorar <span className="category-arrow">↗</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
