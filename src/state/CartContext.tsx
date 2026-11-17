import { createContext, useContext, useState, type ReactNode } from 'react';
import { products } from '../data/catalog';
type CartState = {items:Record<string,number>; setQuantity:(id:string,n:number)=>void; add:(id:string)=>void; clear:()=>void; total:number; count:number};
const Context = createContext<CartState | null>(null);
export function CartProvider({children}:{children:ReactNode}) {
 const [items,setItems] = useState<Record<string,number>>({});
 const setQuantity=(id:string,n:number)=>setItems(old=>{const next={...old};if(n<=0) delete next[id];else next[id]=Math.min(99,Math.floor(n));return next;});
 const add=(id:string)=>setItems(old=>({...old,[id]:Math.min(99,(old[id]||0)+1)}));
 const total=products.reduce((sum,p)=>sum+p.price*(items[p.id]||0),0);
 return <Context.Provider value={{items,setQuantity,add,clear:()=>setItems({}),total,count:Object.values(items).reduce((a,b)=>a+b,0)}}>{children}</Context.Provider>;
}
export function useCart(){const value=useContext(Context);if(!value)throw new Error('Carrinho indisponível');return value;}
