import Product, { IProduct } from '../models/Product.js';

export const productRepository = {
  findAll: async () => await Product.find(),
  findById: async (id: string) => await Product.findById(id),
  create: async (data: any) => await Product.create(data),
  update: async (id: string, data: any) => await Product.findByIdAndUpdate(id, data, { new: true }),
  delete: async (id: string) => await Product.findByIdAndDelete(id),
};
