import { Request, Response } from 'express';
import { tableService } from '../services/tableService';

export const tableController = {
  getAll: async (req: Request, res: Response) => {
    try {
      const tables = await tableService.getAllTables();
      res.json(tables);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch tables' });
    }
  },
  create: async (req: Request, res: Response) => {
    try {
      const table = await tableService.createTable(req.body);
      res.status(201).json(table);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create table' });
    }
  },
  update: async (req: Request, res: Response) => {
    try {
      const table = await tableService.updateTable(req.params.id, req.body);
      res.json(table);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update table' });
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      await tableService.deleteTable(req.params.id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete table' });
    }
  }
};
