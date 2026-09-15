import mongoose, { Schema, Document } from 'mongoose';

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  CLOSED = 'CLOSED'
}

export interface ILoan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  tenure: number;
  interestRate: number;
  totalRepayment: number;
  salarySlipUrl?: string;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema = new Schema(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 50000, max: 500000 },
    tenure: { type: Number, required: true, min: 30, max: 365 },
    interestRate: { type: Number, required: true, default: 12 },
    totalRepayment: { type: Number, required: true },
    salarySlipUrl: { type: String },
    status: { 
      type: String, 
      enum: Object.values(LoanStatus), 
      default: LoanStatus.PENDING 
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILoan>('Loan', LoanSchema);
