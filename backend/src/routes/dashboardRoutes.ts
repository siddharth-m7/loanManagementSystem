import { Router } from 'express';
import { 
  getSalesLeads, 
  getSanctionLoans, 
  reviewLoan, 
  getDisbursementLoans, 
  disburseLoan, 
  getCollectionLoans, 
  addPayment 
} from '../controllers/dashboardController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
import { Role } from '../models/User.js';

const router = Router();

// Sales Endpoints
router.get('/sales/leads', authenticate, authorizeRoles(Role.SALES, Role.ADMIN), getSalesLeads as any);

// Sanction Endpoints
router.get('/sanction/loans', authenticate, authorizeRoles(Role.SANCTION, Role.ADMIN), getSanctionLoans as any);
router.patch('/sanction/loans/:id/review', authenticate, authorizeRoles(Role.SANCTION, Role.ADMIN), reviewLoan as any);

// Disbursement Endpoints
router.get('/disbursement/loans', authenticate, authorizeRoles(Role.DISBURSEMENT, Role.ADMIN), getDisbursementLoans as any);
router.patch('/disbursement/loans/:id/disburse', authenticate, authorizeRoles(Role.DISBURSEMENT, Role.ADMIN), disburseLoan as any);

// Collection Endpoints
router.get('/collection/loans', authenticate, authorizeRoles(Role.COLLECTION, Role.ADMIN), getCollectionLoans as any);
router.post('/collection/loans/:id/payment', authenticate, authorizeRoles(Role.COLLECTION, Role.ADMIN), addPayment as any);

export default router;
