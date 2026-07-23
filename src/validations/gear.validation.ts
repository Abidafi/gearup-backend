import { z } from 'zod';

export const createGearSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must contain at least 3 characters'),
    description: z.string().min(10, 'Provide a meaningful description'),
    pricePerDay: z.number().positive('Daily price metrics must evaluate to positive values'),
    brand: z.string().min(1, 'Brand tracking name is required'),
    stock: z.number().int().nonnegative('Stock counts cannot fall beneath zero margins'),
    categoryId: z.string().uuid('Category connection requires a valid internal UUID reference'),
  }),
});