import Order from '../models/Order.js';
import DailyReport from '../models/DailyReport.js';
import mongoose from 'mongoose';

export const generateDailyReport = async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const allOrders = await Order.find({});
    console.log('DEBUG: Total órdenes en BD:', allOrders.length);
    console.log('DEBUG: Ejemplos de órdenes:', allOrders.slice(0, 3).map(o => ({ status: o.status, createdAt: o.createdAt })));

    const orders = await Order.find({
        status: 'cobrado',
        createdAt: { $gte: today, $lt: tomorrow }
    } as any);

    console.log('DEBUG: Órdenes filtradas para hoy:', orders.length);

    if (orders.length === 0) {
        throw new Error('No hay órdenes para cerrar hoy');
    }

    const existingReport = await DailyReport.findOne({ date: today });
    
    let totalSales = 0;
    let totalTips = 0;
    let totalGuests = 0;
    const platoCounts: { [key: string]: number } = {};

    orders.forEach(order => {
        totalSales += order.total;
        totalTips += order.tips || 0;
        totalGuests += order.guests;
        
        order.items.forEach(item => {
            const productId = item.product.toString();
            platoCounts[productId] = (platoCounts[productId] || 0) + item.quantity;
        });
    });

    if (existingReport) {
        // Actualizar reporte existente
        existingReport.totalSales += totalSales;
        existingReport.totalTips += totalTips;
        existingReport.totalGuests += totalGuests;
        existingReport.ordersCount += orders.length;

        for (const [productId, quantity] of Object.entries(platoCounts)) {
            const existingPlato = existingReport.platosVendidos.find(p => p.product.toString() === productId);
            if (existingPlato) {
                existingPlato.quantity += quantity;
            } else {
                existingReport.platosVendidos.push({
                    product: new mongoose.Types.ObjectId(productId),
                    quantity
                });
            }
        }
        await existingReport.save();
        await Order.deleteMany({ _id: { $in: orders.map(o => o._id) } });
        return existingReport;
    } else {
        // Crear reporte nuevo
        const platosVendidos = Object.keys(platoCounts).map(productId => ({
            product: new mongoose.Types.ObjectId(productId),
            quantity: platoCounts[productId]
        }));

        const report = new DailyReport({
            date: today,
            totalSales,
            totalTips,
            totalGuests,
            ordersCount: orders.length,
            platosVendidos
        });

        await report.save();
        await Order.deleteMany({ _id: { $in: orders.map(o => o._id) } });
        return report;
    }
};
