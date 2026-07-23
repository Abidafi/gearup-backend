import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Please submit a valid email address'),
    password: z.string().min(6, 'Password must consist of at least 6 characters'),
    name: z.string().min(2, 'Name is required'),
    role: z.enum(['CUSTOMER', 'PROVIDER']),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required to authenticate'),
  }),
});