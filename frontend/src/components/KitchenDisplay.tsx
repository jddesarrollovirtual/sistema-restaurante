import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { logout as apiLogout } from '../services/authService';
import type { RootState } from '../store/store';
import { Check, Flame, ChevronDown, ChevronUp, LogOut } from 'lucide-react';

const socket = io('http://localhost:3000');

interface Order {
  _id: string;
  table: { number: string };
  items: { product: { name: string }, quantity: number }[];
  status: 'pendiente' | 'preparando' | 'listo';
  createdAt: string;
}

const getOrderAge = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  return Math.floor(diff / 60000);
};

// Componente para tarjeta de pedido individual
const OrderCard = ({ order, updateStatus }: { order: Order, updateStatus: (id: string, status: string) => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const age = getOrderAge(order.createdAt);
    const itemsToShow = isExpanded ? order.items : order.items.slice(0, 3);
    const hasMoreItems = order.items.length > 3;

    const getStatusBorder = (status: string, age: number) => {
        if (age > 15) return 'border-l-red-500 bg-red-950/40 animate-pulse';
        if (age > 10) return 'border-l-amber-500 bg-amber-950/30';
        if (status === 'pendiente') return 'border-l-orange-500 bg-[#111827]';
        if (status === 'preparando') return 'border-l-blue-500 bg-[#111827]';
        return 'border-l-emerald-500 bg-[#111827]';
    };

    return (
        <div className={`p-6 rounded-3xl border border-white/10 border-l-8 ${getStatusBorder(order.status, age)} shadow-lg flex flex-col animate-in fade-in zoom-in duration-500`}>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Mesa</p>
                    <p className="text-5xl font-black">{order.table?.number}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tiempo</p>
                    <p className={`text-3xl font-mono font-bold ${age > 10 ? 'text-red-400' : 'text-white'}`}>{age}m</p>
                </div>
            </div>

            <ul className="space-y-3 mb-4">
                {itemsToShow.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-base bg-black/30 p-4 rounded-xl">
                        <span className="font-semibold text-white">{item.product?.name || 'Producto'}</span>
                        <span className="font-black bg-white/10 px-4 py-1 rounded-lg text-sm">{item.quantity}</span>
                    </li>
                ))}
            </ul>

            {hasMoreItems && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 mb-6 hover:text-white transition-all">
                    {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    {isExpanded ? 'Ver menos' : `Ver ${order.items.length - 3} más...`}
                </button>
            )}

            <div className="flex gap-4 mt-auto">
                {order.status === 'pendiente' && (
                    <button onClick={() => updateStatus(order._id, 'preparando')} className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm transition-all">INICIAR PREPARACIÓN</button>
                )}
                {order.status === 'preparando' && (
                    <button onClick={() => updateStatus(order._id, 'listo')} className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"><Check size={20} /> MARCAR COMO LISTO</button>
                )}
            </div>
        </div>
    );
};

export const KitchenDisplay = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data.filter((o: Order) => o.status !== 'entregado')));

    socket.on('newOrder', (newOrder: Order) => setOrders(prev => [...prev, newOrder]));
    socket.on('orderUpdated', (u: Order) => setOrders(prev => prev.map(o => o._id === u._id ? u : o)));
    
    return () => { socket.off('newOrder'); socket.off('orderUpdated'); };
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    await axios.patch(`http://localhost:3000/api/orders/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
  };

  const handleLogout = () => {
    apiLogout();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="h-screen w-screen bg-[#05070E] text-white flex flex-col font-sans overflow-hidden">
      <header className="flex justify-between items-center px-8 py-6 border-b border-white/10 bg-[#0B1020]">
        <h2 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase"><Flame className="text-orange-500" size={28}/> Kitchen Ops</h2>
        <div className="flex items-center gap-6">
            <div className="font-mono text-xl font-bold bg-[#111827] px-6 py-2 rounded-xl border border-white/10">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            <button onClick={handleLogout} className="px-6 py-3 bg-red-950/30 hover:bg-red-900/50 text-red-400 rounded-xl text-sm font-medium transition-all border border-red-900/50">Salir</button>
        </div>
      </header>

      <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-y-auto">
        {['pendiente', 'preparando', 'listo'].map(status => (
            <div key={status} className="flex flex-col gap-6">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">{status} ({orders.filter(o => o.status === status).length})</h2>
                {orders.filter(o => o.status === status).map(o => (
                    <OrderCard key={o._id} order={o} updateStatus={updateStatus} />
                ))}
            </div>
        ))}
      </div>
    </div>
  );
};
