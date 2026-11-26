import ProductCarousel from '../components/ProductCarousel';
import { Link } from 'react-router-dom';
import { products } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import CategoryNavigation from '../components/CategoryNavigation';
export default function Home() {
  return (
    <main className="home" id="conteudo" tabIndex={-1}>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="label-line" aria-hidden="true" />
            KNIGHT-TEC / SEU PRÓXIMO MOVIMENTO
          </span>
          <h1 id="home-title">
            Um novo olhar.
            <br />
            <em>Seu próximo</em>
            <br />
            movimento.
          </h1>
          <p>
            O essencial para um setup com a sua identidade. Acessórios para trabalhar, estudar e
            criar — do primeiro clique à próxima ideia.
          </p>
          <div className="hero-actions">
            <Link className="button hero-action" to="/produtos">
              Explorar produtos <span aria-hidden="true">↗</span>
            </Link>
            <a className="hero-secondary" href="#categorias">
              Ver categorias <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-catalog-note">
            <span>30 produtos</span>
            <span>5 categorias</span>
            <span>Um setup seu.</span>
          </div>
        </div>
        <ProductCarousel />
      </section>
      <section className="home-section category-section" aria-labelledby="categorias">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / ENCONTRE O SEU ESSENCIAL</span>
            <h2 id="categorias">Explore por categoria</h2>
          </div>
          <span className="section-note">Cinco caminhos. Seu próximo setup.</span>
        </div>
        <CategoryNavigation />
      </section>
      <section className="home-section featured-section" aria-labelledby="destaques">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / ESCOLHAS PARA O COTIDIANO</span>
            <h2 id="destaques">Produtos em destaque</h2>
          </div>
          <Link className="text-link" to="/produtos">
            Ver os 30 produtos <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="grid">
          {products
            .filter((p) => p.featured)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
