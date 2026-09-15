import { Router } from 'express';
import { applyLoan, getMyLoans } from '../controllers/loanController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/multerConfig.js';
import { Role } from '../models/User.js';

const router = Router();

// Only Borrowers can apply for a loan
router.post('/apply', authenticate, authorizeRoles(Role.BORROWER), upload.single('salarySlip'), applyLoan as any);

// Borrowers can view their loans
router.get('/my-loans', authenticate, authorizeRoles(Role.BORROWER), getMyLoans as any);

export default router;
