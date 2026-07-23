import { Router } from 'express';
import { prisma } from '../prisma';
import { authGuard } from '../middlewares/authGuard';
import { validateRequest } from '../middlewares/validateRequest';
import { createCategorySchema } from '../validations/category.validation';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  authGuard('ADMIN'),
  validateRequest(createCategorySchema),
  async (req, res, next) => {
    try {
      const category = await prisma.category.create({
        data: req.body,
      });
      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;