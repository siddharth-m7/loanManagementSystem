import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

router.post('/register', register as any);
router.post('/login', login as any);

export default router;
