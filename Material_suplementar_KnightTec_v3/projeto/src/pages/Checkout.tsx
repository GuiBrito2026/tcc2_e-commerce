import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import OrderSummary from '../components/OrderSummary';
export default function Checkout() {
  const { items, total, purchase } = useCart();
  const [receipt, setReceipt] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState('');
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    for (const input of Array.from(
      form.querySelectorAll('input[required]'),
    ) as HTMLInputElement[]) {
      input.setCustomValidity(input.value.trim() ? '' : 'Preencha este campo com dados fictícios.');
    }
    if (!form.reportValidity()) return;
    const completed = purchase();
    if (!completed) {
      setError('Não foi possível concluir o pedido. Confira as quantidades na sacola.');
      return;
    }
    setReceipt(completed);
  }
  if (receipt)
    return (
      <main id="conteudo" tabIndex={-1} className="checkout">
        <h1>Pedido simulado concluído</h1>
        <p>Agradecemos a sua compra! O estoque desta sessão foi atualizado.</p>
        <p>Nenhuma cobrança ou transmissão de dados foi realizada.</p>
        <OrderSummary items={receipt} />
        <Link to="/produtos">Voltar aos produtos</Link>
      </main>
    );
  if (!total)
    return (
      <main id="conteudo" tabIndex={-1}>
        <h1>Sua sacola está vazia</h1>
        <Link to="/produtos">Explorar produtos</Link>
      </main>
    );
  return (
    <main id="conteudo" tabIndex={-1} className="checkout">
      <h1>Finalizar pedido</h1>
      <p>Use dados fictícios. Os campos do formulário não são enviados nem persistidos.</p>
      <OrderSummary items={items} />
      {error && <p role="alert">{error}</p>}
      <form
        onSubmit={submit}
        onInput={(e) => {
          if (e.target instanceof HTMLInputElement) e.target.setCustomValidity('');
        }}
      >
        <label>
          Nome fictício
          <input required name="name" autoComplete="off" maxLength={80} />
        </label>
        <label>
          E-mail fictício
          <input required type="email" name="email" autoComplete="off" maxLength={120} />
        </label>
        <label>
          Endereço fictício
          <input required name="address" autoComplete="off" maxLength={160} />
        </label>
        <p>Pagamento e entrega simulados.</p>
        <button type="submit">Concluir pedido simulado</button>
      </form>
    </main>
  );
}
