import { Router } from 'express';
import { getAllUsers, toggleUserSuspension, adminGetALlGear } from '../controllers/admin.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();
router.get('/users', authGuard('ADMIN'), getAllUsers);
router.patch('/users/:id', authGuard('ADMIN'), toggleUserSuspension);
router.get('/gear', authGuard('ADMIN'), adminGetALlGear);
export default router;