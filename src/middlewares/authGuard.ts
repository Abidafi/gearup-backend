import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';
import { AppError } from '../AppError';
import { prisma } from '../prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authGuard = (...roles: Role[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(401, 'Authentication token missing or invalid'));
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; role: Role };

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) {
        return next(new AppError(401, 'User associated with this token does not exist'));
      }

      if (user.isSuspended) {
        return next(new AppError(403, 'Your account has been suspended by an administrator'));
      }

      console.log('Required Roles:', roles);
      console.log('User Role in DB:', user.role);

      if (roles.length && !roles.includes(user.role)) {
        return next(new AppError(403, 'You do not possess permission to access this resource'));
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (error) {
      next(new AppError(401, 'Invalid session or token expired'));
    }
  };
};