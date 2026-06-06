import { Request, Response } from 'express';
import { ComprobanteService } from '../services/comprobanteService.js';

// Extender Request para incluir usuario
interface AuthenticatedRequest extends Request {
    user?: any;
}

export const ComprobanteController = {
  create: async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Asumiendo que el middleware de autenticación llena req.user
      const userId = req.user?.id || '60d5ec49f1b2c422c8a5c3e1'; // Fallback for testing if no auth context
      
      const comprobante = await ComprobanteService.emitirComprobante({
        ...req.body,
        zona: req.body.zona || 'GENERAL'
      }, userId);
      
      res.status(201).json(comprobante);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al emitir comprobante' });
    }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const list = await ComprobanteService.listarComprobantes();
      res.json(list);
    } catch (err) {
      res.status(500).json({ error: 'Error al listar comprobantes' });
    }
  }
};
