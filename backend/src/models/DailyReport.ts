import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyReport extends Document {
  date: Date;
  totalSales: number;
  totalTips: number;
  totalGuests: number;
  ordersCount: number;
  platosVendidos: { product: mongoose.Types.ObjectId; quantity: number }[];
}

const DailyReportSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  totalSales: { type: Number, required: true },
  totalTips: { type: Number, required: true },
  totalGuests: { type: Number, required: true },
  ordersCount: { type: Number, required: true },
  platosVendidos: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number }
  }]
});

export default mongoose.model<IDailyReport>('DailyReport', DailyReportSchema);
