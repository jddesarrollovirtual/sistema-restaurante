import Comprobante, { IComprobante } from '../models/Comprobante';

export const ComprobanteRepository = {
  create: async (data: Partial<IComprobante>) => {
    return await Comprobante.create(data);
  },
  getLastNumero: async (tipoComprobante: string, serie: string) => {
    const last = await Comprobante.findOne({ tipoComprobante, serie } as any)
      .sort({ numero: -1 });
    return last ? last.numero : 0;
  },
  findAll: async () => {
    return await Comprobante.find().sort({ fecha: -1 });
  }
};
