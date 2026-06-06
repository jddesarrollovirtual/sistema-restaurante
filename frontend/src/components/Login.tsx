import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthForm } from './AuthForm';
import { PreviewDashboard } from './PreviewDashboard';
import { Shield, User, ChefHat, Receipt } from 'lucide-react';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<'administrador' | 'mesero' | null>(null);

  return (
    <main className="h-screen w-screen bg-background text-text flex overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Panel Izquierdo: Formulario */}
      <section className="w-full lg:w-[40%] flex flex-col justify-center px-12 xl:px-24 border-r border-white/5 bg-background-surface">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-12">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-8">
              <img src="/restaurant-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter mb-2">Restaurant Manager Pro</h1>
            <p className="text-text-muted text-lg font-medium">Control total de tu operación gastronómica.</p>
          </div>

          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div key="roles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <h2 className="text-sm font-semibold text-text-dark uppercase tracking-wider mb-6">Selecciona tu perfil</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'administrador', label: 'Admin', desc: 'Gestión total', icon: Shield },
                    { id: 'mesero', label: 'Mesero', desc: 'Pedidos y mesas', icon: User },
                    { id: 'cocinero', label: 'Cocinero', desc: 'Órdenes reales', icon: ChefHat },
                    { id: 'cajero', label: 'Cajero', desc: 'Pagos y cierre', icon: Receipt },
                  ].map((role) => (
                    <button key={role.id} onClick={() => setSelectedRole(role.id as any)} 
                      className="group flex flex-col items-start p-6 bg-background-panel border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-white/5 transition-all">
                      <role.icon className="w-6 h-6 mb-3 text-text-dark group-hover:text-primary" />
                      <span className="font-semibold">{role.label}</span>
                      <span className="text-[10px] text-text-dark">{role.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AuthForm role={selectedRole} onBack={() => setSelectedRole(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Panel Derecho: Dashboard Preview (El Storytelling) */}
      <section className="hidden lg:flex w-[60%] relative bg-[#05070E] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366F110,transparent_70%)]" />
        <div className="relative z-10 w-full max-w-2xl bg-background-panel/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-lg font-bold">Resumen Diario</h3>
                    <p className="text-text-muted text-sm">Operación en tiempo real</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20">LIVE</div>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8">
                {[ {l:'Ventas',v:'$2,450'}, {l:'Mesas',v:'14/20'}, {l:'Pedidos',v:'8'} ].map(stat => (
                    <div key={stat.l} className="p-4 bg-background-surface/50 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-text-dark uppercase">{stat.l}</p>
                        <p className="text-xl font-bold mt-1">{stat.v}</p>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center p-4 bg-background-surface/30 rounded-xl border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mr-4 animate-pulse" />
                        <span className="text-sm font-medium flex-1">Mesa {i*2} - Pedido #{100+i}</span>
                        <span className="text-xs text-text-muted">Hace 5m</span>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </main>
  );
}
