import mongoose, { Schema, Document } from 'mongoose';

export enum Role {
  BORROWER = 'BORROWER',
  SALES = 'SALES',
  SANCTION = 'SANCTION',
  DISBURSEMENT = 'DISBURSEMENT',
  COLLECTION = 'COLLECTION',
  ADMIN = 'ADMIN'
}

export enum EmploymentMode {
  SALARIED = 'SALARIED',
  SELF_EMPLOYED = 'SELF_EMPLOYED',
  UNEMPLOYED = 'UNEMPLOYED'
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  pan?: string;
  dob?: Date;
  salary?: number;
  employmentMode?: EmploymentMode;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { 
      type: String, 
      enum: Object.values(Role), 
      default: Role.BORROWER 
    },
    pan: { type: String, unique: true, sparse: true },
    dob: { type: Date },
    salary: { type: Number },
    employmentMode: { 
      type: String, 
      enum: Object.values(EmploymentMode) 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
