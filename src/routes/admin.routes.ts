import { Router } from 'express';
import { getAllUsers, toggleUserSuspension, adminGetALlGear, adminGetAllRentals } from '../controllers/admin.controller';
import { authGuard } from '../middlewares/authGuard';

const router = Router();
router.get('/users', authGuard('ADMIN'), getAllUsers);
router.patch('/users/:id', authGuard('ADMIN'), toggleUserSuspension);
router.get('/gear', authGuard('ADMIN'), adminGetALlGear);
router.get('/rentals', authGuard('ADMIN'), adminGetAllRentals);
export default router;