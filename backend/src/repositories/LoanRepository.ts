import Loan, { type ILoan } from '../models/Loan.js';
import { BaseRepository } from './BaseRepository.js';

export class LoanRepository extends BaseRepository<ILoan> {
  constructor() {
    super(Loan);
  }

  async findLoansByBorrower(borrowerId: string): Promise<ILoan[]> {
    return await this.find({ borrowerId });
  }
}
