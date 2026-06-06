import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface Table {
  _id?: string;
  number: string;
  capacity: number;
  status: 'libre' | 'ocupada' | 'reservada' | 'mantenimiento';
  location: string;
}

export const TableManager = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<Table>({ number: '', capacity: 2, status: 'libre', location: '' });
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchTables = async () => {
    try {
      const res = await apiClient.get('/api/tables');
      setTables(res.data);
    } catch (err) { console.error('Error fetching tables', err); }
  };

  useEffect(() => { fetchTables(); }, [token]);

  const handleOpenModal = (table: Table | null = null) => {
    setEditingTable(table);
    setFormData(table || { number: '', capacity: 2, status: 'libre', location: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTable?._id) {
        await apiClient.put(`/api/tables/${editingTable._id}`, formData);
      } else {
        await apiClient.post('/api/tables', formData);
      }
      setIsModalOpen(false);
      fetchTables();
    } catch (err) { console.error('Error saving table', err); }
  };

  const deleteTable = async (id: string) => {
    if (!confirm('¿Eliminar mesa?')) return;
    try {
      await apiClient.delete(`/api/tables/${id}`);
      fetchTables();
    } catch (err) { console.error('Error deleting table', err); }
  };

  return (
    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-sm col-span-1 md:col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Gestión de Mesas</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
          <Plus size={18} /> Nueva Mesa
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map(t => (
          <div key={t._id} className="p-5 bg-[#05070E] rounded-2xl border border-white/5 flex justify-between items-center">
            <div className="text-white">
                <p className="font-bold text-lg">Mesa {t.number}</p>
                <p className="text-xs text-gray-400">{t.location} • {t.capacity} pax</p>
                <p className="text-[10px] uppercase font-bold text-indigo-400 mt-1">{t.status}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => handleOpenModal(t)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 size={16}/></button>
                <button onClick={() => t._id && deleteTable(t._id)} className="p-2 text-red-500 hover:bg-red-950/30 rounded-lg"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-[#111827] p-8 rounded-3xl border border-white/10 w-full max-w-md space-y-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingTable ? 'Editar Mesa' : 'Nueva Mesa'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <input type="text" placeholder="Número (ej: A1)" value={formData.number} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, number: e.target.value})} required />
            <input type="number" placeholder="Capacidad" value={formData.capacity} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} required />
            <input type="text" placeholder="Ubicación (ej: Terraza)" value={formData.location} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, location: e.target.value})} required />
            <select className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="libre">Libre</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
                <option value="mantenimiento">Mantenimiento</option>
            </select>
            <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Guardar Mesa</button>
          </form>
        </div>
      )}
    </div>
  );
};
