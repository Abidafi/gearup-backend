import { Router } from 'express';
import { createPaymentIntent, confirmPayment, getPaymentHistory } from '../controllers/payment.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();
router.post('/create', authGuard('CUSTOMER'), createPaymentIntent);
router.post('/confirm', authGuard('CUSTOMER'), confirmPayment);
router.get('/', authGuard('CUSTOMER'), getPaymentHistory);
export default router;