import { type Response } from 'express';
import { type AuthRequest } from '../middlewares/authMiddleware.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { LoanRepository } from '../repositories/LoanRepository.js';
import { PaymentRepository } from '../repositories/PaymentRepository.js';
import { Role } from '../models/User.js';
import { LoanStatus } from '../models/Loan.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

const userRepository = new UserRepository();
const loanRepository = new LoanRepository();
const paymentRepository = new PaymentRepository();

export const getSalesLeads = async (req: AuthRequest, res: Response) => {
  try {
    // Basic approach: return all BORROWER users.
    // For a real app, we might do an aggregation to find users with no loans.
    const leads = await userRepository.find({ role: Role.BORROWER });
    res.status(200).json({ leads });
  } catch (error: any) {
    logger.error(`Get Sales Leads Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSanctionLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await loanRepository.find({ status: LoanStatus.PENDING });
    res.status(200).json({ loans });
  } catch (error: any) {
    logger.error(`Get Sanction Loans Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reviewLoan = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, rejectionReason } = req.body;

    if (![LoanStatus.APPROVED, LoanStatus.REJECTED].includes(status)) {
      return res.status(400).json({ error: 'Invalid status update for Sanction stage' });
    }

    const updateData: any = { status };
    if (status === LoanStatus.REJECTED) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedLoan = await loanRepository.updateById(id, updateData);
    if (!updatedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({ message: `Loan ${status.toLowerCase()} successfully`, loan: updatedLoan });
  } catch (error: any) {
    logger.error(`Review Loan Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDisbursementLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await loanRepository.find({ status: LoanStatus.APPROVED });
    res.status(200).json({ loans });
  } catch (error: any) {
    logger.error(`Get Disbursement Loans Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const disburseLoan = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const updatedLoan = await loanRepository.updateById(id, { status: LoanStatus.DISBURSED });
    
    if (!updatedLoan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json({ message: 'Loan disbursed successfully', loan: updatedLoan });
  } catch (error: any) {
    logger.error(`Disburse Loan Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCollectionLoans = async (req: AuthRequest, res: Response) => {
  try {
    const loans = await loanRepository.find({ status: { $in: [LoanStatus.DISBURSED, LoanStatus.CLOSED] } });
    res.status(200).json({ loans });
  } catch (error: any) {
    logger.error(`Get Collection Loans Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addPayment = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { utrNumber, amount, paymentDate } = req.body;
    const recordedBy = req.user?.userId;

    if (!recordedBy) return res.status(401).json({ error: 'Unauthorized' });

    const loan = await loanRepository.findById(id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    if (loan.status !== LoanStatus.DISBURSED) {
      return res.status(400).json({ error: 'Payments can only be added to DISBURSED loans' });
    }

    // Add payment
    await paymentRepository.create({
      loanId: new mongoose.Types.ObjectId(id),
      utrNumber,
      amount: Number(amount),
      paymentDate: new Date(paymentDate),
      recordedBy: new mongoose.Types.ObjectId(recordedBy)
    });

    // Check if total payments cover the loan
    const allPayments = await paymentRepository.find({ loanId: loan._id });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    if (totalPaid >= loan.totalRepayment) {
      loan.status = LoanStatus.CLOSED;
      await loan.save();
      return res.status(200).json({ message: 'Payment added successfully and Loan is now CLOSED', loan, totalPaid });
    }

    res.status(200).json({ message: 'Payment added successfully', loan, totalPaid });
  } catch (error: any) {
    logger.error(`Add Payment Error: ${error.message}`);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'UTR Number must be unique' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
