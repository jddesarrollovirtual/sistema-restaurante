import mongoose, { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  number: string;
  capacity: number;
  status: 'libre' | 'ocupada' | 'reservada' | 'mantenimiento';
  location: string;
}

const TableSchema = new Schema({
  number: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['libre', 'ocupada', 'reservada', 'mantenimiento'], 
    default: 'libre' 
  },
  location: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<ITable>('Table', TableSchema);
