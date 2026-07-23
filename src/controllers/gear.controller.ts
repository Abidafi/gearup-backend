import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../AppError";
import { prisma } from '../prisma';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getAllGear = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, search } = req.query;

    const whereCondition: any = {};

    if (category) {
      whereCondition.categoryId = category as string;
    }

    if (search) {
      whereCondition.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { brand: { contains: search as string, mode: "insensitive" } },
      ];
    }

    const gear = await prisma.gearItem.findMany({
      where: whereCondition,
      include: {
        category: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Gear items fetched successfully",
      data: gear,
    });
  } catch (error) {
    next(error);
  }
};

export const getGearById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const gear = await prisma.gearItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!gear)
      return next(new AppError(404, "Gear resource location target missing"));
    res.status(200).json({ success: true, data: gear });
  } catch (error) {
    next(error);
  }
};

export const createGear = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, pricePerDay, brand, stock, categoryId } =
      req.body;
    const item = await prisma.gearItem.create({
      data: {
        title,
        description,
        pricePerDay,
        brand,
        stock,
        categoryId,
        providerId: req.user!.id,
      },
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Gear added to repository listings",
        data: item,
      });
  } catch (error) {
    next(error);
  }
};

export const updateGear = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const gear = await prisma.gearItem.findUnique({ where: { id } });

    if (!gear || gear.providerId !== req.user!.id) {
      return next(new AppError(403, "Unauthorized modification attempt"));
    }

    const updated = await prisma.gearItem.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteGear = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const gear = await prisma.gearItem.findUnique({ where: { id } });

    if (!gear || gear.providerId !== req.user!.id) {
      return next(new AppError(403, "Unauthorized modification attempt"));
    }

    await prisma.gearItem.delete({ where: { id } });
    res
      .status(200)
      .json({ success: true, message: "Gear deleted successfully" });
  } catch (error) {
    next(error);
  }
};
