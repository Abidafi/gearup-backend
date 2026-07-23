import { Router } from 'express';
import { prisma } from '../prisma';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createReviewSchema } from '../validations/review.validation';

const router = Router();

router.post(
  '/',
  authGuard('CUSTOMER'),
  validateRequest(createReviewSchema),
  async (req, res, next) => {
    try {
      const userId = (req as any).user.id;
      const { gearItemId, rating, comment } = req.body;

      const review = await prisma.review.create({
        data: {
          userId,
          gearItemId,
          rating,
          comment,
        } as any,
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;