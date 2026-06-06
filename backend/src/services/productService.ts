import { productRepository } from '../repositories/productRepository.js';

export const productService = {
  getAllProducts: async () => await productRepository.findAll(),
  getProductById: async (id: string) => await productRepository.findById(id),
  createProduct: async (data: any) => await productRepository.create(data),
  updateProduct: async (id: string, data: any) => await productRepository.update(id, data),
  deleteProduct: async (id: string) => await productRepository.delete(id),
};
