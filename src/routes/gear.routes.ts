import { Router } from 'express';
import { getAllGear, getGearById, createGear, updateGear, deleteGear } from '../controllers/gear.controller';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createGearSchema } from '../validations/gear.validation';

const router = Router();
router.get('/', getAllGear);
router.get('/:id', getGearById);
router.post('/', authGuard('PROVIDER'), validateRequest(createGearSchema), createGear);
router.put('/:id', authGuard('PROVIDER'), updateGear);
router.delete('/:id', authGuard('PROVIDER'), deleteGear);
export default router;