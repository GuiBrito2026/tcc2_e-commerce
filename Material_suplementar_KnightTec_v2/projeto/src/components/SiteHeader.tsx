import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader({ count }: { count: number }) {
  return (
    <>
      <div className="notice">Acessórios para trabalhar, estudar e criar.</div>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="knight-tec — início">
          <img className="brand-icon" src="/knight-tec.png" width="44" height="44" alt="" />
          knight-tec
        </Link>
        <nav aria-label="Navegação principal">
          <NavLink to="/" end>
            Início
          </NavLink>
          <NavLink to="/produtos">Produtos</NavLink>
          <NavLink className="bag-link" to="/carrinho">
            Sacola <span className="bag-count">({count})</span>
          </NavLink>
          <ThemeToggle />
        </nav>
      </header>
    </>
  );
}
