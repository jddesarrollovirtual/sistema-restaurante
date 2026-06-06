import { TrendingUp, Users } from 'lucide-react';

export const PreviewDashboard = () => (
  <div className="w-full bg-[#0B1020]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-widest">Estado Operativo</h3>
        <p className="text-2xl font-bold text-white mt-1">SmartRestaurant Dashboard</p>
      </div>
      <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider">LIVE</span>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-8">
      {[ {l:'Ventas', v:'$12,450', i:TrendingUp}, {l:'Mesas', v:'14/20', i:Users} ].map(s => (
        <div key={s.l} className="p-5 bg-[#111827] border border-white/5 rounded-2xl">
          <s.i className="w-5 h-5 text-[#6366F1] mb-3" />
          <p className="text-[10px] text-[#64748B] uppercase tracking-wider">{s.l}</p>
          <p className="text-2xl font-bold text-white mt-1">{s.v}</p>
        </div>
      ))}
    </div>

    <div className="space-y-3">
      {[ {t:'Pedido #402', s:'En Cocina', c:'text-orange-400'}, {t:'Inventario Bajo', s:'Tomates', c:'text-red-400'} ].map((a, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-[#111827] border border-white/5 rounded-xl">
          <span className="text-sm text-gray-200">{a.t}</span>
          <span className={`text-xs font-bold ${a.c}`}>{a.s}</span>
        </div>
      ))}
    </div>
  </div>
);
