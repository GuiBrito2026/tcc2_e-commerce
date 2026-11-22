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
            ACESSÓRIOS PARA O SEU DIA A DIA
          </span>
          <h1 id="home-title">
            Seu espaço.
            <br />
            <em>Mais conectado.</em>
          </h1>
          <p>Teclados, mouses, áudio e conexões para trabalhar, estudar e criar.</p>
          <Link className="button hero-action" to="/produtos">
            Explorar produtos <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="hero-composition" aria-hidden="true">
          <span className="composition-label">CONEXÕES ESSENCIAIS</span>
          <div className="connection-mark">
            <span>c</span>
            <i />
          </div>
          <div className="composition-caption">
            <span>Trabalho · Estudo · Criatividade</span>
            <span>↗</span>
          </div>
        </div>
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
