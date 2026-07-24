import { Router } from 'express';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createReviewSchema } from '../validations/review.validation';
import { createReview } from '../controllers/review.controller';

const router = Router();

router.post(
  '/',
  authGuard('CUSTOMER'),
  validateRequest(createReviewSchema),
  createReview
);

export default router;