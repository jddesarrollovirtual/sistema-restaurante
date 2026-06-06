import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

interface Product {
  _id?: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({ name: '', price: 0, category: '', stock: 0 });
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await apiClient.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setFormData(product || { name: '', price: 0, category: '', stock: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct?._id) {
        await apiClient.put(`/api/products/${editingProduct._id}`, formData);
      } else {
        await apiClient.post('/api/products', formData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product', err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      await apiClient.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  return (
    <div className="bg-[#111827] p-8 rounded-3xl border border-white/5 shadow-sm col-span-1 md:col-span-3">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Catálogo de Productos</h2>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="pb-4">Nombre</th>
              <th className="pb-4">Categoría</th>
              <th className="pb-4">Precio</th>
              <th className="pb-4">Stock</th>
              <th className="pb-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(p => (
              <tr key={p._id} className="text-white border-b border-white/5">
                <td className="py-4 font-semibold">{p.name}</td>
                <td className="py-4 text-gray-400">{p.category}</td>
                <td className="py-4 text-gray-300 font-mono">${p.price.toFixed(2)}</td>
                <td className="py-4 text-gray-300">{p.stock}</td>
                <td className="py-4 flex gap-2 justify-end">
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"><Edit2 size={16}/></button>
                  <button onClick={() => p._id && deleteProduct(p._id)} className="p-2 text-red-400 hover:bg-red-950/30 rounded-lg"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-[#111827] p-8 rounded-3xl border border-white/10 w-full max-w-md space-y-4 text-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <input type="text" placeholder="Nombre" value={formData.name} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="number" placeholder="Precio" value={formData.price} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} required />
            <input type="text" placeholder="Categoría" value={formData.category} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, category: e.target.value})} required />
            <input type="number" placeholder="Stock" value={formData.stock} className="w-full p-3 rounded-xl bg-[#05070E] text-white border border-white/10" onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} required />
            <button type="submit" className="w-full p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Guardar Producto</button>
          </form>
        </div>
      )}
    </div>
  );
};
