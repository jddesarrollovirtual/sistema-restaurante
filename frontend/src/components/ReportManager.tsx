import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { BarChart3 } from 'lucide-react';

interface Report {
    _id: string;
    date: string;
    totalSales: number;
    totalTips: number;
    totalGuests: number;
    ordersCount: number;
}

export const ReportManager = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        apiClient.get('/api/reports')
            .then(res => setReports(res.data));
    }, [token]);

    const handleCloseDay = async () => {
        if (!confirm('¿Estás seguro de cerrar la caja y generar el reporte del día?')) return;
        try {
            await apiClient.post('/api/reports/close', {});
            alert('Cierre de caja exitoso');
            window.location.reload();
        } catch (err) {
            alert('Error al cerrar la caja');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">Reportes y Cierre de Caja</h2>
                <button onClick={handleCloseDay} className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-all">Ejecutar Cierre Diario</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(r => (
                    <div key={r._id} className="bg-[#0B1020] p-6 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-400">
                            <BarChart3 />
                            <span className="font-bold">{new Date(r.date).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-400 text-sm">Ventas Totales: <span className="text-white font-bold">${r.totalSales.toFixed(2)}</span></p>
                            <p className="text-gray-400 text-sm">Propinas: <span className="text-white font-bold">${r.totalTips.toFixed(2)}</span></p>
                            <p className="text-gray-400 text-sm">Comensales: <span className="text-white font-bold">{r.totalGuests}</span></p>
                            <p className="text-gray-400 text-sm">Pedidos: <span className="text-white font-bold">{r.ordersCount}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
