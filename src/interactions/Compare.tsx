import { useEffect, useRef } from 'react';
import { money, products } from '../data/catalog';
export default function Compare({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  const chosen = products.filter((p) => ids.includes(p.id));
  return (
    <dialog ref={ref} onCancel={onClose} aria-labelledby="compare-title">
      <div className="section-heading">
        <h2 id="compare-title">Comparar produtos</h2>
        <button onClick={onClose} autoFocus>
          Fechar
        </button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Característica</th>
              {chosen.map((p) => (
                <th key={p.id}>{p.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['Preço', 'Categoria', 'Material', 'Dimensões'].map((row, i) => (
              <tr key={row}>
                <th>{row}</th>
                {chosen.map((p) => (
                  <td key={p.id}>{[money(p.price), p.category, p.material, p.dimensions][i]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Produtos ilustrativos. Compare os detalhes antes de adicionar à sacola.</p>
    </dialog>
  );
}
