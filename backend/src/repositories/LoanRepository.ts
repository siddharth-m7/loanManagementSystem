import Loan, { type ILoan } from '../models/Loan.js';
import { BaseRepository } from './BaseRepository.js';

export class LoanRepository extends BaseRepository<ILoan> {
  constructor() {
    super(Loan);
  }

  async findLoansByBorrower(borrowerId: string): Promise<ILoan[]> {
    return await this.find({ borrowerId });
  }

  async findWithBorrower(filter: any): Promise<any[]> {
    return await this.model.find(filter).populate('borrowerId', 'name email').lean().exec();
  }
}
