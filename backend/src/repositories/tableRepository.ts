import Table from '../models/Table.js';

export const tableRepository = {
  findAll: async () => await Table.find(),
  create: async (data: any) => await Table.create(data),
  update: async (id: string, data: any) => await Table.findByIdAndUpdate(id, data, { new: true }),
  delete: async (id: string) => await Table.findByIdAndDelete(id),
};
