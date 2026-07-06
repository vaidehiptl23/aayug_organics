import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma connection errors (DB not available)
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      success: false,
      message: 'Database not available. Please ensure PostgreSQL is running.',
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'A record with this value already exists',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Record not found',
      });
      return;
    }
  }

  // Operational errors
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
    return;
  }

  // Fallback
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    stack: err.stack,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}
