import { orderRepository } from '../repositories/orderRepository.js';

export const orderService = {
  getAllOrders: async () => await orderRepository.findAll(),
  createOrder: async (data: any) => await orderRepository.create(data),
  updateOrderStatus: async (id: string, status: string, tips?: number) => await orderRepository.updateStatus(id, status, tips),
};
