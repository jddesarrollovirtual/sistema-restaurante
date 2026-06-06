import mongoose, { Schema, Document } from 'mongoose';

export interface IComprobante extends Document {
  tipoComprobante: 'BOLETA' | 'FACTURA';
  serie: string;
  numero: number;
  numeroDocumento: string; // DNI o RUC
  nombreCliente: string;
  subtotal: number;
  igv: number;
  total: number;
  fecha: Date;
  orderId: Schema.Types.ObjectId;
  // Professional fields
  vendedorId: Schema.Types.ObjectId; // Referencia a User
  cajaId: string; // ID de caja o nombre
  zona: string;
  estadoSUNAT: 'PENDIENTE' | 'AUTORIZADO' | 'RECHAZADO';
  hashSUNAT?: string;
  qrSUNAT?: string;
}

const ComprobanteSchema = new Schema({
  tipoComprobante: { type: String, enum: ['BOLETA', 'FACTURA'], required: true },
  serie: { type: String, required: true },
  numero: { type: Number, required: true },
  numeroDocumento: { type: String, required: true },
  nombreCliente: { type: String, required: true },
  subtotal: { type: Number, required: true },
  igv: { type: Number, required: true },
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  vendedorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cajaId: { type: String, default: 'CAJA-01' }, // Default for now
  zona: { type: String, required: true },
  estadoSUNAT: { type: String, enum: ['PENDIENTE', 'AUTORIZADO', 'RECHAZADO'], default: 'PENDIENTE' },
  hashSUNAT: String,
  qrSUNAT: String
});

export default mongoose.model<IComprobante>('Comprobante', ComprobanteSchema);
