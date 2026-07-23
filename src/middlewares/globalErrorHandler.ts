import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../AppError';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorDetails = err.errorDetails || null;

  // Catch custom AppErrors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Catch Zod Schema Errors 
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorDetails = err.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};