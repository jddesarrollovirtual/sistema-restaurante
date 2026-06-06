import { useState, useEffect } from 'react';
import { apiClient, socket } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Table, Users, CheckCircle } from 'lucide-react';

interface Table {
  _id: string;
  number: string;
  capacity: number;
  status: 'libre' | 'ocupada' | 'reservada' | 'mantenimiento';
  location: string;
}

export const TableMap = ({ onTableSelect }: { onTableSelect: (id: string) => void }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [readyOrders, setReadyOrders] = useState<string[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000);
    
    socket.on('orderUpdated', (updatedOrder: any) => {
        if(updatedOrder.status === 'listo') {
            setReadyOrders(prev => [...prev, updatedOrder.table]);
            // Notificación visual simple
            alert(`¡Pedido de mesa ${updatedOrder.table.number} está listo!`);
        }
    });

    return () => { 
        clearInterval(interval); 
        socket.off('orderUpdated');
    };
  }, [token]);

  const fetchTables = async () => {
    try {
      const res = await apiClient.get('/api/tables');
      setTables(res.data);
    } catch (err) { console.error('Error fetching tables', err); }
  };

  const getStatusStyles = (status: string, tableId: string) => {
    if (readyOrders.includes(tableId)) return 'bg-emerald-500/30 text-white border-emerald-500';
    switch(status) {
      case 'libre': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'ocupada': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'reservada': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="col-span-1 md:col-span-3">
      <h2 className="text-xl font-bold dark:text-white mb-6">Mapa de Mesas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {tables.map(t => (
          <div key={t._id} onClick={() => onTableSelect(t._id)} className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${getStatusStyles(t.status, t._id)}`}>
            <p className="text-3xl font-bold flex items-center justify-between">
                <Table size={24} /> {t.number}
            </p>
            <p className="text-xs opacity-75 uppercase mt-1">{t.location}</p>
            <div className="flex justify-between items-end mt-4">
                {readyOrders.includes(t._id) ? <CheckCircle className="text-white" size={16}/> : <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-white/5">{t.status.toUpperCase()}</span>}
                <span className="text-xs flex items-center gap-1"><Users size={12}/> {t.capacity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
