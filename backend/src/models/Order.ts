import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  table: mongoose.Types.ObjectId;
  waiter: mongoose.Types.ObjectId;
  items: { product: mongoose.Types.ObjectId; quantity: number }[];
  status: 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cobrado';
  total: number;
  tips: number;
  guests: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema({
  table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
  waiter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, enum: ['pendiente', 'preparando', 'listo', 'entregado', 'cobrado'], default: 'pendiente' },
  total: { type: Number, required: true },
  tips: { type: Number, default: 0 },
  guests: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);
