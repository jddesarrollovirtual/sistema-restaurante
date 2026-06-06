import { Request, Response } from 'express';
import { productService } from '../services/productService';

export const productController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }
};
