import Payment, { type IPayment } from '../models/Payment.js';
import { BaseRepository } from './BaseRepository.js';

export class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(Payment);
  }

  async findByLoanId(loanId: string): Promise<IPayment[]> {
    return await this.find({ loanId });
  }
}
