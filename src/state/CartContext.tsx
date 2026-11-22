import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { products } from '../data/catalog';
export const CART_KEY = 'conecta.cart.v1';
type Items = Record<string, number>;
function normalize(raw: unknown, stock?: Items): Items {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Items = {};
  for (const p of products) {
    const available = stock?.[p.id] ?? p.stock;
    const n = (raw as Record<string, unknown>)[p.id];
    if (typeof n === 'number' && Number.isFinite(n) && n >= 1 && available > 0)
      result[p.id] = Math.min(available, Math.floor(n));
  }
  return result;
}
function readCart(): Items {
  try {
    return normalize(JSON.parse(localStorage.getItem(CART_KEY) || '{}'));
  } catch {
    return {};
  }
}
type CartState = {
  items: Items;
  stock: Items;
  purchase: () => Items | null;
  setQuantity: (id: string, n: number) => void;
  add: (id: string, n?: number) => void;
  clear: () => void;
  total: number;
  count: number;
  storageError: boolean;
};
const Context = createContext<CartState | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Items>(readCart);
  const [stock, setStock] = useState<Items>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.stock])),
  );
  const purchaseLock = useRef(false);
  const purchase = () => {
    if (purchaseLock.current || Object.keys(items).length === 0) return null;
    if (
      Object.entries(items).some(([id, n]) => !Number.isInteger(n) || n < 1 || n > (stock[id] ?? 0))
    )
      return null;
    purchaseLock.current = true;
    const receipt = { ...items };
    setStock((old) =>
      Object.fromEntries(Object.entries(old).map(([id, n]) => [id, n - (receipt[id] || 0)])),
    );
    setItems({});
    return receipt;
  };
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [items]);
  const setQuantity = (id: string, n: number) => {
    if (Number.isFinite(n)) {
      purchaseLock.current = false;
      setItems((old) => normalize({ ...old, [id]: n }, stock));
    }
  };
  const add = (id: string, n = 1) => {
    if (Number.isInteger(n) && n > 0) {
      purchaseLock.current = false;
      setItems((old) => normalize({ ...old, [id]: (old[id] || 0) + n }, stock));
    }
  };
  const total = products.reduce((sum, p) => sum + p.price * (items[p.id] || 0), 0);
  return (
    <Context.Provider
      value={{
        items,
        stock,
        purchase,
        setQuantity,
        add,
        clear: () => setItems({}),
        total,
        count: Object.values(items).reduce((a, b) => a + b, 0),
        storageError,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCart() {
  const value = useContext(Context);
  if (!value) throw new Error('Carrinho indisponível');
  return value;
}
