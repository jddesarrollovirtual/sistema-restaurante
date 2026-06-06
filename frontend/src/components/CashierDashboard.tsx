import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/authSlice';
import { logout as apiLogout } from '../services/authService';
import type { RootState } from '../store/store';
import { Wallet, LogOut, Clock } from 'lucide-react';
import { Receipt } from './Receipt';

export const CashierDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchPendingOrders = async () => {
    try {
      const res = await apiClient.get('/api/orders');
      setOrders(res.data.filter((o: any) => o.status !== 'entregado'));
    } catch (err) { console.error('Error fetching orders', err); }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000); // Auto-refresh cada 30s
    return () => clearInterval(interval);
  }, [token]);

  const handleLogout = () => {
    apiLogout();
    dispatch(logout());
    navigate('/login');
  };

  const processPayment = async (orderId: string, _total: number) => {
    const tips = parseFloat(prompt('Ingrese el monto de propina (o 0):') || '0');
    try {
        await apiClient.patch(`/api/orders/${orderId}/status`, { 
            status: 'cobrado',
            tips: tips
        });
        fetchPendingOrders();
    } catch (err) { alert('Error al procesar pago'); }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <Wallet className="text-indigo-600" size={32}/>
          <h1 className="text-2xl font-bold tracking-tight">PUNTO DE CAJA</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all">
            <LogOut size={18} /> Salir
        </button>
      </header>

      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map(o => (
            <div key={o._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-700">Mesa {o.table?.number}</span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Clock size={14}/> {new Date(o.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              
              <div className="p-4 flex-1">
                <ul className="text-sm text-slate-600 space-y-2">
                    {o.items.map((item: any, idx: number) => (
                        <li key={idx} className="flex justify-between border-b border-slate-50 pb-1">
                            <span>{item.quantity} x {item.product?.name}</span>
                            <span className="font-medium">S/ {(item.product?.price * item.quantity).toFixed(2)}</span>
                        </li>
                    ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-500 font-semibold">TOTAL:</span>
                    <span className="text-2xl font-black text-indigo-700">S/ {o.total.toFixed(2)}</span>
                </div>
                
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Receipt order={o} />
                    </div>
                    <button onClick={() => processPayment(o._id, o.total)} className="flex-1 bg-green-600 text-white rounded-lg font-bold py-2">
                        Cobrar
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
