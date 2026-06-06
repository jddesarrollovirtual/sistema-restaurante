import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setTable } from '../../features/orderSlice';
import type { RootState } from '../../store/store';
import { Table, Bell, CheckCircle2 } from 'lucide-react';

const socket = io('http://localhost:3000');

interface TableType { _id: string; number: string; status: string; location: string; }

export const TableMapCol = () => {
  const [tables, setTables] = useState<TableType[]>([]);
  const [readyOrders, setReadyOrders] = useState<any[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
        const res = await axios.get('http://localhost:3000/api/tables', { headers: { Authorization: `Bearer ${token}` } });
        setTables(res.data);
    };
    fetch();
    
    socket.on('orderUpdated', (updatedOrder: any) => {
        if(updatedOrder.status === 'listo') {
            setReadyOrders(prev => [...prev, {tableId: updatedOrder.table._id, number: updatedOrder.table.number}]);
        } else if (updatedOrder.status === 'entregado') {
            setReadyOrders(prev => prev.filter(order => order.tableId !== updatedOrder.table));
        }
    });
    return () => { socket.off('orderUpdated'); };
  }, [token]);

  const getStatusStyles = (status: string, tableId: string) => {
    if (readyOrders.some(order => order.tableId === tableId)) return 'bg-emerald-900/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
    switch(status) {
      case 'libre': return 'bg-white/5 border-emerald-500/30';
      case 'ocupada': return 'bg-red-900/30 border-red-500/30';
      case 'reservada': return 'bg-amber-900/30 border-amber-500/30';
      default: return 'bg-white/5 border-white/10';
    }
  };

  return (
    <div className="h-full w-full lg:w-[25%] bg-[#0B1020] border border-white/10 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6">
        <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Mapa de Mesas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                {tables.map(t => (
                    <button key={t._id} onClick={() => dispatch(setTable({id: t._id, number: t.number}))}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all relative ${getStatusStyles(t.status, t._id)}`}>
                        <Table size={28} className="mb-3 opacity-60"/>
                        <span className="font-black text-2xl">{t.number}</span>
                        {readyOrders.some(order => order.tableId === t._id) && <Bell className="text-emerald-400 absolute top-2 right-2" size={16} />}
                    </button>
                ))}
            </div>
        </div>

        {readyOrders.length > 0 && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4">
                <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 size={14}/> Pedidos Listos
                </h3>
                <div className="space-y-2">
                    {readyOrders.map(order => (
                        <div key={order.tableId} className="bg-emerald-900/50 text-white font-medium p-2 rounded-lg text-sm">
                            Mesa {order.number}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};
