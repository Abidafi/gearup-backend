import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authGuard';
import { AppError } from '../AppError';
import { prisma } from '../prisma';

export const createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment, gearItemId } = req.body;

    // Strict requirement validation: Ensure they rented it AND returned it before allowing a review
    const verifiedOrder = await prisma.rentalOrder.findFirst({
      where: {
        customerId: req.user!.id,
        gearItemId,
        status: 'RETURNED'
      }
    });

    if (!verifiedOrder) {
      return next(new AppError(400, 'You can only review gear items you have completely rented and returned.'));
    }

    const review = await prisma.review.create({
      data: { rating, comment, customerId: req.user!.id, gearItemId }
    });

    res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
  } catch (error) { next(error); }
};