import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { io } from '../app';

export const orderController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  },
  create: async (req: Request, res: Response) => {
    console.log('Payload recibido en backend:', req.body);
    try {
      const order = await orderService.createOrder(req.body);
      io.emit('newOrder', order);
      res.status(201).json(order);
    } catch (err) {
      console.error('Error al crear pedido en backend:', err);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },
  updateStatus: async (req: Request, res: Response) => {
    try {
      const { status, tips } = req.body;
      const order = await orderService.updateOrderStatus(req.params.id, status, tips);
      io.emit('orderUpdated', order); // Emitir evento de actualización
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
};
