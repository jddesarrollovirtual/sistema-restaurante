import { useState } from 'react';
import { TableMapCol } from './TableMapCol';
import { CatalogCol } from './CatalogCol';
import { OrderCol } from './OrderCol';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/authSlice';
import { logout as apiLogout } from '../../services/authService';
import { LogOut, Table, LayoutGrid, Receipt } from 'lucide-react';

export const MeseroDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'map' | 'catalog' | 'order'>('map');

  const handleLogout = () => {
    apiLogout();
    dispatch(logout());
    navigate('/login');
  };

  return (
    <main className="h-screen w-screen bg-[#0B1020] text-[#F8FAFC] flex flex-col overflow-hidden font-sans">
        <header className="flex justify-between items-center px-4 py-3 md:px-8 md:py-6 border-b border-white/5 bg-[#0B1020]/50 backdrop-blur-md">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase text-indigo-400">SR 360 // Mesero</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-red-950/30 hover:bg-red-900/50 text-red-400 rounded-xl text-sm md:text-base font-medium transition-all border border-red-900/50">
                <LogOut size={18} /> <span className="hidden md:inline">Salir</span>
            </button>
        </header>

        {/* Desktop view */}
        <div className="flex-1 hidden lg:flex overflow-hidden p-4 gap-4">
            <TableMapCol />
            <CatalogCol />
            <OrderCol />
        </div>

        {/* Mobile/Tablet view */}
        <div className="flex-1 lg:hidden flex flex-col overflow-hidden p-4">
            <div className="flex-1 overflow-hidden">
                {activeTab === 'map' && <TableMapCol />}
                {activeTab === 'catalog' && <CatalogCol />}
                {activeTab === 'order' && <OrderCol />}
            </div>
            <nav className="grid grid-cols-3 gap-2 mt-4 bg-[#111827] p-2 rounded-2xl border border-white/10">
                <button onClick={() => setActiveTab('map')} className={`flex flex-col items-center p-3 rounded-xl ${activeTab === 'map' ? 'bg-indigo-600' : ''}`}><Table size={20}/> <span className="text-[10px] uppercase font-bold">Mesas</span></button>
                <button onClick={() => setActiveTab('catalog')} className={`flex flex-col items-center p-3 rounded-xl ${activeTab === 'catalog' ? 'bg-indigo-600' : ''}`}><LayoutGrid size={20}/> <span className="text-[10px] uppercase font-bold">Catálogo</span></button>
                <button onClick={() => setActiveTab('order')} className={`flex flex-col items-center p-3 rounded-xl ${activeTab === 'order' ? 'bg-indigo-600' : ''}`}><Receipt size={20}/> <span className="text-[10px] uppercase font-bold">Pedido</span></button>
            </nav>
        </div>
    </main>
  );
};
