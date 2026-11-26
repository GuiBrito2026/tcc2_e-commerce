import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <Link className="brand" to="/" aria-label="knight-tec — início">
              <img className="brand-icon" src="/knight-tec.png" width="44" height="44" alt="" />
              knight-tec
            </Link>
            <p>Tecnologia para o seu cotidiano.</p>
          </div>
          <nav aria-label="Navegação do rodapé">
            <Link to="/">Início</Link>
            <Link to="/produtos">Produtos</Link>
            <Link to="/carrinho">Sacola</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <small>Loja fictícia · Protótipo acadêmico · Nenhuma compra real</small>
          <span className="footer-signature" aria-hidden="true">
            Menos ruído. Mais conexão.
          </span>
        </div>
      </div>
    </footer>
  );
}
