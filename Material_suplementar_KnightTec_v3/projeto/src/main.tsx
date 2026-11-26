import { Component, Suspense, useEffect, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Catalog, Product, Cart, Checkout } from '@routes';
import { CartProvider, useCart } from './state/CartContext';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import './styles.css';
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main id="conteudo" tabIndex={-1}>
        <h1>Não foi possível carregar a página.</h1>
        <button onClick={() => location.reload()}>Tentar novamente</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const { count, storageError } = useCart();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <>
      <SiteHeader count={count} />
      {storageError && (
        <p role="alert">
          Não foi possível salvar a sacola neste navegador. Os itens serão mantidos somente nesta
          sessão.
        </p>
      )}
      <Boundary>
        <Suspense
          fallback={
            <main id="conteudo" tabIndex={-1} role="status">
              Carregando conteúdo…
            </main>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Catalog />} />
            <Route path="/produtos/:id" element={<Product />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="*"
              element={
                <main id="conteudo" tabIndex={-1}>
                  <h1>Página não encontrada</h1>
                  <Link to="/">Voltar à coleção</Link>
                </main>
              }
            />
          </Routes>
        </Suspense>
      </Boundary>
      <SiteFooter />
    </>
  );
}
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>,
);
