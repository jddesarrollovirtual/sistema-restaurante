import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../features/orderSlice';
import type { RootState } from '../../store/store';
import { Search } from 'lucide-react';

export const CatalogCol = () => {
  const [products, setProducts] = useState<{_id: string, name: string, price: number, category: string}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  const { tableName } = useSelector((state: RootState) => state.order); 
  const dispatch = useDispatch();

  useEffect(() => {
    apiClient.get('/api/products')
        .then(res => setProducts(res.data));
  }, []);

  const categories = useMemo(() => {
    const cats = ['Todos', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="h-full w-full lg:w-[40%] bg-[#0B1020] border border-white/10 rounded-2xl p-6 overflow-y-auto flex flex-col gap-6">
        {/* Banner de contexto */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-2xl">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">Mesa Activa</p>
            <p className="text-white text-3xl md:text-5xl font-black">{tableName ? `Mesa ${tableName}` : 'Selecciona una mesa'}</p>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
                <input 
                    type="text" 
                    placeholder="Buscar producto..." 
                    className="w-full bg-[#111827] text-white p-4 pl-12 rounded-2xl border border-white/10 focus:border-indigo-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-[#111827] text-gray-400 hover:bg-white/5'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Catálogo */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Productos</h2>
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${!tableName ? 'opacity-50 pointer-events-none' : ''}`}>
            {filteredProducts.map(p => (
                <button key={p._id} onClick={() => dispatch(addItem({productId: p._id, name: p.name, price: p.price}))}
                    className="p-6 bg-[#111827] rounded-2xl border border-white/10 hover:border-indigo-500 transition-all text-left flex flex-col gap-1">
                    <p className="font-bold text-lg">{p.name}</p>
                    <p className="text-indigo-400 font-black text-xl">${p.price.toFixed(2)}</p>
                </button>
            ))}
        </div>
    </div>
  );
};
