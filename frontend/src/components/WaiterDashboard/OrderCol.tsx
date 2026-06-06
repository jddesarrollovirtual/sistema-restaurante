import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { clearOrder, increaseQuantity, decreaseQuantity, removeItem } from '../../features/orderSlice';
import axios from 'axios';
import { useState } from 'react';
import { Trash2, Plus, Minus, Users } from 'lucide-react';

export const OrderCol = () => {
  const { items, tableId, tableName } = useSelector((state: RootState) => state.order);
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [guests, setGuests] = useState(1);

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const tax = subtotal * 0.16;

  const sendToKitchen = async () => {
    if(!tableId || items.length === 0) return;
    setIsLoading(true);
    try {
      await axios.post('http://localhost:3000/api/orders', { 
        table: tableId, 
        waiter: userId, 
        items: items.map(i => ({ product: i.productId, quantity: i.quantity })), 
        total: subtotal + tax, 
        guests: guests
      }, { headers: { Authorization: `Bearer ${token}` } });
      dispatch(clearOrder());
      alert('Pedido enviado a cocina exitosamente');
    } catch (err) {
      console.error('Error enviando pedido:', err);
      alert('Error al enviar el pedido. Revisa la consola.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full lg:w-[30%] bg-[#0B1020] p-8 flex flex-col border border-white/10 rounded-2xl">
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Pedido en curso</h2>
      <div className="text-3xl md:text-5xl font-black text-white mb-8">Mesa {tableName || '--'}</div>
      
      <div className="flex-1 overflow-y-auto space-y-6">
        <div className="flex items-center gap-4 bg-[#111827] p-4 rounded-xl">
            <Users className="text-indigo-400" size={20}/>
            <span className="font-bold text-sm text-gray-400 flex-1">Comensales</span>
            <div className="flex items-center gap-2">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-1 bg-white/5 rounded"><Minus size={16}/></button>
                <span className="font-bold w-6 text-center">{guests}</span>
                <button onClick={() => setGuests(guests + 1)} className="p-1 bg-white/5 rounded"><Plus size={16}/></button>
            </div>
        </div>
        {items.map((i, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 bg-[#111827] p-4 rounded-xl">
            <div className="flex-1">
                <p className="font-bold text-sm text-gray-200">{i.name}</p>
                <p className="text-indigo-400 font-bold text-sm">${(i.price * i.quantity).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => dispatch(decreaseQuantity(i.productId))} className="p-1 bg-white/5 rounded hover:bg-white/10"><Minus size={16}/></button>
                <span className="font-bold w-6 text-center">{i.quantity}</span>
                <button onClick={() => dispatch(increaseQuantity(i.productId))} className="p-1 bg-white/5 rounded hover:bg-white/10"><Plus size={16}/></button>
                <button onClick={() => dispatch(removeItem(i.productId))} className="p-2 ml-2 text-red-500 hover:bg-red-900/20 rounded"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/10 space-y-4">
        <div className="flex justify-between text-gray-400 text-lg"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-xl md:text-2xl font-bold text-white"><span>Total</span><span>${(subtotal + tax).toFixed(2)}</span></div>
        <button 
          onClick={sendToKitchen} 
          disabled={isLoading || items.length === 0}
          className="w-full py-6 bg-indigo-600 rounded-2xl text-lg md:text-xl font-bold mt-4 hover:bg-indigo-500 disabled:opacity-50 transition-all"
        >
          {isLoading ? 'Enviando...' : 'Enviar a Cocina'}
        </button>
      </div>
    </div>
  );
};
