import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { X, ShoppingBag, Users, Loader2, Check } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
}

export const OrderTaker = ({ tableId, onBack }: { tableId: string, onBack: () => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<{product: string, quantity: number}[]>([]);
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProducts(res.data));
  }, [token]);

  const addToOrder = (productId: string) => {
    setItems(prev => {
        const existing = prev.find(i => i.product === productId);
        if (existing) return prev.map(i => i.product === productId ? {...i, quantity: i.quantity + 1} : i);
        return [...prev, { product: productId, quantity: 1 }];
    });
  };

  const submitOrder = async () => {
    setStatus('loading');
    try {
      const total = items.reduce((sum, item) => {
        const prod = products.find(p => p._id === item.product);
        return sum + (prod ? prod.price * item.quantity : 0);
      }, 0);

      await axios.post('http://localhost:3000/api/orders', {
        table: tableId,
        waiter: userId,
        items,
        total,
        guests
      }, { headers: { Authorization: `Bearer ${token}` } });
      setStatus('success');
      setTimeout(onBack, 1000);
    } catch (err) { 
        console.error('Error creating order', err); 
        setStatus('idle');
    }
  };

  return (
    <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white">Nueva Orden - Mesa {tableId}</h2>
        <button onClick={onBack}><X className="dark:text-white"/></button>
      </div>
      
      <div className="mb-6 flex items-center gap-4 bg-gray-50 dark:bg-[#1A1A1A] p-4 rounded-xl">
        <Users className="text-indigo-400" />
        <label className="dark:text-white font-medium">Comensales:</label>
        <input type="number" min="1" value={guests} onChange={e => setGuests(parseInt(e.target.value))} className="w-16 p-2 rounded-lg bg-white dark:bg-black border dark:border-white/10 dark:text-white" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 h-64 overflow-y-auto pr-2">
        {products.map(p => (
          <button key={p._id} onClick={() => addToOrder(p._id)} className="p-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border border-white/5 hover:border-indigo-500 transition-all text-left">
            <p className="font-bold dark:text-white">{p.name}</p>
            <p className="text-indigo-400">${p.price}</p>
          </button>
        ))}
      </div>

      <button onClick={submitOrder} disabled={status !== 'idle'} className={`w-full flex items-center justify-center gap-2 p-4 text-white rounded-2xl font-bold transition ${status === 'success' ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
        {status === 'loading' && <Loader2 className="animate-spin" />}
        {status === 'success' && <Check />}
        {status === 'idle' && <><ShoppingBag size={20} /> Enviar Pedido</>}
        {status === 'loading' && 'Enviando...'}
        {status === 'success' && 'Pedido Enviado'}
      </button>
    </div>
  );
};
