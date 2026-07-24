import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../AppError'; 
import { prisma } from '../prisma';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createRentalOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { gearItemId, startDate, endDate, totalPrice } = req.body;

    const gear = await prisma.gearItem.findUnique({
      where: { id: gearItemId },
    });

    if (!gear || !gear.isAvailable || gear.stock <= 0) {
      return next(new AppError(400, 'Requested gear is currently out of stock or unavailable'));
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const order = await prisma.$transaction(async (tx) => {
      const updatedGear = await tx.gearItem.update({
        where: { id: gearItemId },
        data: { stock: { decrement: 1 } },
      });

      if (updatedGear.stock === 0) {
        await tx.gearItem.update({
          where: { id: gearItemId },
          data: { isAvailable: false },
        });
      }

      return await tx.rentalOrder.create({
        data: {
          startDate: start,
          endDate: end,
          totalPrice,
          customerId: req.user!.id,
          gearItemId,
        },
      });
    });

    res.status(201).json({
      success: true,
      message: 'Rental order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.rentalOrder.findMany({
      where: { customerId: req.user!.id },
      include: { gearItem: true, payments: true },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getProviderOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await prisma.rentalOrder.findMany({
      where: {
        gearItem: {
          providerId: req.user!.id,
        },
      },
      include: {
        gearItem: true,
        customer: {
          select: { id: true, name: true, email: true },
        },
        payments: true,
      },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; 

    const order = await prisma.rentalOrder.findUnique({
      where: { id },
      include: { gearItem: true },
    });

    if (!order || order.gearItem.providerId !== req.user!.id) {
      return next(new AppError(403, 'Unauthorized scope update access'));
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.rentalOrder.update({
        where: { id },
        data: { status },
      });

      if (status === 'RETURNED') {
        await tx.gearItem.update({
          where: { id: order.gearItemId },
          data: { stock: { increment: 1 }, isAvailable: true },
        });
      }

      return updated;
    });

    res.status(200).json({
      success: true,
      message: 'Order state updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};