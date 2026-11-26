import { Suspense, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { Compare } from '@interactions';
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const categories = [...new Set(products.map((p) => p.category))];
  const requested = params.get('categoria') || 'Todos';
  const category = categories.includes(requested) ? requested : 'Todos';
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const [compare, setCompare] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const visible = products
    .filter(
      (p) =>
        (category === 'Todos' || p.category === category) &&
        p.name.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR')),
    )
    .sort((a, b) => (sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : 0));
  return (
    <main id="conteudo" tabIndex={-1}>
      <span className="eyebrow">TECNOLOGIA PARA O COTIDIANO</span>
      <h1>Todos os produtos</h1>
      <p role="status">{visible.length} produtos encontrados</p>
      <div className="filters">
        <label>
          Buscar produto
          <input
            placeholder="O que você procura?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          Categoria
          <select
            value={category}
            onChange={(e) =>
              setParams(e.target.value === 'Todos' ? {} : { categoria: e.target.value })
            }
          >
            {['Todos', ...categories].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Destaques</option>
            <option value="asc">Menor preço</option>
            <option value="desc">Maior preço</option>
          </select>
        </label>
        <button disabled={selected.length < 2} onClick={() => setCompare(true)}>
          Comparar ({selected.length}/3)
        </button>
      </div>
      <div className="grid">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p}>
            <label className="check">
              <input
                aria-label={`Comparar ${p.name}`}
                type="checkbox"
                checked={selected.includes(p.id)}
                disabled={selected.length >= 3 && !selected.includes(p.id)}
                onChange={(e) =>
                  setSelected((old) =>
                    e.target.checked ? [...old, p.id] : old.filter((id) => id !== p.id),
                  )
                }
              />
              Comparar produto
            </label>
          </ProductCard>
        ))}
      </div>
      {visible.length === 0 && <p>Nenhum produto encontrado. Tente outra busca ou categoria.</p>}
      {compare && (
        <Suspense fallback={<p role="status">Carregando comparação…</p>}>
          <Compare ids={selected} onClose={() => setCompare(false)} />
        </Suspense>
      )}
    </main>
  );
}
