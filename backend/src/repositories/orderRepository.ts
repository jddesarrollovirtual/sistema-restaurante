import Order from '../models/Order';

export const orderRepository = {
  findAll: async () => await Order.find().populate('table waiter items.product'),
  create: async (data: any) => {
    const newOrder = await Order.create(data);
    return await newOrder.populate('table waiter items.product');
  },
  updateStatus: async (id: string, status: string, tips?: number) => {
    const updateData: any = { status };
    if (tips !== undefined) updateData.tips = tips;
    return await Order.findByIdAndUpdate(id, updateData, { new: true }).populate('table waiter items.product');
  },
};
