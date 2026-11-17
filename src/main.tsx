import { Component, Suspense, useEffect, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { Catalog, Product, Cart, Checkout } from '@routes';
import { CartProvider, useCart } from './state/CartContext';
import './styles.css';
class Boundary extends Component<{children:ReactNode},{failed:boolean}> {state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<main><h1>Não foi possível carregar a página.</h1><button onClick={()=>location.reload()}>Tentar novamente</button></main>:this.props.children;}}
function App(){const {count}=useCart();const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);},[pathname]);return <><div className="notice">Design simples. Espaços com personalidade.</div><header><Link className="brand" to="/">forma<span>●</span></Link><nav><NavLink to="/">Coleção</NavLink><NavLink to="/carrinho">Sacola ({count})</NavLink></nav></header><Boundary><Suspense fallback={<main role="status">Carregando conteúdo…</main>}><Routes><Route path="/" element={<Catalog/>}/><Route path="/produto/:id" element={<Product/>}/><Route path="/carrinho" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="*" element={<main><h1>Página não encontrada</h1><Link to="/">Voltar à coleção</Link></main>}/></Routes></Suspense></Boundary><footer><Link className="brand" to="/">forma<span>●</span></Link><p>Objetos para viver bem.</p><small>Loja fictícia · Protótipo acadêmico · Nenhuma compra real</small></footer></>;}
createRoot(document.getElementById('root')!).render(<BrowserRouter><CartProvider><App/></CartProvider></BrowserRouter>);
