import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../AppError';
import { AuthenticatedRequest } from '../middlewares/authGuard';
import { prisma } from '../prisma'; 

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return next(new AppError(400, 'Email identifier already claims registration'));

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    res.status(201).json({ success: true, message: 'User signed up successfully', data: user });
  } catch (error) { next(error); }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError(401, 'Invalid authentication credentials provided'));
    }

    if (user.isSuspended) return next(new AppError(403, 'Your account has been suspended'));

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    res.status(200).json({ success: true, message: 'Login successful', token });
  } catch (error) { next(error); }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, name: true, role: true, isSuspended: true },
    });
    res.status(200).json({ success: true, data: user });
  } catch (error) { next(error); }
};