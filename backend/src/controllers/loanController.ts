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

    // Update user profile if new information is provided
    if (pan || dob || salary || employmentMode) {
      user.pan = pan || user.pan;
      user.dob = dob ? new Date(dob) : user.dob;
      user.salary = salary ? Number(salary) : user.salary;
      user.employmentMode = employmentMode || user.employmentMode;
      await user.save();
    }

    // Evaluate Business Rules
    const breResult = bre.evaluateLoan(user, {} as any); // We don't really need the loan object in evaluateLoan based on current BRE logic
    
    if (!breResult.approved) {
      return res.status(400).json({ 
        error: 'Loan application rejected by Business Rule Engine', 
        reason: breResult.reason 
      });
    }

    // File Upload handling via multer
    const salarySlipUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    if (!salarySlipUrl && user.employmentMode === 'SALARIED') {
       // Optional: enforce salary slip for salaried employees, but let's just log it or fail if required
       // return res.status(400).json({ error: 'Salary slip is required for SALARIED employees' });
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
