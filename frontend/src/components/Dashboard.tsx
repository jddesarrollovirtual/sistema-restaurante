import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { logout as apiLogout } from '../services/authService';
import type { RootState } from '../store/store';
import { UserRegistrationForm } from './UserRegistrationForm';
import { ProductManager } from './ProductManager';
import { TableManager } from './TableManager';
import { OrderHistory } from './OrderHistory';
import { MeseroDashboard } from './WaiterDashboard/WaiterDashboard';
import { KitchenDisplay } from './KitchenDisplay';
import { CashierDashboard } from './CashierDashboard';
import { ReportManager } from './ReportManager';
import { LayoutDashboard, Package, Armchair, Users, LogOut, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) return null;

  if (user.role === 'mesero') return <MeseroDashboard />;
  if (user.role === 'cocinero') return <KitchenDisplay />;
  if (user.role === 'cajero') return <CashierDashboard />;

  const menu = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'tables', label: 'Mesas', icon: Armchair },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-[#05070E] text-white">
      {/* Sidebar Profesional */}
      <aside className="w-64 border-r border-white/5 bg-[#0B1020] p-6 flex flex-col">
        <div className="mb-10 text-xl font-black text-indigo-500 tracking-tighter">SR 360</div>
        <nav className="flex-1 space-y-2">
            {menu.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.id ? 'bg-[#6366F1] text-white' : 'text-gray-400 hover:bg-white/5'}`}>
                    <item.icon size={18} /> {item.label}
                </button>
            ))}
        </nav>
        <button onClick={() => { apiLogout(); dispatch(logout()); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-950/20 transition-all">
            <LogOut size={18} /> Cerrar Sesión
        </button>
      </aside>

      {/* Área de Contenido */}
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && <OrderHistory />}
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'tables' && <TableManager />}
            {activeTab === 'users' && <UserRegistrationForm />}
            {activeTab === 'reports' && <ReportManager />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
