import { Router } from 'express';
import { loginUser, registerUser, getMe } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { authGuard } from '../middlewares/authGuard';

const router = Router();
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.get('/me', authGuard('CUSTOMER', 'PROVIDER', 'ADMIN'), getMe);
export default router;