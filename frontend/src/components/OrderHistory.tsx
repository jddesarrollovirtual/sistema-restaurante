import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

interface Order {
  _id: string;
  table: { number: string };
  waiter: { username: string };
  total: number;
  status: string;
  createdAt: string;
}

export const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
    }
  };

  return (
    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-sm col-span-3">
      <h2 className="text-xl font-bold text-white mb-6">Historial de Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="pb-4">Mesa</th>
              <th className="pb-4">Mesero</th>
              <th className="pb-4">Total</th>
              <th className="pb-4">Estado</th>
              <th className="pb-4">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map(o => (
              <tr key={o._id} className="text-gray-200">
                <td className="py-4">{o.table?.number}</td>
                <td className="py-4">{o.waiter?.username}</td>
                <td className="py-4 text-white font-medium">${o.total.toFixed(2)}</td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-bold">
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
