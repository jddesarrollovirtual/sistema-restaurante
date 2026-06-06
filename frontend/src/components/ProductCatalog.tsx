import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { Search } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

export const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products', err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-white/10 col-span-1 md:col-span-3">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold dark:text-white">Catálogo de Productos</h2>
        <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-500" size={18}/>
            <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl border dark:border-white/10 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map(p => (
          <div key={p._id} className="p-5 bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl border border-white/5 hover:border-indigo-500/50 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
            <h3 className="font-bold dark:text-white mb-1">{p.name}</h3>
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">{p.category}</p>
            <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-indigo-400">${p.price.toFixed(2)}</p>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {p.stock > 0 ? `${p.stock} EN STOCK` : 'AGOTADO'}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
