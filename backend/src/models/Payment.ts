import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  loanId: mongoose.Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    utrNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 1 },
    paymentDate: { type: Date, required: true },
    recordedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
