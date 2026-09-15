import { Router } from 'express';
import { applyLoan, getMyLoans, getLoanById } from '../controllers/loanController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/multerConfig.js';
import { Role } from '../models/User.js';

const router = Router();

// Only Borrowers can apply for a loan
router.post('/apply', authenticate, authorizeRoles(Role.BORROWER), upload.single('salarySlip'), applyLoan as any);

// Borrowers can view their loans
router.get('/my-loans', authenticate, authorizeRoles(Role.BORROWER), getMyLoans as any);

// Any authenticated user can view full loan details by ID
router.get('/:id', authenticate, getLoanById as any);

export default router;
