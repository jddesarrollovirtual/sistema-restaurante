import { tableRepository } from '../repositories/tableRepository.js';

export const tableService = {
  getAllTables: async () => await tableRepository.findAll(),
  createTable: async (data: any) => await tableRepository.create(data),
  updateTable: async (id: string, data: any) => await tableRepository.update(id, data),
  deleteTable: async (id: string) => await tableRepository.delete(id),
};
