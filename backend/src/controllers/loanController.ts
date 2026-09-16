import { type Response } from 'express';
import { type AuthRequest } from '../middlewares/authMiddleware.js';
import { LoanRepository } from '../repositories/LoanRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { BusinessRuleEngine } from '../services/BusinessRuleEngine.js';
import { LoanStatus } from '../models/Loan.js';
import { logger } from '../utils/logger.js';
import mongoose from 'mongoose';

const loanRepository = new LoanRepository();
const userRepository = new UserRepository();
const bre = new BusinessRuleEngine();

export const applyLoan = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const user = await userRepository.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Extract fields from body
    const { amount, tenure, pan, dob, salary, employmentMode } = req.body;

    // Validate core loan requirements
    const loanAmount = Number(amount);
    const loanTenure = Number(tenure);
    if (!loanAmount || loanAmount < 50000 || loanAmount > 500000) {
      return res.status(400).json({ error: 'Amount must be between 50,000 and 5,00,000' });
    }
    if (!loanTenure || loanTenure < 30 || loanTenure > 365) {
      return res.status(400).json({ error: 'Tenure must be between 30 and 365 days' });
    }

    // Update user profile if new information is provided (in memory)
    if (pan || dob || salary || employmentMode) {
      if (pan && pan !== user.pan) user.pan = pan; // Only update if PAN is new to avoid duplicate key errors
      if (dob) user.dob = new Date(dob);
      if (salary) user.salary = Number(salary);
      if (employmentMode) user.employmentMode = employmentMode;
    }

    // Evaluate Business Rules
    const breResult = bre.evaluateLoan(user, {} as any); // We don't really need the loan object in evaluateLoan based on current BRE logic
    
    if (!breResult.approved) {
      return res.status(400).json({ 
        error: 'Loan application rejected by Business Rule Engine', 
        reason: breResult.reason 
      });
    }

    // If approved by BRE, persist user updates to database
    if (user.isModified()) {
      await user.save();
    }

    // File Upload handling via multer (Cloudinary URL is in req.file.path)
    const salarySlipUrl = req.file ? req.file.path : undefined;
    if (!salarySlipUrl) {
       return res.status(400).json({ error: 'Salary slip document is strictly required' });
    }

    // Calculate Repayment (Simple Interest: P + (P * R * T / 365) / 100)
    const interestRate = 12; // 12% p.a.
    const interest = (loanAmount * interestRate * loanTenure) / (365 * 100);
    const totalRepayment = loanAmount + interest;

    const newLoan = await loanRepository.create({
      borrowerId: new mongoose.Types.ObjectId(userId),
      amount: loanAmount,
      tenure: loanTenure,
      interestRate,
      totalRepayment,
      ...(salarySlipUrl !== undefined && { salarySlipUrl }),
      status: LoanStatus.PENDING,
    });

    res.status(201).json({
      message: 'Loan application submitted successfully',
      loan: newLoan,
    });
  } catch (error: any) {
    logger.error(`Apply Loan Error: ${error.message || error}`);
    // Handle MongoDB duplicate key error (e.g. PAN already registered to another user)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      const fieldLabel = field === 'pan' ? 'PAN number' : field;
      return res.status(400).json({ error: `This ${fieldLabel} is already registered to another account. Please use a different ${fieldLabel}.` });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyLoans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const loans = await loanRepository.find({ borrowerId: new mongoose.Types.ObjectId(userId) });
    
    res.status(200).json({ loans });
  } catch (error: any) {
    logger.error(`Get My Loans Error: ${error.message || error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLoanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Loan ID is required' });
    const loan = await loanRepository.findById(id as string);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Populate borrower info
    const borrower = await userRepository.findById(loan.borrowerId.toString());

    res.status(200).json({ loan, borrower: borrower ? { name: borrower.name, email: borrower.email, pan: borrower.pan, salary: borrower.salary, employmentMode: borrower.employmentMode, dob: borrower.dob } : null });
  } catch (error: any) {
    logger.error(`Get Loan By ID Error: ${error.message || error}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

