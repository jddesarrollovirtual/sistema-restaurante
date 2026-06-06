import { ComprobanteRepository } from '../repositories/comprobanteRepository.js';

export const ComprobanteService = {
  emitirComprobante: async (data: any, userId: string) => {
    const serie = data.tipoComprobante === 'FACTURA' ? 'F001' : 'B001';
    const lastNumero = await ComprobanteRepository.getLastNumero(data.tipoComprobante, serie);
    const nuevoNumero = lastNumero + 1;
    
    // Cálculo fiscal (asumiendo 18% IGV)
    const subtotal = data.total / 1.18;
    const igv = data.total - subtotal;
    
    return await ComprobanteRepository.create({
      ...data,
      serie,
      numero: nuevoNumero,
      subtotal: parseFloat(subtotal.toFixed(2)),
      igv: parseFloat(igv.toFixed(2)),
      vendedorId: userId,
      estadoSUNAT: 'PENDIENTE'
    });
  },
  listarComprobantes: async () => {
    return await ComprobanteRepository.findAll();
  }
};
