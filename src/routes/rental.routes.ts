import { Router } from 'express';
import { createRentalOrder, getMyOrders, getProviderOrders, updateOrderStatus } from '../controllers/rental.controller';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createRentalSchema } from '../validations/rental.validation';

const router = Router();
router.post('/', authGuard('CUSTOMER'), validateRequest(createRentalSchema), createRentalOrder);
router.get('/', authGuard('CUSTOMER'), getMyOrders);
router.get('/provider', authGuard('PROVIDER'), getProviderOrders);
router.patch('/provider/:id', authGuard('PROVIDER'), updateOrderStatus);
export default router;